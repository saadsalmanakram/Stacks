
### Summarization
**Summarization** generates a shorter version of a document that captures the key details. There are two types of summarization:
- **Extractive**: Extracting the most important parts of the original document.
- **Abstractive**: Generating new text that conveys the main ideas of the original document.

In this task, we will focus on **Abstractive Summarization** and finetune a T5 model on the **BillSum dataset** (California state bill subset) for summarizing the text.

#### 1. Install Required Libraries:
First, make sure you have the necessary libraries installed:

```bash
pip install transformers datasets evaluate rouge_score
```

#### 2. Login to Hugging Face Hub:
Login to Hugging Face using your token to upload and share your model:

```python
from huggingface_hub import notebook_login
notebook_login()
```

#### 3. Load the Dataset:
We will load the **BillSum** dataset for the California state bill subset:

```python
from datasets import load_dataset

billsum = load_dataset("billsum", split="ca_test")
billsum = billsum.train_test_split(test_size=0.2)  # Split into train and test sets
```

Example of the dataset:

```python
billsum["train"][0]
```

The dataset consists of:
- `text`: Full text of the bill
- `summary`: Condensed version (target for summarization)

#### 4. Preprocessing:
You need to preprocess the text by adding a prefix (for the T5 model to know it's a summarization task) and then tokenize the text and summary.

```python
from transformers import AutoTokenizer

checkpoint = "google-t5/t5-small"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

prefix = "summarize: "

def preprocess_function(examples):
    inputs = [prefix + doc for doc in examples["text"]]
    model_inputs = tokenizer(inputs, max_length=1024, truncation=True)

    labels = tokenizer(text_target=examples["summary"], max_length=128, truncation=True)

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

tokenized_billsum = billsum.map(preprocess_function, batched=True)
```

#### 5. Data Collator:
Use `DataCollatorForSeq2Seq` to pad the sequences dynamically during training:

```python
from transformers import DataCollatorForSeq2Seq

data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=checkpoint)
```

#### 6. ROUGE Evaluation:
We will use the **ROUGE** metric to evaluate the model's performance during training:

```python
import evaluate
import numpy as np

rouge = evaluate.load("rouge")

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    decoded_preds = tokenizer.batch_decode(predictions, skip_special_tokens=True)
    labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

    result = rouge.compute(predictions=decoded_preds, references=decoded_labels, use_stemmer=True)

    prediction_lens = [np.count_nonzero(pred != tokenizer.pad_token_id) for pred in predictions]
    result["gen_len"] = np.mean(prediction_lens)

    return {k: round(v, 4) for k, v in result.items()}
```

#### 7. Training the Model:
Now, you can begin training the model with **Seq2SeqTrainer**:

```python
from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer

model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)

training_args = Seq2SeqTrainingArguments(
    output_dir="my_awesome_billsum_model",
    eval_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    weight_decay=0.01,
    save_total_limit=3,
    num_train_epochs=4,
    predict_with_generate=True,
    fp16=True,
    push_to_hub=True,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_billsum["train"],
    eval_dataset=tokenized_billsum["test"],
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
```

#### 8. Push Model to Hub:
After training, push your model to the Hugging Face Hub:

```python
trainer.push_to_hub()
```

#### 9. Inference (Using the Model for Summarization):
To use your finetuned model for inference:

```python
from transformers import pipeline

summarizer = pipeline("summarization", model="username/my_awesome_billsum_model")

text = "summarize: The Inflation Reduction Act lowers prescription drug costs, health care costs, and energy costs. It's the most aggressive action on tackling the climate crisis in American history, which will lift up American workers and create good-paying, union jobs across the country. It'll lower the deficit and ask the ultra-wealthy and corporations to pay their fair share. And no one making under $400,000 per year will pay a penny more in taxes."

summarizer(text)
```

Output:
```json
[{"summary_text": "The Inflation Reduction Act lowers prescription drug costs, health care costs, and energy costs. It's the most aggressive action on tackling the climate crisis in American history, which will lift up American workers and create good-paying, union jobs across the country."}]
```

#### 10. Manual Inference (Optional):
Alternatively, you can manually perform the inference using the model:

```python
inputs = tokenizer(text, return_tensors="pt").input_ids
outputs = model.generate(inputs, max_new_tokens=100, do_sample=False)
tokenizer.decode(outputs[0], skip_special_tokens=True)
```
