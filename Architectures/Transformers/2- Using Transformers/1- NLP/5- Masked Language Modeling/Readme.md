
---

**Masked Language Modeling (MLM)**  
MLM predicts a masked token in a sequence, allowing the model to attend to tokens both on the left and right, making it ideal for tasks requiring contextual understanding. BERT is an example of an MLM.

**Objective**  
This guide will help you:
- Fine-tune **DistilRoBERTa** on the **r/askscience** subset of the **ELI5** dataset.
- Use the finetuned model for inference.

---

### **Prerequisites: Install Libraries**

Install required libraries:

```bash
pip install transformers datasets evaluate
```

Log in to Hugging Face using the following:

```python
from huggingface_hub import notebook_login
notebook_login()
```

---

### **Load ELI5 Dataset**

Begin by loading a subset of 5000 examples from the **ELI5-Category** dataset:

```python
from datasets import load_dataset

eli5 = load_dataset("eli5_category", split="train[:5000]")
```

Next, split the dataset into training and testing:

```python
eli5 = eli5.train_test_split(test_size=0.2)
```

View an example:

```python
eli5["train"][0]
```

Output:

```json
{
  'q_id': '7h191n',
  'title': 'What does the tax bill that was passed today mean? How will it affect Americans in each tax bracket?',
  'category': 'Economics',
  'answers.text': [
    "The tax bill is 500 pages long...",
    "None yet. It has to be reconciled with a vastly different house bill..."
  ],
  ...
}
```

### **Preprocess Data**

1. **Tokenize Text:**

Use **DistilRoBERTa** tokenizer to process the `answers.text` field.

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert/distilroberta-base")
```

Flatten the dataset:

```python
eli5 = eli5.flatten()
```

Define the preprocessing function:

```python
def preprocess_function(examples):
    return tokenizer([" ".join(x) for x in examples["answers.text"]])
```

Apply this function to the dataset:

```python
tokenized_eli5 = eli5.map(
    preprocess_function,
    batched=True,
    num_proc=4,
    remove_columns=eli5["train"].column_names,
)
```

2. **Handle Sequence Length:**

Set `block_size` to 128 and group sequences to fit the model's input size.

```python
block_size = 128

def group_texts(examples):
    concatenated_examples = {k: sum(examples[k], []) for k in examples.keys()}
    total_length = len(concatenated_examples[list(examples.keys())[0]])
    if total_length >= block_size:
        total_length = (total_length // block_size) * block_size
    result = {k: [t[i : i + block_size] for i in range(0, total_length, block_size)] for k, t in concatenated_examples.items()}
    return result
```

Apply the function:

```python
lm_dataset = tokenized_eli5.map(group_texts, batched=True, num_proc=4)
```

---

### **Prepare Data Collator for MLM**

Use the **DataCollatorForLanguageModeling** to dynamically pad sequences during training.

```python
from transformers import DataCollatorForLanguageModeling

tokenizer.pad_token = tokenizer.eos_token
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm_probability=0.15)
```

---

### **Train Model**

1. **Load DistilRoBERTa:**

```python
from transformers import AutoModelForMaskedLM

model = AutoModelForMaskedLM.from_pretrained("distilbert/distilroberta-base")
```

2. **Set Training Arguments:**

```python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="my_awesome_eli5_mlm_model",
    eval_strategy="epoch",
    learning_rate=2e-5,
    num_train_epochs=3,
    weight_decay=0.01,
    push_to_hub=True,
)
```

3. **Initialize Trainer:**

```python
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=lm_dataset["train"],
    eval_dataset=lm_dataset["test"],
    data_collator=data_collator,
    tokenizer=tokenizer,
)

trainer.train()
```

After training, evaluate the model:

```python
import math

eval_results = trainer.evaluate()
print(f"Perplexity: {math.exp(eval_results['eval_loss']):.2f}")
```

Push the model to Hugging Face Hub:

```python
trainer.push_to_hub()
```

---

### **Inference with Finetuned Model**

Use your finetuned model for inference. The goal is to predict the masked token.

Example input:

```python
text = "The Milky Way is a <mask> galaxy."
```

Load your model using the pipeline API:

```python
from transformers import pipeline

mask_filler = pipeline("fill-mask", "username/my_awesome_eli5_mlm_model")
mask_filler(text, top_k=3)
```

Output:

```json
[
  {"score": 0.515, "token_str": "spiral", "sequence": "The Milky Way is a spiral galaxy."},
  {"score": 0.070, "token_str": "massive", "sequence": "The Milky Way is a massive galaxy."},
  {"score": 0.064, "token_str": "small", "sequence": "The Milky Way is a small galaxy."}
]
```

Alternatively, manually process the input:

```python
inputs = tokenizer(text, return_tensors="pt")
mask_token_index = torch.where(inputs["input_ids"] == tokenizer.mask_token_id)[1]
logits = model(**inputs).logits
mask_token_logits = logits[0, mask_token_index, :]
top_3_tokens = torch.topk(mask_token_logits, 3, dim=1).indices[0].tolist()

for token in top_3_tokens:
    print(text.replace(tokenizer.mask_token, tokenizer.decode([token])))
```

---

### **Conclusion**

This process walks through fine-tuning a DistilRoBERTa model for Masked Language Modeling using the ELI5 dataset. You can now use the finetuned model for filling in masked tokens in various texts.
