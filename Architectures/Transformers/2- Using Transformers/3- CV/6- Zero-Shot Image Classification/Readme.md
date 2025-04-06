### Zero-Shot Image Classification

Zero-shot image classification allows models to classify images into categories they weren't explicitly trained on, without needing additional training data. Unlike traditional image classification, where models are trained on a fixed set of labeled images, zero-shot classification leverages models that can generalize to new, unseen categories using textual descriptions.

### Traditional vs Zero-Shot Classification

In traditional image classification:
- The model is trained on images with specific labels.
- It learns to associate features in images with those labels.
- To classify new categories, the model needs to be fine-tuned on labeled examples of those categories.

In contrast, zero-shot classification:
- Uses a model trained on a large dataset of images paired with descriptive text.
- The model learns representations that connect vision and language, enabling it to classify images based on free-text descriptions.
- This allows the model to generalize to new classes without needing additional labeled training data.

### Key Benefits
- **Flexibility:** Can classify images into categories without additional fine-tuning.
- **Open Vocabulary:** Uses textual descriptions to classify objects, allowing for flexible, free-form queries.

### Steps for Zero-Shot Image Classification

1. **Install necessary libraries:**

   To begin, install the necessary libraries:

   ```bash
   pip install -q "transformers[torch]" pillow
   ```

2. **Create a Zero-Shot Image Classification Pipeline:**

   The simplest way to perform zero-shot image classification is to use a pre-built pipeline:

   ```python
   from transformers import pipeline

   checkpoint = "openai/clip-vit-large-patch14"
   classifier = pipeline(model=checkpoint, task="zero-shot-image-classification")
   ```

3. **Select an Image:**

   Choose an image to classify. For example, here's an image of an owl:

   ```python
   from PIL import Image
   import requests

   url = "https://unsplash.com/photos/g8oS8-82DxI/download?ixid=MnwxMjA3fDB8MXx0b3BpY3x8SnBnNktpZGwtSGt8fHx8fDJ8fDE2NzgxMDYwODc&force=true&w=640"
   image = Image.open(requests.get(url, stream=True).raw)
   ```

4. **Classify the Image:**

   Provide candidate labels for the model to predict, and pass them along with the image to the pipeline:

   ```python
   predictions = classifier(image, candidate_labels=["fox", "bear", "seagull", "owl"])
   ```

   Example output:
   ```python
   [{'score': 0.9996670484542847, 'label': 'owl'},
    {'score': 0.000199399160919711, 'label': 'seagull'},
    {'score': 7.392891711788252e-05, 'label': 'fox'},
    {'score': 5.96074532950297e-05, 'label': 'bear'}]
   ```

### Zero-Shot Image Classification Manually

To run zero-shot image classification manually:

1. **Load Model and Processor:**

   Load the model and processor from Hugging Face:

   ```python
   from transformers import AutoProcessor, AutoModelForZeroShotImageClassification

   model = AutoModelForZeroShotImageClassification.from_pretrained(checkpoint)
   processor = AutoProcessor.from_pretrained(checkpoint)
   ```

2. **Prepare the Image:**

   For a different image, here’s a photo of a car:

   ```python
   url = "https://unsplash.com/photos/xBRQfR2bqNI/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjc4Mzg4ODEx&force=true&w=640"
   image = Image.open(requests.get(url, stream=True).raw)
   ```

3. **Prepare Candidate Labels:**

   Format the labels for the classification task:

   ```python
   candidate_labels = ["tree", "car", "bike", "cat"]
   candidate_labels = [f'This is a photo of {label}.' for label in candidate_labels]
   inputs = processor(images=image, text=candidate_labels, return_tensors="pt", padding=True)
   ```

4. **Run the Model and Post-Process the Results:**

   Pass the prepared inputs through the model and post-process the results:

   ```python
   import torch

   with torch.no_grad():
       outputs = model(**inputs)

   logits = outputs.logits_per_image[0]
   probs = logits.softmax(dim=-1).numpy()
   scores = probs.tolist()

   result = [
       {"score": score, "label": candidate_label}
       for score, candidate_label in sorted(zip(probs, candidate_labels), key=lambda x: -x[0])
   ]

   result
   ```

   Example output:
   ```python
   [{'score': 0.998572, 'label': 'car'},
    {'score': 0.0010570387, 'label': 'bike'},
    {'score': 0.0003393686, 'label': 'tree'},
    {'score': 3.1572064e-05, 'label': 'cat'}]
   ```

By using this approach, you can classify images into categories, even those the model hasn't seen during training, using free-text descriptions.