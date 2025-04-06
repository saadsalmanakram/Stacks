# Image Segmentation

## Introduction
Image segmentation is the process of partitioning an image into multiple segments to simplify its analysis. Semantic segmentation assigns a class label to each pixel in an image.

This guide explains how to fine-tune SegFormer, a transformer-based model, for semantic segmentation using PyTorch and the Hugging Face Transformers library.

## 1. Load and Prepare the Model
The SegFormer model can be loaded using `AutoModelForSemanticSegmentation`. You need to provide mappings between label IDs and their corresponding class names.

```python
from transformers import AutoModelForSemanticSegmentation

# Load pre-trained SegFormer model
model = AutoModelForSemanticSegmentation.from_pretrained(
    checkpoint,
    id2label=id2label,
    label2id=label2id
)
```

## 2. Define Training Arguments
Training arguments specify hyperparameters and configurations. Important parameters:
- `output_dir`: Directory to save the model.
- `learning_rate`: Learning rate for optimization.
- `num_train_epochs`: Number of training epochs.
- `per_device_train_batch_size`: Training batch size.
- `remove_unused_columns=False`: Prevents dropping image columns.
- `push_to_hub=True`: Uploads the model to Hugging Face Hub.

```python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="segformer-b0-scene-parse-150",
    learning_rate=6e-5,
    num_train_epochs=50,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    save_total_limit=3,
    evaluation_strategy="steps",
    save_strategy="steps",
    save_steps=20,
    eval_steps=20,
    logging_steps=1,
    eval_accumulation_steps=5,
    remove_unused_columns=False,
    push_to_hub=True,
)
```

## 3. Initialize Trainer and Train the Model
The `Trainer` class simplifies training. It requires:
- `model`: The loaded SegFormer model.
- `train_dataset` and `eval_dataset`: Training and validation datasets.
- `compute_metrics`: Function to compute evaluation metrics.

```python
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=test_ds,
    compute_metrics=compute_metrics,
)

trainer.train()
```

## 4. Upload Model to Hugging Face Hub
Once training is complete, share the model with:

```python
trainer.push_to_hub()
```

## 5. Perform Inference
### Load Dataset and Select Image

```python
from datasets import load_dataset

ds = load_dataset("scene_parse_150", split="train[:50]")
ds = ds.train_test_split(test_size=0.2)
test_ds = ds["test"]
image = test_ds[0]["image"]
```

### Preprocess Image
Convert the image to tensor format and move it to the appropriate device (CPU/GPU).

```python
from accelerate.test_utils.testing import get_backend

device, _, _ = get_backend()
encoding = image_processor(image, return_tensors="pt")
pixel_values = encoding.pixel_values.to(device)
```

### Pass Image Through Model
Obtain raw segmentation logits.

```python
outputs = model(pixel_values=pixel_values)
logits = outputs.logits.cpu()
```

### Rescale Logits and Apply Argmax
Resize logits to match the original image size and determine predicted classes.

```python
import torch.nn.functional as F

upsampled_logits = F.interpolate(
    logits,
    size=image.size[::-1],  # Reverse width and height
    mode="bilinear",
    align_corners=False,
)
pred_seg = upsampled_logits.argmax(dim=1)[0]
```

## 6. Visualizing Segmentation Results
### Define ADE20K Color Palette
Each class is mapped to an RGB value.

```python
import numpy as np

def ade_palette():
    return np.array([
        [0, 0, 0], [120, 120, 120], [180, 120, 120], [6, 230, 230],
        [80, 50, 50], [4, 200, 3], [120, 120, 80], [140, 140, 140],
        [204, 5, 255], [230, 230, 230], [4, 250, 7], [224, 5, 255]
        # Add more colors as needed
    ])
```

### Overlay Segmentation Map on Image

```python
import matplotlib.pyplot as plt

def visualize_segmentation(image, pred_seg):
    color_palette = ade_palette()
    color_seg = color_palette[pred_seg.numpy()]
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.imshow(image)
    plt.axis("off")
    plt.subplot(1, 2, 2)
    plt.imshow(color_seg)
    plt.axis("off")
    plt.show()

visualize_segmentation(image, pred_seg)
```

## Conclusion
This guide covers:
- Loading and fine-tuning SegFormer for semantic segmentation.
- Training the model using `Trainer`.
- Performing inference and visualizing segmentation results.



