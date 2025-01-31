# Complete OS Report

## Overview
**Complete OS Report** is a desktop application built using the Kivy framework that integrates the **Hugging Face Inference API** to provide system/OS analytics based on user prompts. The application gathers detailed system information (such as CPU usage, memory usage, disk usage, and network statistics) and uses a language model to generate responses to user queries about the system's performance.

This project is ideal for users who want to quickly analyze their system's performance and get insights in a conversational manner. It combines system analytics with the power of natural language processing (NLP) to make system monitoring more intuitive and user-friendly.

---

## Features
- **System Information Gathering**: Collects detailed system metrics using `psutil` and `platform` libraries.
- **Hugging Face Integration**: Queries a language model (e.g., GPT-2) to generate responses based on system data and user prompts.
- **User-Friendly Interface**: Built with Kivy, the application provides a simple and intuitive UI for entering queries and viewing results.
- **Customizable**: Easily extendable to include additional system metrics or integrate with other NLP models.

---

## Installation

### Step 1: Install Required Libraries
Make sure you have the following libraries installed:
```bash
pip install kivy requests psutil
```

### Step 2: Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/your-username/complete-os-report.git
cd complete-os-report
```

### Step 3: Replace the Hugging Face API Token
Replace `"your_huggingface_api_token"` in the script with your actual Hugging Face API token. You can get this token by:
1. Creating an account on [Hugging Face](https://huggingface.co/).
2. Navigating to your profile → Settings → API Tokens.
3. Generating a new token.

---

## Usage

### Step 1: Run the Application
Run the script:
```bash
python your_script_name.py
```

### Step 2: Enter a Query
1. Enter a prompt in the text input field, such as:
   - "What is my current CPU usage?"
   - "Summarize my system's performance."
   - "How much memory is being used?"
2. Click the **"Analyze"** button.

### Step 3: View Results
The application will display the system information and the language model's response in the results section.

---

## Example Output
If the system info is:
```json
{
  "OS": "Windows",
  "OS Version": "10.0.19041",
  "CPU Usage (%)": 25.6,
  "Memory Usage (%)": 45.3,
  "Disk Usage (%)": 60.1,
  "Network Info": {
    "Bytes Sent": 123456789,
    "Bytes Received": 987654321
  }
}
```
And the user prompt is:
```
"What is my current CPU usage?"
```
The language model might respond:
```
Your current CPU usage is 25.6%.
```

---

## Enhancements
Here are some ideas to improve the application:
1. **Add More System Metrics**: Use `psutil` to gather additional details like CPU cores, disk partitions, etc.
2. **Improve UI**: Use Kivy's `kv` language to design a more polished interface.
3. **Error Handling**: Add better error handling for API calls and system information retrieval.
4. **Save Reports**: Allow users to save system reports as text files.

---

## Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- [Kivy](https://kivy.org/) for the GUI framework.
- [Hugging Face](https://huggingface.co/) for the Inference API and language models.
- [psutil](https://github.com/giampaolo/psutil) for system information gathering.

---

## Contact
For questions or feedback, feel free to reach out:
- **Email**: saadsalmanakram1@example.com
- **GitHub**: [saadsalman](https://github.com/saadsalmanakram)

---
