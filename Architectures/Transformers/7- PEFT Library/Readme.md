
### PEFT Overview
PEFT methods freeze the pretrained model parameters during fine-tuning and add a small number of trainable parameters, called *adapters*, on top of them. The adapters are trained to learn task-specific information. This technique is memory-efficient with lower computational usage while yielding results comparable to a fully fine-tuned model. 

Adapters are much smaller than the full model, making them easier to share, store, and load. For instance, the adapter weights for an `OPTForCausalLM` model stored on the Hub are only about 6MB, compared to the full model size of ~700MB.

### Install PEFT
To get started with 🤗 PEFT, install it via pip:
```bash
pip install peft
```

To try out new features, install from source:
```bash
pip install git+https://github.com/huggingface/peft.git
```

### Supported PEFT Models
🤗 Transformers supports several PEFT methods, including:
- Low Rank Adapters (LoRA)
- IA3
- AdaLoRA

### Load a PEFT Adapter
To load and use a PEFT adapter model:
1. Specify the PEFT model ID.
2. Pass it to the `AutoModelForCausalLM` class.

Example:
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

peft_model_id = "ybelkada/opt-350m-lora"
model = AutoModelForCausalLM.from_pretrained(peft_model_id)
```

Alternatively, you can use `load_adapter()`:
```python
model_id = "facebook/opt-350m"
peft_model_id = "ybelkada/opt-350m-lora"

model = AutoModelForCausalLM.from_pretrained(model_id)
model.load_adapter(peft_model_id)
```

### Load in 8bit or 4bit Precision
To save memory when loading large models, you can use 8bit or 4bit precision with the `bitsandbytes` integration:
```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

peft_model_id = "ybelkada/opt-350m-lora"
model = AutoModelForCausalLM.from_pretrained(peft_model_id, quantization_config=BitsAndBytesConfig(load_in_8bit=True))
```

### Add a New Adapter
If you already have an adapter attached, you can add a new adapter of the same type (e.g., LoRA):
```python
from peft import LoraConfig
from transformers import AutoModelForCausalLM

model_id = "facebook/opt-350m"
model = AutoModelForCausalLM.from_pretrained(model_id)

lora_config = LoraConfig(target_modules=["q_proj", "k_proj"], init_lora_weights=False)
model.add_adapter(lora_config, adapter_name="adapter_1")
```

### Enable and Disable Adapters
To enable or disable an adapter:
```python
# Enable adapter
model.enable_adapters()

# Disable adapter
model.disable_adapters()
```

### Train a PEFT Adapter
PEFT adapters can be trained using the Trainer class:
```python
from peft import LoraConfig
from transformers import Trainer

# Define adapter configuration
peft_config = LoraConfig(
    lora_alpha=16,
    lora_dropout=0.1,
    r=64,
    bias="none",
    task_type="CAUSAL_LM",
)

model.add_adapter(peft_config)

# Train with Trainer
trainer = Trainer(model=model, ...)
trainer.train()
```

### API Documentation for Key Methods
Here are some essential methods to interact with PEFT:

1. **`load_adapter`**: Load adapter weights from a local path or remote Hub repository.
2. **`add_adapter`**: Add a new adapter to the model.
3. **`set_adapter`**: Set which adapter to use.
4. **`disable_adapters`**: Disable all adapters, using the base model.
5. **`enable_adapters`**: Enable adapters that are attached.
6. **`active_adapters`**: Get the list of current active adapters.
7. **`get_adapter_state_dict`**: Get the state dict of the active adapter.

For further information, refer to the [PEFT official documentation](https://huggingface.co/docs/peft).

### Example of Working with Adapters
You can switch between different adapters for multi-task learning by enabling or disabling them as needed. Additionally, you can save and load adapters for reusability across different models or tasks.

For detailed examples, please consult the full [PEFT Guide](https://huggingface.co/docs/peft).