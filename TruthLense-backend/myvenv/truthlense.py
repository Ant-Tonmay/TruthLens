from fastapi import FastAPI , HTTPException , Depends , status
from fastapi.middleware.cors import CORSMiddleware
from rag import get_rag_context , prepare_rag
from graph_rag_context import user_query_to_context,prepare_graph_rag
from llm import run_llm
from utility import get_prompt_for_finding_named_enitity,get_prompt_for_finding_wikidata
from wikidata import get_wikidata_info,get_wikipedia_title,get_wikidata_response
from dotenv import load_dotenv , dotenv_values
from models import QueryRequest,QueryResponse
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.post("/query",status_code=status.HTTP_200_OK, response_model=QueryResponse)
async def check_fact(request: QueryRequest):
    try:
        query = request.query
        rag_context = get_rag_context(query)
        claim , graph_rag_context = user_query_to_context(query)
        content_for_prompt=f"""
        claim:{claim}
        Based on the following Context recieved by RAG and GraphRAG, justify whether claim is true or false:
        rag context : {rag_context}
        context from GraphRAG:{graph_rag_context}
        """
        result = run_llm(query)
        print(type(rag_context))
        print(type(graph_rag_context))
        print(type(result))

        response_query_model = QueryResponse(rag_context=rag_context,
                                             graphrag_context=graph_rag_context,
                                             llm_response=result
                                             )
        return response_query_model
        # return "here"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")



@app.post("/initilize",status_code=status.HTTP_200_OK, response_model=str)
def initilize(request: QueryRequest):
    try:
        print("hello world")
        query = request.query
        prompt_to_named_entity = get_prompt_for_finding_named_enitity(query)
        named_enitity = run_llm(prompt_to_named_entity)
        print(named_enitity)
        wikidata_id_meta_info = get_wikidata_response(named_enitity)
        wikidata_id = run_llm(get_prompt_for_finding_wikidata(query,wikidata_id_meta_info))
        print(wikidata_id)
        wikipedia_title = get_wikipedia_title(query)
        print(wikipedia_title)
        prepare_graph_rag(wikidata_id)
        prepare_rag(named_enitity)  
        return "Initilization Done"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    