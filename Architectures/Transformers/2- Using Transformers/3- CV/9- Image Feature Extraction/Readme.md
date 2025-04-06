### Image Feature Extraction Guide

**Image feature extraction** refers to the task of extracting semantically meaningful features from an image. These features can represent important aspects of the image, such as edges, corners, or objects, and are crucial for tasks like image similarity, retrieval, and even training new classifiers.

In this guide, we will:
1. Build a simple image similarity system using the **image-feature-extraction pipeline**.
2. Accomplish the same task using **bare model inference**.

### Image Similarity Using Image-Feature-Extraction Pipeline

#### 1. Load Images

We will use two images of cats for this example—one real and one generated.

```python
from PIL import Image
import requests

# URLs of the two images
img_urls = [
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.png", 
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/cats.jpeg"
]

# Load the images
image_real = Image.open(requests.get(img_urls[0], stream=True).raw).convert("RGB")
image_gen = Image.open(requests.get(img_urls[1], stream=True).raw).convert("RGB")
```

#### 2. Initialize the Image Feature Extraction Pipeline

We will use the **ViT (Vision Transformer)** model for feature extraction. The pipeline will be automatically initialized with the model `google/vit-base-patch16-384`. To compute similarity, we will enable pooling by setting `pool=True`.

```python
import torch
from transformers import pipeline
from accelerate.test_utils.testing import get_backend

# Automatically detect the underlying device (CUDA, CPU, XPU, MPS, etc.)
DEVICE, _, _ = get_backend()

# Initialize the image-feature-extraction pipeline with the ViT model
pipe = pipeline(task="image-feature-extraction", model_name="google/vit-base-patch16-384", device=DEVICE, pool=True)
```

#### 3. Perform Feature Extraction

We pass both images to the pipeline, which returns pooled embeddings for each image.

```python
# Get the features for both images
outputs = pipe([image_real, image_gen])

# Check the length of a single output (feature vector size)
print(len(outputs[0][0]))  # Output: 768
print(outputs)  # Show the features for both images
```

#### 4. Calculate Similarity

To compare the similarity between the images, we can compute the **cosine similarity** between their feature embeddings.

```python
from torch.nn.functional import cosine_similarity

# Calculate the cosine similarity between the two embeddings
similarity_score = cosine_similarity(torch.Tensor(outputs[0]), torch.Tensor(outputs[1]), dim=1)

print(similarity_score)  # Output will be a tensor with similarity score, e.g., tensor([0.6043])
```

#### 5. Extract Features Without Pooling

If you prefer to get the last hidden states instead of pooled embeddings (which can be useful for training new classifiers), simply omit the `pool` parameter.

```python
# Initialize the pipeline without pooling
pipe = pipeline(task="image-feature-extraction", model_name="google/vit-base-patch16-224", device=DEVICE)

# Get unpooled features (last hidden states)
outputs = pipe(image_real)

# Check the shape of the outputs
import numpy as np
print(np.array(outputs).shape)  # Output: (1, 197, 768)
```

### Getting Features and Similarities Using AutoModel

We can also use the **AutoModel** class from Hugging Face to load any transformer model without its task-specific head. This allows us to extract the features directly.

#### 1. Initialize the Model and Processor

We load the processor and model, which will handle the image processing and feature extraction.

```python
from transformers import AutoImageProcessor, AutoModel

# Load the processor and model
processor = AutoImageProcessor.from_pretrained("google/vit-base-patch16-224")
model = AutoModel.from_pretrained("google/vit-base-patch16-224").to(DEVICE)
```

#### 2. Define a Function for Inference

We'll define a simple inference function that takes an image, processes it, and returns the pooled output embeddings.

```python
def infer(image):
    # Process the image
    inputs = processor(image, return_tensors="pt").to(DEVICE)
    
    # Get the model's output (features)
    outputs = model(**inputs)
    
    return outputs.pooler_output
```

#### 3. Perform Inference and Calculate Similarity

Now, we can directly pass the images to this function and compute the similarity.

```python
# Get embeddings for both images
embed_real = infer(image_real)
embed_gen = infer(image_gen)

# Calculate cosine similarity between the embeddings
similarity_score = cosine_similarity(embed_real, embed_gen, dim=1)

print(similarity_score)  # Output will be a similarity score, e.g., tensor([0.6061], device='cuda:0')
```

### Conclusion

This guide demonstrates how to perform **image feature extraction** using both the Hugging Face **image-feature-extraction pipeline** and **bare model inference**. We also built a simple image similarity system by comparing the embeddings of two images using cosine similarity. Whether you use the pipeline for simplicity or raw model inference for more control, both methods enable powerful feature extraction for a variety of computer vision tasks.