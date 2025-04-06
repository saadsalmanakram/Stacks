# Directional Stimulus Prompting

Directional Stimulus Prompting (DSP) is a novel prompting technique proposed by Li et al., (2023) to enhance Large Language Model (LLM) performance in generating more precise and contextually relevant outputs. This technique introduces a **stimulus/hint generation** mechanism that provides additional directional guidance to a black-box frozen LLM.

## Overview

Standard prompting techniques rely on directly feeding a prompt into an LLM and receiving a response. However, DSP introduces an **intermediary policy language model (policy LM)** that generates stimulus/hints before the final prompt is given to the LLM. This approach ensures that the LLM is guided in the desired direction without needing direct fine-tuning.

### Key Features of DSP:
- **Tuneable Policy LM:** A smaller, trainable policy model generates the hint/stimulus.
- **RL Optimization:** Reinforcement Learning (RL) techniques optimize the policy LM for better hint generation.
- **Black-box LLM Compatibility:** Works with frozen, non-trainable LLMs like GPT-4, Claude, or LLaMA-2.

## How DSP Works

1. A user provides an initial query.
2. The **policy LM** generates an optimized hint/stimulus based on the query.
3. The hint is added to the query, forming a "directional prompt."
4. The final prompt is passed to a **frozen LLM** for output generation.

### Comparison: Standard vs. Directional Stimulus Prompting

| Approach | Process | Optimization | Control over Output |
|----------|---------|--------------|----------------------|
| Standard Prompting | Direct input into LLM | No RL optimization | Low |
| Directional Stimulus Prompting | Generates a hint before input | RL-optimized policy LM | High |

## Implementation Guide

Below is an original implementation of DSP using Python and the Hugging Face `transformers` library.

### 1. Setting Up Dependencies
```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

def load_model(model_name):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    return model, tokenizer

policy_model, policy_tokenizer = load_model("facebook/opt-350m")  # Policy LM
llm_model, llm_tokenizer = load_model("meta-llama/Llama-2-7b")  # Frozen LLM
```

### 2. Generating a Stimulus/Hint
```python
def generate_hint(policy_model, policy_tokenizer, user_query):
    input_ids = policy_tokenizer(user_query, return_tensors="pt").input_ids
    with torch.no_grad():
        output_ids = policy_model.generate(input_ids, max_length=50)
    hint = policy_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return hint

user_query = "Summarize the impact of climate change on marine life."
hint = generate_hint(policy_model, policy_tokenizer, user_query)
print("Generated Hint:", hint)
```

### 3. Constructing the Directional Prompt
```python
def create_directional_prompt(user_query, hint):
    return f"[Hint: {hint}]\nUser Query: {user_query}"

directional_prompt = create_directional_prompt(user_query, hint)
print("Final Directional Prompt:", directional_prompt)
```

### 4. Passing the Prompt to a Frozen LLM
```python
def generate_response(llm_model, llm_tokenizer, directional_prompt):
    input_ids = llm_tokenizer(directional_prompt, return_tensors="pt").input_ids
    with torch.no_grad():
        output_ids = llm_model.generate(input_ids, max_length=100)
    response = llm_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return response

response = generate_response(llm_model, llm_tokenizer, directional_prompt)
print("LLM Response:", response)
```

## Advantages of DSP

- **Improves LLM Output Quality:** The additional hint guides the model toward better responses.
- **Works with Pre-Trained Models:** No need to fine-tune large LLMs.
- **Optimized Guidance via RL:** Policy LM can be trained for domain-specific optimizations.
- **Scalability:** Works across different use cases, from summarization to code generation.

## Future Enhancements
- **Fine-Tuning the Policy LM:** Training a policy LM with reinforcement learning techniques for better hint generation.
- **Expanding to Other LLMs:** Testing with models like Mistral and Claude.
- **Integrating Multi-Step Guidance:** Using multiple hints iteratively for complex queries.

## Check out the Paper
- Li et al., (2023). "Directional Stimulus Prompting: Guiding Large Language Models with Optimized Hints."

---


