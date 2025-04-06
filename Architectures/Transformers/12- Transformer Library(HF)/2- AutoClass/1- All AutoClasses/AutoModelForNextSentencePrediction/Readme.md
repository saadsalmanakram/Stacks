
---

### `AutoModelForNextSentencePrediction`
#### Class: `transformers.AutoModelForNextSentencePrediction`

This is a generic model class that will be instantiated as one of the model classes of the library (with a next sentence prediction head) when created using the `from_pretrained()` or `from_config()` class methods.

**Important Notes:**
- This class **cannot be instantiated directly** using the `__init__()` method; doing so will result in an error.
- The class is used to load models that perform next sentence prediction tasks (e.g., BERT, MobileBERT, MegatronBERT).
- The model class is selected based on the configuration (e.g., `BertConfig` will load `BertForNextSentencePrediction`).

#### `from_config`
- **config (PretrainedConfig):** This parameter helps instantiate the correct model class based on the configuration (e.g., `BertConfig` for BERT model).
- Instantiates a model with a next sentence prediction head from a configuration. However, it does not load the model weights — use `from_pretrained()` for that.

#### `from_pretrained`
- **pretrained_model_name_or_path (str):** Can be a model ID (e.g., `bert-base-uncased`) or a path to a directory with saved model weights.
- **from_tf (bool):** If `True`, the model is loaded from a TensorFlow checkpoint instead of a PyTorch model.
- **cache_dir (str, optional):** Directory for caching the downloaded model.
- **force_download (bool):** If `True`, it forces the download of the model, bypassing the cache.

**Example Usage:**
```python
from transformers import AutoModelForNextSentencePrediction

# Load pretrained model
model = AutoModelForNextSentencePrediction.from_pretrained('bert-base-cased')

# Load model with additional configuration options
model = AutoModelForNextSentencePrediction.from_pretrained('bert-base-cased', output_attentions=True)
```

---

### `AutoModelForTokenClassification`
#### Class: `transformers.AutoModelForTokenClassification`

This is a generic model class that will be instantiated as one of the model classes of the library (with a token classification head) when created using the `from_pretrained()` or `from_config()` class methods.

**Important Notes:**
- This class **cannot be instantiated directly** using the `__init__()` method; doing so will result in an error.
- The class is used for models designed for token classification tasks, such as Named Entity Recognition (NER).
- The model class is selected based on the configuration (e.g., `BertConfig` will load `BertForTokenClassification`).

#### `from_config`
- **config (PretrainedConfig):** This parameter helps instantiate the correct model class based on the configuration (e.g., `BertConfig` for BERT).
- Instantiates a model with a token classification head from a configuration. However, it does not load the model weights — use `from_pretrained()` for that.

#### `from_pretrained`
- **pretrained_model_name_or_path (str):** Can be a model ID (e.g., `bert-base-uncased`) or a path to a directory with saved model weights.
- **from_tf (bool):** If `True`, the model is loaded from a TensorFlow checkpoint instead of a PyTorch model.
- **cache_dir (str, optional):** Directory for caching the downloaded model.
- **force_download (bool):** If `True`, it forces the download of the model, bypassing the cache.

**Example Usage:**
```python
from transformers import AutoModelForTokenClassification

# Load pretrained model
model = AutoModelForTokenClassification.from_pretrained('bert-base-cased')

# Load model with additional configuration options
model = AutoModelForTokenClassification.from_pretrained('bert-base-cased', output_attentions=True)
```

--- 
