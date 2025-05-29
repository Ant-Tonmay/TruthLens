from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv , dotenv_values
import os

load_dotenv()

uri = os.getenv("MONGODB_URI")

client = MongoClient(uri, server_api=ServerApi('1'))

db = client.truth_lense

entity_name_collection = db["entity_name"]
rag_context_collection = db["rag_context"]
