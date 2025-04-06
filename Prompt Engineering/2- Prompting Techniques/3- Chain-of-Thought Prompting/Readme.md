# Chain-of-Thought Prompting (CoT)

## Introduction
Chain-of-Thought (CoT) prompting is a powerful technique that enhances the reasoning ability of large language models (LLMs) by explicitly breaking down problems into intermediate reasoning steps. Introduced in Wei et al. (2022), CoT prompting improves the accuracy of complex tasks that require logical reasoning by incorporating intermediate explanations before arriving at the final answer.

This repository explores various types of CoT prompting, including:
- **Few-shot CoT Prompting**
- **Zero-shot CoT Prompting**
- **Automatic Chain-of-Thought (Auto-CoT)**

## 1️⃣ Few-shot Chain-of-Thought Prompting
Few-shot CoT prompting involves providing examples with explicit reasoning to guide the model toward solving new problems more effectively.

### 📌 Example:
```python
import openai

def cot_prompting_few_shot(question):
    prompt = f"""
    The odd numbers in this group add up to an even number: 4, 8, 9, 15, 12, 2, 1.
    A: Adding all the odd numbers (9, 15, 1) gives 25. The answer is False.
    The odd numbers in this group add up to an even number: 15, 32, 5, 13, 82, 7, 1.
    A: Adding all the odd numbers (15, 5, 13, 7, 1) gives 41. The answer is False.
    {question}
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"]

question = "The odd numbers in this group add up to an even number: 17, 10, 19, 4, 8, 12, 24. A:"
print(cot_prompting_few_shot(question))
```

### ✅ Expected Output:
```
Adding all the odd numbers (17, 19) gives 36. The answer is True.
```

## 2️⃣ Zero-shot Chain-of-Thought Prompting
Zero-shot CoT prompting requires no examples; instead, the model is encouraged to reason step by step by adding the phrase **"Let's think step by step"** to the prompt.

### 📌 Example:
```python
import openai

def zero_shot_cot(question):
    prompt = f"{question}\nLet's think step by step."
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"]

question = "I bought 10 apples. Gave 3 away. Bought 5 more. Ate 2. How many do I have left?"
print(zero_shot_cot(question))
```

### ✅ Expected Output:
```
First, you started with 10 apples.
You gave away 3 apples, so you had 7 left.
Then you bought 5 more, so now you had 12 apples.
Finally, you ate 2 apples, so you would remain with 10 apples.
```

## 3️⃣ Automatic Chain-of-Thought (Auto-CoT)
Auto-CoT is a method that automates the selection and generation of CoT demonstrations. It follows these steps:

1. **Clustering questions**: Groups similar questions into clusters.
2. **Sampling representative questions**: Picks one question per cluster and generates a reasoning chain using Zero-Shot CoT.
3. **Creating diverse demonstrations**: Ensures a variety of reasoning chains to prevent overfitting on similar reasoning styles.

### 📌 Example:
```python
import openai
from sklearn.cluster import KMeans
import numpy as np

def generate_cot_for_questions(questions):
    prompts = [q + "\nLet's think step by step." for q in questions]
    responses = []
    
    for prompt in prompts:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        responses.append(response["choices"][0]["message"]["content"])
    return responses

def auto_cot(questions, n_clusters=3):
    # Dummy embeddings for clustering
    embeddings = np.random.rand(len(questions), 5)  # Replace with real embeddings
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(embeddings)
    
    selected_questions = [questions[i] for i in np.unique(labels)]
    return generate_cot_for_questions(selected_questions)

questions = [
    "What is the sum of the first five prime numbers?",
    "How many legs does a spider have?",
    "What is the capital of France?",
    "If I have 6 apples and give away 2, how many are left?"
]
print(auto_cot(questions))
```

### ✅ Expected Output:
```
['The first five prime numbers are 2, 3, 5, 7, and 11. Their sum is 28.',
 'Spiders have 8 legs.',
 'The capital of France is Paris.',
 'You started with 6 apples. After giving away 2, you have 4 left.']
```

## 🔥 Key Takeaways
- **Few-shot CoT** uses explicit examples to guide the model’s reasoning.
- **Zero-shot CoT** leverages the phrase "Let's think step by step" for improved logical processing.
- **Auto-CoT** reduces manual effort by automatically selecting and generating reasoning chains from diverse examples.

## 📌 Research Papers to check
- Wei et al. (2022) - Chain-of-Thought Prompting in Large Language Models
- Kojima et al. (2022) - Zero-shot Chain of Thought
- Zhang et al. (2022) - Automatic Chain-of-Thought Prompting


---
🚀 **Explore Chain-of-Thought prompting techniques and improve LLM reasoning!**

