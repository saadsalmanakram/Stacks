### Agents and Tools Overview

#### **What is an Agent?**
An agent is a system that uses a **Large Language Model (LLM)** as its engine and incorporates various **tools** to execute tasks. These tools perform specific functions and contain descriptions that help the agent use them properly. 

An agent is designed to either:
- **Devise a series of actions/tools** and execute them all at once (e.g., **CodeAgent**)
- **Plan and execute actions/tools step by step**, waiting for the outcome of each action before proceeding (e.g., **ReactJsonAgent**)

#### **Types of Agents**

1. **Code Agent**
   - **Description**: The CodeAgent performs a series of actions by generating Python code in a planning step, which is then executed all at once.
   - **Use Case**: It is ideal for **multimodal tasks** that require handling different types of input/output.
   
2. **React Agents**
   - **Description**: These agents are designed for **reasoning tasks** using the **ReAct framework** (Yao et al., 2022), where the agent reasons based on previous observations.
   - **Variants**:
     - **ReactJsonAgent**: Generates tool calls as JSON.
     - **ReactCodeAgent**: Generates tool calls as code blobs and works well for LLMs that excel at coding.

#### **Framework of a React Agent**

For example, here’s how a **React Code agent** would tackle a question:
```python
>>> agent.run("How many more blocks in BERT base encoder than in the architecture proposed in Attention is All You Need?")
=====New task=====
How many more blocks in BERT base encoder than in the encoder from Attention is All You Need?
====Agent is executing code below:
bert_blocks = search(query="number of blocks in BERT base encoder")
print("BERT blocks:", bert_blocks)

====Agent is executing code below:
attention_layer = search(query="number of layers in Attention is All You Need")
print("Attention layers:", attention_layer)

====Agent is executing code below:
bert_blocks = 12
attention_layers = 6
diff = bert_blocks - attention_layers
print("Difference in blocks:", diff)
final_answer(diff)
```
The agent executes the actions step by step:
- Searches for the number of blocks in BERT
- Searches for the number of layers in "Attention is All You Need"
- Calculates the difference and outputs the result.

#### **Building an Agent**

To build an agent, you need:
1. **LLM Engine**: The language model that powers the agent.
2. **System Prompt**: What the LLM uses to generate output.
3. **Toolbox**: A set of tools for the agent to use.
4. **Parser**: A component to extract which tools to use and with which arguments.

Steps to Initialize:
1. Install the required dependencies:
   ```bash
   pip install transformers[agents]
   ```

2. **Define the `llm_engine`**:
   Use a model from Hugging Face or a custom LLM engine to handle the messages:
   ```python
   from huggingface_hub import login, InferenceClient

   login("<YOUR_HUGGINGFACEHUB_API_TOKEN>")
   client = InferenceClient(model="meta-llama/Meta-Llama-3-70B-Instruct")

   def llm_engine(messages, stop_sequences=["Task"]) -> str:
       response = client.chat_completion(messages, stop=stop_sequences, max_tokens=1000)
       return response.choices[0].message.content
   ```

3. **Define the tools**:
   Add tools to the agent’s toolbox, which can be used for various tasks (e.g., Python code execution, document question answering).

4. **Create and Run the Agent**:
   Initialize a CodeAgent or ReactCodeAgent, passing in the tools and LLM engine:
   ```python
   from transformers import CodeAgent

   agent = CodeAgent(tools=[], llm_engine=llm_engine, add_base_tools=True)
   agent.run("Translate this sentence to French and say it out loud.", sentence="Where is the nearest bakery?")
   ```

#### **Code Execution in Agents**
The agents can execute Python code using tools like the **PythonInterpreterTool**, ensuring safety as the environment is controlled. For example, Python code that executes within the agent will be constrained to the tools and functions allowed, such as basic print statements or tool-specific actions.

#### **System Prompt**
The **system prompt** defines the behavior of the agent. For example, for a React agent, the system prompt could be:
```plaintext
You are given a task to solve with tools: <<tool_descriptions>>.
Plan forward with 'Thought:', 'Code:', and 'Observation:' sequences. 
Use 'final_answer()' for the final result.
```

#### **Tools**
Tools are functions that the agent can use to perform specific tasks. The **PythonInterpreterTool**, for example, allows executing Python code. Tools can be added to the agent or replaced dynamically.

##### **Default Toolbox**:
Includes tools like:
- **Document question answering** (e.g., Donut for PDFs)
- **Image question answering** (e.g., VILT for images)
- **Speech to text** (e.g., Whisper)
- **Text to speech** (e.g., SpeechT5)
- **Web search** (e.g., DuckDuckGo)
- **Python code execution** (for running generated Python code)

##### **Creating Custom Tools**:
You can create your own tools for custom tasks. For example, a tool that returns the most downloaded model for a given task on Hugging Face:
```python
from huggingface_hub import list_models

def model_download_tool(task: str) -> str:
    model = next(iter(list_models(filter=task, sort="downloads", direction=-1)))
    return model.id
```
This tool can then be added to the agent's toolbox and used in a task.

#### **Managing the Toolbox**
You can manage the agent's toolbox by adding, replacing, or updating tools. This allows flexibility in incorporating custom tools into existing agents.

For example:
```python
from transformers import CodeAgent

agent = CodeAgent(tools=[], llm_engine=llm_engine, add_base_tools=True)
agent.toolbox.add_tool(model_download_tool)
```

#### **Collections of Tools**
Tool collections, like the **ToolCollection** object, allow you to quickly load and use a set of tools for specific tasks:
```python
from transformers import ToolCollection, ReactCodeAgent

image_tool_collection = ToolCollection(collection_slug="huggingface-tools/diffusion-tools-6630bb19a942c2306a2cdb6f")
agent = ReactCodeAgent(tools=[*image_tool_collection.tools], add_base_tools=True)
```

---

#### **Open In Colab / Open In Studio Lab**
If you want to run these agents or experiments, consider opening them in a collaborative environment like **Google Colab** or **Studio Lab** for easy access to powerful hardware and shared execution. Simply integrate the provided code into your notebook on these platforms to get started.