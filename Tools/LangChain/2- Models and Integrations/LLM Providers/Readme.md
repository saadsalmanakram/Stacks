# LangChain LLM Providers

This repository outlines the integration of various **Large Language Model (LLM) Providers** with [LangChain](https://www.langchain.com/). LangChain simplifies building applications powered by LLMs, offering a unified interface for interacting with different providers and their APIs.

---

## Supported LLM Providers

LangChain supports a wide range of LLM providers, each with its unique features and configurations. Below is a list of popular providers and their integration details:

### 1. OpenAI

**Features:**
- High-quality models like `text-davinci-003` and `gpt-4`.
- Extensive fine-tuning capabilities.

**Setup:**

1. Install the OpenAI library:
   ```bash
   pip install openai
   ```

2. Initialize the LLM:
   ```python
   from langchain.llms import OpenAI

   llm = OpenAI(
       model="text-davinci-003",
       temperature=0.7,
       max_tokens=150
   )
   ```

3. Use the LLM in your LangChain pipeline:
   ```python
   from langchain.chains import LLMChain
   from langchain.prompts import PromptTemplate

   # Define a prompt
   prompt = PromptTemplate(
       input_variables=["question"],
       template="Answer the question: {question}"
   )

   # Create a chain
   chain = LLMChain(llm=llm, prompt=prompt)

   # Run the chain
   response = chain.run({"question": "What is LangChain?"})
   print(response)
   ```

---

### 2. Cohere

**Features:**
- Models optimized for text classification, summarization, and embeddings.
- Pre-trained multilingual support.

**Setup:**

1. Install the Cohere library:
   ```bash
   pip install cohere
   ```

2. Initialize the LLM:
   ```python
   from langchain.llms import Cohere

   llm = Cohere(
       model="command-xlarge-nightly",
       temperature=0.6,
       max_tokens=200
   )
   ```

3. Use it in your LangChain application:
   ```python
   response = llm("Explain the benefits of using Cohere with LangChain.")
   print(response)
   ```

---

### 3. Hugging Face Hub

**Features:**
- Access to open-source models, including transformers.
- Community-contributed models for various use cases.

**Setup:**

1. Install the Hugging Face Hub library:
   ```bash
   pip install huggingface_hub
   ```

2. Initialize the LLM:
   ```python
   from langchain.llms import HuggingFaceHub

   llm = HuggingFaceHub(
       repo_id="google/flan-t5-large",
       model_kwargs={"temperature": 0.5, "max_length": 256}
   )
   ```

3. Generate a response:
   ```python
   response = llm("Summarize the key features of LangChain.")
   print(response)
   ```

---

### 4. Google PaLM

**Features:**
- Advanced natural language understanding and generation.
- Highly accurate for complex tasks.

**Setup:**

1. Install the required SDK:
   ```bash
   pip install google-generativeai
   ```

2. Initialize the LLM:
   ```python
   from langchain.llms import GooglePalm

   llm = GooglePalm(
       model="chat-bison",
       temperature=0.8,
       max_output_tokens=300
   )
   ```

3. Use in your application:
   ```python
   response = llm("What are the use cases of Google PaLM in LangChain?")
   print(response)
   ```

---

### 5. Anthropic (Claude)

**Features:**
- Designed for safety and interpretability.
- Focused on helpful and harmless outputs.

**Setup:**

1. Install Anthropic’s library:
   ```bash
   pip install anthropic
   ```

2. Initialize the LLM:
   ```python
   from langchain.llms import Anthropic

   llm = Anthropic(
       model="claude-v1",
       temperature=0.7,
       max_tokens_to_sample=256
   )
   ```

3. Generate a response:
   ```python
   response = llm("What is the importance of safe AI in LangChain workflows?")
   print(response)
   ```

---

## Best Practices

1. **API Keys:**
   Ensure you store API keys securely using environment variables or a secrets manager.
   ```bash
   export OPENAI_API_KEY="your_api_key"
   ```

2. **Model Selection:**
   Choose the model that best fits your use case. For example:
   - OpenAI for general-purpose tasks.
   - Cohere for embeddings and multilingual tasks.
   - Hugging Face for open-source flexibility.

3. **Experiment with Hyperparameters:**
   Adjust parameters like `temperature`, `max_tokens`, and `top_p` to optimize performance.

4. **Error Handling:**
   Implement error handling to manage API timeouts or invalid responses gracefully.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/)
- [Cohere Documentation](https://docs.cohere.ai/)
- [Hugging Face Models](https://huggingface.co/models)
- [Google PaLM API](https://developers.generativeai.google/)
- [Anthropic Documentation](https://www.anthropic.com/)

---

