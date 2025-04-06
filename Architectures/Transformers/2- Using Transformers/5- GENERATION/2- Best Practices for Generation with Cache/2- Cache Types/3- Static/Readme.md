# **Static Cache in 🤗 Transformers**  

## **📌 What is Static Cache?**  
By default, **"DynamicCache"** dynamically **grows** with each generation step, which prevents certain **JIT (Just-In-Time) optimizations** from being applied.  

💡 **Static Cache (`StaticCache`)** pre-allocates a **fixed maximum size** for the **key-value (KV) cache**, allowing you to:  
✔ **Optimize memory usage** by avoiding dynamic cache resizing.  
✔ **Improve performance** by enabling JIT optimizations.  
✔ **Generate up to a predefined max length** efficiently.  

---

## **🚀 How Static Cache Works**  
1️⃣ **Pre-allocates memory** for the KV cache based on a **fixed max length**.  
2️⃣ **Avoids resizing the cache dynamically**, reducing overhead.  
3️⃣ **Works best when JIT compilation (e.g., `torch.compile`) is used**.  
4️⃣ **Unlike Offloaded Cache**, it **keeps KV cache on GPU** but **optimizes memory allocation**.  

📌 **When to Use Static Cache?**  
- ✅ If you want **JIT optimizations**.  
- ✅ When running **long sequences** and want **consistent memory usage**.  
- ✅ If **dynamic cache resizing** is causing slowdowns.  
- ❌ **Avoid if your generation length varies significantly**, as **pre-allocating too much memory may waste resources**.  

---

## **🛠️ Enabling Static Cache**
To enable **Static Cache**, set:  
```python
cache_implementation="static"
```
in `generation_config` or directly in `generate()`.  

---

## **💻 Code Example: Using Static Cache**  
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load LLaMA 2 model & tokenizer
model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Define input prompt
inputs = tokenizer("Hello, my name is", return_tensors="pt").to(model.device)

# Generate with Static Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=20,
    cache_implementation="static"  # Enable Static Cache
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
💡 **Example Output:**  
```
Hello, my name is John, and I am a software engineer with 10 years of experience in...
```

---

## **🔍 Why Use Static Cache?**
✔ **Improves JIT compatibility** for frameworks like `torch.compile`.  
✔ **Eliminates cache resizing overhead**, reducing **latency jitter**.  
✔ **More predictable memory usage** than Dynamic Cache.  
✔ **Speeds up long-context generation**.  

---

## **📌 When to Use Static vs. Other Cache Implementations?**  

| **Cache Type**     | **Use Case** | **Best When** |
|-------------------|-------------|--------------|
| **Static Cache** (`static`) | Pre-allocates KV cache for efficiency | **Long sequences, JIT optimization** |
| **Dynamic Cache** (`dynamic`) | Default, grows as needed | **Short or varying-length generations** |
| **Offloaded Cache** (`offloaded`) | Moves KV cache to CPU to save GPU memory | **Low VRAM, large models** |
| **Quantized Cache** (`quantized`) | Reduces memory via lower precision | **Long-context, memory-limited inference** |

---

## **🔄 Combining Static Cache with JIT Compilation**
For further **speed optimizations**, you can combine **Static Cache** with `torch.compile`:  

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model
model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    torch_dtype=torch.float16,
    device_map="auto"
)

# Compile model for faster execution
model = torch.compile(model)

# Define input
inputs = tokenizer("Once upon a time,", return_tensors="pt").to(model.device)

# Generate with Static Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=50,
    cache_implementation="static"
)

# Decode output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
---

## **💡 Summary: Best Practices**
✔ **Use Static Cache for faster inference** in **long-text generation**.  
✔ **Combine with JIT (`torch.compile`)** for additional **performance boosts**.  
✔ **Ensure max length is properly set** to avoid memory wastage.  
✔ **Avoid for extremely variable-length generations**, as **pre-allocating too much memory** may be inefficient.  

🚀 **Static Cache optimizes memory usage and enables faster text generation!**