# Self-Consistency in Prompt Engineering

## Overview
Self-consistency is an advanced prompt engineering technique proposed by Wang et al. (2022) to improve the reliability of Chain-of-Thought (CoT) reasoning. Instead of relying on a single deterministic output, self-consistency samples multiple diverse reasoning paths and selects the most consistent answer. This method significantly enhances the accuracy of CoT prompting for tasks requiring arithmetic and commonsense reasoning.

## How Self-Consistency Works
1. **Sampling Multiple Reasoning Paths**: Generate multiple possible outputs using few-shot CoT prompting.
2. **Diversity in Thought Process**: Ensure reasoning paths differ slightly, leading to varied results.
3. **Consistency Selection**: Identify the most common or logically sound answer from multiple generated responses.

## Why Use Self-Consistency?
- Reduces errors in arithmetic and logical reasoning tasks.
- Helps mitigate biases caused by deterministic decoding.
- Increases robustness and reliability in language model responses.

## Example Use Case: Arithmetic Reasoning
### Without Self-Consistency
#### **Prompt:**
```
When I was 6 my sister was half my age. Now I’m 70 how old is my sister?
```
#### **Output:**
```
35
```
Incorrect!

### With Self-Consistency
We apply few-shot exemplars to guide the reasoning process:
#### **Few-Shot Exemplars:**
```
Q: There are 15 trees in the grove. Grove workers will plant trees in the grove today. After they are done, there will be 21 trees. How many trees did the grove workers plant today?
A: We start with 15 trees. Later we have 21 trees. The difference must be the number of trees they planted. So, they must have planted 21 - 15 = 6 trees. The answer is 6.

Q: If there are 3 cars in the parking lot and 2 more cars arrive, how many cars are in the parking lot?
A: There are 3 cars in the parking lot already. 2 more arrive. Now there are 3 + 2 = 5 cars. The answer is 5.
```

#### **Prompt with Self-Consistency Applied:**
```
Q: When I was 6 my sister was half my age. Now I’m 70 how old is my sister?
```
#### **Possible Outputs:**
1. *"When I was 6 my sister was half my age, so she was 3. Now I am 70, so she is 70 - 3 = 67."* ✅
2. *"When the narrator was 6, his sister was half his age, which is 3. Now that the narrator is 70, his sister would be 70 - 3 = 67 years old."* ✅
3. *"When I was 6 my sister was half my age, so she was 3. Now I am 70, so she is 70/2 = 35."* ❌

By selecting the majority answer (67), we obtain the correct response.

## Implementing Self-Consistency in Python
Here's an original Python implementation using OpenAI's GPT API:
```python
import openai
import random

def generate_responses(prompt, num_samples=5):
    responses = []
    for _ in range(num_samples):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        responses.append(response["choices"][0]["message"]["content"].strip())
    return responses

def select_consistent_answer(responses):
    answer_counts = {}
    for response in responses:
        answer_counts[response] = answer_counts.get(response, 0) + 1
    return max(answer_counts, key=answer_counts.get)

prompt = "When I was 6 my sister was half my age. Now I’m 70 how old is my sister?"
responses = generate_responses(prompt)
final_answer = select_consistent_answer(responses)

print("Generated Responses:", responses)
print("Final Answer:", final_answer)
```

## Applications of Self-Consistency
- **Mathematical Reasoning**: Improves calculations and logical deductions.
- **Commonsense QA**: Reduces hallucinations in reasoning-based queries.
- **Code Generation**: Ensures correctness in automated code solutions.
- **Medical Diagnosis AI**: Helps confirm predictions by sampling multiple reasoning paths.

## Conclusion
Self-consistency enhances the reliability of AI-generated responses by eliminating deterministic biases and promoting robust reasoning. Implementing this technique can significantly improve AI performance in arithmetic and commonsense reasoning tasks.

## References
- Wang et al. (2022) - *Self-Consistency Improves Chain-of-Thought Reasoning in Language Models.*

