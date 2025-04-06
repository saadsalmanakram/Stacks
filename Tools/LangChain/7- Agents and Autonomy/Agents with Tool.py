from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

# Define tools
def search(input: str) -> str:
    return f"Search results for: {input}"

search_tool = Tool(name="Search", func=search, description="Performs web searches")

# Initialize an agent
llm = OpenAI(model="text-davinci-003")
agent = initialize_agent([search_tool], llm, agent="zero-shot-react-description", verbose=True)

# Run the agent
response = agent.run("Find the capital of France.")
print(response)
