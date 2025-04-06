# Few-Shot Prompting

Large language models (LLMs) have demonstrated remarkable zero-shot capabilities, but they often struggle with more complex tasks when using a zero-shot approach. Few-shot prompting is a technique that enables **in-context learning**, where we provide demonstrations in the prompt to steer the model toward better performance. These demonstrations act as conditioning examples, guiding the model in generating more accurate responses.

## Background

Few-shot properties first appeared when models were scaled to a sufficient size (Touvron et al., 2023; Kaplan et al., 2020). This approach gained popularity with the release of models like GPT-3 (Brown et al., 2020), which could generalize tasks with just a few examples.

## Example of Few-Shot Prompting

Consider an example where we want a model to correctly use a newly introduced word in a sentence.

### Prompt:

```
A "glorb" is a rare gem found in volcanic caves. An example of a sentence that uses the word glorb is:
We found a beautiful glorb while exploring the lava tunnels.

To "trenk" means to leap over an obstacle effortlessly. An example of a sentence that uses the word trenk is:
```

### Model Output:

```
She managed to trenk over the fallen tree with ease.
```

The model has learned how to apply the given word in context, despite only seeing a single example (1-shot). More complex tasks may require increasing the number of demonstrations (e.g., 3-shot, 5-shot, 10-shot).

## Best Practices for Few-Shot Prompting

A few considerations when crafting few-shot examples include:

- The **label space** and **distribution of input text** in demonstrations significantly impact performance.
- The **format of demonstrations** is crucial—keeping a structured input-output format improves results.
- Even when using **random labels**, a consistent format still aids model performance.
- Choosing **labels from a true distribution** rather than assigning them randomly enhances accuracy.

### Example: Sentiment Classification with Random Labels

#### Prompt:

```
This is an amazing experience! // Negative
I am so disappointed in this product. // Positive
I absolutely love this song! // Positive
This book was a complete waste of time! //
```

#### Model Output:

```
Negative
```

Despite the labels being randomly assigned, the model correctly predicts the sentiment due to the structured format.

## Limitations of Few-Shot Prompting

Few-shot prompting improves model performance for many tasks but is **not a perfect solution**, particularly for complex reasoning tasks.

### Example: Logical Reasoning Task

#### Prompt:

```
The sum of all odd numbers in this set results in an even number: 7, 14, 3, 21, 8, 5, 1.
A: 
```

#### Model Output:

```
Yes, the sum is 37, which is an even number.
```

The response is incorrect, highlighting the model’s difficulty with multi-step reasoning. Adding few-shot examples might still not be sufficient:

#### Extended Prompt:

```
The sum of odd numbers in this set results in an even number: 4, 7, 11, 2, 9.
A: The answer is False.
The sum of odd numbers in this set results in an even number: 12, 15, 3, 8, 6.
A: The answer is True.
The sum of odd numbers in this set results in an even number: 18, 1, 7, 4, 11.
A: The answer is False.
The sum of odd numbers in this set results in an even number: 7, 14, 3, 21, 8, 5, 1.
A:
```

#### Model Output:

```
The answer is True.
```

Despite adding examples, the model still produces incorrect reasoning, showing the **limitations of few-shot prompting for complex logic-based tasks**. In such cases, alternative techniques like **Chain-of-Thought (CoT) prompting** can improve accuracy.

## Alternative Approaches

When few-shot prompting is insufficient, consider:
- **Chain-of-Thought (CoT) Prompting:** Breaking down complex problems into reasoning steps.
- **Fine-Tuning:** Training the model on domain-specific tasks.
- **Retrieval-Augmented Generation (RAG):** Augmenting responses with external knowledge sources.

## Conclusion

Few-shot prompting enhances model performance in various tasks by leveraging in-context learning. However, for more complex reasoning tasks, additional techniques like CoT or fine-tuning may be necessary. Experimenting with different prompt formats, labels, and example selection strategies can further optimize performance.

---

