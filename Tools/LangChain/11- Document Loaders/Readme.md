# Document Loaders in LangChain

Document Loaders in LangChain are essential for ingesting and processing text from various sources, including files, databases, APIs, and web pages. This guide explains the purpose, supported loaders, setup instructions, and best practices for working with document loaders in LangChain.

---

## What Are Document Loaders?

Document Loaders are responsible for extracting text or data from external sources and preparing it for further processing in a LangChain pipeline. They standardize the process of data ingestion, enabling seamless integration with LLMs and other tools.

---

## Supported Document Loaders

LangChain provides support for a wide range of document loaders. Below are the major categories:

### 1. File-Based Loaders

#### a. Text Files
**Purpose:** Load plain text files for processing.

**Usage:**
```python
from langchain.document_loaders import TextLoader

loader = TextLoader("path/to/your/file.txt")
documents = loader.load()
for doc in documents:
    print(doc.page_content)
```

#### b. PDF Files
**Purpose:** Extract text from PDFs, including scanned documents.

**Setup:** Install `PyPDF2` or `PyMuPDF` for PDF processing.
```bash
pip install PyPDF2
```

**Usage:**
```python
from langchain.document_loaders import PyPDFLoader

loader = PyPDFLoader("path/to/your/file.pdf")
documents = loader.load()
```

#### c. CSV Files
**Purpose:** Process CSV files with rows as individual documents.

**Usage:**
```python
from langchain.document_loaders import CSVLoader

loader = CSVLoader(file_path="path/to/your/file.csv", source_column="content")
documents = loader.load()
```

---

### 2. Database Loaders

#### a. SQL Databases
**Purpose:** Extract text data from SQL tables or queries.

**Setup:** Install `SQLAlchemy` for database connectivity.
```bash
pip install sqlalchemy
```

**Usage:**
```python
from langchain.document_loaders import SQLLoader

loader = SQLLoader(
    connection_string="sqlite:///example.db",
    table_name="your_table"
)
documents = loader.load()
```

---

### 3. Web-Based Loaders

#### a. Web Scraping
**Purpose:** Extract text content from web pages.

**Setup:** Install `beautifulsoup4` and `requests` for web scraping.
```bash
pip install beautifulsoup4 requests
```

**Usage:**
```python
from langchain.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://example.com")
documents = loader.load()
```

#### b. Notion
**Purpose:** Load documents from Notion workspaces.

**Setup:**
```bash
pip install notion-client
```

**Usage:**
```python
from langchain.document_loaders import NotionDBLoader

loader = NotionDBLoader(integration_token="your_integration_token", database_id="your_database_id")
documents = loader.load()
```

---

### 4. Cloud Storage Loaders

#### a. AWS S3
**Purpose:** Extract files from S3 buckets.

**Setup:** Install `boto3` for AWS integration.
```bash
pip install boto3
```

**Usage:**
```python
from langchain.document_loaders import S3FileLoader

loader = S3FileLoader(
    bucket="your_bucket_name",
    key="path/to/your/file.txt"
)
documents = loader.load()
```

#### b. Google Drive
**Purpose:** Load files stored in Google Drive.

**Setup:** Install `google-api-python-client`.
```bash
pip install google-api-python-client
```

**Usage:**
```python
from langchain.document_loaders import GoogleDriveLoader

loader = GoogleDriveLoader(credentials_path="path/to/credentials.json")
documents = loader.load()
```

---

### 5. API-Based Loaders

#### a. REST APIs
**Purpose:** Fetch documents from custom APIs.

**Usage:**
```python
from langchain.document_loaders import RESTAPILoader

loader = RESTAPILoader(
    endpoint="https://api.example.com/data",
    headers={"Authorization": "Bearer your_token"}
)
documents = loader.load()
```

#### b. OpenAI Chat Messages
**Purpose:** Load conversations from OpenAI chat history.

**Usage:**
```python
from langchain.document_loaders import OpenAIChatLoader

loader = OpenAIChatLoader(api_key="your_openai_api_key")
documents = loader.load()
```

---

## Best Practices

1. **Batch Loading:**
   For large datasets, use batching to improve performance and memory management.
   ```python
   for batch in loader.load_in_batches(batch_size=50):
       process(batch)
   ```

2. **Metadata Enrichment:**
   Add metadata (e.g., file name, source URL) to each document to improve traceability.

3. **Preprocessing:**
   Clean and preprocess the data (e.g., remove stopwords, handle missing values) before passing it to LLMs.

4. **Error Handling:**
   Use `try...except` blocks to gracefully handle errors during loading.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [PyPDF2 Documentation](https://pypdf2.readthedocs.io/en/latest/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)

---
