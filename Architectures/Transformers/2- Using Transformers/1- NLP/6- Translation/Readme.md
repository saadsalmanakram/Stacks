
---

### **Translation**

Translation is a common task in NLP where a sequence of text is converted from one language to another. In this guide, we'll demonstrate how to fine-tune the T5 model on the OPUS Books dataset for English to French translation.

---

### **Required Libraries**

Before starting, install the necessary libraries:

```bash
pip install transformers datasets evaluate sacrebleu
```

---

### **Authentication (Optional)**

For sharing your model, log in to your Hugging Face account:

```python
from huggingface_hub import notebook_login

notebook_login()
```

---

### **Loading OPUS Books Dataset**

We'll load the English-French subset of the OPUS Books dataset:

```python
from datasets import load_dataset

books = load_dataset("opus_books", "en-fr")
books = books["train"].train_test_split(test_size=0.2)
```

Check an example from the dataset:

```python
books["train"][0]
```

---

### **Preprocessing**

To prepare the data for T5, load the tokenizer and define a preprocessing function:

```python
from transformers import AutoTokenizer

checkpoint = "google-t5/t5-small"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

source_lang = "en"
target_lang = "fr"
prefix = "translate English to French: "

def preprocess_function(examples):
    inputs = [prefix + example[source_lang] for example in examples["translation"]]
    targets = [example[target_lang] for example in examples["translation"]]
    model_inputs = tokenizer(inputs, text_target=targets, max_length=128, truncation=True)
    return model_inputs

tokenized_books = books.map(preprocess_function, batched=True)
```

---

### **Collator**

Use `DataCollatorForSeq2Seq` to dynamically pad sequences during batching:

```python
from transformers import DataCollatorForSeq2Seq

data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=checkpoint)
```

---

### **Evaluation Metrics**

We will use the **SacreBLEU** metric for evaluation:

```python
import evaluate

metric = evaluate.load("sacrebleu")

import numpy as np

def postprocess_text(preds, labels):
    preds = [pred.strip() for pred in preds]
    labels = [[label.strip()] for label in labels]
    return preds, labels

def compute_metrics(eval_preds):
    preds, labels = eval_preds
    if isinstance(preds, tuple):
        preds = preds[0]
    decoded_preds = tokenizer.batch_decode(preds, skip_special_tokens=True)

    labels = np.where(labels != -100, labels, tokenizer.pad_token_id)
    decoded_labels = tokenizer.batch_decode(labels, skip_special_tokens=True)

    decoded_preds, decoded_labels = postprocess_text(decoded_preds, decoded_labels)

    result = metric.compute(predictions=decoded_preds, references=decoded_labels)
    result = {"bleu": result["score"]}

    prediction_lens = [np.count_nonzero(pred != tokenizer.pad_token_id) for pred in preds]
    result["gen_len"] = np.mean(prediction_lens)
    result = {k: round(v, 4) for k, v in result.items()}
    return result
```

---

### **Training the Model**

Using **Seq2SeqTrainer** for model training:

```python
from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer

model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)

training_args = Seq2SeqTrainingArguments(
    output_dir="my_awesome_opus_books_model",
    eval_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    weight_decay=0.01,
    save_total_limit=3,
    num_train_epochs=2,
    predict_with_generate=True,
    fp16=True, 
    push_to_hub=True,
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_books["train"],
    eval_dataset=tokenized_books["test"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
```

---

### **Inference**

For inference, use the model for translation:

```python
from transformers import pipeline

translator = pipeline("translation_xx_to_yy", model="username/my_awesome_opus_books_model")
text = "translate English to French: Legumes share resources with nitrogen-fixing bacteria."
translator(text)
```

Alternatively, manually process the input and generate the translation:

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("username/my_awesome_opus_books_model")
inputs = tokenizer(text, return_tensors="pt").input_ids

model = AutoModelForSeq2SeqLM.from_pretrained("username/my_awesome_opus_books_model")
outputs = model.generate(inputs, max_new_tokens=40, do_sample=True, top_k=30, top_p=0.95)

tokenizer.decode(outputs[0], skip_special_tokens=True)
```

---

### **Summary**

This guide walks you through finetuning a T5 model on the OPUS Books dataset for English to French translation. We covered dataset loading, preprocessing, training, and evaluation using **SacreBLEU**. Finally, we showed how to use your model for inference, making it easy to translate new text.

---
