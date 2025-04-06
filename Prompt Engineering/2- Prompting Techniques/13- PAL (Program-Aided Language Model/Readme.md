# PAL (Program-Aided Language Models)

## Overview

Program-Aided Language Models (PAL) is a technique introduced by Gao et al. (2022) that enhances Large Language Models (LLMs) by utilizing programmatic runtimes, such as a Python interpreter, to derive solutions to natural language problems. Unlike Chain-of-Thought (CoT) prompting, which relies solely on free-form text reasoning, PAL generates executable code as an intermediate step to arrive at the final answer.

This repository provides an implementation of PAL using OpenAI's GPT-3 (or later models) with LangChain, demonstrating its capability in handling date-related queries by offloading computations to a Python runtime.

## Features

- **Uses LLMs to generate executable Python programs for problem-solving**
- **Employs LangChain for structured prompt management**
- **Interprets date-related questions and computes answers programmatically**
- **Executes generated Python code dynamically**
- **Extensible for more complex computational tasks**

---

## Installation

Ensure you have Python 3.8+ installed, then install the necessary dependencies:

```sh
pip install openai langchain python-dotenv dateutil
```

Create a `.env` file in the project directory and add your OpenAI API key:

```sh
OPENAI_API_KEY=your_api_key_here
```

---

## Usage

### 1. Import Required Libraries

```python
import openai
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
from langchain.llms import OpenAI
from dotenv import load_dotenv
```

### 2. Configure API and Model

```python
load_dotenv()

# API configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure LangChain LLM
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
llm = OpenAI(model_name='text-davinci-003', temperature=0)
```

### 3. Define the Prompt Template

```python
DATE_UNDERSTANDING_PROMPT = """
# Q: Today is 14 March 2025. If a project deadline is in 3 months and 10 days, what is the due date in MM/DD/YYYY?
# Today is 14 March 2025.
today = datetime(2025, 3, 14)
# Adding 3 months and 10 days,
due_date = today + relativedelta(months=3, days=10)
# The answer formatted with %m/%d/%Y is
due_date.strftime('%m/%d/%Y')

# Q: {question}
""".strip() + '\n'
```

### 4. Query the Model and Generate Code

```python
question = "Today is 5 May 2024. If I add 45 days to today, what is the resulting date in MM/DD/YYYY?"
llm_out = llm(DATE_UNDERSTANDING_PROMPT.format(question=question))
print("Generated Code:\n", llm_out)
```

### 5. Execute the Generated Code

```python
exec(llm_out)
print("Computed Answer:", due_date.strftime('%m/%d/%Y'))
```

---

## Example Output

```
Generated Code:
# Today is 5 May 2024.
today = datetime(2024, 5, 5)
# Adding 45 days,
result_date = today + relativedelta(days=45)
# The answer formatted with %m/%d/%Y is
result_date.strftime('%m/%d/%Y')

Computed Answer: 06/19/2024
```

---

## Customization & Extensions

### Handling Mathematical Problems

PAL can also handle arithmetic and logical operations:

```python
MATH_PROMPT = """
# Q: If a person earns $5000 per month and saves 20%, how much will they save in a year?
monthly_income = 5000
savings_percentage = 0.2
annual_savings = monthly_income * savings_percentage * 12
# The answer is
annual_savings

# Q: {question}
""".strip() + '\n'
```

---

## References

- Gao et al., (2022), "PAL: Program-Aided Language Models"

