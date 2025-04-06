from langchain.llms import OpenAI

# Initialize the LLM
llm = OpenAI(model="text-davinci-003")

# Generate a response
response = llm("Summarize the benefits of AI in education.")
print(response)
