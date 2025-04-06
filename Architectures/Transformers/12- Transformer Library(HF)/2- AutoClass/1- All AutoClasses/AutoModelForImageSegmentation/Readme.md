
### `AutoModelForImageSegmentation`
```python
class transformers.AutoModelForImageSegmentation
```

This is a generic model class that will be instantiated as one of the model classes of the library (with an image segmentation head) when created with the `from_pretrained()` or `from_config()` class method.

**Note:**  
This class cannot be instantiated directly using `__init__()` (it throws an error).

---

### `from_config`
```python
AutoModelForImageSegmentation.from_config(**kwargs)
```

#### Parameters:
- `config` (PretrainedConfig) — The model class to instantiate is selected based on the configuration class:
  - `DetrConfig` configuration class: `DetrForSegmentation` (DETR model)
  - Instantiates one of the model classes of the library (with an image segmentation head) from a configuration.

**Note:** Loading a model from its configuration file does not load the model weights. It only affects the model’s configuration. Use `from_pretrained()` to load the model weights.

#### Example:
```python
from transformers import AutoConfig, AutoModelForImageSegmentation
# Download configuration from huggingface.co and cache.
config = AutoConfig.from_pretrained('bert-base-cased')
model = AutoModelForImageSegmentation.from_config(config)
```

---

### `from_pretrained`
```python
AutoModelForImageSegmentation.from_pretrained(*model_args, **kwargs)
```

#### Parameters:

- `pretrained_model_name_or_path` (str or os.PathLike) — Can be:
  - A string, the model id of a pretrained model hosted inside a model repo on huggingface.co (e.g., `bert-base-uncased`, or `dbmdz/bert-base-german-cased`).
  - A path to a directory containing model weights saved using `save_pretrained()`, e.g., `./my_model_directory/`.
  - A path or URL to a TensorFlow index checkpoint file (e.g., `./tf_model/model.ckpt.index`). In this case, `from_tf` should be set to `True` and a configuration object should be provided as a `config` argument.

- `model_args` (additional positional arguments, optional) — Will be passed along to the underlying model `__init__()` method.

- `config` (PretrainedConfig, optional) — Configuration for the model to use instead of an automatically loaded configuration.

- `state_dict` (Dict[str, torch.Tensor], optional) — A state dictionary to use instead of a state dictionary loaded from saved weights file.

- `cache_dir` (str or os.PathLike, optional) — Path to a directory in which a downloaded pretrained model configuration should be cached if the standard cache should not be used.

- `from_tf` (bool, optional, defaults to `False`) — Load the model weights from a TensorFlow checkpoint save file.

- `force_download` (bool, optional, defaults to `False`) — Whether or not to force the (re-)download of the model weights and configuration files, overriding the cached versions if they exist.

- `resume_download` (bool, optional, defaults to `False`) — Whether or not to delete incompletely received files and attempt to resume the download.

- `proxies` (Dict[str, str], optional) — A dictionary of proxy servers to use by protocol or endpoint (e.g., `{'http': 'foo.bar:3128', 'http://hostname': 'foo.bar:4012'}`).

- `output_loading_info` (bool, optional, defaults to `False`) — Whether or not to return a dictionary containing missing keys, unexpected keys, and error messages.

- `local_files_only` (bool, optional, defaults to `False`) — Whether or not to only look at local files (e.g., not attempt to download the model).

- `revision` (str, optional, defaults to `"main"`) — The specific model version to use.

- `trust_remote_code` (bool, optional, defaults to `False`) — Whether or not to allow for custom models defined on the Hub in their own modeling files.

- `kwargs` (additional keyword arguments, optional) — Can be used to update the configuration object (after it has been loaded) and initiate the model.

#### Example:
```python
from transformers import AutoConfig, AutoModelForImageSegmentation

# Download model and configuration from huggingface.co and cache.
model = AutoModelForImageSegmentation.from_pretrained('bert-base-cased')

# Update configuration during loading
model = AutoModelForImageSegmentation.from_pretrained('bert-base-cased', output_attentions=True)
print(model.config.output_attentions)  # True

# Loading from a TF checkpoint file instead of a PyTorch model (slower)
config = AutoConfig.from_pretrained('./tf_model/bert_tf_model_config.json')
model = AutoModelForImageSegmentation.from_pretrained('./tf_model/bert_tf_checkpoint.ckpt.index', from_tf=True, config=config)
```