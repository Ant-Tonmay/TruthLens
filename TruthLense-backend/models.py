from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    rag_context:list
    graphrag_context:list
    llm_response:str