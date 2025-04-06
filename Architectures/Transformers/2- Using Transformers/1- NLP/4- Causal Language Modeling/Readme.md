
### Causal Language Modeling with DistilGPT2 on ELI5 dataset

#### 1. Install Necessary Libraries
```bash
pip install transformers datasets evaluate
```

#### 2. Login to Hugging Face
```python
from huggingface_hub import notebook_login

notebook_login()
```

#### 3. Load the ELI5 Dataset
```python
from datasets import load_dataset

eli5 = load_dataset("eli5_category", split="train[:5000]")
eli5 = eli5.train_test_split(test_size=0.2)
```

#### 4. Preprocessing the Data
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert/distilgpt2")

# Flatten the dataset
eli5 = eli5.flatten()

# Preprocessing function
def preprocess_function(examples):
    return tokenizer([" ".join(x) for x in examples["answers.text"]])

# Tokenize dataset
tokenized_eli5 = eli5.map(
    preprocess_function,
    batched=True,
    num_proc=4,
    remove_columns=eli5["train"].column_names,
)
```

#### 5. Group the Texts into Chunks
```python
block_size = 128

def group_texts(examples):
    concatenated_examples = {k: sum(examples[k], []) for k in examples.keys()}
    total_length = len(concatenated_examples[list(examples.keys())[0]])
    
    if total_length >= block_size:
        total_length = (total_length // block_size) * block_size
        
    result = {
        k: [t[i : i + block_size] for i in range(0, total_length, block_size)]
        for k, t in concatenated_examples.items()
    }
    result["labels"] = result["input_ids"].copy()
    return result

lm_dataset = tokenized_eli5.map(group_texts, batched=True, num_proc=4)
```

#### 6. Data Collator for Language Modeling
```python
from transformers import DataCollatorForLanguageModeling

tokenizer.pad_token = tokenizer.eos_token
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
```

#### 7. Initialize Model and Training
```python
from transformers import AutoModelForCausalLM, TrainingArguments, Trainer

model = AutoModelForCausalLM.from_pretrained("distilbert/distilgpt2")

training_args = TrainingArguments(
    output_dir="my_awesome_eli5_clm-model",
    eval_strategy="epoch",
    learning_rate=2e-5,
    weight_decay=0.01,
    push_to_hub=True,
)

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

#### 8. Evaluate Model
```python
import math

eval_results = trainer.evaluate()
print(f"Perplexity: {math.exp(eval_results['eval_loss']):.2f}")
```

#### 9. Push the Model to Hugging Face Hub
```python
trainer.push_to_hub()
```

#### 10. Inference with the Model
```python
from transformers import pipeline

prompt = "Somatic hypermutation allows the immune system to"

generator = pipeline("text-generation", model="username/my_awesome_eli5_clm-model")
generated_text = generator(prompt)

print(generated_text)
```

#### 11. Tokenize Input and Generate Text
```python
from transformers import AutoModelForCausalLM

inputs = tokenizer(prompt, return_tensors="pt").input_ids

# Generate text
outputs = model.generate(inputs, max_new_tokens=100, do_sample=True, top_k=50, top_p=0.95)

# Decode the output
generated_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)
print(generated_text)
```

