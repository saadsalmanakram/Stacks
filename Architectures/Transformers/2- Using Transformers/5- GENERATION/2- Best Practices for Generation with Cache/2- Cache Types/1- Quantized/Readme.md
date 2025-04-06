# **Quantized Cache in 🤗 Transformers**  

## **📌 Why Use Quantized Cache?**  
Key-Value (**KV**) cache can consume **significant memory**, especially in **long-context generation** with **Large Language Models (LLMs)**.  
💡 **Solution** → **Quantizing the cache** reduces memory consumption but may slightly increase latency.  

### **🚀 Benefits of Quantized Cache**
✔ **Reduces VRAM usage** → More efficient long-text processing.  
✔ **Optimized for large models** → Essential for running **LLMs** with long contexts.  
✔ **Based on cutting-edge research** → Inspired by the **KIVI** paper ([link](https://arxiv.org/abs/2306.00978)).  

---

## **🛠️ How to Enable Quantized Cache**
To enable **quantized KV cache**, set:  
```python
cache_implementation="quantized"
```
in `generation_config`.  
Quantization-related parameters should be passed via `cache_config`, either as a **dictionary** or using `QuantizedCacheConfig`.  

```python
cache_config={"nbits": 4, "backend": "quanto"}
```

📌 **Recommended Configurations:**  
- Use **axis-key=0 & axis-value=0** for `quanto` backend.  
- Use **axis-key=1 & axis-value=1** for `HQQ` backend.  
- Keep other defaults **unless memory is an issue** (in which case, reduce `residual length`).  

---

## **⚠️ When to Use Quantized Cache**
- ✅ **Use quantization** if:  
  - Running out of **VRAM**.  
  - Generating long texts with **LLMs**.  
- ❌ **Avoid quantization** if:  
  - **Short-context generation** → Unnecessary latency overhead.  
  - **Sufficient GPU memory** → Native caching is faster.

---

## **💻 Code Example: Using Quantized Cache**  
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model & tokenizer
model_id = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16).to("cuda:0")

# Define input prompt
inputs = tokenizer("I like rock music because", return_tensors="pt").to(model.device)

# Generate with Quantized Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=20,
    cache_implementation="quantized",
    cache_config={"nbits": 4, "backend": "quanto"}  # Use 4-bit quantization with "quanto" backend
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```

💡 **Example Output (Quantized Cache)**  
```
I like rock music because it's loud and energetic. It's a great way to express myself and rel
```

💡 **Example Output (Without Quantization)**
```
I like rock music because it's loud and energetic. I like to listen to it when I'm feeling
```
📌 **Notice**: Quantized cache **does not change model accuracy**, but reduces memory usage.  

---

## **🔍 Summary: Best Practices**
✔ **Enable Quantized Cache for long-text generation with large models.**  
✔ **Balance memory efficiency and latency** based on **VRAM availability**.  
✔ **Use recommended backend settings** (`quanto` or `HQQ`).  
✔ **Disable cache quantization for small models or short-context generation.**  

🚀 **Quantized caching enables running LLMs with long-context generation on memory-limited hardware!**