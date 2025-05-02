import json

def extract_valid_json_objects(file_path):
    valid_entries = []
    buffer = ""
    brace_count = 0
    inside_object = False

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            for char in line:
                if char == '{':
                    brace_count += 1
                    inside_object = True
                if inside_object:
                    buffer += char
                if char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        # Attempt to parse the full JSON object
                        try:
                            obj = json.loads(buffer)
                            valid_entries.append(obj)
                        except json.JSONDecodeError:
                            pass  # Skip invalid JSON
                        buffer = ""
                        inside_object = False

    return valid_entries

def create_prompt_for_relationships(content_json):
  prompt_for_relationships = f"""
  {content_json}

  You are given a list of key-value facts about a person. The person is identified by their Listal ID, which maps to their full name. For each key-value pair in the content above, you must generate a JSON object in the following format:
  Dont't change the name , Virat should be Virat.
  \\

  {{
    "source": "<Source Entity>",
    "source_type": "<Entity type>",
    "relation": "<RELATION_TYPE>",
    "target": "<Target Entity>",
    "target_type": "<Entity Type>",
    "text": "<Natural language description of the relationship>"
  }}
  \\
  """
  print(prompt_for_relationships)
  return prompt_for_relationships

def get_prompt_for_finding_named_enitity(sentence):
  prompt_to_named_entity =f"""
   sentence :{sentence},
   to check whether the given sentence is right or wrong .
   which named entity's wikipedia should i look for ?
   i mean which is more relevant so that i can verify the sentence .
   If there is more than one prominent named Entity , give one which will help best.
   In the response just give me the named entity no need write anything else . just one word answer .
  """
  return prompt_to_named_entity

def get_prompt_for_finding_wikidata(meta_info,wikidata_id_meta_info):
  prompt = f"""
  context : {wikidata_id_meta_info}

  among all the wikidata id i want a wikidata id that matches the description of
  senctence : {meta_info}

   In the response just give me the wikidata id no need write anything else . just one word answer .
  """

  return prompt
