from crewai_tools import tool
import weaviate

@tool
def save_to_weaviate(data):
    client = weaviate.Client("http://localhost:8080")  # Weaviate instance URL
    client.data_object.create(data, class_name="LinkedInMetrics")
    return "Data saved to Weaviate."
