### **Multiple Choice Task**

A multiple-choice task is similar to question answering, except several candidate answers are provided along with a context, and the model is trained to select the correct answer.

This guide will show you how to:

- Finetune BERT on the regular configuration of the SWAG dataset to select the best answer given multiple options and some context.
- Use your finetuned model for inference.

---

### **1. Install Dependencies**
Before you begin, make sure you have all the necessary libraries installed:

```bash
pip install transformers datasets evaluate
```

We encourage you to log in to your Hugging Face account so you can upload and share your model with the community:

```python
from huggingface_hub import notebook_login
notebook_login()
```

---

### **2. Load the SWAG Dataset**
Start by loading the SWAG dataset from the 🤗 Datasets library:

```python
from datasets import load_dataset
swag = load_dataset("swag", "regular")
```

Check an example from the dataset:

```python
swag["train"][0]
```

**Dataset Fields Explanation:**
- `sent1` and `sent2`: These fields represent the beginning of a sentence.
- `ending0`, `ending1`, `ending2`, `ending3`: Four possible sentence endings, where only one is correct.
- `label`: Identifies the correct ending.

---

### **3. Preprocessing**
Load a BERT tokenizer to process the sentence beginnings and the four possible endings:

```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")
```

Define a preprocessing function:

```python
ending_names = ["ending0", "ending1", "ending2", "ending3"]

def preprocess_function(examples):
    first_sentences = [[context] * 4 for context in examples["sent1"]]
    question_headers = examples["sent2"]
    second_sentences = [
        [f"{header} {examples[end][i]}" for end in ending_names] for i, header in enumerate(question_headers)
    ]

    first_sentences = sum(first_sentences, [])
    second_sentences = sum(second_sentences, [])

    tokenized_examples = tokenizer(first_sentences, second_sentences, truncation=True)
    return {k: [v[i : i + 4] for i in range(0, len(v), 4)] for k, v in tokenized_examples.items()}
```

Apply the preprocessing function to the entire dataset:

```python
tokenized_swag = swag.map(preprocess_function, batched=True)
```

---

### **4. Create a Data Collator**
🤗 Transformers doesn’t have a built-in data collator for multiple-choice tasks, so we need to create one:

```python
from dataclasses import dataclass
from transformers.tokenization_utils_base import PreTrainedTokenizerBase, PaddingStrategy
from typing import Optional, Union
import torch

@dataclass
class DataCollatorForMultipleChoice:
    tokenizer: PreTrainedTokenizerBase
    padding: Union[bool, str, PaddingStrategy] = True
    max_length: Optional[int] = None
    pad_to_multiple_of: Optional[int] = None

    def __call__(self, features):
        label_name = "label" if "label" in features[0].keys() else "labels"
        labels = [feature.pop(label_name) for feature in features]
        batch_size = len(features)
        num_choices = len(features[0]["input_ids"])
        flattened_features = [
            [{k: v[i] for k, v in feature.items()} for i in range(num_choices)] for feature in features
        ]
        flattened_features = sum(flattened_features, [])

        batch = self.tokenizer.pad(
            flattened_features,
            padding=self.padding,
            max_length=self.max_length,
            pad_to_multiple_of=self.pad_to_multiple_of,
            return_tensors="pt",
        )

        batch = {k: v.view(batch_size, num_choices, -1) for k, v in batch.items()}
        batch["labels"] = torch.tensor(labels, dtype=torch.int64)
        return batch
```

---

### **5. Evaluation Metric**
Load the accuracy metric from 🤗 Evaluate:

```python
import evaluate
accuracy = evaluate.load("accuracy")
```

Define a function to compute accuracy:

```python
import numpy as np

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    return accuracy.compute(predictions=predictions, references=labels)
```

---

### **6. Train the Model**
Load BERT with `AutoModelForMultipleChoice`:

```python
from transformers import AutoModelForMultipleChoice, TrainingArguments, Trainer

model = AutoModelForMultipleChoice.from_pretrained("google-bert/bert-base-uncased")
```

Define training arguments:

```python
training_args = TrainingArguments(
    output_dir="my_awesome_swag_model",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    learning_rate=5e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    push_to_hub=True,
)
```

Initialize the Trainer:

```python
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_swag["train"],
    eval_dataset=tokenized_swag["validation"],
    tokenizer=tokenizer,
    data_collator=DataCollatorForMultipleChoice(tokenizer=tokenizer),
    compute_metrics=compute_metrics,
)
```

Start training:

```python
trainer.train()
```

Once training is completed, push your model to the Hugging Face Hub:

```python
trainer.push_to_hub()
```

---

### **7. Inference**
Now that your model is finetuned, you can use it for inference. Define a prompt with two candidate answers:

```python
prompt = "France has a bread law, Le Décret Pain, with strict rules on what is allowed in a traditional baguette."
candidate1 = "The law does not apply to croissants and brioche."
candidate2 = "The law applies to baguettes."
```

Load the tokenizer:

```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained("username/my_awesome_swag_model")
inputs = tokenizer([[prompt, candidate1], [prompt, candidate2]], return_tensors="pt", padding=True)
```

Define labels:

```python
import torch
labels = torch.tensor(0).unsqueeze(0)
```

Load the model and get predictions:

```python
from transformers import AutoModelForMultipleChoice
model = AutoModelForMultipleChoice.from_pretrained("username/my_awesome_swag_model")

outputs = model(**{k: v.unsqueeze(0) for k, v in inputs.items()}, labels=labels)
logits = outputs.logits
```

Get the class with the highest probability:

```python
predicted_class = logits.argmax().item()
predicted_class
```

The predicted class will indicate the correct answer.

---

### **Conclusion**
You have now successfully:
- Loaded the SWAG dataset.
- Preprocessed the data.
- Trained a BERT model for multiple-choice classification.
- Used the model for inference.