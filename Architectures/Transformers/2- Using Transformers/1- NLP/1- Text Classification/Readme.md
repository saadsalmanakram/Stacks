
### Overview

Text classification involves assigning predefined labels to a given text. In this example, we’ll fine-tune a **DistilBERT** model to predict whether a movie review is positive or negative from the **IMDb** dataset.

### Steps:
1. Install Necessary Libraries
2. Load IMDb Dataset
3. Preprocess the Data
4. Define Evaluation Metrics
5. Set Up the Model
6. Train the Model
7. Perform Inference

---

### 1. Install Necessary Libraries

First, install the required libraries:

```bash
pip install transformers datasets evaluate accelerate
```

Log in to your Hugging Face account to upload and share the model:

```python
from huggingface_hub import notebook_login
notebook_login()
```

---

### 2. Load IMDb Dataset

Load the IMDb dataset using the `datasets` library:

```python
from datasets import load_dataset

imdb = load_dataset("imdb")
```

Preview the data:

```python
print(imdb["test"][0])
```

Example output:

```json
{
    "label": 0,
    "text": "I love sci-fi and am willing to put up with a lot... (full review)"
}
```

The fields in the dataset:
- **text**: The movie review text.
- **label**: A binary value (0 for negative, 1 for positive).

---

### 3. Preprocess the Data

We need to tokenize the text using the **DistilBERT tokenizer**. Here's how to do that:

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
```

Define a function to tokenize the text and truncate sequences to the maximum length supported by DistilBERT:

```python
def preprocess_function(examples):
    return tokenizer(examples["text"], truncation=True)
```

Apply the preprocessing function to the dataset:

```python
tokenized_imdb = imdb.map(preprocess_function, batched=True)
```

For efficient padding, use **DataCollatorWithPadding**:

```python
from transformers import DataCollatorWithPadding

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
```

---

### 4. Define Evaluation Metrics

The accuracy metric can be loaded from the **evaluate** library:

```python
import evaluate

accuracy = evaluate.load("accuracy")
```

Define a function to calculate accuracy during evaluation:

```python
import numpy as np

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    return accuracy.compute(predictions=predictions, references=labels)
```

---

### 5. Set Up the Model

Define the label mappings for the classification task:

```python
id2label = {0: "NEGATIVE", 1: "POSITIVE"}
label2id = {"NEGATIVE": 0, "POSITIVE": 1}
```

Load the **DistilBERT model** for sequence classification:

```python
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=2, id2label=id2label, label2id=label2id
)
```

---

### 6. Train the Model

Define the training parameters using **TrainingArguments**:

```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="my_awesome_model",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=2,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    push_to_hub=True,
)
```

Set up the **Trainer**:

```python
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_imdb["train"],
    eval_dataset=tokenized_imdb["test"],
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
```

Once the model is trained, you can upload it to the Hugging Face Hub:

```python
trainer.push_to_hub()
```

---

### 7. Inference with the Model

After training, you can use the model for inference. Here's how to classify a new review:

```python
text = "This was a masterpiece. Not completely faithful to the books, but enthralling from beginning to end."

# Tokenize the input text
inputs = tokenizer(text, return_tensors="pt")

# Get the model's predictions
with torch.no_grad():
    logits = model(**inputs).logits

# Get the predicted class and label
predicted_class_id = logits.argmax().item()
predicted_label = model.config.id2label[predicted_class_id]
print(predicted_label)  # 'POSITIVE'
```

Alternatively, use the **Hugging Face pipeline** for sentiment analysis:

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis", model="stevhliu/my_awesome_model")
print(classifier(text))  # [{'label': 'POSITIVE', 'score': 0.9994}]
```

---

### Conclusion

This guide demonstrates how to fine-tune **DistilBERT** for **text classification** on the **IMDb dataset** in PyTorch. By following these steps, you can easily adapt this approach to other text classification tasks and fine-tune models for your specific datasets. The Hugging Face Hub makes it simple to share and deploy models.