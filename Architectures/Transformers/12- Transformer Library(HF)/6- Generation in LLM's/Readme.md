
---

**Generation with LLMs**

LLMs, or Large Language Models, are essential for text generation. These models, such as those based on transformers, are pretrained to predict the next token given some input text. Autoregressive generation is a key concept where the model uses its own generated output iteratively to generate new text.

### Key Concepts:

1. **Autoregressive Generation**  
   - Models predict the next token iteratively, using previously generated tokens. The `generate()` function in 🤗 Transformers handles this.

2. **Token Selection**  
   - A critical aspect is how the next token is selected from a probability distribution. This can range from simple token selection (greedy) to more complex methods like sampling.
  
3. **Stopping Condition**  
   - Generation continues until the model outputs an end-of-sequence (EOS) token or a maximum length is reached. This is controlled by the `GenerationConfig`.

### Code Example:

**Installation**:
```bash
pip install transformers bitsandbytes>=0.39.0 -q
```

**Generate Text**:

1. **Load Model**:  
```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1", device_map="auto", load_in_4bit=True
)
```

2. **Preprocess Input**:  
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-v0.1", padding_side="left")
model_inputs = tokenizer(["A list of colors: red, blue"], return_tensors="pt").to("cuda")
```

3. **Generate Text**:  
```python
generated_ids = model.generate(**model_inputs)
tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
```

4. **Batch Generation**:  
```python
model_inputs = tokenizer(
    ["A list of colors: red, blue", "Portugal is"], return_tensors="pt", padding=True
).to("cuda")
generated_ids = model.generate(**model_inputs)
tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
```

---

### Common Pitfalls:

1. **Incorrect Generation Length**:
   - By default, models generate up to 20 tokens. Use `max_new_tokens` to control the output length.
   
   Example:  
   ```python
   generated_ids = model.generate(**model_inputs, max_new_tokens=50)
   ```

2. **Wrong Generation Mode**:
   - Greedy decoding may lead to repetitive results. For more creativity, enable sampling.
   
   Example:  
   ```python
   generated_ids = model.generate(**model_inputs, do_sample=True)
   ```

3. **Wrong Padding**:
   - LLMs require left-padding for inputs. Make sure to handle padding correctly.
   
   Example:  
   ```python
   tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-v0.1", padding_side="left")
   ```

4. **Wrong Prompt**:
   - Ensure the input prompt follows the model’s expected format. For example, chat models require specific input templates.

   Example:  
   ```python
   messages = [
       {"role": "system", "content": "You are a friendly chatbot."},
       {"role": "user", "content": "How many helicopters can a human eat in one sitting?"}
   ]
   ```

---

### Further Resources:

- **Advanced Generation Usage**:  
  Guide to controlling generation methods, setting configurations, and streaming output.
  
- **Optimization**:  
  Learn how to speed up generation with optimizations like quantization and reducing memory usage.

- **Prompting**:  
  Detailed guide on designing effective prompts for various LLM tasks.

- **Leaderboard**:  
  - Open LLM Leaderboard (quality of models)
  - Open LLM-Perf Leaderboard (throughput)

- **Related Libraries**:  
  - [optimum](https://huggingface.co/optimum): Optimizations for specific hardware
  - [text-generation-webui](https://github.com/text-generation-webui): UI for generation tasks
  - [logits-processor-zoo](https://github.com/logits-processor-zoo): Additional generation controls

---
