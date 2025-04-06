### **Contrastive Search in Text Generation**

**Contrastive Search** is a decoding strategy introduced in the 2022 paper *A Contrastive Framework for Neural Text Generation*. It is designed to address the challenge of generating long-form text that is both non-repetitive and coherent. The primary goal of contrastive search is to generate more diverse outputs compared to greedy search while maintaining coherence throughout the generated text.

This strategy works by selecting tokens that not only maximize their probability but also encourage diversity by applying penalties to highly repetitive sequences. Contrastive search has been shown to produce high-quality results for tasks requiring long-form generation without excessive repetition.

### **Key Parameters for Contrastive Search:**
- **`penalty_alpha`**: This controls the degree of penalty applied to tokens that lead to repetitive or highly probable sequences. A higher penalty encourages more diversity in the generated output.
- **`top_k`**: This parameter limits the candidate tokens to the top k most probable tokens at each generation step. It ensures that only the most likely tokens are considered for selection, improving coherence.

### **Example Code for Contrastive Search:**

```python
from transformers import AutoTokenizer, AutoModelForCausalLM

# Define the checkpoint and tokenizer
checkpoint = "openai-community/gpt2-large"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(checkpoint)

# Define the prompt and prepare inputs
prompt = "Hugging Face Company is"
inputs = tokenizer(prompt, return_tensors="pt")

# Generate text using contrastive search with specified penalty_alpha and top_k
outputs = model.generate(**inputs, penalty_alpha=0.6, top_k=4, max_new_tokens=100)

# Decode the generated text
generated_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)
print(generated_text)
```

### **Explanation:**
- **`penalty_alpha=0.6`**: This applies a moderate penalty to prevent repetitive outputs.
- **`top_k=4`**: This ensures that only the 4 most probable tokens are considered for each generation step, providing a balance between diversity and coherence.
- **`max_new_tokens=100`**: Limits the number of new tokens generated, ensuring the output does not become too long.
- **Prompt**: The input text `"Hugging Face Company is"` serves as the starting point for the model.

### **Generated Output:**
```plaintext
Hugging Face Company is a family-owned and operated business. We pride ourselves on being the best in the business, and our customer service is second to none.

If you have any questions about our products or services, feel free to contact us at any time. We look forward to hearing from you!
```

### **When to Use Contrastive Search:**
Contrastive search is ideal when you need:
- **Long, coherent, and diverse outputs**: Unlike greedy search or beam search, contrastive search reduces repetition while ensuring the output remains coherent over longer sequences.
- **Applications requiring both diversity and coherence**: Such as creative writing, detailed product descriptions, or non-repetitive text generation for customer support and storytelling.

By controlling **`penalty_alpha`** and **`top_k`**, you can fine-tune the balance between repetition, creativity, and coherence, making it suitable for various text generation tasks.