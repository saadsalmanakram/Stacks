
### **Image-Text-to-Text Inference with Hugging Face Transformers**

Image-text-to-text models, or vision-language models (VLMs), can handle various tasks, such as visual question answering, image captioning, and image segmentation. Unlike image-to-text models that only process images, VLMs can take both image and open-ended text inputs.

### **Installation**
To get started, install the required dependencies for inference:

```bash
pip install -q transformers accelerate flash_attn
```

### **Model and Processor Initialization**
Next, initialize the model and processor:

```python
from transformers import AutoProcessor, AutoModelForImageTextToText
import torch

device = torch.device("cuda")  # Ensure using a GPU for inference

# Load the model and processor
model = AutoModelForImageTextToText.from_pretrained(
    "HuggingFaceM4/idefics2-8b",
    torch_dtype=torch.bfloat16,
    attn_implementation="flash_attention_2",
).to(device)

processor = AutoProcessor.from_pretrained("HuggingFaceM4/idefics2-8b")
```

### **Prepare Image Inputs**
Define the images you will use as inputs to the model:

```python
from PIL import Image
import requests

# List of image URLs
img_urls = [
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png",
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/bee.jpg"
]

# Load images from URLs
images = [
    Image.open(requests.get(img_urls[0], stream=True).raw),
    Image.open(requests.get(img_urls[1], stream=True).raw)
]
```

### **Prepare Chat Template and Message Formatting**
Here’s an example of a conversation with a chat template for image-captioning:

```python
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": "What do we see in this image?"}
        ]
    },
    {
        "role": "assistant",
        "content": [
            {"type": "text", "text": "In this image we can see two cats on the nets."}
        ]
    },
    {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": "And how about this image?"}
        ]
    },
]
```

### **Preprocessing Inputs**
Now, preprocess the inputs using the processor’s `apply_chat_template`:

```python
prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
inputs = processor(text=prompt, images=[images[0], images[1]], return_tensors="pt").to(device)
```

### **Inference**
Finally, generate text responses with the model:

```python
with torch.no_grad():
    generated_ids = model.generate(**inputs, max_new_tokens=500)

# Decode the generated text
generated_texts = processor.batch_decode(generated_ids, skip_special_tokens=True)
print(generated_texts)
# Output: ['User: What do we see in this image? \nAssistant: In this image we can see two cats on the nets. \nUser: And how about this image? \nAssistant: In this image we can see flowers, plants and insect.']
```

### **Using Pipeline API**
For quicker setup, use the `pipeline` API for the image-text-to-text task:

```python
from transformers import pipeline

# Create a pipeline for image-text-to-text
pipe = pipeline("image-text-to-text", model="llava-hf/llava-interleave-qwen-0.5b-hf")

# Define the chat messages for image captioning
messages = [
    {
        "role": "user",
        "content": [
            {"type": "image", "image": "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/bee.jpg"},
            {"type": "text", "text": "Describe this image."}
        ]
    },
    {
        "role": "assistant",
        "content": [
            {"type": "text", "text": "There's a pink flower"}
        ]
    },
]

# Generate outputs
outputs = pipe(text=messages, max_new_tokens=20, return_full_text=False)
print(outputs[0]["generated_text"])
# Output: with a yellow center in the foreground. The flower is surrounded by red and white flowers with green stems
```

### **Streaming Generation**
If you want to stream the generated text in real-time, use the `TextIteratorStreamer`:

```python
import time
from transformers import TextIteratorStreamer
from threading import Thread

def model_inference(user_prompt, chat_history, max_new_tokens, images):
    user_prompt = {
        "role": "user",
        "content": [
            {"type": "image"},
            {"type": "text", "text": user_prompt},
        ]
    }
    chat_history.append(user_prompt)
    streamer = TextIteratorStreamer(processor.tokenizer, skip_prompt=True, timeout=5.0)

    generation_args = {
        "max_new_tokens": max_new_tokens,
        "streamer": streamer,
        "do_sample": False
    }

    # Add generation prompt to the chat history
    prompt = processor.apply_chat_template(chat_history, add_generation_prompt=True)
    inputs = processor(text=prompt, images=images, return_tensors="pt").to(device)
    generation_args.update(inputs)

    thread = Thread(target=model.generate, kwargs=generation_args)
    thread.start()

    acc_text = ""
    for text_token in streamer:
        time.sleep(0.04)
        acc_text += text_token
        if acc_text.endswith("<end_of_utterance>"):
            acc_text = acc_text[:-18]
        yield acc_text

    thread.join()

# Call the model inference function for streaming output
generator = model_inference(user_prompt="And what is in this image?", chat_history=messages[:2], max_new_tokens=100, images=images)
for value in generator:
    print(value)
```

### **Optimizing for Smaller Hardware (Quantization)**
VLMs are large and can be optimized for smaller hardware with quantization. Here’s how you can apply int8 quantization to the model:

```bash
pip install -U quanto bitsandbytes
```

Then, initialize the model with quantization config:

```python
from transformers import AutoModelForImageTextToText, QuantoConfig

model_id = "HuggingFaceM4/idefics2-8b"
quantization_config = QuantoConfig(weights="int8")

quantized_model = AutoModelForImageTextToText.from_pretrained(
    model_id, device_map="cuda", quantization_config=quantization_config
)
```

### **Conclusion**
With this setup, you can easily leverage vision-language models for tasks like image captioning and question answering using the Hugging Face Transformers library. For faster and more efficient inference, you can utilize the pipeline API, real-time streaming, and model quantization techniques.

For more details on image-text-to-text tasks and VLMs, check out these resources:
- [Image-text-to-text Task on Hugging Face](https://huggingface.co/tasks/image-text-to-text)
- [Vision Language Models Explained](https://huggingface.co/blog/vision-language-models)