# TruthLens : Fact Verification System using RAG and GraphRAG

This project implements a fact verification system that leverages both Retrieval-Augmented Generation (RAG) and Graph-based RAG techniques to assess the truthfulness of user claims. It uses external knowledge sources like Wikipedia and Wikidata, integrated with Large Language Models (LLMs) and a graph database (Neo4j), to provide context-aware justifications for its verification results.

## Features

*   **Claim Verification:** Takes a user claim and determines if it is true or false.
*   **Named Entity Recognition:** Identifies the most relevant named entity in the claim to guide the information retrieval process, potentially using an LLM like Gemini.
*   **Wikipedia Integration:** Fetches textual content from Wikipedia pages for relevant entities to serve as RAG context.
*   **Wikidata Integration:** Retrieves structured data (key-value facts) from Wikidata for relevant entities.
*   **Graph Construction:** Processes Wikidata facts and constructs a knowledge graph in Neo4j, including embedding nodes and relationships.
*   **Embedding-based Search:** Uses sentence-transformers models to create embeddings for queries, graph entities, and relationships, enabling similarity search within the graph.
*   **Context Generation:** Combines retrieved information from the Wikipedia-based RAG (text chunks) and the Neo4j GraphRAG (relevant triples) to create a comprehensive context for the LLM.
*   **LLM-based Justification:** Uses an LLM (such as Ollama with Llama3 or Gemini) to analyze the claim against the generated context and produce a reasoned justification for whether the claim is true or false.

## Workflow and Usage

The system follows these steps to verify a claim:

1.  **User Input:** The user provides a claim they want to verify.
2.  **Named Entity Identification:** The system identifies the key named entity in the claim, potentially using an LLM prompt asking which entity's Wikipedia page is most relevant for verification.
3.  **Data Preparation (GraphRAG):**
    *   The Wikidata ID for the identified entity is obtained using the Wikidata API.
    *   Information for the entity is fetched from Wikidata using SPARQL queries.
    *   The raw Wikidata JSON data is preprocessed using an LLM (Gemini-2.0-flash in the source) to extract structured relationships in a specific JSON format.
    *   The extracted relationship data is loaded into the Neo4j graph database, with embeddings generated for nodes and relationships using `all-MiniLM-L6-v2`.
4.  **Data Preparation (RAG):**
    *   The text content from the Wikipedia page of the identified entity is fetched.
    *   The Wikipedia text is split into chunks using a `RecursiveCharacterTextSplitter`.
    *   Embeddings for the text chunks are created using `HuggingFaceEmbeddings` (`all-MiniLM-L6-v2`).
    *   A FAISS vector store is created from the embedded text chunks.
5.  **Context Retrieval:**
    *   For RAG, the system retrieves the most relevant text chunks from the FAISS vector store based on the user query's embedding.
    *   For GraphRAG, the system retrieves relevant nodes and relationships from the Neo4j graph based on the user query's embedding, using cosine similarity.
6.  **Claim Verification:**
    *   A prompt is constructed containing the user claim and the combined context from both RAG (text chunks) and GraphRAG (graph relationships).
    *   An LLM (Ollama with Llama3 in the source) is used to generate a response based on the prompt, justifying whether the claim is true or false using the provided context.
    *   The system outputs the LLM's response.

### Example Interaction

Based on the conversation history, here is an example workflow:

