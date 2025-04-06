# **🚀 Working with Legacy Cache Format in 🤗 Transformers**

## **📌 What is Legacy Cache Format?**
Before the introduction of the `Cache` object, LLMs used a tuple of tuples of tensors to store past key-value pairs. This **legacy format** was dynamic in size, growing as text was generated, similar to `DynamicCache`.

While newer models use `Cache` objects, you may still encounter or need to work with this **legacy cache format** in certain scenarios. Fortunately, you can easily **convert between the legacy cache format and the newer `DynamicCache`**.

---

## **🛠️ Example: Converting Legacy Cache to `DynamicCache`**
### **🔹 How to Convert Legacy Cache to DynamicCache and Back**

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, DynamicCache

# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-chat-hf")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-chat-hf", torch_dtype=torch.float16, device_map="auto")

# Tokenize the input
inputs = tokenizer("Hello, my name is", return_tensors="pt").to(model.device)

# Generate text while returning the legacy cache format
generation_outputs = model.generate(
    **inputs,
    return_dict_in_generate=True,
    return_legacy_cache=True,  # Forces legacy cache format
    max_new_tokens=5
)

# Convert legacy cache format to DynamicCache
cache = DynamicCache.from_legacy_cache(generation_outputs.past_key_values)

# Convert the DynamicCache back to legacy format (if needed)
legacy_format_cache = cache.to_legacy_cache()
```

---

## **🚀 Explanation of the Code**

### **1️⃣ Load Model & Tokenizer**
We use **`meta-llama/Llama-2-7b-chat-hf`** for this example, and the model is loaded with `torch.float16` for better memory efficiency.

### **2️⃣ Generating Text with Legacy Cache**
- We set `return_legacy_cache=True` in the `generate()` call.  
- This forces the output cache to be in the **legacy format** (tuple of tuples of tensors).  
- The model generates the text and returns the legacy cache as part of the generation outputs.

### **3️⃣ Converting Legacy Cache to `DynamicCache`**
- **`DynamicCache.from_legacy_cache()`**: Converts the legacy cache into the newer `DynamicCache` format. This allows you to work with it more easily in the current framework.
  
### **4️⃣ Converting Back to Legacy Cache**
- **`cache.to_legacy_cache()`**: Converts a `DynamicCache` object back to the legacy format when needed.  

---

## **📌 Why Use Legacy Cache Format?**
Some projects or custom logic might depend on the legacy format, and **converting between cache formats** is seamless, allowing you to leverage the full benefits of `DynamicCache` while still maintaining compatibility with legacy systems.

---

## **📈 Benefits**
✔ **Seamless conversion** between legacy cache and newer cache formats.  
✔ **Efficient handling** of different cache types without breaking existing code.  
✔ **Useful for maintaining backward compatibility** with older models or systems relying on the legacy cache format.

🚀 **Keep your LLM workflows flexible** by handling both new and legacy cache formats efficiently!