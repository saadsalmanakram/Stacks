from crewai_tools import tool
import requests

@tool
def linkedin_api_tool(action, payload):
    # Replace with actual LinkedIn API endpoint and authorization
    headers = {"Authorization": "Bearer YOUR_LINKEDIN_API_TOKEN"}
    response = requests.post(f"https://api.linkedin.com/v2/{action}", json=payload, headers=headers)
    return response.json() if response.ok else response.text
