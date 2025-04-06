# **Offloaded Cache in 🤗 Transformers**  

## **📌 Why Use Offloaded Cache?**  
Similar to **KV cache quantization**, **offloading** reduces **GPU VRAM usage**. However, instead of reducing precision, it moves most of the **KV cache** to the **CPU** while keeping only the **current layer's cache** on the **GPU**.  

💡 **Key Benefits:**  
✔ **Saves GPU memory** → Prevents `CUDA out of memory` (OOM) errors.  
✔ **Always produces the same results** as standard KV caching.  
✔ **Can be used as a fallback strategy** when OOM occurs.  

---

## **🚀 How Offloaded Cache Works**  
1️⃣ **Stores the KV cache of past layers on the CPU** instead of GPU.  
2️⃣ **Moves only the current layer cache to the GPU** for computation.  
3️⃣ **Prefetches the next layer’s cache asynchronously** while offloading the previous layer.  
4️⃣ **Unlike quantization**, offloading **preserves numerical precision** (exact same output).  

📌 **Potential Trade-off:**  
- **Slightly slower generation speed** compared to default KV caching.  
- **Best for long-context generation** or models with **high beam search values**.  

---

## **🛠️ Enabling Offloaded Cache**
To enable **KV cache offloading**, set:  
```python
cache_implementation="offloaded"
```
in `generation_config` or directly in `generate()`.  

For **offloaded static cache**, use:  
```python
cache_implementation="offloaded_static"
```

---

## **💻 Code Example: Using Offloaded Cache**  
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load model & tokenizer
model_id = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16).to("cuda:0")

# Define input prompt
inputs = tokenizer("Fun fact: The shortest", return_tensors="pt").to(model.device)

# Generate with Offloaded Cache
out = model.generate(
    **inputs,
    do_sample=False,
    max_new_tokens=23,
    cache_implementation="offloaded"  # Enable offloaded cache
)

# Decode and print output
print(tokenizer.batch_decode(out, skip_special_tokens=True)[0])
```
💡 **Example Output:**  
```
Fun fact: The shortest war in history was between Britain and Zanzibar on August 27, 1896.
```

---

## **⚠️ When to Use Offloaded Cache**
- ✅ **Use Offloaded Cache if:**  
  - Running **out of VRAM** (`CUDA out of memory`).  
  - Generating **long-context outputs**.  
  - Running **beam search with large beam sizes**.  
- ❌ **Avoid if:**  
  - **Short prompts** (default KV cache is faster).  
  - You **already have enough GPU memory**.  

📌 **If performance is slow**, try `offloaded_static` for a more optimized offloaded cache.  

---

## **🔄 Using Offloaded Cache as a Fallback Strategy**
💡 **If a `CUDA out of memory` error occurs, retry with offloaded cache!**  
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def resilient_generate(model, *args, **kwargs):
    """
    Try generating normally. If an OOM error occurs, retry with offloaded cache.
    """
    try:
        return model.generate(*args, **kwargs)
    except torch.cuda.OutOfMemoryError as e:
        print(e)
        print("Retrying with cache_implementation='offloaded'")
        torch.cuda.empty_cache()  # Free up memory
        kwargs["cache_implementation"] = "offloaded"
        return model.generate(*args, **kwargs)

# Load model & tokenizer
model_id = "microsoft/Phi-3-mini-4k-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16).to("cuda:0")

# Long prompt with high beam search settings
prompt = ["okay " * 1000 + "Fun fact: The most"]
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
beam_params = {
    "num_beams": 40,
    "num_beam_groups": 40,
    "num_return_sequences": 40,
    "diversity_penalty": 1.0,
    "max_new_tokens": 23,
    "early_stopping": True,
}

# Run resilient generation
out = resilient_generate(model, **inputs, **beam_params)
responses = tokenizer.batch_decode(out[:, -28:], skip_special_tokens=True)
```
---

## **💡 What Happens if GPU Runs Out of Memory?**
On a **50GB GPU**, running this code may print:  
```
CUDA out of memory. Tried to allocate 4.83 GiB.
Retrying with cache_implementation='offloaded'
```
After retrying with **offloaded cache**, the model successfully generates **40 beams**!

---

## **🔍 Summary: Best Practices**
✔ **Use Offloaded Cache when VRAM is a bottleneck**.  
✔ **Leverage offloaded caching for large models and long texts**.  
✔ **Use fallback logic** to automatically switch if OOM occurs.  
✔ **Expect a minor speed tradeoff but identical outputs**.  

🚀 **Offloaded Cache allows running LLMs even on limited-memory GPUs!**