
---

**Save a Custom Decoding Strategy with Your Model**  
When fine-tuning a model, you might want to share it with specific text generation settings. To do this, you can save a custom **generation configuration** along with the model, which defines the decoding strategy for tasks like text generation, summarization, translation, etc.

### Steps to Save a Custom Decoding Strategy:
1. **Create a `GenerationConfig` Instance**  
   - First, create an instance of the `GenerationConfig` class and specify your desired decoding parameters such as `max_new_tokens`, `do_sample`, `top_k`, `num_beams`, etc.

2. **Save the GenerationConfig**  
   - Once you’ve defined the custom configuration, save it using `GenerationConfig.save_pretrained()`.
   - Set the `push_to_hub` argument to `True` if you want to upload the configuration to the Hugging Face Hub alongside your model.

3. **Push Configuration to Hugging Face Hub**  
   - Ensure that you have the correct permissions to upload the configuration files to the model’s repository on the Hub.

### Example: Save Custom Generation Configuration for Causal Language Model
```python
from transformers import AutoModelForCausalLM, GenerationConfig

# Load the model
model = AutoModelForCausalLM.from_pretrained("my_account/my_model")

# Create a custom GenerationConfig
generation_config = GenerationConfig(
    max_new_tokens=50, 
    do_sample=True, 
    top_k=50, 
    eos_token_id=model.config.eos_token_id
)

# Save the custom generation configuration to the model repo
generation_config.save_pretrained("my_account/my_model", push_to_hub=True)
```

### Storing Multiple Configurations
You can save multiple generation configurations in one directory by specifying the `config_file_name` argument in `GenerationConfig.save_pretrained()`. This is useful for models with different configurations, such as one for creative text generation (using sampling) and another for summarization (using beam search).

### Example: Save Custom Generation Configuration for Translation Model
```python
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, GenerationConfig

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("google-t5/t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google-t5/t5-small")

# Define a custom generation configuration for translation
translation_generation_config = GenerationConfig(
    num_beams=4,
    early_stopping=True,
    decoder_start_token_id=0,
    eos_token_id=model.config.eos_token_id,
    pad_token=model.config.pad_token_id,
)

# Save the generation configuration to a file
translation_generation_config.save_pretrained("/tmp", "translation_generation_config.json")

# Later load the configuration and use it for generation
generation_config = GenerationConfig.from_pretrained("/tmp", "translation_generation_config.json")

# Example of using the custom config for translation
inputs = tokenizer("translate English to French: Configuration files are easy to use!", return_tensors="pt")
outputs = model.generate(**inputs, generation_config=generation_config)
print(tokenizer.batch_decode(outputs, skip_special_tokens=True))
# Output: ['Les fichiers de configuration sont faciles à utiliser!']
```

### Key Points:
- You can create and save different **generation configurations** for various tasks and models.
- The saved configuration file can be uploaded to the **Hugging Face Hub** for sharing or reuse.
- You can store several configurations (e.g., for summarization, translation, or creative text generation) and load them as needed.

By saving and sharing these configurations, you ensure that the custom settings (like beam search or sampling strategies) are maintained, making it easier to reproduce your generation results across different environments.

---
