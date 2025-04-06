# **Sliding Window Cache in 🤗 Transformers**  

## **📌 What is Sliding Window Cache?**  
🚀 **Sliding Window Cache (`sliding_window`)** is a **memory-efficient caching strategy** that:  
✔ **Retains only the last `sliding_window` tokens** instead of storing the entire KV cache.  
✔ **Works with models that support Sliding Window Attention**, e.g., **Mistral**.  
✔ **Supports JIT optimizations**, making it **compatible with `torch.compile`**.  

💡 **Why is this useful?**  
- 🏆 **Reduces GPU VRAM usage** by discarding old tokens in attention.  
- ⚡ **Ideal for long-context inference** without excessive memory growth.  
- 🔥 **Improves speed** by keeping memory requirements stable.  

---

## **🚀 How Sliding Window Cache Works**  
1️⃣ **Limits memory use** by storing **only the last `sliding_window` tokens**.  
2️⃣ **Uses an attention window** instead of processing all past tokens.  
3️⃣ **Ensures efficient long-text generation** with constant memory consumption.  
4️⃣ **Compatible with JIT optimizations**, reducing runtime overhead.  

📌 **When to Use Sliding Window Cache?**  
- ✅ **Low GPU VRAM** and long sequences.  
- ✅ **Inference with models like Mistral**, which support **sliding window attention**.  
- ✅ **Long-context applications** such as **chatbots, summarization, or document processing**.  
- ❌ **Not supported for all models**—use only if your model has **sliding window attention**.  

---

## **🛠️ Enabling Sliding Window Cache**
To enable **Sliding Window Cache**, set:  
```python
cache_implementation="sliding_window"
```
in `generation_config` or directly in `generate()`.  

---

## **💻 Code Example: Using Sliding Window Cache**  
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load Mistral model & tokenizer
model_id = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16
).to("cuda:0")  # Load to GPU

# Define input prompt
inputs = tokenizer("Yesterday I was at a rock concert and", return_tensors="pt").to(model.device)

# Generate with Sliding Window Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=30,
    cache_implementation="sliding_window"  # Enable Sliding Window Cache
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
💡 **Example Output:**  
```
Yesterday I was at a rock concert and it was amazing! The energy of the crowd, the lights, the sound—everything was perfect. I danced all night...
```

---

## **🔍 Why Use Sliding Window Cache?**
✔ **Reduces VRAM usage** by discarding older tokens.  
✔ **Ideal for long sequences** without excessive memory growth.  
✔ **Boosts efficiency** by keeping memory footprint stable.  
✔ **Compatible with JIT compilation** for speed optimizations.  

---

## **📌 When to Use Sliding Window vs. Other Cache Types?**  

| **Cache Type**              | **Use Case** | **Best When** |
|----------------------------|-------------|--------------|
| **Static Cache** (`static`) | Pre-allocates KV cache for efficiency | **Long sequences, JIT optimization** |
| **Dynamic Cache** (`dynamic`) | Default, grows as needed | **Short or varying-length generations** |
| **Offloaded Cache** (`offloaded`) | Moves KV cache to CPU to save GPU memory | **Low VRAM, large models** |
| **Quantized Cache** (`quantized`) | Reduces memory via lower precision | **Long-context, memory-limited inference** |
| **Sliding Window Cache** (`sliding_window`) | Keeps only last N tokens in memory | **Long sequences, Mistral models** |

---

## **🔄 Combining Sliding Window Cache with JIT Compilation**
For further **speed optimizations**, you can combine **Sliding Window Cache** with `torch.compile`:  

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model
model_id = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    torch_dtype=torch.float16
).to("cuda:0")  # Load to GPU

# Compile model for faster execution
model = torch.compile(model)

# Define input
inputs = tokenizer("Once upon a time,", return_tensors="pt").to(model.device)

# Generate with Sliding Window Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=50,
    cache_implementation="sliding_window"
)

# Decode output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
---

## **💡 Summary: Best Practices**
✔ **Use Sliding Window Cache for long-context models like Mistral**.  
✔ **Ideal for inference with limited GPU VRAM**.  
✔ **Prevents excessive memory growth in long-text generation**.  
✔ **Combines well with JIT (`torch.compile`) for speed optimizations**.  

🚀 **Sliding Window Cache enables long-sequence generation while maintaining efficient memory usage!**