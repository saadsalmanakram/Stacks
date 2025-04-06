### `AutoModelForMaskedLM`

The `AutoModelForMaskedLM` class in the Hugging Face `transformers` library is a generic model class designed to be instantiated with a masked language modeling head. This class cannot be directly instantiated using the `__init__()` method. Instead, it can be created via the `from_pretrained()` or `from_config()` class methods. These methods will select the appropriate model class based on the configuration or pretrained model name.

#### `from_config` Method

The `from_config` method instantiates one of the model classes for masked language modeling based on the provided configuration (`PretrainedConfig`).

- **Parameters:**
  - `config (PretrainedConfig)`: The configuration object that dictates which model class to instantiate. Examples of model configurations include `BertConfig`, `DistilBertConfig`, `RoBertaConfig`, etc.

- **Example Usage:**

```python
from transformers import AutoConfig, AutoModelForMaskedLM

# Download configuration from huggingface.co
config = AutoConfig.from_pretrained('bert-base-cased')

# Instantiate model from configuration
model = AutoModelForMaskedLM.from_config(config)
```

This method only affects the model’s configuration and does **not** load model weights. To load the model weights, use the `from_pretrained()` method.

#### `from_pretrained` Method

The `from_pretrained` method instantiates a model using weights from a pretrained model. The class for the model is selected based on the configuration’s `model_type` property. If the configuration is unavailable, the `pretrained_model_name_or_path` string is used to determine the model type.

- **Parameters:**
  - `pretrained_model_name_or_path (str or os.PathLike)`: A string representing either the model id (e.g., `bert-base-uncased`) or a local path containing model weights (e.g., `./my_model_directory/`).
  - `model_args (additional positional arguments, optional)`: Arguments passed to the model's `__init__()` method.
  - `config (PretrainedConfig, optional)`: A configuration object to override the default configuration.
  - `state_dict (Dict[str, torch.Tensor], optional)`: A state dictionary to load instead of the one saved with the pretrained model.
  - `cache_dir (str or os.PathLike, optional)`: Directory to cache the model and configuration files.
  - `from_tf (bool, optional)`: Flag to indicate if the model should be loaded from a TensorFlow checkpoint (use with `config`).
  - `force_download (bool, optional)`: Flag to force re-downloading the model files.
  - `resume_download (bool, optional)`: Resume download if the previous attempt was incomplete.
  - `proxies (Dict[str, str], optional)`: Proxy servers for network requests.
  - `output_loading_info (bool, optional)`: Whether to return a dictionary with loading info such as missing or unexpected keys.
  - `local_files_only (bool, optional)`: Flag to only look for models in local directories.
  - `revision (str, optional)`: The specific version or branch of the model to use (default is `"main"`).
  - `trust_remote_code (bool, optional)`: Flag to allow custom models defined in remote repositories.

- **Example Usage:**

```python
from transformers import AutoModelForMaskedLM

# Download and cache pretrained model
model = AutoModelForMaskedLM.from_pretrained('bert-base-cased')

# Modify configuration during loading
model = AutoModelForMaskedLM.from_pretrained('bert-base-cased', output_attentions=True)
print(model.config.output_attentions)  # True

# Load model from a TensorFlow checkpoint
model = AutoModelForMaskedLM.from_pretrained('./tf_model/bert_tf_checkpoint.ckpt.index', from_tf=True)
```

### Model Selection Based on Configuration

The model class to instantiate depends on the model’s configuration (`config` object). The following are some common model names and their corresponding model classes for masked language modeling:

- `bert` — `BertForMaskedLM` (BERT model)
- `roberta` — `RobertaForMaskedLM` (RoBERTa model)
- `distilbert` — `DistilBertForMaskedLM` (DistilBERT model)
- `albert` — `AlbertForMaskedLM` (ALBERT model)
- `electra` — `ElectraForMaskedLM` (ELECTRA model)
- `longformer` — `LongformerForMaskedLM` (Longformer model)
- `camembert` — `CamembertForMaskedLM` (CamemBERT model)
- `xlnet` — `XLNetForMaskedLM` (XLNet model)

### Setting Model to Evaluation Mode

By default, models are set to evaluation mode using `model.eval()` during loading, which deactivates modules like dropout. If you need to fine-tune the model, you can switch it to training mode using `model.train()`.