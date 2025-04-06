# **Offloaded Static Cache in 🤗 Transformers**  

## **📌 What is Offloaded Static Cache?**  
🚀 **Offloaded Static Cache (`offloaded_static`)** combines:  
✔ **Offloading (moves KV cache to CPU)** to **reduce GPU memory usage**.  
✔ **Static Cache (pre-allocates cache)** for **JIT optimizations** and **consistent memory usage**.  

💡 **Why is this useful?**  
- 🏆 **Reduces VRAM usage** while still allowing for **JIT optimizations**.  
- ⚡ **Maintains fast generation speeds** by keeping cache access optimized.  
- 🔥 **Ideal for large models** where memory is a constraint but **performance is still a priority**.  

---

## **🚀 How Offloaded Static Cache Works**  
1️⃣ **Pre-allocates KV cache** like `StaticCache` to **avoid dynamic resizing**.  
2️⃣ **Offloads KV cache to CPU**, reducing **GPU memory consumption**.  
3️⃣ **Supports JIT optimizations** to improve execution speed.  
4️⃣ **Maintains deterministic outputs** (unlike `QuantizedCache`, which can affect precision).  

📌 **When to Use Offloaded Static Cache?**  
- ✅ **Low GPU VRAM** but you still want **JIT optimizations**.  
- ✅ **Large model inference**, e.g., **LLaMA 2, Mistral, GPT-4-style models**.  
- ✅ **Long-context generation** where GPU memory is limited.  
- ❌ **Avoid if GPU VRAM is sufficient**, as it introduces **CPU-GPU transfer overhead**.  

---

## **🛠️ Enabling Offloaded Static Cache**
To enable **Offloaded Static Cache**, set:  
```python
cache_implementation="offloaded_static"
```
in `generation_config` or directly in `generate()`.  

---

## **💻 Code Example: Using Offloaded Static Cache**  
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

# Generate with Offloaded Static Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=20,
    cache_implementation="offloaded_static"  # Enable Offloaded Static Cache
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
💡 **Example Output:**  
```
Hello, my name is John, and I am a software engineer with 10 years of experience in...
```

---

## **🔍 Why Use Offloaded Static Cache?**
✔ **Reduces VRAM usage** by **offloading KV cache** to CPU.  
✔ **Improves performance with JIT optimizations**.  
✔ **Keeps deterministic outputs** (unlike quantized cache).  
✔ **Prevents cache resizing overhead**, leading to **stable latency**.  

---

## **📌 When to Use Offloaded Static vs. Other Cache Implementations?**  

| **Cache Type**              | **Use Case** | **Best When** |
|----------------------------|-------------|--------------|
| **Static Cache** (`static`) | Pre-allocates KV cache for efficiency | **Long sequences, JIT optimization** |
| **Dynamic Cache** (`dynamic`) | Default, grows as needed | **Short or varying-length generations** |
| **Offloaded Cache** (`offloaded`) | Moves KV cache to CPU to save GPU memory | **Low VRAM, large models** |
| **Quantized Cache** (`quantized`) | Reduces memory via lower precision | **Long-context, memory-limited inference** |
| **Offloaded Static Cache** (`offloaded_static`) | Moves static KV cache to CPU | **Low VRAM + JIT optimizations** |

---

## **🔄 Combining Offloaded Static Cache with JIT Compilation**
For further **speed optimizations**, you can combine **Offloaded Static Cache** with `torch.compile`:  

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

# Generate with Offloaded Static Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=50,
    cache_implementation="offloaded_static"
)

# Decode output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
---

## **💡 Summary: Best Practices**
✔ **Use Offloaded Static Cache for memory savings** on **large models**.  
✔ **Combine with JIT (`torch.compile`)** for performance boosts.  
✔ **Ideal for large sequences when GPU VRAM is low**.  
✔ **Avoid if you have enough VRAM**, as offloading introduces **CPU-GPU transfer latency**.  

🚀 **Offloaded Static Cache enables large-model inference with reduced VRAM usage and faster execution!**