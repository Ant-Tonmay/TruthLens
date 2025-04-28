from utility import extract_valid_json_objects , create_prompt_for_relationships
from wikidata import get_wikidata_info , load_data_in_json
import json
from llm import run_llm


def generate_relationships_using_llm(prompt_for_relationships):
  response = run_llm(prompt_for_relationships)

  with open("response_relationships.json", "w", encoding="utf-8") as file:
      file.write(response)

  valid_data = extract_valid_json_objects("response_relationships.json")
  with open("relationships.txt", "w", encoding="utf-8") as f:
    json.dump(valid_data, f, indent=2, ensure_ascii=False)

  print("Response saved to relationships.txt")

def get_relationship_data():
  with open("relationships.txt", "r", encoding="utf-8") as file:
      content = file.read().strip()

  # Remove the ```json tag and any trailing ```
  if content.startswith("```json"):
      content = content[len("```json"):].strip()

  if content.endswith("```"):
      content = content[:-3].strip()

  # Ensure the content ends with a closing bracket ]
  if content.startswith("[") and not content.endswith("]"):
      content += "]"

  relationship_data = json.loads(content)
  print("JSON loaded successfully.")
  # for item in relationship_data:
  #   print(f"{item['source']} → {item['relation']} → {item['target']}")
  return relationship_data

def download_preprocess_and_format_relationships(entity_id):
  data=get_wikidata_info(entity_id)
  with open("resoponse.json", "w", encoding="utf-8") as f:
      json.dump(data, f, indent=4, ensure_ascii=False)
  print("Data successfully downloaded and saved.")
  content_json = load_data_in_json()
  prompt = create_prompt_for_relationships(content_json)
  generate_relationships_using_llm(prompt)