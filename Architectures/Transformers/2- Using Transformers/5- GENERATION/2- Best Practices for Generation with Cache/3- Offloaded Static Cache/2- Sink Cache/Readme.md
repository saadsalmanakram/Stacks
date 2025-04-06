# **Sink Cache in 🤗 Transformers**  

## **📌 What is Sink Cache?**  
🚀 **Sink Cache (`SinkCache`)** is an advanced **memory-efficient caching mechanism** that enables:  
✔ **Generating extremely long sequences** without fine-tuning.  
✔ **Stable performance** in long-form text generation by retaining **key "sink tokens"**.  
✔ **Reduced memory usage** by discarding most previous tokens while maintaining coherence.  

💡 **How is this achieved?**  
- 🔹 **Retains a few key tokens at the start** of the sequence (called **"sink tokens"**).  
- 🔹 **Discards all other tokens except the most recent ones** using a sliding window.  
- 🔹 **Sink tokens act as anchors**, preserving crucial context while discarding older tokens.  
- 🔹 **Ensures long-context coherence** without growing memory usage.  

📌 **When to Use Sink Cache?**  
✔ **Generating ultra-long sequences ("infinite" text generation)**.  
✔ **Memory-limited environments** where full KV caching is impractical.  
✔ **Use cases like book/story generation, long conversations, and document completion.**  
✔ **Ideal for autoregressive LLMs like Llama 2**.  

---

## **🛠️ How Sink Cache Works**
1️⃣ **"Sink tokens" are preserved** as **attention anchors**.  
2️⃣ **Old tokens are discarded**, except for the most recent **`window_size`** tokens.  
3️⃣ **Keeps inference efficient** while maintaining logical coherence.  
4️⃣ **Ensures stable text generation** over long sequences.  

📌 **Key Parameters in `SinkCache`**  
- **`num_sink_tokens`** – Number of initial tokens to keep as **attention anchors**.  
- **`window_length`** – Total number of tokens in cache (including sink tokens).  

---

## **💻 Code Example: Using Sink Cache**
Unlike other caches (`static`, `sliding_window`), **Sink Cache** must be **explicitly initialized** before calling `.generate()`.  

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, SinkCache

# Load Llama 2 model & tokenizer
model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16
).to("cuda:0")  # Load to GPU

# Define input prompt
inputs = tokenizer("This is a long story about unicorns, fairies and magic.", return_tensors="pt").to(model.device)

# Initialize Sink Cache with 4 sink tokens and a total window of 256 tokens
past_key_values = SinkCache(window_length=256, num_sink_tokens=4)

# Generate with Sink Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=30,
    past_key_values=past_key_values  # Use Sink Cache
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```

💡 **Example Output:**  
```
This is a long story about unicorns, fairies and magic. It is a fantasy world where unicorns and fairies live together in harmony. The story follows a young girl named Lily...
```

---

## **🔍 Why Use Sink Cache?**
✔ **Supports infinite-length generation** without memory overflow.  
✔ **Maintains logical coherence** by keeping crucial context.  
✔ **Reduces VRAM consumption** by limiting stored tokens.  
✔ **Works well for long-form text, books, and chatbot dialogues.**  

---

## **📌 When to Use Sink Cache vs. Other Cache Types?**  

| **Cache Type**               | **Use Case** | **Best When** |
|-----------------------------|-------------|--------------|
| **Static Cache** (`static`) | Pre-allocated KV cache | **Long sequences, JIT optimization** |
| **Dynamic Cache** (`dynamic`) | Grows as needed | **Short/variable-length generations** |
| **Offloaded Cache** (`offloaded`) | Moves KV cache to CPU | **Low VRAM, large models** |
| **Sliding Window Cache** (`sliding_window`) | Keeps only last N tokens | **Long sequences, Mistral models** |
| **Sink Cache** (`SinkCache`) | Preserves a few key tokens + sliding window | **Infinite-length text generation** |

---

## **🚀 Optimizing Sink Cache with JIT Compilation**
To further optimize **Sink Cache**, you can combine it with **`torch.compile`** for **faster inference**:

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, SinkCache

# Load model
model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    torch_dtype=torch.float16
).to("cuda:0")  # Load to GPU

# Compile model for speed optimization
model = torch.compile(model)

# Define input
inputs = tokenizer("Once upon a time,", return_tensors="pt").to(model.device)

# Initialize Sink Cache
past_key_values = SinkCache(window_length=512, num_sink_tokens=8)  # Increase window size for longer context

# Generate text with Sink Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=50,
    past_key_values=past_key_values
)

# Decode output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```

---

## **💡 Summary: Best Practices**
✔ **Use Sink Cache for infinite-length text generation**.  
✔ **Set a reasonable `num_sink_tokens` (4-8) to preserve key context**.  
✔ **Choose an appropriate `window_length` (256-512) for balancing coherence & memory efficiency**.  
✔ **Combine with JIT compilation (`torch.compile`) for faster inference**.  

