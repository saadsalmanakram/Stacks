# Automatic Prompt Engineer (APE)

## Overview

Automatic Prompt Engineer (APE) is a framework designed to automate the generation and selection of effective instructions for guiding large language models (LLMs). The problem of instruction generation is treated as a natural language synthesis task and is optimized as a black-box search problem.

The APE framework operates in the following stages:
1. **Instruction Generation**: A pre-trained LLM generates candidate instructions based on a given task and output demonstrations.
2. **Instruction Execution**: These candidate instructions are executed using a target model.
3. **Instruction Selection**: The best-performing instruction is selected based on evaluation scores computed from the model's output.

APE has demonstrated improved performance on zero-shot chain-of-thought (CoT) reasoning tasks compared to human-engineered prompts such as "Let's think step by step." Instead, APE discovered that prompts like *"Let's work this out in a step-by-step way to be sure we have the right answer."* led to better results on benchmarks like MultiArith and GSM8K.

## Key Features
- **Automated Prompt Generation**: Eliminates the need for manual prompt engineering by leveraging LLMs.
- **Performance-Driven Selection**: Selects the best instruction based on model-generated evaluation metrics.
- **Black-Box Optimization**: Does not require access to model gradients, making it adaptable to different LLMs.
- **Improved Zero-Shot CoT Performance**: Enhances logical reasoning capabilities of LLMs without additional fine-tuning.

## Installation

To use APE, install the required dependencies:

```bash
pip install torch transformers openai
```

## Example Usage

### 1. Generating Candidate Instructions

```python
import openai

def generate_instruction(demo_output, model="gpt-4"):
    prompt = f"Generate an effective prompt to instruct a model to produce the following output: {demo_output}"
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"]

# Example demonstration output
demo_output = "The capital of France is Paris."
instruction = generate_instruction(demo_output)
print("Generated Instruction:", instruction)
```

### 2. Evaluating Instructions

```python
import random

def evaluate_instruction(instruction, model="gpt-4"):
    responses = []
    for _ in range(3):
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": instruction}]
        )
        responses.append(response["choices"][0]["message"]["content"])
    
    score = random.uniform(0, 1)  # Placeholder scoring mechanism
    return sum(len(resp) for resp in responses) / len(responses), score

# Example Evaluation
score, confidence = evaluate_instruction(instruction)
print(f"Instruction Score: {score:.2f}, Confidence: {confidence:.2f}")
```

### 3. Selecting the Best Instruction

```python
def select_best_instruction(instructions):
    scored_instructions = [(instr, evaluate_instruction(instr)[1]) for instr in instructions]
    return max(scored_instructions, key=lambda x: x[1])

# Example instruction candidates
candidates = [
    "Explain the concept step by step.",
    "Provide a detailed breakdown of the solution.",
    "Work through the problem logically, ensuring correctness."
]

best_instruction, best_score = select_best_instruction(candidates)
print("Best Instruction:", best_instruction)
print("Best Score:", best_score)
```

## Related Works

- **Prompt-OIRL**: Uses offline inverse reinforcement learning for query-dependent prompt generation.
- **OPRO**: Optimizes prompts using LLMs by introducing the "Take a deep breath" strategy.
- **AutoPrompt**: Automatically creates prompts based on gradient-guided search.
- **Prefix Tuning**: Lightweight fine-tuning method that adds a trainable prefix for NLG tasks.
- **Prompt Tuning**: Learns soft prompts through backpropagation.

## Future Enhancements
- **Better scoring mechanisms**: Replace random scoring with model-based evaluations.
- **Broader dataset testing**: Evaluate on diverse tasks beyond arithmetic reasoning.
- **Integration with RL**: Optimize prompt generation using reinforcement learning.



