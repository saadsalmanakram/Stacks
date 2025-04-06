
---

### **Token Classification with PyTorch**

Token classification assigns a label to individual tokens in a sentence. One of the most common tasks is Named Entity Recognition (NER), which identifies entities like people, organizations, and locations.

### **Prerequisites**
Ensure the required libraries are installed:
```bash
pip install transformers datasets evaluate seqeval
```

Log in to your Hugging Face account:
```python
from huggingface_hub import notebook_login
notebook_login()
```

### **Load the WNUT 17 Dataset**
You can load the dataset from the 🤗 Datasets library:
```python
from datasets import load_dataset

wnut = load_dataset("wnut_17")
```

### **Inspect the Data**
Take a look at an example:
```python
wnut["train"][0]
```

#### **NER Tags Mapping**
Each number in the `ner_tags` represents an entity. Convert the numbers to their label names:
```python
label_list = wnut["train"].features[f"ner_tags"].feature.names
print(label_list)
```

### **Preprocessing**
Use the DistilBERT tokenizer to preprocess tokens:
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert/distilbert-base-uncased")
```

To tokenize the input, set `is_split_into_words=True`:
```python
example = wnut["train"][0]
tokenized_input = tokenizer(example["tokens"], is_split_into_words=True)
tokens = tokenizer.convert_ids_to_tokens(tokenized_input["input_ids"])
```

### **Align Tokens and Labels**
You need to realign tokens with labels, especially since the tokenizer splits words into subwords and introduces special tokens (`[CLS]` and `[SEP]`). Here's a function to realign tokens and labels:
```python
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(examples["tokens"], truncation=True, is_split_into_words=True)
    
    labels = []
    for i, label in enumerate(examples[f"ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label[word_idx])
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx
        labels.append(label_ids)

    tokenized_inputs["labels"] = labels
    return tokenized_inputs
```

Apply the preprocessing function over the entire dataset:
```python
tokenized_wnut = wnut.map(tokenize_and_align_labels, batched=True)
```

### **Data Collator**
Create a data collator for dynamic padding:
```python
from transformers import DataCollatorForTokenClassification

data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)
```

### **Evaluation Metrics**
Use `seqeval` for evaluating your model’s performance:
```python
import evaluate

seqeval = evaluate.load("seqeval")
```

Create a function to compute metrics:
```python
import numpy as np

def compute_metrics(p):
    predictions, labels = p
    predictions = np.argmax(predictions, axis=2)

    true_predictions = [
        [label_list[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    true_labels = [
        [label_list[l] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]

    results = seqeval.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }
```

### **Define Label Mappings**
Map label IDs to their labels:
```python
id2label = {
    0: "O",
    1: "B-corporation",
    2: "I-corporation",
    3: "B-creative-work",
    4: "I-creative-work",
    5: "B-group",
    6: "I-group",
    7: "B-location",
    8: "I-location",
    9: "B-person",
    10: "I-person",
    11: "B-product",
    12: "I-product",
}

label2id = {v: k for k, v in id2label.items()}
```

### **Model Setup**
Load the DistilBERT model for token classification:
```python
from transformers import AutoModelForTokenClassification

model = AutoModelForTokenClassification.from_pretrained(
    "distilbert/distilbert-base-uncased", num_labels=13, id2label=id2label, label2id=label2id
)
```

### **Training Setup**
Define training arguments and setup the Trainer:
```python
from transformers import TrainingArguments, Trainer

training_args = TrainingArguments(
    output_dir="my_awesome_wnut_model",
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

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_wnut["train"],
    eval_dataset=tokenized_wnut["test"],
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
```

Once training is completed, upload the model to the Hub:
```python
trainer.push_to_hub()
```

### **Inference**
To run inference on the finetuned model, use the `pipeline()`:
```python
from transformers import pipeline

classifier = pipeline("ner", model="stevhliu/my_awesome_wnut_model")
text = "The Golden State Warriors are an American professional basketball team based in San Francisco."
print(classifier(text))
```

Manually replicate the results by tokenizing the text and passing it through the model:
```python
from transformers import AutoTokenizer, AutoModelForTokenClassification
import torch

tokenizer = AutoTokenizer.from_pretrained("stevhliu/my_awesome_wnut_model")
inputs = tokenizer(text, return_tensors="pt")

model = AutoModelForTokenClassification.from_pretrained("stevhliu/my_awesome_wnut_model")
with torch.no_grad():
    logits = model(**inputs).logits

predictions = torch.argmax(logits, dim=2)
predicted_token_class = [model.config.id2label[t.item()] for t in predictions[0]]
print(predicted_token_class)
```

---
