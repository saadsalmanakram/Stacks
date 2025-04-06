# LangChain Tools

This repository provides a comprehensive overview of **Tools in LangChain**, which are integral for building applications that interact with external systems such as APIs, databases, and document storage. LangChain tools offer modularity and flexibility, enabling developers to create dynamic and efficient workflows for LLM-powered applications.

---

## What Are Tools in LangChain?

In LangChain, **Tools** are interfaces that allow an agent (powered by an LLM) to interact with external systems. These can include:
- APIs
- Search engines
- Vector databases
- File storage systems
- Custom integrations for specific workflows

---

## Supported Tools

Below are some of the most commonly used tools in LangChain:

### 1. Search Tools

#### a. Google Search API
**Purpose:** Enables real-time search for retrieving up-to-date information.

**Setup:**
1. Install the required library:
   ```bash
   pip install google-search-results
   ```

2. Initialize the tool:
   ```python
   from langchain.tools import GoogleSearchAPIWrapper

   search_tool = GoogleSearchAPIWrapper(
       api_key="your_google_api_key",
       cse_id="your_cse_id"
   )
   ```

3. Use the tool in an agent:
   ```python
   response = search_tool.run("Latest advancements in AI for 2025")
   print(response)
   ```

#### b. Bing Search API
**Purpose:** An alternative to Google Search with strong integration for Microsoft services.

**Setup:**
1. Install the required library:
   ```bash
   pip install azure-cognitiveservices-search
   ```
2. Initialize and use the tool:
   ```python
   from langchain.tools import BingSearchAPIWrapper

   bing_tool = BingSearchAPIWrapper(
       subscription_key="your_bing_api_key",
       endpoint="your_bing_endpoint"
   )

   response = bing_tool.run("Explain quantum computing in simple terms")
   print(response)
   ```

---

### 2. Vector Database Tools

#### a. Pinecone
**Purpose:** For vector similarity search in applications like semantic search and recommendations.

**Setup:**
1. Install Pinecone:
   ```bash
   pip install pinecone-client
   ```

2. Initialize Pinecone and connect:
   ```python
   import pinecone
   from langchain.vectorstores import Pinecone

   pinecone.init(api_key="your_pinecone_api_key", environment="your_environment")

   index = Pinecone(
       index_name="your_index_name",
       namespace="your_namespace"
   )
   ```

3. Query the vector store:
   ```python
   results = index.similarity_search("Find documents related to renewable energy", k=5)
   for result in results:
       print(result)
   ```

#### b. Weaviate
**Purpose:** Open-source vector search engine with extensive use cases.

**Setup:**
1. Install Weaviate:
   ```bash
   pip install weaviate-client
   ```

2. Initialize the tool:
   ```python
   from langchain.vectorstores import Weaviate

   client = Weaviate(
       url="https://your-weaviate-instance.com",
       api_key="your_api_key"
   )

   weaviate_tool = Weaviate(client=client, index_name="your_index")
   ```

---

### 3. Document Retrieval Tools

#### a. File-Based Retrieval
**Purpose:** Allows searching and extracting information from local files.

**Setup:**
1. Use the `LocalFileSystemLoader` for local files:
   ```python
   from langchain.document_loaders import LocalFileSystemLoader

   loader = LocalFileSystemLoader(
       folder_path="path/to/your/files",
       glob_pattern="*.txt"
   )

   documents = loader.load()
   ```

#### b. Elasticsearch
**Purpose:** High-performance search for large datasets.

**Setup:**
1. Install Elasticsearch Python client:
   ```bash
   pip install elasticsearch
   ```

2. Initialize the Elasticsearch client:
   ```python
   from langchain.document_loaders import ElasticsearchDocumentLoader

   loader = ElasticsearchDocumentLoader(
       es_url="http://localhost:9200",
       index="your_index"
   )

   documents = loader.load()
   ```

---

### 4. API Integration Tools

#### a. Zapier
**Purpose:** Automates workflows by connecting to thousands of APIs.

**Setup:**
1. Install Zapier SDK:
   ```bash
   pip install zapier
   ```

2. Integrate Zapier with LangChain:
   ```python
   from langchain.tools import ZapierNLAWrapper

   zapier_tool = ZapierNLAWrapper(api_key="your_zapier_api_key")

   response = zapier_tool.run("Send an email via Gmail API")
   print(response)
   ```

---

## Best Practices

1. **Secure API Keys:**
   Use environment variables or secret managers to store sensitive API keys.
   ```bash
   export API_KEY="your_api_key"
   ```

2. **Test Configurations:**
   Ensure each tool works independently before integrating into your LangChain pipeline.

3. **Error Handling:**
   Wrap tool calls in `try...except` blocks to gracefully handle failures.

4. **Optimize for Scale:**
   Use caching and batched requests when working with high-volume data or APIs.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Weaviate Documentation](https://weaviate.io/documentation)
- [Zapier Documentation](https://zapier.com/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

---

