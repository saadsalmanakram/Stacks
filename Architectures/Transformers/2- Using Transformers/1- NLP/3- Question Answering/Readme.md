
### Libraries Installation
Before you begin, make sure you have all the necessary libraries installed:
```bash
pip install transformers datasets evaluate
```

### Login to Hugging Face
```python
from huggingface_hub import notebook_login
notebook_login()
```

### Load SQuAD Dataset
```python
from datasets import load_dataset

squad = load_dataset("squad", split="train[:5000]")
squad = squad.train_test_split(test_size=0.2)
```

### Preprocess the Data
Load a DistilBERT tokenizer to process the question and context fields.
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
```

Here’s the function to preprocess the data:
```python
def preprocess_function(examples):
    questions = [q.strip() for q in examples["question"]]
    inputs = tokenizer(
        questions,
        examples["context"],
        max_length=384,
        truncation="only_second",
        return_offsets_mapping=True,
        padding="max_length",
    )

    offset_mapping = inputs.pop("offset_mapping")
    answers = examples["answers"]
    start_positions = []
    end_positions = []

    for i, offset in enumerate(offset_mapping):
        answer = answers[i]
        start_char = answer["answer_start"][0]
        end_char = answer["answer_start"][0] + len(answer["text"][0])
        sequence_ids = inputs.sequence_ids(i)

        # Find the start and end of the context
        idx = 0
        while sequence_ids[idx] != 1:
            idx += 1
        context_start = idx
        while sequence_ids[idx] == 1:
            idx += 1
        context_end = idx - 1

        # If the answer is not fully inside the context, label it (0, 0)
        if offset[context_start][0] > end_char or offset[context_end][1] < start_char:
            start_positions.append(0)
            end_positions.append(0)
        else:
            # Otherwise it's the start and end token positions
            idx = context_start
            while idx <= context_end and offset[idx][0] <= start_char:
                idx += 1
            start_positions.append(idx - 1)

            idx = context_end
            while idx >= context_start and offset[idx][1] >= end_char:
                idx -= 1
            end_positions.append(idx + 1)

    inputs["start_positions"] = start_positions
    inputs["end_positions"] = end_positions
    return inputs
```

Apply the preprocessing function:
```python
tokenized_squad = squad.map(preprocess_function, batched=True, remove_columns=squad["train"].column_names)
```

### Data Collator
```python
from transformers import DefaultDataCollator

data_collator = DefaultDataCollator()
```

### Model Training
Finetune DistilBERT for question answering:
```python
from transformers import AutoModelForQuestionAnswering, TrainingArguments, Trainer

model = AutoModelForQuestionAnswering.from_pretrained("distilbert-base-uncased")
```

Set up training arguments:
```python
training_args = TrainingArguments(
    output_dir="my_awesome_qa_model",
    eval_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    push_to_hub=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_squad["train"],
    eval_dataset=tokenized_squad["test"],
    tokenizer=tokenizer,
    data_collator=data_collator,
)

trainer.train()
trainer.push_to_hub()
```

### Inference
For inference, you can use the pipeline API:
```python
from transformers import pipeline

question_answerer = pipeline("question-answering", model="my_awesome_qa_model")
question = "How many programming languages does BLOOM support?"
context = "BLOOM has 176 billion parameters and can generate text in 46 languages natural languages and 13 programming languages."
question_answerer(question=question, context=context)
```

For manual inference:
```python
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch

tokenizer = AutoTokenizer.from_pretrained("my_awesome_qa_model")
inputs = tokenizer(question, context, return_tensors="pt")

model = AutoModelForQuestionAnswering.from_pretrained("my_awesome_qa_model")
with torch.no_grad():
    outputs = model(**inputs)

answer_start_index = outputs.start_logits.argmax()
answer_end_index = outputs.end_logits.argmax()

predict_answer_tokens = inputs.input_ids[0, answer_start_index : answer_end_index + 1]
answer = tokenizer.decode(predict_answer_tokens)
print(answer)
```

