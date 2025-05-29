from typing import Tuple, List
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from relationships_preprocess import download_preprocess_and_format_relationships,get_relationship_data
import re
from embeddings import get_embedding
from dotenv import load_dotenv , dotenv_values
import os
from neo4j import GraphDatabase
load_dotenv()
NEO4J_URI=os.getenv("NEO4J_URI")
NEO4J_USERNAME=os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD=os.getenv("NEO4J_PASSWORD")

def insert_data(tx, data):
    print(f"NEO4J_URI : {NEO4J_URI}")
    print(f"NEO4J_USERNAME:{NEO4J_USERNAME}")
    print(f"NEO4J_PASSWORD:{NEO4J_USERNAME}")
    
    for entry in data:
        source_name, source_type = entry["source"], entry["source_type"]
        target_name, target_type = entry["target"], entry["target_type"]
        relation = re.sub(r"\W+", "_", entry["relation"])  # sanitized for Cypher
        text = entry["text"]

        # Generate embeddings for nodes and relationship
        source_embedding = get_embedding(source_name)
        target_embedding = get_embedding(target_name)
        relation_embedding = get_embedding(text)

        # Sanitize source and target types by replacing spaces with underscores
        source_type = re.sub(r"\W+", "_", source_type)
        target_type = re.sub(r"\W+", "_", target_type)

        query = """
        MERGE (s:{source_type} {{name: $source_name, embedding: $source_embedding}})
        MERGE (t:{target_type} {{name: $target_name, embedding: $target_embedding}})
        MERGE (s)-[r:{relation} {{embedding: $relation_embedding}}]->(t)
        """.format(
            source_type=source_type,  # Now sanitized
            target_type=target_type,  # Now sanitized
            relation=relation  # already sanitized
        )

        tx.run(query, source_name=source_name, source_embedding=source_embedding,
               target_name=target_name, target_embedding=target_embedding,
               relation_embedding=relation_embedding)


def create_graph_in_neo4j(relationship_data):
  print(f"NEO4J_URI : {NEO4J_URI}")
  print(f"NEO4J_USERNAME:{NEO4J_USERNAME}")
  print(f"NEO4J_PASSWORD:{NEO4J_PASSWORD}")
  with GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD)) as driver:
    with driver.session() as session:
        session.write_transaction(insert_data, relationship_data)
  print("Data inserted successfully!")


def fetch_nodes_and_relationships(tx):
    query = """
    MATCH (s)-[r]->(t)
    RETURN s.name AS source, s.embedding AS source_embedding,
           type(r) AS relation, r.embedding AS relation_embedding,
           t.name AS target, t.embedding AS target_embedding
    """
    return tx.run(query).data()




def search_similar_nodes_and_relationships(neo4j_results, query_embedding, threshold=0.5, top_n=5):
    results = []

    for record in neo4j_results:
        source_name = record["source"]
        target_name = record["target"]
        relation = record["relation"]

        # Convert embeddings to NumPy arrays
        source_embedding = np.array(record["source_embedding"])
        target_embedding = np.array(record["target_embedding"])
        relation_embedding = np.array(record["relation_embedding"])

        # Compute cosine similarity for node and relationship embeddings
        source_score = cosine_similarity([query_embedding], [source_embedding])[0][0]
        target_score = cosine_similarity([query_embedding], [target_embedding])[0][0]
        relation_score = cosine_similarity([query_embedding], [relation_embedding])[0][0]

        # Take the max similarity score
        max_score = max(source_score, target_score, relation_score)

        # if max_score > threshold:
        results.append((source_name, relation, target_name, max_score))
  
    # Sort by similarity score in descending order
    results.sort(key=lambda x: x[3], reverse=True)

    return results[:top_n]


def user_query_to_context(user_query):
  print(f"NEO4J_URI : {NEO4J_URI}")
  print(f"NEO4J_USERNAME:{NEO4J_USERNAME}")
  print(f"NEO4J_PASSWORD:{NEO4J_USERNAME}")
  with GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USERNAME, NEO4J_PASSWORD)) as driver:
      with driver.session() as session:
          neo4j_results = session.read_transaction(fetch_nodes_and_relationships)

  # Get query embedding
  query_embedding = get_embedding(user_query)

  # Perform similarity search
  similar_nodes = search_similar_nodes_and_relationships(neo4j_results, query_embedding)

  # Print results
  print(" Relevant Nodes and Relationships:")
  for source, relation, target, score in similar_nodes:
      print(f"{source} -[{relation}]-> {target}, Score: {score:.3f}")
  context = []
  for source, relation, target, score in similar_nodes:
    context.append(f"{source} -[{relation}]-> {target}")
  return (str(user_query),context);

# entity_id=str(input("Enter Wikidata Enitity Id to load contents into database : "))
def prepare_graph_rag(entity_id):
  download_preprocess_and_format_relationships(entity_id) #Q213854
  #print("Here")
  relationship_data=get_relationship_data()
  #print(relationship_data)
  create_graph_in_neo4j(relationship_data)