# LangChain Prompt Template

This repository provides a reusable **Prompt Template** for use in [LangChain](https://www.langchain.com/) workflows. LangChain simplifies building applications powered by large language models (LLMs) by providing modular components. This prompt template module helps create structured, reusable, and efficient prompts for your LangChain pipelines.

---

## Features
- **Customizable templates:** Define dynamic prompts with placeholders for inputs.
- **Seamless integration:** Works with LangChain's prompt and chain components.
- **Dynamic rendering:** Render templates using user-provided inputs at runtime.
- **Validation:** Ensures all required inputs are provided.
- **Reusability:** Centralized and reusable prompt management for your applications.

---

## Installation

To use this prompt template, ensure you have Python installed (>=3.7) and install the necessary dependencies:

```bash
pip install langchain openai
```

---

## Usage

Here’s a step-by-step guide to using the prompt template in your LangChain project.

### 1. Import Necessary Libraries

```python
from langchain.prompts import PromptTemplate
```

### 2. Define Your Prompt Template

Use placeholders to make the prompt dynamic and adaptable:

```python
# Define the template with placeholders
prompt_template = """
You are an AI assistant specializing in {domain}. Your task is to help the user with {task}. 
Provide detailed, concise, and actionable insights.

Context:
{context}

Question:
{question}

Response:
"""
```

### 3. Create a PromptTemplate Object

Create a `PromptTemplate` object by specifying the template and input variables:

```python
from langchain.prompts import PromptTemplate

# Define input variables for the template
template_inputs = ["domain", "task", "context", "question"]

# Create the PromptTemplate object
prompt = PromptTemplate(
    input_variables=template_inputs,
    template=prompt_template
)
```

### 4. Render the Prompt with Inputs

Supply the required inputs dynamically:

```python
# Input values for the prompt
inputs = {
    "domain": "machine learning",
    "task": "explaining complex concepts",
    "context": "The user is a beginner interested in neural networks.",
    "question": "Can you explain backpropagation in simple terms?"
}

# Render the prompt
final_prompt = prompt.format(**inputs)

print(final_prompt)
```

Output:
```plaintext
You are an AI assistant specializing in machine learning. Your task is to help the user with explaining complex concepts. 
Provide detailed, concise, and actionable insights.

Context:
The user is a beginner interested in neural networks.

Question:
Can you explain backpropagation in simple terms?

Response:
```

### 5. Use in LangChain Pipelines

You can integrate the rendered prompt into LangChain pipelines, such as chains or agents:

```python
from langchain.chains import LLMChain
from langchain.llms import OpenAI

# Initialize the LLM (e.g., OpenAI GPT)
llm = OpenAI(model="text-davinci-003", temperature=0.7)

# Create an LLMChain
chain = LLMChain(llm=llm, prompt=prompt)

# Run the chain with inputs
response = chain.run(inputs)
print(response)
```

---

## Examples

Here are a few example prompt templates you can create:

### Example 1: Summarization Prompt
```python
summarization_template = """
Summarize the following text in {word_limit} words:

{text}

Summary:
"""
```

### Example 2: Code Debugging Prompt
```python
code_debugging_template = """
You are a coding assistant. Your task is to debug the following Python code snippet:

Code:
{code_snippet}

Describe the issues and provide fixes.
"""
```

---

## Best Practices

1. **Use descriptive variable names:** Ensure placeholders in templates are meaningful.
2. **Avoid hardcoding values:** Leverage `PromptTemplate` for dynamic rendering.
3. **Test templates:** Validate the template by running test inputs to ensure correctness.
4. **Keep prompts concise:** Avoid overly verbose prompts; focus on clarity.
5. **Iterate based on feedback:** Adjust prompts based on the model's performance.

---

## Troubleshooting

- **Error: Missing input variables:** Ensure all required inputs are passed when formatting the prompt.
- **Poor LLM responses:** Refine the prompt for clarity or provide more context.
- **Template rendering issues:** Validate placeholder names and template structure.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/)

---
