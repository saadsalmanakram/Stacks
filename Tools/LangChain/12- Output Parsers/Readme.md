# Output Parsers in LangChain

Output Parsers in LangChain play a crucial role in structuring the raw outputs from language models into a more organized and usable format. This guide provides a comprehensive overview of output parsers, their types, usage, and best practices in LangChain.

---

## What Are Output Parsers?

Output Parsers transform the raw text output from Language Models (LLMs) into structured data. They are essential for scenarios where consistent formatting, extraction of key details, or conversion into specific data types is required.

---

## Key Features

1. **Structure Outputs:** Convert raw text into dictionaries, lists, or other Python objects.
2. **Error Handling:** Manage unexpected or malformed outputs from LLMs.
3. **Validation:** Ensure outputs adhere to specified formats or constraints.
4. **Custom Parsing:** Define custom rules for extracting information from outputs.

---

## Types of Output Parsers

### 1. Simple Output Parsers
These are used for straightforward transformations like splitting text or extracting substrings.

#### Example: Splitting Output
```python
from langchain.output_parsers import SimpleOutputParser

class CustomParser(SimpleOutputParser):
    def parse(self, text: str):
        # Example: Split text by newlines
        return text.split("\n")

parser = CustomParser()
parsed_output = parser.parse("Line 1\nLine 2\nLine 3")
print(parsed_output)  # ["Line 1", "Line 2", "Line 3"]
```

---

### 2. Pydantic Output Parsers
These use Pydantic models to validate and structure the outputs.

#### Example: Using a Pydantic Model
```python
from pydantic import BaseModel
from langchain.output_parsers import PydanticOutputParser

class OutputModel(BaseModel):
    name: str
    age: int

parser = PydanticOutputParser(pydantic_object=OutputModel)
output = parser.parse("{"name": "John", "age": 30}")
print(output.name)  # John
print(output.age)   # 30
```

---

### 3. Regex Output Parsers
Use regular expressions to extract specific patterns from the text.

#### Example: Extracting Email Addresses
```python
from langchain.output_parsers import RegexOutputParser

regex = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
parser = RegexOutputParser(regex=regex)
parsed_output = parser.parse("Contact us at support@example.com")
print(parsed_output)  # support@example.com
```

---

### 4. Structured Output Parsers
These parsers use specific formatting like JSON, key-value pairs, or XML to structure the output.

#### Example: Parsing JSON
```python
from langchain.output_parsers import StructuredOutputParser

class JSONParser(StructuredOutputParser):
    def parse(self, text: str):
        import json
        return json.loads(text)

parser = JSONParser()
parsed_output = parser.parse('{"key": "value"}')
print(parsed_output)  # {"key": "value"}
```

---

## Custom Output Parsers
You can define your own custom parsers by inheriting from `BaseOutputParser` and overriding the `parse` method.

#### Example: Custom Date Parser
```python
from langchain.output_parsers import BaseOutputParser
from datetime import datetime

class DateParser(BaseOutputParser):
    def parse(self, text: str):
        return datetime.strptime(text, "%Y-%m-%d")

parser = DateParser()
parsed_output = parser.parse("2025-01-25")
print(parsed_output)  # datetime.datetime(2025, 1, 25)
```

---

## Best Practices

1. **Define Expected Output:** Clearly specify the output format in the LLM prompt to reduce parsing errors.
   ```python
   prompt = "Provide the output in JSON format: {\"key\": \"value\"}"
   ```

2. **Handle Errors Gracefully:** Use `try...except` blocks to catch parsing errors and provide fallback mechanisms.

3. **Validate Outputs:** Use Pydantic or other validation tools to ensure outputs meet your requirements.

4. **Test Parsers Thoroughly:** Test your parsers with various inputs to ensure robustness against edge cases.

5. **Reuse Parsers:** Modularize and reuse parsers across different projects or workflows.

---

## Resources

- [LangChain Documentation](https://www.langchain.com/docs)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Python Regex Documentation](https://docs.python.org/3/library/re.html)

---
