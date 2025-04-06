
---

**Customize Text Generation**  
You can fine-tune the text generation behavior by customizing the **generation configuration** for your model. The **generate()** method allows you to override the default configuration and pass in parameters that control the generation process.

### Customization Parameters for `generate()` Method
Several parameters can be customized to influence how text is generated, including the length of the output, sampling strategies, and the number of generated sequences.

#### Key Customization Parameters:
1. **`max_new_tokens`**:  
   - Defines the maximum number of tokens to generate, excluding tokens in the input prompt.
   - This controls the length of the output sequence. You can also use custom stopping criteria like time-based stopping (for real-time applications).
   
   ```python
   my_model.generate(**inputs, max_new_tokens=50)
   ```

2. **`num_beams`**:  
   - When you set `num_beams` to a value higher than 1, beam search is used instead of greedy search.
   - Beam search evaluates multiple hypotheses at each time step and selects the highest-probability sequence overall, which improves the quality of longer sequences.
   
   ```python
   my_model.generate(**inputs, num_beams=4)
   ```

3. **`do_sample`**:  
   - If set to `True`, enables probabilistic sampling strategies like **Top-K**, **Top-P**, **multinomial sampling**, and **beam-search multinomial sampling**.
   - These strategies select the next token from the entire vocabulary based on the probability distribution, with specific adjustments depending on the strategy.
   
   ```python
   my_model.generate(**inputs, do_sample=True)
   ```

4. **`num_return_sequences`**:  
   - Specifies how many different sequence candidates to return for each input.
   - This is particularly useful when using beam search or sampling, as they generate multiple sequences.
   
   ```python
   my_model.generate(**inputs, num_return_sequences=3)
   ```

### Customizing Further with External Libraries:
- **`logits_processor`**:  
   - This allows you to apply custom logic to manipulate the next-token probability distributions.
   - You can pass a `LogitsProcessor` instance that defines custom logic for token selection.
   
   ```python
   my_model.generate(**inputs, logits_processor=my_logit_processor)
   ```

- **`stopping_criteria`**:  
   - This parameter enables you to set custom criteria for stopping the text generation, such as when a specific token is generated or after a certain amount of time.
   
   ```python
   my_model.generate(**inputs, stopping_criteria=my_stopping_criteria)
   ```

### Example Customization:
Here’s how you might use the `generate()` method with customized parameters:

```python
# Example: Generate text with beam search and sampling
generated_output = my_model.generate(
    **inputs,
    num_beams=4,
    do_sample=True,
    max_new_tokens=100,
    num_return_sequences=3
)

# Decode and print the generated text
print(my_model.tokenizer.decode(generated_output[0], skip_special_tokens=True))
```

This setup uses **beam search** to explore different hypotheses, **sampling** to introduce variability, and generates up to **100 tokens** while returning **3 different sequence candidates**.

### Extending Generation with Custom Logic:
- You can extend the `generate()` method to handle custom logic or integrate with external libraries. For example, using the **logits-processor-zoo** library, you can customize how tokens are selected during generation.

---
