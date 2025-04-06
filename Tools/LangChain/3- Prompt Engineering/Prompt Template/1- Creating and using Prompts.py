from langchain.prompts import PromptTemplate

# Define a template with placeholders
template = "Translate the following sentence to French: {sentence}"

# Create a prompt
prompt = PromptTemplate(input_variables=["sentence"], template=template)

# Format the prompt with data
formatted_prompt = prompt.format(sentence="How are you?")
print(formatted_prompt)
