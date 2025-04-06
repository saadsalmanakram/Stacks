# Loading Pretrained Models with AutoClass

Hugging Face's 🤗 Transformers library provides a convenient way to load pretrained models using AutoClasses. Since there are numerous Transformer architectures, manually selecting the correct one for a given checkpoint can be complex. AutoClasses simplify this process by automatically inferring and loading the appropriate architecture from a given checkpoint.

The `from_pretrained()` method allows you to quickly load a pretrained model for any architecture, eliminating the need to train a model from scratch. This approach makes your code **checkpoint-agnostic**, meaning it works with different checkpoints trained for similar tasks, even if the architectures differ.

### Key Concepts
- **Architecture**: The skeletal structure of the model (e.g., BERT, ViT, Swin, LayoutLM).
- **Checkpoint**: The specific trained weights for a given architecture (e.g., `google-bert/bert-base-uncased`).
- **Model**: A general term that may refer to either the architecture or a checkpoint.

This guide covers how to load various pretrained instances, including tokenizers, image processors, feature extractors, processors, and models.

---

## 1. Loading a Pretrained Tokenizer

A **tokenizer** converts raw text into a format that a model can process.

### Example:
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("google-bert/bert-base-uncased")

sequence = "In a hole in the ground there lived a hobbit."
print(tokenizer(sequence))
```
**Output:**
```json
{
  "input_ids": [101, 1999, 1037, 4920, 1999, 1996, 2598, 2045, 2973, 1037, 7570, 10322, 4183, 1012, 102],
  "token_type_ids": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "attention_mask": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}
```

---

## 2. Loading a Pretrained Image Processor

For vision tasks, an **image processor** converts images into a format compatible with Transformer models.

### Example:
```python
from transformers import AutoImageProcessor

image_processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
```

---

## 3. Loading a Pretrained Model as a Backbone

AutoBackbone allows the extraction of feature maps from different model stages.

### Example:
```python
from transformers import AutoImageProcessor, AutoBackbone
import torch
from PIL import Image
import requests

# Load an example image
url = "http://images.cocodataset.org/val2017/000000039769.jpg"
image = Image.open(requests.get(url, stream=True).raw)

processor = AutoImageProcessor.from_pretrained("microsoft/swin-tiny-patch4-window7-224")
model = AutoBackbone.from_pretrained("microsoft/swin-tiny-patch4-window7-224", out_indices=(1,))

inputs = processor(image, return_tensors="pt")
outputs = model(**inputs)
feature_maps = outputs.feature_maps

print(list(feature_maps[0].shape))  # Output: [1, 96, 56, 56]
```

---

## 4. Loading a Pretrained Feature Extractor (for Audio Tasks)

A **feature extractor** processes raw audio signals into a format suitable for a model.

### Example:
```python
from transformers import AutoFeatureExtractor

feature_extractor = AutoFeatureExtractor.from_pretrained(
    "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
)
```

---

## 5. Loading a Pretrained Processor (for Multimodal Tasks)

A **processor** combines different preprocessing tools (e.g., an image processor + a tokenizer).

### Example:
```python
from transformers import AutoProcessor

processor = AutoProcessor.from_pretrained("microsoft/layoutlmv2-base-uncased")
```

---

## 6. Loading a Pretrained Model for Specific Tasks

Pretrained models can be loaded for different tasks using **AutoModelFor classes**.

### Example: Loading a Model for Sequence Classification
```python
from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("distilbert/distilbert-base-uncased", torch_dtype="auto")
```

### Example: Loading a Model for Token Classification
```python
from transformers import AutoModelForTokenClassification

model = AutoModelForTokenClassification.from_pretrained("distilbert/distilbert-base-uncased", torch_dtype="auto")
```

---

## 7. Security Considerations

- PyTorch models use `torch.load()`, which internally relies on `pickle`, a known security risk.
- Avoid loading models from untrusted sources.
- Hugging Face Hub mitigates this risk by scanning public models for malware.
- **TensorFlow** and **Flax** checkpoints are not affected by this issue.

---

## 8. Loading Models in TensorFlow

Hugging Face also supports TensorFlow through **TFAutoModelFor classes**.

### Example:
```python
from transformers import TFAutoModelForSequenceClassification

model = TFAutoModelForSequenceClassification.from_pretrained("distilbert/distilbert-base-uncased")
```

### Example: Loading a Model for Token Classification
```python
from transformers import TFAutoModelForTokenClassification

model = TFAutoModelForTokenClassification.from_pretrained("distilbert/distilbert-base-uncased")
```

---

## Conclusion

For best practices, always use `AutoTokenizer` and `AutoModelFor` classes to ensure compatibility across different architectures and checkpoints. This tutorial provided examples of loading pretrained tokenizers, image processors, feature extractors, processors, and models for various tasks. In the next tutorial, you'll learn how to preprocess a dataset for fine-tuning using these components.