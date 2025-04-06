
---

### **Knowledge Distillation for Computer Vision**
Knowledge distillation is a technique where a complex, pre-trained model (teacher) transfers its knowledge to a simpler model (student). The goal is to make the student model learn from the teacher's output, making it more efficient while retaining much of the performance of the teacher.

In this tutorial, we will:
1. Use a fine-tuned **ViT model** as the teacher.
2. Distill this model into a smaller, randomly initialized **MobileNetV2** (the student model).
3. Use Hugging Face's Trainer API for distillation.

### **Libraries Installation**
Before proceeding, install the necessary libraries for distillation and evaluation:
```bash
pip install transformers datasets accelerate tensorboard evaluate --upgrade
```

### **Dataset**
We'll use the **Beans** dataset to fine-tune and test the models.
```python
from datasets import load_dataset

dataset = load_dataset("beans")
```

### **Preprocessing**
We can use the same image processor from the teacher model (ViT). Apply preprocessing to each split of the dataset:
```python
from transformers import AutoImageProcessor
teacher_processor = AutoImageProcessor.from_pretrained("merve/beans-vit-224")

def process(examples):
    processed_inputs = teacher_processor(examples["image"])
    return processed_inputs

processed_datasets = dataset.map(process, batched=True)
```

### **Distillation Process**
We now define a custom trainer to compute the distillation loss using **KL Divergence**. This loss minimizes the difference between the teacher's and student's soft targets.

```python
from transformers import TrainingArguments, Trainer
import torch
import torch.nn as nn
import torch.nn.functional as F
from accelerate.test_utils.testing import get_backend

class ImageDistilTrainer(Trainer):
    def __init__(self, teacher_model=None, student_model=None, temperature=None, lambda_param=None,  *args, **kwargs):
        super().__init__(model=student_model, *args, **kwargs)
        self.teacher = teacher_model
        self.student = student_model
        self.loss_function = nn.KLDivLoss(reduction="batchmean")
        device, _, _ = get_backend()
        self.teacher.to(device)
        self.teacher.eval()
        self.temperature = temperature
        self.lambda_param = lambda_param

    def compute_loss(self, student, inputs, return_outputs=False):
        student_output = self.student(**inputs)

        with torch.no_grad():
          teacher_output = self.teacher(**inputs)

        soft_teacher = F.softmax(teacher_output.logits / self.temperature, dim=-1)
        soft_student = F.log_softmax(student_output.logits / self.temperature, dim=-1)

        distillation_loss = self.loss_function(soft_student, soft_teacher) * (self.temperature ** 2)
        student_target_loss = student_output.loss

        loss = (1. - self.lambda_param) * student_target_loss + self.lambda_param * distillation_loss
        return (loss, student_output) if return_outputs else loss
```

### **Login to Hugging Face Hub**
To push the distilled model, log in to the Hugging Face Hub:
```python
from huggingface_hub import notebook_login
notebook_login()
```

### **Setting Up Models and Training Arguments**
We use the **ViT** model as the teacher and initialize **MobileNetV2** for the student model:
```python
from transformers import AutoModelForImageClassification, MobileNetV2Config, MobileNetV2ForImageClassification

training_args = TrainingArguments(
    output_dir="my-awesome-model",
    num_train_epochs=30,
    fp16=True,
    logging_dir=f"{repo_name}/logs",
    logging_strategy="epoch",
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    report_to="tensorboard",
    push_to_hub=True,
    hub_strategy="every_save",
    hub_model_id=repo_name,
)

num_labels = len(processed_datasets["train"].features["labels"].names)

teacher_model = AutoModelForImageClassification.from_pretrained(
    "merve/beans-vit-224",
    num_labels=num_labels,
    ignore_mismatched_sizes=True
)

student_config = MobileNetV2Config()
student_config.num_labels = num_labels
student_model = MobileNetV2ForImageClassification(student_config)
```

### **Metrics and Evaluation**
To compute accuracy and F1 score, use the **evaluate** library:
```python
import evaluate
import numpy as np

accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    acc = accuracy.compute(references=labels, predictions=np.argmax(predictions, axis=1))
    return {"accuracy": acc["accuracy"]}
```

### **Trainer Initialization**
Now, initialize the **ImageDistilTrainer** with the models, training arguments, and the dataset:
```python
from transformers import DefaultDataCollator

data_collator = DefaultDataCollator()
trainer = ImageDistilTrainer(
    student_model=student_model,
    teacher_model=teacher_model,
    training_args=training_args,
    train_dataset=processed_datasets["train"],
    eval_dataset=processed_datasets["validation"],
    data_collator=data_collator,
    processing_class=teacher_processor,
    compute_metrics=compute_metrics,
    temperature=5,
    lambda_param=0.5
)
```

### **Training and Evaluation**
Train the model:
```python
trainer.train()
```

Evaluate the model:
```python
trainer.evaluate(processed_datasets["test"])
```

### **Results**
The distilled MobileNetV2 model reaches 72% accuracy on the test set, compared to 63% when trained from scratch. This shows the effectiveness of knowledge distillation in transferring knowledge from a more complex teacher model to a simpler student model.

### **Summary**
You have now successfully distilled a **ViT model** into a **MobileNetV2 model** using the knowledge distillation technique in Hugging Face Transformers.

---

