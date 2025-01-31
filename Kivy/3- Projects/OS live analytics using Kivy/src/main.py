from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
import psutil
import platform
import json
from dotenv import load_dotenv
import os
from huggingface_hub import InferenceClient  # Import InferenceClient

# Load environment variables from .env file
load_dotenv()

# Hugging Face Inference API details
API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")  # Load API token from .env
MODEL_NAME = "meta-llama/Llama-3.2-1B-Instruct"  # Replace with your desired model

# Initialize the Hugging Face InferenceClient
client = InferenceClient(api_key=API_TOKEN)

class SystemAnalyticsApp(App):
    def build(self):
        self.layout = BoxLayout(orientation='vertical')

        # Input for user prompts
        self.prompt_input = TextInput(hint_text="Enter your query...", size_hint_y=0.1)
        self.layout.add_widget(self.prompt_input)

        # Button to trigger analytics
        self.analyze_button = Button(text="Analyze", size_hint_y=0.1)
        self.analyze_button.bind(on_press=self.analyze_system)
        self.layout.add_widget(self.analyze_button)

        # Label to display results
        self.result_label = Label(text="Results will appear here...", size_hint_y=0.8)
        self.layout.add_widget(self.result_label)

        return self.layout

    def analyze_system(self, instance):
        user_prompt = self.prompt_input.text
        system_info = self.get_system_info()

        # Query the language model with the system info and user prompt
        response = self.query_language_model(user_prompt, system_info)
        self.result_label.text = response

    def get_system_info(self):
        # Gather system information using psutil and platform
        system_info = {
            "OS": platform.system(),
            "OS Version": platform.version(),
            "CPU Usage (%)": psutil.cpu_percent(interval=1),
            "Memory Usage (%)": psutil.virtual_memory().percent,
            "Disk Usage (%)": psutil.disk_usage('/').percent,
            "Network Info": {
                "Bytes Sent": psutil.net_io_counters().bytes_sent,
                "Bytes Received": psutil.net_io_counters().bytes_recv,
            },
        }
        return json.dumps(system_info, indent=2)  # Convert to JSON for better readability

    def query_language_model(self, prompt, system_info):
        # Prepare the messages for the chat completion
        messages = [
            {"role": "system", "content": f"System Info: {system_info}"},
            {"role": "user", "content": prompt},
        ]

        try:
            # Query the Hugging Face model using InferenceClient
            stream = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.5,  # Adjust for creativity
                max_tokens=2048,  # Adjust as needed
                top_p=0.7,  # Adjust for diversity
                stream=True,  # Stream the response
            )

            # Collect the response chunks
            response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    response += chunk.choices[0].delta.content

            return response
        except Exception as e:
            return f"Error querying the language model: {str(e)}"

if __name__ == "__main__":
    SystemAnalyticsApp().run()