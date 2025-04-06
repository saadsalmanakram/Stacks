### Image-to-Image Task Guide

The **Image-to-Image** task involves taking an input image and producing another output image. This task has several applications, such as image enhancement (e.g., super-resolution, low-light enhancement, deraining), image inpainting, and more.

This guide demonstrates how to:
1. Use an image-to-image pipeline for the **super-resolution** task.
2. Run image-to-image models for the same task without using a pipeline.

Note that, as of now, the image-to-image pipeline supports only **super-resolution** tasks.

### Steps for Image-to-Image Super-Resolution Task

#### 1. Install Necessary Libraries

First, install the `transformers` library:

```bash
pip install transformers
```

#### 2. Initialize the Image-to-Image Pipeline

For the super-resolution task, we will use the **Swin2SR** model, which is designed for image upscaling. You can initialize the pipeline like this:

```python
from transformers import pipeline
import torch
from accelerate.test_utils.testing import get_backend

# Automatically detects the underlying device type (CUDA, CPU, XPU, MPS, etc.)
device, _, _ = get_backend()

# Initialize the pipeline with the Swin2SR model
pipe = pipeline(task="image-to-image", model="caidas/swin2SR-lightweight-x2-64", device=device)
```

#### 3. Load and Inspect the Image

Next, let's load an image for upscaling (super-resolution). For this example, we will use a sample image of a cat:

```python
from PIL import Image
import requests

url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/cat.jpg"
image = Image.open(requests.get(url, stream=True).raw)

print(image.size)  # Output the original image size
```

Output:
```python
# (532, 432)
```

#### 4. Perform Inference with the Pipeline

Now that the pipeline is initialized and the image is loaded, we can run inference and obtain the upscaled version of the image:

```python
upscaled = pipe(image)

# Output the size of the upscaled image
print(upscaled.size)  # Expected Output: (1072, 880)
```

#### 5. Perform Inference Without Using the Pipeline

If you'd like to handle the inference process manually, you can use the **Swin2SRForImageSuperResolution** model and **Swin2SRImageProcessor** to perform the task without the pipeline abstraction.

- **Initialize the model and processor:**

```python
from transformers import Swin2SRForImageSuperResolution, Swin2SRImageProcessor 

# Load the model and processor
model = Swin2SRForImageSuperResolution.from_pretrained("caidas/swin2SR-lightweight-x2-64").to(device)
processor = Swin2SRImageProcessor.from_pretrained("caidas/swin2SR-lightweight-x2-64")
```

- **Preprocess the image:**

To prepare the image for the model, we will use the processor:

```python
pixel_values = processor(image, return_tensors="pt").pixel_values
print(pixel_values.shape)  # Verify the shape

# Move the pixel values to the device (GPU)
pixel_values = pixel_values.to(device)
```

#### 6. Perform Inference

Now, we can pass the preprocessed image to the model for inference:

```python
import torch

with torch.no_grad():
    outputs = model(pixel_values)
```

The output will be an object of type `ImageSuperResolutionOutput`. For example:

```python
(loss=None, reconstruction=tensor([[[[0.8270, 0.8269, 0.8275, ..., 0.7463, 0.7446, 0.7453], ... ]]], device='cuda:0'))
```

#### 7. Post-Process and Visualize the Result

We need to process the output to visualize the upscaled image. The reconstruction tensor must be squeezed, clipped, and converted to an appropriate image format.

- **Post-process the output:**

```python
import numpy as np

# Squeeze the output, move to CPU, and clamp the values
output = outputs.reconstruction.data.squeeze().cpu().clamp_(0, 1).numpy()

# Rearrange the axes to have the correct image shape
output = np.moveaxis(output, source=0, destination=-1)

# Bring values back to the pixel range [0, 255]
output = (output * 255.0).round().astype(np.uint8)

# Convert to a PIL Image
Image.fromarray(output)
```

The final output will be the **upscaled image** (super-resolution) of the original input image.

#### 8. Conclusion

This guide covered how to use the **image-to-image** pipeline for the **super-resolution** task and how to manually process the image using the `Swin2SR` model and processor. The pipeline simplifies the workflow, while manual processing gives you more control over the steps involved in the inference and post-processing.