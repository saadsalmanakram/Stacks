from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.llms import OpenAI

# Create memory
memory = ConversationBufferMemory()

# Create a conversation chain with memory
conversation = ConversationChain(llm=OpenAI(model="text-davinci-003"), memory=memory)

# Interact with the chain
response1 = conversation.run("What's your name?")
response2 = conversation.run("How can you help me?")
print(response1)
print(response2)
