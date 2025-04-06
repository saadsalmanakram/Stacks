from langchain.agents import Tool

# Define a simple tool
def calculator(input: str) -> str:
    try:
        return str(eval(input))
    except Exception as e:
        return str(e)

calc_tool = Tool(name="Calculator", func=calculator, description="Performs calculations")

# Use the tool
print(calc_tool.run("2 + 3"))
