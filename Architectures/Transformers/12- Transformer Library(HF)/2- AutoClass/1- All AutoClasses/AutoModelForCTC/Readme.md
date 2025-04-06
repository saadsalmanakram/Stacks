
---

### `AutoModelForCTC`
#### Class: `transformers.AutoModelForCTC`

This is a generic model class that will instantiate one of the model classes of the library (with a connectionist temporal classification head) when created with the `from_pretrained()` or `from_config()` class methods. It is designed to handle models used for automatic speech recognition (ASR) tasks based on CTC.

#### Instantiation
This class cannot be instantiated directly using `__init__()`; attempting to do so will result in an error.

---

### `from_config`
#### Method: `AutoModelForCTC.from_config`

```python
AutoModelForCTC.from_config(**kwargs)
```

**Parameters:**
- **config (PretrainedConfig)** — The model class to instantiate is determined based on the configuration class passed to it:
    - **HubertConfig**: Loads `HubertForCTC` (Hubert model).
    - **SEWConfig**: Loads `SEWForCTC` (SEW model).
    - **SEWDConfig**: Loads `SEWDForCTC` (SEW-D model).
    - **UniSpeechConfig**: Loads `UniSpeechForCTC` (UniSpeech model).
    - **UniSpeechSatConfig**: Loads `UniSpeechSatForCTC` (UniSpeechSat model).
    - **Wav2Vec2Config**: Loads `Wav2Vec2ForCTC` (Wav2Vec2 model).

Instantiates one of the model classes of the library (with a CTC head) from the configuration. Note that loading a model from its configuration file does not load the model weights. It only affects the model’s configuration. For loading the model weights, `from_pretrained()` should be used.

**Example:**

```python
from transformers import AutoConfig, AutoModelForCTC
# Download configuration from huggingface.co and cache it
config = AutoConfig.from_pretrained('bert-base-cased')
model = AutoModelForCTC.from_config(config)
```

---

### `from_pretrained`
#### Method: `AutoModelForCTC.from_pretrained`

```python
AutoModelForCTC.from_pretrained(pretrained_model_name_or_path, *model_args, **kwargs)
```

**Parameters:**

- **pretrained_model_name_or_path (str or os.PathLike)** — Specifies the path or name of the pretrained model. This can be:
    - A string that refers to a model hosted on Hugging Face Hub (e.g., `bert-base-uncased`).
    - A directory path containing model weights saved using `save_pretrained()`.
    - A TensorFlow checkpoint file path (e.g., `./tf_model/model.ckpt.index`) if `from_tf=True` is set.
  
- **model_args (optional)** — Additional positional arguments passed to the model’s `__init__()` method.

- **config (PretrainedConfig, optional)** — Configuration for the model. This can be provided explicitly instead of being automatically loaded from the pretrained model.

- **state_dict (Dict[str, torch.Tensor], optional)** — A state dictionary to use in place of the default weights loaded from the saved model. This allows you to load custom weights.

- **cache_dir (optional)** — Directory where the model configuration will be cached.

- **from_tf (bool, optional, default=False)** — Set this to `True` to load the model from a TensorFlow checkpoint.

- **force_download (bool, optional, default=False)** — Whether to force a (re-)download of the model weights and configuration, even if they exist in cache.

- **resume_download (bool, optional, default=False)** — Attempt to resume download if files were incompletely received.

- **proxies (Dict[str, str], optional)** — A dictionary of proxies to use for HTTP requests.

- **output_loading_info (bool, optional, default=False)** — Whether to return additional information about missing or unexpected keys during loading.

- **local_files_only (bool, optional, default=False)** — Set this to `True` to only use local files and avoid downloading from the internet.

- **revision (str, optional, default="main")** — The specific version or branch of the model to load, e.g., a tag, branch, or commit ID.

- **trust_remote_code (bool, optional, default=False)** — Allows loading custom models that define their own classes.

- **kwargs (optional)** — Additional keyword arguments. Can be used to update configuration or pass settings like `output_attentions=True`.

**Example:**

```python
from transformers import AutoConfig, AutoModelForCTC

# Download model and configuration from Hugging Face and cache it
model = AutoModelForCTC.from_pretrained('bert-base-cased')

# Update the configuration during model loading
model = AutoModelForCTC.from_pretrained('bert-base-cased', output_attentions=True)
print(model.config.output_attentions)  # True
```

**Loading from TensorFlow Checkpoint:**

```python
config = AutoConfig.from_pretrained('./tf_model/bert_tf_model_config.json')
model = AutoModelForCTC.from_pretrained('./tf_model/bert_tf_checkpoint.ckpt.index', from_tf=True, config=config)
```

---

### Model Behavior:
- The model is in **evaluation mode** by default (`model.eval()`), which disables dropout layers. To train the model, you need to set it back to training mode (`model.train()`).

**Model Selection Based on Configuration:**
The model class to instantiate is determined by the `model_type` property in the config file:
- **hubert**: `HubertForCTC`
- **sew**: `SEWForCTC`
- **sew-d**: `SEWDForCTC`
- **unispeech**: `UniSpeechForCTC`
- **unispeech-sat**: `UniSpeechSatForCTC`
- **wav2vec2**: `Wav2Vec2ForCTC`

