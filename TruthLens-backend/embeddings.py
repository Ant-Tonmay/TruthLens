from langchain_community.embeddings import HuggingFaceEmbeddings
from sentence_transformers import SentenceTransformer

model_name = "all-MiniLM-L6-v2"
model_path = model_name

model = SentenceTransformer(model_path)
def get_embedding(text):
    return model.encode(text).tolist()

def get_embedding_model():
    return HuggingFaceEmbeddings(
        model_name=model_path 
    )