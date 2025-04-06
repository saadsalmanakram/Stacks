
---

### `AutoModelForVision2Seq`
**Class:** `transformers.AutoModelForVision2Seq`  
This class is designed for models that perform vision-to-text tasks (such as image captioning or image-to-text generation). It serves as a generic class that dynamically loads the appropriate model with a vision-to-text head based on the configuration or pretrained weights.

This class **cannot be instantiated directly using `__init__()`**. Instead, it is instantiated through the `from_pretrained()` or `from_config()` methods.

---

### `from_config`
```python
AutoModelForVision2Seq.from_config(config, **kwargs)
```

**Parameters:**

- `config` (PretrainedConfig): This parameter is used to select which model class to instantiate based on the configuration class. The model class is determined by the configuration file:
  - `VisionEncoderDecoderConfig`: This configuration class instantiates the `VisionEncoderDecoderModel`, which is the core vision-to-text model.

**Note:** Loading a model from its configuration file **does not load model weights**; it only affects the model’s architecture configuration. To load the model weights, use `from_pretrained()`.

**Example:**

```python
from transformers import AutoConfig, AutoModelForVision2Seq

# Download configuration from huggingface.co and cache it locally.
config = AutoConfig.from_pretrained('vision-encoder-decoder-config')
model = AutoModelForVision2Seq.from_config(config)
```

---

### `from_pretrained`
```python
AutoModelForVision2Seq.from_pretrained(pretrained_model_name_or_path, *model_args, **kwargs)
```

**Parameters:**

- `pretrained_model_name_or_path` (str or os.PathLike): This can be:
  - A string representing the model ID of a pretrained model hosted on Hugging Face's model hub (e.g., `bert-base-uncased`).
  - A path to a local directory containing model weights saved using the `save_pretrained()` method.
  - A path or URL to a TensorFlow checkpoint file (if using TensorFlow model checkpoints, the `from_tf` parameter should be set to `True`).
  
- `model_args` (additional positional arguments, optional): These arguments are passed to the underlying model's `__init__()` method.

- `config` (PretrainedConfig, optional): If specified, this configuration will override the default configuration loaded from the pretrained model.

- `state_dict` (dict[str, torch.Tensor], optional): A state dictionary to initialize the model weights.

- `cache_dir` (str or os.PathLike, optional): A custom path for caching the downloaded model configuration.

- `from_tf` (bool, optional, defaults to `False`): Set to `True` if the model weights are being loaded from a TensorFlow checkpoint.

- `force_download` (bool, optional, defaults to `False`): If `True`, it will force the download of the model weights and configuration, bypassing any cached versions.

- `resume_download` (bool, optional, defaults to `False`): Allows resuming the download of a model if the download was interrupted.

- `proxies` (dict[str, str], optional): A dictionary for proxy settings.

- `output_loading_info` (bool, optional, defaults to `False`): If set to `True`, it will return a dictionary containing information about missing or unexpected keys in the model weights.

- `local_files_only` (bool, optional, defaults to `False`): If `True`, it will search for the model only in local directories, preventing any downloads.

- `revision` (str, optional, defaults to `"main"`): Specifies the model version to use.

- `trust_remote_code` (bool, optional, defaults to `False`): If `True`, it allows for loading custom models from the model hub.

- `kwargs` (additional keyword arguments, optional): Passed to either the configuration or model’s `__init__()` method, depending on whether a configuration is provided.

**Note:** The model is set to evaluation mode (`model.eval()`) by default when using `from_pretrained()`. You must call `model.train()` if you want to fine-tune the model.

**Example 1:**

```python
from transformers import AutoModelForVision2Seq

# Download the pretrained model and its configuration from Hugging Face
model = AutoModelForVision2Seq.from_pretrained('vision-encoder-decoder-model')

# Optionally update the configuration during loading
model = AutoModelForVision2Seq.from_pretrained('vision-encoder-decoder-model', output_attentions=True)
```

**Example 2:**

```python
from transformers import AutoConfig, AutoModelForVision2Seq

# Load model from a TensorFlow checkpoint file
config = AutoConfig.from_pretrained('./tf_model/vision_encoder_decoder_config.json')
model = AutoModelForVision2Seq.from_pretrained('./tf_model/vision_encoder_decoder_checkpoint.ckpt.index', from_tf=True, config=config)
```

---

### Model Class Selection
- The class of the model is determined by the `model_type` property found in the configuration. Based on this, the appropriate model is instantiated. For the vision-to-text task, it defaults to using the **Vision Encoder-Decoder Model** if the configuration type is `vision-encoder-decoder`.

---

### Key Considerations:
- The model is **set to evaluation mode** by default (`model.eval()`), which disables certain features like dropout. Make sure to call `model.train()` if you're planning to fine-tune the model.
  
---

### Summary:
`AutoModelForVision2Seq` is an abstract class that allows you to load pretrained models with a vision-to-text head, like image captioning models, from Hugging Face's model hub or a local directory. Use `from_config()` to load the configuration or `from_pretrained()` to load both the configuration and the weights.