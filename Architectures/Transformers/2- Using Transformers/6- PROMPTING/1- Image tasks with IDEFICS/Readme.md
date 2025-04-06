
### Key Tasks You Can Perform with IDEFICS:
1. **Image Captioning**:
   - Generate captions for images without any textual prompts, based only on the visual content.
   - Example: **Image of a puppy in a flower bed** — The model will generate a caption such as "A puppy in a flower bed."

2. **Prompted Image Captioning**:
   - Provide a text prompt to guide the caption generation. This allows the model to complete the sentence starting from the text prompt, grounded in the image.
   - Example: **Image of the Eiffel Tower at night** with the prompt "This is an image of" — The model generates "This is an image of the Eiffel Tower in Paris, France."

3. **Few-Shot Prompting**:
   - Provide a few examples (e.g., 1-shot, 3-shot) of desired output format to steer the model in generating captions with the same structure and information.
   - Example: **Image of the Statue of Liberty** — The model generates a caption with a fun fact similar to a previous example of the Eiffel Tower.

4. **Visual Question Answering (VQA)**:
   - Answer open-ended questions about an image based on its content.
   - Example: **Image of a couple having a picnic** — The model can answer, "They're in a park in New York City, and it's a beautiful day."

5. **Image Classification**:
   - Classify images into pre-defined categories based on visual and textual cues.
   - Example: **Image of a vegetable stand** — The model classifies the image as "Vegetables."

6. **Image-Guided Text Generation**:
   - Use images as inspiration for creative text generation, such as writing stories or generating descriptions for ads or scenes.
   - Example: **Image of a red door with a pumpkin on the steps** — The model generates a spooky Halloween story.

7. **Batch Inference**:
   - Process multiple images or prompts simultaneously by passing a batch of image-text pairs for inference.

### How to Load and Use the Model:

#### Prerequisites:
Before starting, install the necessary libraries:
```bash
pip install -q bitsandbytes sentencepiece accelerate transformers
```

#### Loading the Model:
To load the IDEFICS model (9 billion parameters) from the Hugging Face Hub:
```python
checkpoint = "HuggingFaceM4/idefics-9b"
import torch
from transformers import IdeficsForVisionText2Text, AutoProcessor

processor = AutoProcessor.from_pretrained(checkpoint)
model = IdeficsForVisionText2Text.from_pretrained(checkpoint, torch_dtype=torch.bfloat16, device_map="auto")
```

For loading the **quantized** model (if GPU memory is limited):
```python
from transformers import IdeficsForVisionText2Text, AutoProcessor, BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
)

processor = AutoProcessor.from_pretrained(checkpoint)
model = IdeficsForVisionText2Text.from_pretrained(
    checkpoint,
    quantization_config=quantization_config,
    device_map="auto"
)
```

### Examples of Image Tasks:

#### 1. **Image Captioning**:
   - No text prompt needed, just the image URL.
```python
prompt = [
    "https://images.unsplash.com/photo-1583160247711-2191776b4b91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3542&q=80",
]
inputs = processor(prompt, return_tensors="pt").to("cuda")
generated_ids = model.generate(**inputs, max_new_tokens=10)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(generated_text[0])
```

#### 2. **Prompted Image Captioning**:
   - Provide a textual context for captioning.
```python
prompt = [
    "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3501&q=80",
    "This is an image of ",
]
inputs = processor(prompt, return_tensors="pt").to("cuda")
generated_ids = model.generate(**inputs, max_new_tokens=10)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(generated_text[0])
```

#### 3. **Visual Question Answering**:
   - Ask questions about the image.
```python
prompt = [
    "Instruction: Provide an answer to the question. Use the image to answer.\n",
    "https://images.unsplash.com/photo-1623944889288-cd147dbb517c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    "Question: Where are these people and what's the weather like? Answer:"
]
inputs = processor(prompt, return_tensors="pt").to("cuda")
generated_ids = model.generate(**inputs, max_new_tokens=20)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(generated_text[0])
```

### Batch Inference:
To process multiple examples at once:
```python
prompts = [
    ["https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3501&q=80", "This is an image of "],
    ["https://images.unsplash.com/photo-1623944889288-cd147dbb517c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80", "This is an image of "]
]
inputs = processor(prompts, return_tensors="pt").to("cuda")
generated_ids = model.generate(**inputs, max_new_tokens=10)
generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(generated_text)
```

