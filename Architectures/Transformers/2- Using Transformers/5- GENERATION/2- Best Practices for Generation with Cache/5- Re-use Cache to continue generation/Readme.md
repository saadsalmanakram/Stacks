# **🚀 Re-use Cache to Continue Generation in 🤗 Transformers**  

## **📌 What is Re-using Cache for Continued Generation?**  
Instead of recomputing the model's attention for a **prefix prompt** every time, you can **precompute and store the cache** for the instruction prompt and then re-use it for multiple completions. This is useful when:  
✔ You have a **common instruction** that remains the same (e.g., "You are a helpful assistant.")  
✔ You want to **generate multiple responses** efficiently **without recalculating the prefix**  
✔ Reduces redundant computation and **improves inference speed**  

---

## **🛠️ Example: Re-using Cached Key-Values for Multiple Generations**
### **🔹 Efficiently Re-using Cache for an Instruction Prompt**
```python
import copy
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, StaticCache, DynamicCache

# Load Model & Tokenizer
model_id = "meta-llama/Llama-2-7b-chat-hf"
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.bfloat16, device_map="cuda")
tokenizer = AutoTokenizer.from_pretrained(model_id)

# Initialize a StaticCache with a sufficient max length (1024 tokens)
# Alternatively, DynamicCache can also be used depending on the use case
prompt_cache = StaticCache(config=model.config, max_batch_size=1, max_cache_len=1024, device="cuda", dtype=torch.bfloat16)

# Define a fixed instruction prompt
INITIAL_PROMPT = "You are a helpful assistant. "
inputs_initial_prompt = tokenizer(INITIAL_PROMPT, return_tensors="pt").to("cuda")

# Precompute cache for the instruction prompt
with torch.no_grad():
    prompt_cache = model(**inputs_initial_prompt, past_key_values=prompt_cache).past_key_values

# Multiple follow-up prompts using the cached instruction
prompts = [
    "Help me to write a blog post about travelling.",
    "What is the capital of France?"
]

responses = []
for prompt in prompts:
    # Combine the fixed instruction prompt with a new prompt
    new_inputs = tokenizer(INITIAL_PROMPT + prompt, return_tensors="pt").to("cuda")

    # Re-use the cached prompt
    past_key_values = copy.deepcopy(prompt_cache)  # Ensure each generation starts from the same cache state
    
    # Generate response using cached prefix
    outputs = model.generate(
        **new_inputs, past_key_values=past_key_values, max_new_tokens=20
    )

    # Decode and store the response
    response = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
    responses.append(response)

# Print generated responses
print(responses)
```

---

## **🚀 Explanation of the Code**
### **1️⃣ Initialize Model & Tokenizer**
- Load **Meta-Llama-2-7B-Chat** with `torch.bfloat16` for efficiency.  
- Use `StaticCache` with `max_cache_len=1024` to store the prefix efficiently.  
- `DynamicCache` can also be used if **variable-length caching** is needed.  

### **2️⃣ Precompute the Cache for the Instruction Prompt**
- **"You are a helpful assistant."** is a fixed instruction used in all responses.  
- The model processes this instruction **once** and stores the computed **past key-values**.  
- This allows **future responses** to use this precomputed cache **without recomputing the instruction**.  

### **3️⃣ Generate Multiple Responses from Cached Prefix**
- Two different prompts are added to the **precomputed instruction prompt**.  
- `copy.deepcopy(prompt_cache)` ensures that each generation starts from the original cache.  
- The model generates responses **using cached key-values for efficiency**.  

---

## **📌 Benefits of Re-using Cache**
✔ **Speeds up response generation** by avoiding redundant computations.  
✔ **Reduces computational overhead**, especially for long prompts.  
✔ **Useful for chatbots, prompt-based generation, and instruction-following models.**  

🚀 **Use cached prefixes to make AI generation faster and more efficient!**