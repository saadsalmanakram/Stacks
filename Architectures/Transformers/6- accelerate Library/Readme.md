
### **Distributed Training with 🤗 Accelerate**
As models grow larger, parallelism is key for training models efficiently, especially when hardware is limited. 🤗 Accelerate was developed to simplify distributed training for 🤗 Transformers models, enabling training on multiple GPUs or across different machines. Here’s how you can leverage 🤗 Accelerate for distributed training.

#### **Setup**

1. **Install 🤗 Accelerate**:
   First, install 🤗 Accelerate to manage distributed setups.

   ```bash
   pip install accelerate
   ```

2. **Import and Initialize the Accelerator**:
   The Accelerator automatically detects your setup (whether it’s a single machine with multiple GPUs or multiple machines) and prepares the necessary components.

   ```python
   from accelerate import Accelerator

   accelerator = Accelerator()
   ```

#### **Preparing for Distributed Training**

3. **Prepare Training Components**:
   You need to prepare the model, optimizer, and DataLoaders using the `accelerator.prepare()` method, which will handle device placement and distribution.

   ```python
   train_dataloader, eval_dataloader, model, optimizer = accelerator.prepare(
       train_dataloader, eval_dataloader, model, optimizer
   )
   ```

#### **Backward Pass**

4. **Replace Loss Backpropagation**:
   When training in a distributed setup, replace the regular `loss.backward()` with `accelerator.backward(loss)`, ensuring the backward pass is correctly handled across multiple devices.

   ```python
   for epoch in range(num_epochs):
       for batch in train_dataloader:
           outputs = model(**batch)
           loss = outputs.loss
           accelerator.backward(loss)

           optimizer.step()
           lr_scheduler.step()
           optimizer.zero_grad()
           progress_bar.update(1)
   ```

This change enables distributed training with minimal effort by adding just a few lines to your training loop.

#### **Example: Full Training Loop with 🤗 Accelerate**

Here's a complete example of setting up a training loop with distributed training support:

```python
from accelerate import Accelerator
from transformers import AdamW, AutoModelForSequenceClassification, get_scheduler
from tqdm import tqdm

# Initialize accelerator
accelerator = Accelerator()

# Load model and optimizer
model = AutoModelForSequenceClassification.from_pretrained(checkpoint, num_labels=2)
optimizer = AdamW(model.parameters(), lr=3e-5)

# Prepare DataLoader and model with accelerator
train_dataloader, eval_dataloader, model, optimizer = accelerator.prepare(
    train_dataloader, eval_dataloader, model, optimizer
)

# Set training parameters
num_epochs = 3
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_scheduler(
    "linear",
    optimizer=optimizer,
    num_warmup_steps=0,
    num_training_steps=num_training_steps
)

# Training loop
progress_bar = tqdm(range(num_training_steps))
model.train()

for epoch in range(num_epochs):
    for batch in train_dataloader:
        outputs = model(**batch)
        loss = outputs.loss
        accelerator.backward(loss)  # Backpropagate using accelerator

        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)
```

#### **Train with a Script**

1. **Configure Accelerator**:
   If running from a script, first run the following command to create and save a configuration file:

   ```bash
   accelerate config
   ```

2. **Launch Training**:
   After configuring, launch the training with:

   ```bash
   accelerate launch train.py
   ```

#### **Train with a Notebook**

If you're using a notebook (like Colaboratory), you can launch the training inside the notebook by wrapping it in a function and passing it to `notebook_launcher`.

```python
from accelerate import notebook_launcher

notebook_launcher(training_function)
```

