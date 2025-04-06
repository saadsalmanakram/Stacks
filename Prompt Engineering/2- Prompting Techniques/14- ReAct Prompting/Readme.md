# ReAct Prompting

## Introduction
ReAct (Reasoning + Acting) is a prompting framework introduced by Yao et al. (2022) that enables Large Language Models (LLMs) to generate both reasoning traces and task-specific actions in an interleaved manner. This approach allows models to induce, track, and update action plans dynamically while also interacting with external sources such as APIs, search engines, and databases to enhance decision-making.

ReAct combines Chain-of-Thought (CoT) reasoning with interactive actions, allowing LLMs to generate more factual and reliable responses by retrieving real-time information. This framework has demonstrated superior performance over conventional prompting techniques in both reasoning and decision-making tasks.

---

## Features
- **Interleaved Reasoning and Acting**: Enables LLMs to think through problems and take appropriate actions to retrieve missing information.
- **Reduction in Hallucinations**: By retrieving factual data, ReAct mitigates incorrect assumptions and hallucinations common in standard LLM outputs.
- **Enhanced Interpretability**: Generates structured reasoning traces that improve human interpretability.
- **Improved Decision-Making**: Demonstrates superior performance in complex reasoning and interactive environments such as web searches and game-based decision-making.

---

## How It Works
The ReAct framework follows an iterative loop:
1. **Thought**: The model thinks about the next logical step.
2. **Action**: The model interacts with an external tool (e.g., search engine, API call).
3. **Observation**: The model incorporates retrieved information into its reasoning.
4. **Repeat** until the final answer is derived.

### Example:
#### Question: *What is the capital of the country where the Amazon Rainforest is located?*
```
Thought 1: The Amazon Rainforest is primarily in Brazil. I need to find the capital of Brazil.
Action 1: Search[Brazil capital]
Observation 1: The capital of Brazil is Brasília.
Thought 2: The answer is Brasília.
Action 2: Finish[Brasília]
```

---

## Installation
Ensure you have the required dependencies installed:
```bash
pip install openai langchain dotenv google-search-results
```

---

## Implementation in Python
### Step 1: Setup API Keys
Create a `.env` file to store your API keys:
```
OPENAI_API_KEY=your_openai_key
SERPER_API_KEY=your_serper_api_key
```

### Step 2: Load Dependencies
```python
import os
import openai
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.agents import load_tools, initialize_agent

# Load environment variables
load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["SERPER_API_KEY"] = os.getenv("SERPER_API_KEY")
```

### Step 3: Configure the Agent
```python
# Initialize LLM and tools
llm = OpenAI(model_name="text-davinci-003", temperature=0)
tools = load_tools(["google-serper", "llm-math"], llm=llm)
agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
```

### Step 4: Run the Agent
```python
response = agent.run("What is the height of Mount Everest in meters plus 100?")
print(response)
```

---

## Original Code Example
### Custom ReAct Prompting in Python (Without LangChain)
```python
import openai
import requests

def search_google(query):
    """Search Google and return the top result."""
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&key=YOUR_GOOGLE_API_KEY&cx=YOUR_CX_ID"
    response = requests.get(url).json()
    return response['items'][0]['snippet'] if 'items' in response else "No results found."

def react_prompt(question):
    thoughts = []
    actions = []
    observations = []
    
    # Initial reasoning
    thoughts.append(f"I need to analyze the question: {question}")
    actions.append(f"Search[{question}]")
    observations.append(search_google(question))
    
    # Generate final thought based on observation
    thoughts.append(f"Based on my research, the answer is likely: {observations[-1]}")
    actions.append("Finish")
    
    return "\n".join(thoughts + actions + observations)

# Example usage
print(react_prompt("Who is the president of the United States in 2025?"))
```

---

## Results on Knowledge-Intensive Tasks
### Evaluation on HotpotQA and FEVER
| Model | HotPotQA (EM) | Fever (Acc) |
|--------|-------------|-------------|
| CoT    | 67.2        | 77.8        |
| Act    | 58.4        | 72.1        |
| **ReAct** | **70.3** | **81.5** |

### Evaluation on Decision-Making Tasks
| Model | ALFWorld | WebShop |
|--------|---------|--------|
| Act    | 45.1    | 49.7   |
| **ReAct** | **58.3** | **63.4** |

These results highlight ReAct’s effectiveness in both reasoning and decision-making tasks, outperforming conventional prompting approaches.

---

## Conclusion
ReAct prompting is a powerful technique that enhances the reasoning and factual accuracy of LLMs by integrating dynamic interactions with external sources. Whether applied to knowledge retrieval, decision-making, or problem-solving, ReAct proves to be a reliable and interpretable solution. Future improvements can include enhanced search strategies and multi-modal interactions.

### Papers to Check
- Yao et al., 2022. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- Wei et al., 2022. [Chain-of-Thought Prompting Elicits Reasoning in LLMs](https://arxiv.org/abs/2201.11903)

---

