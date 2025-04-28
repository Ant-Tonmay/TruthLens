from SPARQLWrapper import SPARQLWrapper, JSON
from llm import run_llm
import json
import requests

def get_wikidata_response(entity_name):
    url = "https://www.wikidata.org/w/api.php"
    params = {
        "action": "wbsearchentities",
        "search": entity_name,
        "language": "en",
        "format": "json",
    }
    response = requests.get(url, params=params).json()

    wikidata_metadata = ""

    if 'search' in response:
        for item in response['search']:
            label = item.get('label', 'N/A')
            item_id = item.get('id', 'N/A')
            description = item.get('description', 'N/A')

            wikidata_metadata += f"Label: {label}\nWikidata ID: {item_id}\nDescription: {description}\n\n"
    else:
        wikidata_metadata = "No results found."

    return wikidata_metadata

def get_wikidata_info(entity_id):
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")

    query = f"""
    SELECT ?property ?propertyLabel ?value ?valueLabel
    WHERE {{
        wd:{entity_id} ?p ?value .
        ?property wikibase:directClaim ?p .

        SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """

    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results



def load_data_in_json():
  # Load the JSON file
  with open("resoponse.json", "r", encoding="utf-8") as f:
      data = json.load(f)

  # Extract results
  bindings = data["results"]["bindings"]

  print("\n--- Wikidata Information ---\n")

  content_json = "";

  for entry in bindings:
      prop = entry.get("propertyLabel", {}).get("value", "Unknown Property")
      value = entry.get("valueLabel", {}).get("value", entry.get("value", {}).get("value", "Unknown Value"))

      content_json += f"{prop}: {value}\n"

  #print(content_json)
  return content_json

def get_wikipedia_title(sentence):
  prompt_to_title =f"""

   i want to get the wikipedia title , so that i get information about the sentence .

   Example  :
   Sentence : i want to check some facts about Cricketer Salman Khan
   Answer : Salman Khan (Indian cricketer) - > It is a legit wikipedia title

   Sentence : i want to check some facts about Pakistani Cricketer Salman Khan
   Answer : Salman Khan (Pakistani cricketer)

   Query is given Below :
   sentence :{sentence},
   In the response just give me the title no need write anything else . just one word answer .
  """

  title = run_llm(prompt_to_title)
  return title
