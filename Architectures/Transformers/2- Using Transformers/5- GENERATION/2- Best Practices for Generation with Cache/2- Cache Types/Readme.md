# **Generate with Cache in 🤗 Transformers**  

🤗 **Transformers** provides multiple **cache types** to optimize performance across **various models and tasks**.  

## **💡 Default Caching Behavior**  
- **All models** generate with **caching enabled by default**.  
- The **`DynamicCache`** class is the default cache for most models.  
- **DynamicCache allows cache size to grow dynamically** by saving more key-value pairs as generation progresses.  
- If you **don’t want to use caching**, set:  
  ```python
  model.generate(use_cache=False)
  ```

---

## **🔍 Cache Type Comparison Table**  
Different **cache types** have trade-offs in **memory efficiency, latency, and compatibility** with `torch.compile()`.  

| **Cache Type**              | **Memory Efficient** | **Supports `torch.compile()`** | **Initialization Needed?** | **Latency** | **Supports Long Contexts?** |
|-----------------------------|----------------------|--------------------------------|----------------------------|-------------|-----------------------------|
| **Dynamic Cache**           | ❌ No                | ❌ No                          | ❌ No                      | 🟠 Mid      | ❌ No                        |
| **Static Cache**            | ❌ No                | ✅ Yes                         | ✅ Yes                     | 🔴 High     | ❌ No                        |
| **Offloaded Cache**         | ✅ Yes               | ❌ No                          | ❌ No                      | 🟢 Low      | ✅ Yes                        |
| **Offloaded Static Cache**  | ❌ No                | ✅ Yes                         | ✅ Yes                     | 🔴 High     | ✅ Yes                        |
| **Quantized Cache**         | ✅ Yes               | ❌ No                          | ❌ No                      | 🟢 Low      | ✅ Yes                        |
| **Sliding Window Cache**    | ❌ No                | ✅ Yes                         | ✅ Yes                     | 🔴 High     | ❌ No                        |
| **Sink Cache**              | ✅ Yes               | ❌ No                          | ✅ Yes                     | 🟠 Mid      | ✅ Yes                        |

📌 **Key Considerations**  
- **Memory-efficient caching** is useful for deploying large models with constrained resources.  
- **Long-context caching** is essential for handling **long text sequences** efficiently.  
- **Latency-sensitive applications** should use **low-latency caches** like `Offloaded Cache` or `Quantized Cache`.

---

## *⚙️ How to Choose and Set a Cache Type**  
To specify a **cache implementation**, use the `cache_implementation` argument when generating text.  

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "meta-llama/Llama-2-7b-chat-hf"
model = AutoModelForCausalLM.from_pretrained(model_id)
tokenizer = AutoTokenizer.from_pretrained(model_id)

messages = [{"role": "user", "content": "Hello, what's your name?"}]
inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True)

# Generate with a specific cache type
outputs = model.generate(**inputs, max_new_tokens=50, cache_implementation="offloaded_cache")

print(tokenizer.batch_decode(outputs, skip_special_tokens=True)[0])
```

---

## **🛠️ Model-Specific Caches**  
Some **models**, such as **Mamba** and **Jamba**, have specialized **"Model-Specific Cache"** classes. These caches are optimized for **specific architectures** and can be more efficient than general caching approaches.  

👉 **Refer to the API Documentation** for more details on **model-specific cache implementations**.

---

## **📌 Summary: Best Practices for Using Cache in Generation**  
✔ **Dynamic Cache** is the default for most models.  
✔ **Use `Offloaded Cache` or `Quantized Cache`** for **memory efficiency**.  
✔ **Use `Static Cache` or `Sliding Window Cache`** for **torch.compile() compatibility**.  
✔ **Enable long-context caching** when working with **long text sequences**.  
✔ **Use model-specific caches** when available for **optimized performance**.

🚀 **Optimizing cache selection can drastically improve generation speed and resource efficiency!**