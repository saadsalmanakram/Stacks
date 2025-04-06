# **🚀 Iterative Generation with Cache in 🤗 Transformers**  

## **📌 What is Iterative Generation with Cache?**  
Iterative generation is a key technique for applications like **chatbots, dialogue agents, and multi-turn conversation systems**. Instead of reprocessing the entire conversation history in each turn, **cached key-value pairs** from previous interactions are used to improve efficiency and reduce memory usage.  

✔ **Speeds up response time by reusing stored keys/values.**  
✔ **Reduces memory overhead for long conversations.**  
✔ **Works with various cache types** (Dynamic, Static, Sink, Sliding Window, etc.).  

---

## **🔹 Key Considerations Before Using Caching in Iterative Generation**
1. **Cache Initialization:** Start with an **empty cache** before processing user inputs.  
2. **Managing Chat History:** Use **chat templates** to maintain conversation structure.  
3. **Sink Cache Consideration:** **Crop inputs** to the maximum cache length since **Sink Cache allows longer-than-window generations but expects initial input to fit within the cache size.**  

---

## **🛠️ Example: Iterative Generation with Caching**
### **🔹 Using Dynamic Cache for Multi-Turn Chat**
```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.cache_utils import (
    DynamicCache,
    SinkCache,
    StaticCache,
    SlidingWindowCache
)

# Load Model & Tokenizer
model_id = "meta-llama/Llama-2-7b-chat-hf"
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16, device_map="auto")
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Example conversation prompts
user_prompts = [
    "Hello, what's your name?",
    "Btw, yesterday I was on a rock concert."
]

# Initialize Cache (Can be DynamicCache, StaticCache, etc.)
past_key_values = DynamicCache()
max_cache_length = past_key_values.get_max_length()  # Get max cache size

messages = []  # Store chat history

for prompt in user_prompts:
    messages.append({"role": "user", "content": prompt})

    # Tokenize user input and format with chat template
    inputs = tokenizer.apply_chat_template(
        messages, add_generation_prompt=True, return_tensors="pt", return_dict=True
    ).to(model.device)

    # If using SinkCache, crop input to max cache length
    if isinstance(past_key_values, SinkCache):
        inputs = {k: v[:, -max_cache_length:] for k, v in inputs.items()}

    input_length = inputs["input_ids"].shape[1]

    # Generate response using cached past key-values
    outputs = model.generate(
        **inputs, do_sample=False, max_new_tokens=256, past_key_values=past_key_values
    )

    # Extract assistant's response
    completion = tokenizer.decode(outputs[0, input_length:], skip_special_tokens=True)
    messages.append({"role": "assistant", "content": completion})

# Print conversation history
print(messages)
```

---

## **🚀 Explanation of the Code**
### **1️⃣ Initialize Model & Tokenizer**
- We load **Meta-Llama-2-7B-Chat** with `torch.bfloat16` for efficiency.  
- The tokenizer is used to format chat messages properly.  

### **2️⃣ Define the Cache**
- We initialize **`DynamicCache()`**, which adapts to varying conversation lengths.  
- Alternatively, you can use **`StaticCache`**, **`SlidingWindowCache`**, or **`SinkCache`**.  

### **3️⃣ Process Multi-Turn Conversation**
- **Chat history** is stored in `messages` as a list of dictionaries (`role: user/assistant`).  
- **Chat templating** is applied using `tokenizer.apply_chat_template()`.  
- **Caching prevents recomputation** of previous tokens, allowing faster response generation.  

### **4️⃣ Handling Sink Cache Special Case**
- **If using `SinkCache`**, crop input tokens to fit within the cache window size.  

### **5️⃣ Generate & Store Responses**
- The model generates a response using stored **past key-values**.  
- Assistant responses are decoded and **added back to the message history**.  

---

## **📌 When to Use Iterative Generation with Cache?**
✔ **For Chatbots & Virtual Assistants** → Speeds up response time.  
✔ **For Long Conversations** → Reduces memory and processing costs.  
✔ **For Any Application Requiring Context Retention** → Maintains past knowledge without reprocessing everything.  

---

## **🔥 Summary: Why Use Iterative Generation with Cache?**
✔ **Optimized for multi-turn conversations.**  
✔ **Prevents redundant recomputation** of past tokens.  
✔ **Supports various cache types** (Static, Dynamic, Sink, Sliding Window).  
✔ **Boosts inference speed & memory efficiency.**  

🚀 **Use iterative caching to make chatbot interactions seamless and efficient!**