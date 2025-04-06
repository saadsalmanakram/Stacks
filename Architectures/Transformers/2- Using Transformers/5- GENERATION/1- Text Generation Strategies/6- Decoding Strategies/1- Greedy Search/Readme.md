### **Greedy Search in Text Generation**

**Greedy Search** is the default decoding strategy in the `generate()` method. It is the simplest form of text generation where at each step, the token with the highest probability is selected as the next token. This method is used when `num_beams=1` and `do_sample=False`.

In greedy search, the model chooses the most probable token at each step without considering any other potential sequences, which makes it efficient but less diverse and creative compared to other strategies like beam search or sampling-based methods. Greedy search is ideal when you need deterministic and coherent results.

### **Key Parameters for Greedy Search**
- **`num_beams=1`**: Greedy search is effectively the same as beam search with only one beam. No other candidate sequences are evaluated.
- **`do_sample=False`**: Sampling is disabled, and the model always selects the token with the highest probability.
  
Thus, if you don't specify any parameters (or leave them at default), greedy search will be used.

### **Example Code for Greedy Search**

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Define prompt and checkpoint for model loading
prompt = "I look forward to"
checkpoint = "distilbert/distilgpt2"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
inputs = tokenizer(prompt, return_tensors="pt")

model = AutoModelForCausalLM.from_pretrained(checkpoint)

# Generate output using greedy search (default behavior)
outputs = model.generate(**inputs)

# Decode and print the output
generated_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)
print(generated_text)
```

### **Explanation:**
- **Prompt**: `"I look forward to"` is used as the input text for the model.
- **Model**: `"distilbert/distilgpt2"` is the model checkpoint being used, which is a lightweight version of GPT-2.
- **Greedy Search**: By default, the `generate()` method uses greedy search, where the model always selects the token with the highest probability.

### **Generated Output:**
```plaintext
I look forward to seeing you all again!




```

### **When to Use Greedy Search**
Greedy search is appropriate when:
- You need deterministic results and coherent sentences.
- The task requires generating text with minimal randomness (e.g., factual statements, dialogues).
  
However, it may not be the best choice for tasks that require creativity, diversity, or randomness in the output (e.g., creative writing, story generation). In such cases, other strategies like **Top-k Sampling** or **Beam Search** may be preferred.