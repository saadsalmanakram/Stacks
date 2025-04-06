
---

### Fine-Tune a Pretrained Model with PyTorch

Fine-tuning a pretrained model allows you to leverage the power of large, state-of-the-art models without the need to train them from scratch. Using Hugging Face's 🤗 Transformers, you can fine-tune models for various tasks like text classification. Below is a step-by-step guide to fine-tuning a model using PyTorch.

#### 1. Prepare the Dataset

Start by loading a dataset. In this case, we will use the **Yelp Reviews** dataset for a sequence classification task.

```python
from datasets import load_dataset

dataset = load_dataset("yelp_review_full")
dataset["train"][100]
```

The dataset will look something like this:
```json
{
  'label': 0,
  'text': 'My expectations for McDonalds are t rarely high. But for one to still fail so spectacularly...that takes something special!...'
}
```

We need to process the text and tokenize it for the model. Use the Hugging Face tokenizer to convert the text into a format the model can understand.

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-cased")

def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True)

tokenized_datasets = dataset.map(tokenize_function, batched=True)
```

You can create a smaller subset for faster training:

```python
small_train_dataset = tokenized_datasets["train"].shuffle(seed=42).select(range(1000))
small_eval_dataset = tokenized_datasets["test"].shuffle(seed=42).select(range(1000))
```

#### 2. Fine-Tuning with PyTorch

##### Load the Pretrained Model

Now, let's load the pretrained model. Since we're performing sequence classification, we'll use `AutoModelForSequenceClassification` and specify the number of output labels.

```python
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("google-bert/bert-base-cased", num_labels=5, torch_dtype="auto")
```

##### Prepare the Data

Next, remove unnecessary columns from the dataset and rename the label column to `labels` since the model expects the argument to be named `labels`.

```python
tokenized_datasets = tokenized_datasets.remove_columns(["text"])
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch")
```

Create DataLoader for both training and evaluation:

```python
from torch.utils.data import DataLoader

train_dataloader = DataLoader(small_train_dataset, shuffle=True, batch_size=8)
eval_dataloader = DataLoader(small_eval_dataset, batch_size=8)
```

##### Optimizer and Learning Rate Scheduler

We will use the **AdamW** optimizer and create a learning rate scheduler to adjust the learning rate during training.

```python
from torch.optim import AdamW
from transformers import get_scheduler

optimizer = AdamW(model.parameters(), lr=5e-5)

num_epochs = 3
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_scheduler(
    name="linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps
)
```

#### 3. Training Loop

To track progress during training, use the `tqdm` library to add a progress bar:

```python
from tqdm.auto import tqdm

progress_bar = tqdm(range(num_training_steps))

model.train()
for epoch in range(num_epochs):
    for batch in train_dataloader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)
```

#### 4. Evaluation

To evaluate the model, calculate accuracy by comparing predictions with the true labels:

```python
import evaluate

metric = evaluate.load("accuracy")
model.eval()

for batch in eval_dataloader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)

    logits = outputs.logits
    predictions = torch.argmax(logits, dim=-1)
    metric.add_batch(predictions=predictions, references=batch["labels"])

metric.compute()
```

#### 5. Conclusion

This concludes the fine-tuning process using PyTorch. You’ve loaded a pretrained model, prepared your dataset, trained the model on the task-specific data, and evaluated its performance.

You can adjust the hyperparameters (e.g., batch size, learning rate, number of epochs) and experiment with other improvements like mixed precision training or gradient accumulation.