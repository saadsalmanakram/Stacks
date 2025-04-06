
---

### **Image Captioning with Hugging Face**

**Image captioning** is the task of generating textual descriptions for images. It is beneficial for applications like aiding visually impaired individuals by providing image descriptions, improving accessibility.

#### **Overview**
In this guide, you'll learn how to:
1. Fine-tune an image captioning model.
2. Use the fine-tuned model for inference.

---

### **Step 1: Installation**

Ensure that the necessary libraries are installed:

```bash
pip install transformers datasets evaluate -q
pip install jiwer -q
```

**Login to Hugging Face** (Optional but recommended for model sharing):

```python
from huggingface_hub import notebook_login

notebook_login()
```

---

### **Step 2: Load the Pokémon BLIP Dataset**

You will use the **Pokémon BLIP captions dataset**, which contains image-caption pairs:

```python
from datasets import load_dataset

ds = load_dataset("lambdalabs/pokemon-blip-captions")
ds
```

This dataset consists of 833 samples with the following features:
- `image`
- `text`

Split the dataset into training and test sets:

```python
ds = ds["train"].train_test_split(test_size=0.1)
train_ds = ds["train"]
test_ds = ds["test"]
```

---

### **Step 3: Visualize Sample Images**

Visualize a few sample images along with their captions:

```python
from textwrap import wrap
import matplotlib.pyplot as plt
import numpy as np

def plot_images(images, captions):
    plt.figure(figsize=(20, 20))
    for i in range(len(images)):
        ax = plt.subplot(1, len(images), i + 1)
        caption = captions[i]
        caption = "\n".join(wrap(caption, 12))
        plt.title(caption)
        plt.imshow(images[i])
        plt.axis("off")

sample_images = [np.array(train_ds[i]["image"]) for i in range(5)]
sample_captions = [train_ds[i]["text"] for i in range(5)]
plot_images(sample_images, sample_captions)
```

---

### **Step 4: Preprocess the Dataset**

You need to preprocess both the images and captions for model input. Load the processor associated with the model you are fine-tuning:

```python
from transformers import AutoProcessor

checkpoint = "microsoft/git-base"
processor = AutoProcessor.from_pretrained(checkpoint)

def transforms(example_batch):
    images = [x for x in example_batch["image"]]
    captions = [x for x in example_batch["text"]]
    inputs = processor(images=images, text=captions, padding="max_length")
    inputs.update({"labels": inputs["input_ids"]})
    return inputs

train_ds.set_transform(transforms)
test_ds.set_transform(transforms)
```

---

### **Step 5: Load the Model**

Now, load the pre-trained model for image captioning:

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained(checkpoint)
```

---

### **Step 6: Evaluation**

To evaluate the model, we will use **Word Error Rate (WER)** as the metric:

```python
from evaluate import load
import torch

wer = load("wer")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predicted = logits.argmax(-1)
    decoded_labels = processor.batch_decode(labels, skip_special_tokens=True)
    decoded_predictions = processor.batch_decode(predicted, skip_special_tokens=True)
    wer_score = wer.compute(predictions=decoded_predictions, references=decoded_labels)
    return {"wer_score": wer_score}
```

---

### **Step 7: Train the Model**

Define the training arguments and initialize the **Trainer**:

```python
from transformers import TrainingArguments, Trainer

model_name = checkpoint.split("/")[1]

training_args = TrainingArguments(
    output_dir=f"{model_name}-pokemon",
    learning_rate=5e-5,
    num_train_epochs=50,
    fp16=True,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    gradient_accumulation_steps=2,
    save_total_limit=3,
    eval_strategy="steps",
    eval_steps=50,
    save_strategy="steps",
    save_steps=50,
    logging_steps=50,
    remove_unused_columns=False,
    push_to_hub=True,
    label_names=["labels"],
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=test_ds,
    compute_metrics=compute_metrics,
)

trainer.train()
```

After training, you can push the model to the Hub:

```python
trainer.push_to_hub()
```

---

### **Step 8: Inference**

Test the fine-tuned model with a sample image:

```python
from PIL import Image
import requests

url = "https://huggingface.co/datasets/sayakpaul/sample-datasets/resolve/main/pokemon.png"
image = Image.open(requests.get(url, stream=True).raw)

device, _, _ = get_backend()
inputs = processor(images=image, return_tensors="pt").to(device)
pixel_values = inputs.pixel_values

generated_ids = model.generate(pixel_values=pixel_values, max_length=50)
generated_caption = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
print(generated_caption)
```

Output:

```
a drawing of a pink and blue pokemon
```

This demonstrates that the fine-tuned model generates a good caption for the given image.

---
