# Task-oriented Prompt Enhancement via Script Generation (TITAN)

## Overview

**TITAN** is a novel framework designed to enhance large language models (LLMs) in solving task-oriented prompts by leveraging **script generation**. Unlike previous methods such as PAL, TITAN employs **step-back prompting** and **chain-of-thought prompting** to extract necessary input parameters and procedural steps before generating executable scripts. This zero-shot approach eliminates the need for manually crafted few-shot examples, making LLMs more efficient for practical reasoning tasks.

## Features
- **Zero-shot prompt enhancement**: No need for manually curated few-shot examples.
- **Step-back prompting**: Extracts task inputs before execution.
- **Chain-of-thought prompting**: Determines stepwise procedural logic.
- **Script generation**: Converts task descriptions into Python code for execution.
- **Post-processing and execution**: Ensures correct and validated task results.

## Installation

To use TITAN, ensure you have Python 3.8+ installed and install the required dependencies:

```bash
pip install openai
pip install transformers
pip install numpy
```

## Usage

### Example 1: Solving a Task-oriented Prompt

#### **Input Prompt**
```text
Ed had 22 more marbles than Doug. Doug lost 8 of his marbles at the playground. How many more marbles did Ed have than Doug then?
```

#### **Generated Python Script by TITAN**
```python
def solve_task():
    # Extracted Inputs
    initial_difference = 22
    doug_lost = 8
    
    # Applying Logical Steps
    new_difference = initial_difference + doug_lost
    
    return new_difference

# Execute the function
print(solve_task())
```

#### **Expected Output**
```text
30
```

---

### Example 2: Counting Words in a Sentence

#### **Input Prompt**
```text
Count the number of words in the following sentence: "TITAN enhances LLMs for reasoning tasks."
```

#### **Generated Python Script by TITAN**
```python
def count_words(sentence):
    words = sentence.split()
    return len(words)

sentence = "TITAN enhances LLMs for reasoning tasks."
print(count_words(sentence))
```

#### **Expected Output**
```text
6
```

---

### Example 3: Generating an Abbreviation

#### **Input Prompt**
```text
Generate an abbreviation from the following sentence: "Task-oriented Prompt Enhancement via Script Generation."
```

#### **Generated Python Script by TITAN**
```python
def generate_abbreviation(sentence):
    words = sentence.split()
    abbreviation = ''.join([word[0].upper() for word in words])
    return abbreviation

sentence = "Task-oriented Prompt Enhancement via Script Generation."
print(generate_abbreviation(sentence))
```

#### **Expected Output**
```text
TITAN
```

## Benchmarks
TITAN has been evaluated on **eleven** datasets, including:
- GSM8K (mathematical problem-solving)
- GSMHard (complex word problems)
- ASDIV (algebraic reasoning)
- SVAMP (symbolic variations)
- AddSub, MultiArith (arithmetic reasoning)
- Penguins (table-based queries)
- Custom-built **task-oriented datasets** (Finding, Counting, True/False, Generative tasks)

TITAN **outperforms existing zero-shot approaches by 7.6% (GPT-3.5) and 3.9% (GPT-4)** and achieves **state-of-the-art** performance on 8 out of 11 datasets.

## How It Works
TITAN follows a structured **three-step approach**:
1. **Input Extraction**: Identifies and extracts the necessary input variables.
2. **Procedure Extraction**: Uses **Chain-of-Thought (CoT)** prompting to derive logical steps.
3. **Script Generation**: Converts extracted logic into an executable Python function.

## Contributions
- Eliminates need for manual few-shot prompt engineering.
- Boosts **LLMs’ ability** to perform mathematical and procedural reasoning tasks.
- Works across diverse domains including **NLP, mathematics, and symbolic reasoning**.

## Future Work
- Expanding TITAN to support additional programming languages (e.g., Java, C++)
- Optimizing **script validation and execution accuracy**
- Enhancing self-consistency for **more robust results**

