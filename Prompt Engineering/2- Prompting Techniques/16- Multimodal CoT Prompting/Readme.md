# Multimodal Chain-of-Thought Reasoning in Language Models

## Introduction

Multimodal Chain-of-Thought (CoT) Reasoning enhances the capabilities of large language models (LLMs) by integrating both language (text) and vision (images) modalities. This project implements a two-stage framework to separate rationale generation and answer inference, leveraging multimodal information for improved reasoning.

### Key Features
- **Multimodal-CoT Framework:** Integrates vision and language modalities for enhanced reasoning.
- **State-of-the-Art Performance:** Achieves top results on ScienceQA and A-OKVQA benchmarks.
- **Hallucination Mitigation:** Reduces incorrect rationales through structured inference.
- **Optimized for 1B-Parameter Models:** Enables efficient deployment on consumer-grade GPUs.

## Installation

To set up this project, follow these steps:

```bash
# Clone the repository
git clone https://github.com/amazon-science/mm-cot.git
cd mm-cot

# Create a virtual environment
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

## Usage

### 1. Preparing the Dataset

Download the ScienceQA or A-OKVQA dataset and place it in the `data/` directory:

```bash
mkdir data
wget -P data/ https://scienceqa-dataset.com/download
```

### 2. Running the Model

#### **Fine-Tuning the Multimodal-CoT Model**

```bash
python train.py --dataset data/scienceqa.json --model t5-base --vision vit-base
```

#### **Inference with a Pretrained Model**

```bash
python inference.py --input question_image.png --model checkpoint/mm-cot
```

## Code Examples

### **1. Vision-Language Feature Extraction**

```python
from transformers import ViTFeatureExtractor, ViTModel
from transformers import T5Tokenizer, T5ForConditionalGeneration
from PIL import Image
import torch

# Load vision and language models
vision_model = ViTModel.from_pretrained("google/vit-base-patch16-224-in21k")
tokenizer = T5Tokenizer.from_pretrained("t5-base")
language_model = T5ForConditionalGeneration.from_pretrained("t5-base")

# Process image
image = Image.open("example_image.jpg")
feature_extractor = ViTFeatureExtractor.from_pretrained("google/vit-base-patch16-224-in21k")
inputs = feature_extractor(images=image, return_tensors="pt")
vision_features = vision_model(**inputs).last_hidden_state

# Process text
question = "What is shown in the image?"
input_ids = tokenizer(question, return_tensors="pt").input_ids

# Generate response
outputs = language_model.generate(input_ids)
answer = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("Answer:", answer)
```

### **2. Chain-of-Thought Reasoning Implementation**

```python
def chain_of_thought_reasoning(image_path, question):
    """Performs multimodal chain-of-thought reasoning."""
    # Extract vision features
    image = Image.open(image_path)
    vision_inputs = feature_extractor(images=image, return_tensors="pt")
    vision_features = vision_model(**vision_inputs).last_hidden_state
    
    # Generate rationale
    rationale_prompt = f"{question} Let's think step by step."
    rationale_ids = tokenizer(rationale_prompt, return_tensors="pt").input_ids
    rationale_outputs = language_model.generate(rationale_ids)
    rationale = tokenizer.decode(rationale_outputs[0], skip_special_tokens=True)
    
    # Generate answer using rationale
    final_prompt = f"{rationale} Therefore, the answer is"
    final_ids = tokenizer(final_prompt, return_tensors="pt").input_ids
    answer_outputs = language_model.generate(final_ids)
    final_answer = tokenizer.decode(answer_outputs[0], skip_special_tokens=True)
    
    return rationale, final_answer

# Example usage
rationale, answer = chain_of_thought_reasoning("example_image.jpg", "What is the object in the image?")
print("Rationale:", rationale)
print("Final Answer:", answer)
```

## Results

The Multimodal-CoT model achieves:
- **ScienceQA Accuracy:** 90.45%
- **A-OKVQA Accuracy:** 50.57%
- **Error Reduction:** 60.7% correction in hallucinated rationales

## Contributions

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push the branch and submit a pull request.

## Check the research Paper

- Zhang et al., "Multimodal Chain-of-Thought Reasoning in Language Models," *Transactions on Machine Learning Research*, 2024.
- ScienceQA Dataset: https://scienceqa-dataset.com
- A-OKVQA Dataset: https://a-okvqa.com

