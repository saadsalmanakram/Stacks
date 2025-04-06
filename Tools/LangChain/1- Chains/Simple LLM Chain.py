from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

# Define a prompt template
prompt = PromptTemplate(
    input_variables=["name"],
    template="What are some interesting facts about {name}?"
)

# Define an LLM
llm = OpenAI(model="text-davinci-003")

# Combine them into a chain
chain = LLMChain(llm=llm, prompt=prompt)

# Run the chain
response = chain.run("Python programming")
print(response)
