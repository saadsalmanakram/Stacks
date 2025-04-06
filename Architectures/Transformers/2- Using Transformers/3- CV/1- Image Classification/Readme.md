# Image Classification

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/huggingface/notebooks/blob/main/examples/image_classification.ipynb)
[![Open In Studio Lab](https://github.com/studiolab/studiolab-badge.svg)](https://studiolab.sagemaker.aws/import/github/huggingface/notebooks/blob/main/examples/image_classification.ipynb)

Image classification assigns a label or class to an image. Unlike text or audio classification, the inputs are the pixel values that comprise an image. There are many applications for image classification, such as detecting damage after a natural disaster, monitoring crop health, or helping screen medical images for signs of disease.

## Guide Overview
This guide illustrates how to:
- Fine-tune ViT on the Food-101 dataset to classify a food item in an image.
- Use your fine-tuned model for inference.

To see all architectures and checkpoints compatible with this task, check the [task page](https://huggingface.co/tasks/image-classification).

## Install Necessary Libraries
```bash
pip install transformers datasets evaluate accelerate pillow torchvision scikit-learn
```

## Authenticate with Hugging Face
```python
from huggingface_hub import notebook_login
notebook_login()
```

## Load Food-101 Dataset
```python
from datasets import load_dataset
food = load_dataset("food101", split="train[:5000]")
food = food.train_test_split(test_size=0.2)
```

View an example:
```python
food["train"][0]
```

## Label Mapping
```python
labels = food["train"].features["label"].names
label2id, id2label = {}, {}
for i, label in enumerate(labels):
    label2id[label] = str(i)
    id2label[str(i)] = label
```

## Preprocess Data
Load ViT image processor:
```python
from transformers import AutoImageProcessor
checkpoint = "google/vit-base-patch16-224-in21k"
image_processor = AutoImageProcessor.from_pretrained(checkpoint)
```

Apply transformations:
```python
from torchvision.transforms import RandomResizedCrop, Compose, Normalize, ToTensor
normalize = Normalize(mean=image_processor.image_mean, std=image_processor.image_std)
size = image_processor.size.get("shortest_edge", (image_processor.size["height"], image_processor.size["width"]))
_transforms = Compose([RandomResizedCrop(size), ToTensor(), normalize])
```

Create transformation function:
```python
def transforms(examples):
    examples["pixel_values"] = [_transforms(img.convert("RGB")) for img in examples["image"]]
    del examples["image"]
    return examples
```

Apply transformations:
```python
food = food.with_transform(transforms)
```

## Data Collation
```python
from transformers import DefaultDataCollator
data_collator = DefaultDataCollator()
```

## Define Evaluation Metric
```python
import evaluate
accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    return accuracy.compute(predictions=predictions, references=labels)
```

## Train Model with PyTorch
```python
from transformers import AutoModelForImageClassification, TrainingArguments, Trainer
model = AutoModelForImageClassification.from_pretrained(
    checkpoint, num_labels=len(labels), id2label=id2label, label2id=label2id)

training_args = TrainingArguments(
    output_dir="my_awesome_food_model",
    remove_unused_columns=False,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=16,
    gradient_accumulation_steps=4,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    warmup_ratio=0.1,
    logging_steps=10,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    push_to_hub=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=food["train"],
    eval_dataset=food["test"],
    compute_metrics=compute_metrics,
)

trainer.train()
```

## Push Model to Hub
```python
trainer.push_to_hub()
```

## Run Inference
```python
from transformers import pipeline
classifier = pipeline("image-classification", model="my_awesome_food_model")

from datasets import load_dataset
ds = load_dataset("food101", split="validation[:10]")
image = ds["image"][0]
classifier(image)
```

