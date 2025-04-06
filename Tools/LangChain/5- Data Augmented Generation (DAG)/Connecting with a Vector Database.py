from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

# Create a database and add data
embedding_model = OpenAIEmbeddings()
db = FAISS(embedding_model)
db.add_texts(["The Eiffel Tower is in Paris.", "AI is transforming the world."])

# Query the database
query = "Where is the Eiffel Tower?"
results = db.similarity_search(query)
print(results)
