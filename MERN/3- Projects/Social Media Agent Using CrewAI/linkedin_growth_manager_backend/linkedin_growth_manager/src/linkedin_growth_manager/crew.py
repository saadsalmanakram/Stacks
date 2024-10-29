from crewai import Agent, Task, Crew, Process
from tools.linkedin_api_tool import linkedin_api_tool
from tools.weaviate_tool import save_to_weaviate

# Define the agent
linkedin_growth_agent = Agent(
    role="LinkedIn Growth Specialist",
    goal="Grow LinkedIn followers and engagement",
    tools=[linkedin_api_tool, save_to_weaviate]
)

# Define tasks
create_content_task = Task(
    description="Generate LinkedIn post draft.",
    expected_output="Draft of LinkedIn post.",
    agent=linkedin_growth_agent
)

engage_audience_task = Task(
    description="Engage with followers on LinkedIn.",
    expected_output="Summary of engagement activities.",
    agent=linkedin_growth_agent
)

analyze_growth_task = Task(
    description="Analyze LinkedIn engagement and save data to Weaviate.",
    expected_output="Detailed LinkedIn performance report.",
    agent=linkedin_growth_agent
)

# Define Crew and process
crew = Crew(
    agents=[linkedin_growth_agent],
    tasks=[create_content_task, engage_audience_task, analyze_growth_task],
    process=Process.sequential
)

crew.kickoff()
