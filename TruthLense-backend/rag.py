# import os
# import faiss
# from PyPDF2 import PdfReader
# from langchain.text_splitter import CharacterTextSplitter
# from langchain.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings

from llm import run_llm
from embeddings import get_embedding_model
from wikipedia import get_wikipedia_content





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



def chunk_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    return splitter.split_documents(documents)


def load_text_documents(file_path):
    loader = TextLoader(file_path)
    return loader.load()

# 3. Embed chunks and create vector store
def embed_chunks(docs):
    embeddings = get_embedding_model()
    #embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(docs, embedding=embeddings)
    return vectorstore

# 4. Retrieve relevant chunks
def get_relevant_chunks(vectorstore, query, k=3):
    retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    return retriever.get_relevant_documents(query)

def build_qa_chain(vectorstore):
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    retriever = vectorstore.as_retriever()
    qa = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)
    return qa

def get_rag_context(question):
  print(f"question:{question}")
  top_k=3
  documents = load_text_documents("wikipedia_content.txt")
  split_docs = chunk_documents(documents)
  vectorstore = embed_chunks(split_docs)
  relevant_docs = get_relevant_chunks(vectorstore, question, k=top_k)
  rag_context = []
  for i, doc in enumerate(relevant_docs, 1):
    rag_context.append(f"Chunk {i}:\n{doc.page_content}\n{'-'*60}")
  print("RAG context:")
  for item in rag_context:
    print(item)
  print("here")
  return rag_context 

def prepare_rag(title):
   get_wikipedia_content(title)