1.  System asks: `what do you want to check about?`
2.  User inputs: `MS Dhoni`
3.  System identifies the named entity `MS Dhoni` and its Wikidata ID `Q470774`.
4.  System fetches data for MS Dhoni from Wikidata and Wikipedia and prepares the GraphRAG and RAG components. The Wikidata information includes details like place of birth, spouse, children (Ziva Dhoni), sports teams, occupation, religion, and awards.
5.  System asks: `Enter your claim:`
6.  User inputs: `tonmay is the son of Lionel messi`
7.  System retrieves relevant RAG context (which, in the example, was about MS Dhoni and other unrelated topics due to a potential mix-up based on previous input). System retrieves relevant GraphRAG context, which correctly identifies relationships for *Lionel Messi*, including his children (Thiago Messi), but finds no relation to "Tonmay".
8.  The LLM processes the claim and contexts.
9.  System outputs the verification result and justification:
    ```
    Based on the provided context from RAG and GraphRAG, I can conclude that the claim "Tonmay is the son of Lionel Messi" is FALSE.

    Here's why:
    1. The RAG context does not mention Tonmay or any relationship between him and Lionel Messi.
    2. The RAG context primarily talks about MS Dhoni, an Indian cricketer, and a Gujarati woman named Wamiqa Gabbi, with no connection to Lionel Messi or his family.
    3. GraphRAG provides information about Lionel Messi's family relationships, including the names of his children (Thiago Messi) and father (Jorge Messi). However, there is no mention of Tonmay being his son.
    Given that neither RAG nor GraphRAG contains any information linking Tonmay to Lionel Messi as a parent-child relationship, we can confidently conclude that the claim is FALSE.
    ```
### Architecture
![Alt text](https://github.com/Ant-Tonmay/TruthLens/blob/main/architecture.png)

## Setup

To set up and run this project, you will need to install several libraries and configure access to external services.

### Prerequisites

*   Python 3.x
*   Access to a Neo4j Aura instance or a local Neo4j database.
*   An API key for Google Generative AI (for Gemini model).
*   Ollama installed and running locally with the `llama3` model pulled.

### Installation

Install the required Python libraries using pip:

```bash
!pip install neo4j sentence-transformers colab-xterm ollama SPARQLWrapper google-generativeai pypdf langchain langchain-community langchain-core wikipedia-api faiss-cpu PyPDF2
```

*Note: Some libraries like `colab-xterm` might be specific to a Colab environment. The sources also show dependency resolution and successful installation of various packages including `neo4j`, `sentence-transformers`, `ollama`, `SPARQLWrapper`, `google-generativeai`, `pypdf`, `langchain`, `langchain-community`, `langchain-core`, `wikipedia-api`, `faiss-cpu`, and `PyPDF2`. There is a deprecation warning noted for `HuggingFaceEmbeddings` in LangChain 0.2.2, suggesting an alternative package.*

### Configuration

1.  **Neo4j:** Configure your Neo4j connection details:
    ```python
    NEO4J_URI="your_neo4j_uri"
    NEO4J_USERNAME="your_username"
    NEO4J_PASSWORD="your_password"
    # AURA_INSTANCEID and AURA_INSTANCENAME are also mentioned but not explicitly used in the provided code snippets for connection.
    ```
2.  **Google Generative AI:** Set up your API key for accessing Google's models like Gemini:
    ```python
    client = genai.Client(api_key="your_google_api_key")
    ```
3.  **Ollama:** Ensure Ollama is running and the `llama3` model is available. Instructions for setting up Ollama and pulling the model are provided, using `colab-xterm` in the source:
    ```bash
    # Inside colab-xterm terminal
    curl -fsSL https://ollama.com/install.sh | sh
    ollama serve & ollama pull llama3
    ```
    The system then uses the `ollama.chat` function with the `llama3` model.
4.  **HuggingFace Embeddings:** The system uses the `sentence-transformers/all-MiniLM-L6-v2` model for embeddings. This model is automatically downloaded by the `SentenceTransformer` library upon first use.
5.  
### Run Application
Install Docker : 
    https://docs.docker.com/engine/install/
    
1.  
    ```bash
    $ git clone https://github.com/Ant-Tonmay/TruthLens.git
    ```
2. 
    ```bash
    # Start the Backend
    $ cd TruthLens-backend
    $ docker compose build
    $ docker compose up
    ```
 2. 
    ```bash
    # Start the Frontend
    $ cd TruthLens-frontend
    $ npm i
    $ npm run dev
    ```
    
    



