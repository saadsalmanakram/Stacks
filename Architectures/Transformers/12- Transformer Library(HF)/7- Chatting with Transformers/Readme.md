
---

### Chatting with Transformers

Introduction to Chat Models
Chat models are conversational AIs that can send and receive messages. Famous examples include proprietary models like ChatGPT, but open-source models are becoming widely available. These models are free to download and run locally, though larger models require significant hardware resources (high memoryGPU). Smaller models can run on consumer GPUs or regular CPUs.

### Quickstart Guide
To quickly get started with a chat model, pass a conversation history (including user input) to the model. Here's a brief example to build a chat

```python
chat = [
    {role system, content You are a sassy, wise-cracking robot as imagined by Hollywood circa 1986.},
    {role user, content Hey, can you tell me any fun things to do in New York}
]
```

Use the `TextGenerationPipeline` to continue the conversation. Here's an example using LLaMA-3

```python
import torch
from transformers import pipeline

pipe = pipeline(text-generation, meta-llamaMeta-Llama-3-8B-Instruct, torch_dtype=torch.bfloat16, device_map=auto)
response = pipe(chat, max_new_tokens=512)
print(response[0]['generated_text'][-1]['content'])
```

To continue the chat, append the user’s message and pass it back to the pipeline

```python
chat = response[0]['generated_text']
chat.append({role user, content Wait, what's so wild about soup cans})
response = pipe(chat, max_new_tokens=512)
print(response[0]['generated_text'][-1]['content'])
```

### Choosing a Chat Model
When selecting a chat model, focus on
1. Model size (impacts memory and speed).
2. Quality of chat output (larger models generally perform better, but there is variation).

Model Size 
- The number in the model name (e.g., 8B or 70B) indicates the number of parameters. For an 8B model, expect it to require ~16GB of memory.
- Models like Mixture of Experts (MoE) may have more complex sizes but offer flexibility in memory usage.

Specialist Models 
- Some models are specialized for domains (medical, legal, etc.) but may still be outperformed by general-purpose models.

### Inside the Pipeline
The high-level pipeline is convenient, but a low-level approach gives more flexibility. Here’s how the process works

1. Load the model and tokenizer.
2. Apply chat formatting.
3. Tokenize the chat.
4. Generate a response.
5. Decode the generated tokens into readable text.

Here’s the code breakdown

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

chat = [
    {role system, content You are a sassy, wise-cracking robot as imagined by Hollywood circa 1986.},
    {role user, content Hey, can you tell me any fun things to do in New York}
]

model = AutoModelForCausalLM.from_pretrained(meta-llamaMeta-Llama-3-8B-Instruct, device_map=auto, torch_dtype=torch.bfloat16)
tokenizer = AutoTokenizer.from_pretrained(meta-llamaMeta-Llama-3-8B-Instruct)

formatted_chat = tokenizer.apply_chat_template(chat, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(formatted_chat, return_tensors=pt, add_special_tokens=False)
inputs = {key tensor.to(model.device) for key, tensor in inputs.items()}

outputs = model.generate(inputs, max_new_tokens=512, temperature=0.1)
decoded_output = tokenizer.decode(outputs[0][inputs['input_ids'].size(1)], skip_special_tokens=True)
print(decoded_output)
```

### Performance, Memory, and Hardware
While running on GPUs is optimal for speed, CPU-based generation is possible albeit slower. Memory bandwidth is more crucial than compute power for text generation. Bandwidth varies depending on the hardware

- High-end GPUs have much better memory bandwidth compared to consumer CPUs.
- To improve speed, quantization can reduce memory usage per parameter, allowing for better model utilization.

### Memory Considerations
Models by default use float32 precision, which takes 4 bytes per parameter. However, models like `bfloat16` precision (using 2 bytes per parameter) can save memory. Additionally, quantization (e.g., reducing precision to 8-bit or 4-bit) can reduce memory usage further.

Here’s an example using quantization with bitsandbytes

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_8bit=True)
model = AutoModelForCausalLM.from_pretrained(meta-llamaMeta-Llama-3-8B-Instruct, device_map=auto, quantization_config=quantization_config)
```

For the pipeline, the same configuration is used

```python
from transformers import pipeline, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_8bit=True)
pipe = pipeline(text-generation, meta-llamaMeta-Llama-3-8B-Instruct, device_map=auto, model_kwargs={quantization_config quantization_config})
```

### Performance Considerations
Larger models require more memory and are generally slower. However, Mixture of Experts (MoE) models are designed for efficiency by activating only a subset of parameters, allowing them to perform faster than standard models of the same size.

For more performance optimization, techniques like assisted generation or speculative sampling can improve generation speed by guessing multiple tokens at once and validating them with the chat model.

---
