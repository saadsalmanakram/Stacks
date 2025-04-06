from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel

# Define a schema
class Recipe(BaseModel):
    name: str
    ingredients: list
    steps: list

parser = PydanticOutputParser(pydantic_object=Recipe)

# Parse output
output = """
{
    "name": "Pancakes",
    "ingredients": ["Flour", "Milk", "Eggs"],
    "steps": ["Mix ingredients", "Cook on pan"]
}
"""
recipe = parser.parse(output)
print(recipe)
