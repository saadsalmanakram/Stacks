For the **Visual Question Answering (VQA)** task, here's a breakdown of the steps involved in fine-tuning and inference, specifically using the ViLT model and the BLIP-2 model for zero-shot inference.

### 1. **Fine-tuning ViLT for Visual Question Answering**

**Objective**: Fine-tune ViLT on the Graphcore/vqa dataset for the VQA task, then upload the trained model to Hugging Face for inference.

#### **Install Necessary Libraries**

```bash
pip install -q transformers datasets
```

#### **Login to Hugging Face**

```python
from huggingface_hub import notebook_login
notebook_login()
```

#### **Define Model Checkpoint**

```python
model_checkpoint = "dandelin/vilt-b32-mlm"
```

#### **Load and Explore the Data**

```python
from datasets import load_dataset

dataset = load_dataset("Graphcore/vqa", split="validation[:200]")
print(dataset)
```

#### **Preprocessing Data**

Here we process the dataset, encoding the questions and images for the ViLT model.

```python
from transformers import ViltProcessor
from PIL import Image
import torch

processor = ViltProcessor.from_pretrained(model_checkpoint)

def preprocess_data(examples):
    image_paths = examples['image_id']
    images = [Image.open(image_path) for image_path in image_paths]
    texts = examples['question']

    encoding = processor(images, texts, padding="max_length", truncation=True, return_tensors="pt")

    targets = []
    for labels, scores in zip(examples['label.ids'], examples['label.weights']):
        target = torch.zeros(len(id2label))
        for label, score in zip(labels, scores):
            target[label] = score
        targets.append(target)

    encoding["labels"] = targets
    return encoding

processed_dataset = dataset.map(preprocess_data, batched=True, remove_columns=['question', 'question_type', 'question_id', 'image_id', 'answer_type', 'label.ids', 'label.weights'])
```

#### **Fine-tune ViLT Model**

```python
from transformers import ViltForQuestionAnswering, Trainer, TrainingArguments

model = ViltForQuestionAnswering.from_pretrained(model_checkpoint, num_labels=len(id2label), id2label=id2label, label2id=label2id)

training_args = TrainingArguments(
    output_dir="vilt_finetuned_200",
    per_device_train_batch_size=4,
    num_train_epochs=20,
    save_steps=200,
    logging_steps=50,
    learning_rate=5e-5,
    save_total_limit=2,
    remove_unused_columns=False,
    push_to_hub=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=DefaultDataCollator(),
    train_dataset=processed_dataset,
)

trainer.train()
trainer.push_to_hub()
```

#### **Inference Using the Fine-tuned ViLT Model**

```python
from transformers import pipeline

pipe = pipeline("visual-question-answering", model="MariaK/vilt_finetuned_200")

example = dataset[0]
image = Image.open(example['image_id'])
question = example['question']

print(question)
pipe(image, question, top_k=1)
```

### 2. **Zero-shot VQA with BLIP-2**

**Objective**: Use BLIP-2 for zero-shot Visual Question Answering (VQA) without fine-tuning the model.

#### **Install Necessary Libraries**

```bash
pip install -q transformers accelerate
```

#### **Load BLIP-2 Model**

```python
from transformers import AutoProcessor, Blip2ForConditionalGeneration
import torch

processor = AutoProcessor.from_pretrained("Salesforce/blip2-opt-2.7b")
model = Blip2ForConditionalGeneration.from_pretrained("Salesforce/blip2-opt-2.7b", torch_dtype=torch.float16)

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
```

#### **Perform Zero-shot Inference**

```python
example = dataset[0]
image = Image.open(example['image_id'])
question = example['question']

prompt = f"Question: {question} Answer:"

inputs = processor(image, text=prompt, return_tensors="pt").to(device, torch.float16)
generated_ids = model.generate(**inputs, max_new_tokens=10)

generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
print(generated_text)
```

This approach allows you to apply **zero-shot** VQA using BLIP-2 by simply feeding the model an image and a question. It does not require fine-tuning but provides answers based on pre-trained capabilities.

--- 
