
### **Multi-agents**

Multi-agent systems allow multiple agents to work together on a shared task, each specializing in different sub-tasks. This setup has been shown to enhance performance on many tasks by delegating work efficiently, rather than using one all-encompassing agent.

**Example:**
- The `ManagedAgent` class encapsulates an agent, which can be managed by another agent to perform specific sub-tasks (e.g., web searches).
- In the example, a `web_agent` is created that handles web searches using DuckDuckGo, and then a `manager_agent` is used to handle the overall task by incorporating this web search agent.

```python
from transformers.agents import ReactCodeAgent, HfApiEngine, DuckDuckGoSearchTool, ManagedAgent

llm_engine = HfApiEngine()

web_agent = ReactCodeAgent(tools=[DuckDuckGoSearchTool()], llm_engine=llm_engine)

managed_web_agent = ManagedAgent(
    agent=web_agent,
    name="web_search",
    description="Runs web searches for you. Give it your query as an argument."
)

manager_agent = ReactCodeAgent(
    tools=[], llm_engine=llm_engine, managed_agents=[managed_web_agent]
)

manager_agent.run("Who is the CEO of Hugging Face?")
```

This approach is useful when multiple specialized agents can work together in a more efficient and scalable way.

---

### **Advanced Tool Usage**

In some cases, you might need to create a custom tool. This can be done by subclassing `Tool` and defining specific attributes and behaviors.

**Example:**
The `HFModelDownloadsTool` class is a custom tool that provides the most downloaded models for a given task using the Hugging Face Hub.

```python
from transformers import Tool
from huggingface_hub import list_models

class HFModelDownloadsTool(Tool):
    name = "model_download_counter"
    description = """
    This tool returns the most downloaded model for a given task from Hugging Face Hub.
    """
    inputs = {
        "task": {
            "type": "string",
            "description": "The task category (e.g., text-classification, depth-estimation)"
        }
    }
    output_type = "string"

    def forward(self, task: str):
        model = next(iter(list_models(filter=task, sort="downloads", direction=-1)))
        return model.id
```

You can then push this custom tool to the Hub for reuse, or load it directly using `load_tool`.

---

### **Importing a Space as a Tool**

You can use Hugging Face Spaces directly as tools. By using `Tool.from_space()`, you can integrate various Spaces into your workflow seamlessly.

**Example:**
Here’s how you can import the FLUX.1-dev Space and use it to generate an image:

```python
from transformers import Tool

image_generation_tool = Tool.from_space(
    "black-forest-labs/FLUX.1-dev",
    name="image_generator",
    description="Generate an image from a prompt"
)

image_generation_tool("A sunny beach")
```

This can be further extended by using the tool in conjunction with other agents to refine prompts and generate even more specific images.

---

### **Using Gradio Tools**

The `gradio-tools` library allows Hugging Face Spaces to be used as tools. You can wrap an existing tool from the Gradio ecosystem into a `Tool` object using `Tool.from_gradio()`.

**Example:**
You can use the `StableDiffusionPromptGeneratorTool` from Gradio to generate better prompts for image generation:

```python
from gradio_tools import StableDiffusionPromptGeneratorTool
from transformers import Tool, load_tool, CodeAgent

gradio_prompt_generator_tool = StableDiffusionPromptGeneratorTool()
prompt_generator_tool = Tool.from_gradio(gradio_prompt_generator_tool)
```

This tool helps improve prompts used to generate images, further enhancing the quality of the generated outputs.

---

### **Using LangChain Tools**

LangChain is a robust framework that enables complex tool interactions. You can integrate LangChain tools into your agents using `Tool.from_langchain()`.

**Example:**
Here’s how you can use LangChain’s `serpapi` search tool to retrieve information about BERT's architecture:

```python
from langchain.agents import load_tools
from transformers import Tool, ReactCodeAgent

search_tool = Tool.from_langchain(load_tools(["serpapi"])[0])

agent = ReactCodeAgent(tools=[search_tool])

agent.run("How many more blocks (also denoted as layers) are in BERT base encoder compared to the encoder from the architecture proposed in Attention is All You Need?")
```

This demonstrates how to combine the capabilities of LangChain’s tools with Hugging Face’s agent framework.

---

### **Gradio Interface for Agent Interactions**

To make interactions with your agent more engaging, you can display the agent’s thoughts and outputs using a Gradio interface.

**Example:**
Here’s how to set up a Gradio interface that interacts with an agent to generate an image based on user input:

```python
import gradio as gr
from transformers import (
    load_tool,
    ReactCodeAgent,
    HfApiEngine,
    stream_to_gradio,
)

image_generation_tool = load_tool("m-ric/text-to-image")

llm_engine = HfApiEngine("meta-llama/Meta-Llama-3-70B-Instruct")

agent = ReactCodeAgent(tools=[image_generation_tool], llm_engine=llm_engine)


def interact_with_agent(task):
    messages = []
    messages.append(gr.ChatMessage(role="user", content=task))
    yield messages
    for msg in stream_to_gradio(agent, task):
        messages.append(msg)
        yield messages + [
            gr.ChatMessage(role="assistant", content="⏳ Task not finished yet!")
        ]
    yield messages


with gr.Blocks() as demo:
    text_input = gr.Textbox(lines=1, label="Chat Message", value="Make me a picture of the Statue of Liberty.")
    submit = gr.Button("Run illustrator agent!")
    chatbot = gr.Chatbot(
        label="Agent",
        type="messages",
        avatar_images=(None, "https://em-content.zobj.net/source/twitter/53/robot-face_1f916.png"),
    )
    submit.click(interact_with_agent, [text_input], [chatbot])

if __name__ == "__main__":
    demo.launch()
```

This example demonstrates how to use a Gradio interface to display the agent’s workflow in real-time while generating an image based on user input.

---
