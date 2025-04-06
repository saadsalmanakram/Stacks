### Monocular Depth Estimation

Monocular depth estimation is the task of predicting depth information (distance of objects from the camera) from a single image. This involves estimating how far objects are in a scene, which has applications in 3D reconstruction, augmented reality, autonomous driving, and robotics.

### Key Concepts

1. **Absolute Depth Estimation:**
   - Provides exact depth measurements (in meters or feet).
   - Outputs a depth map with numerical values representing real-world distances.

2. **Relative Depth Estimation:**
   - Predicts the depth order (closer or farther) of objects without precise measurements.
   - Outputs a depth map that shows the relative distances between objects.

### Depth Estimation Models
- **Depth Anything V2:** A zero-shot relative depth estimation model.
- **ZoeDepth:** An absolute depth estimation model.

### Steps for Depth Estimation

#### 1. Install the latest version of Transformers:

To get started, install the latest version of the `transformers` library:

```bash
pip install -q -U transformers
```

#### 2. Depth Estimation Pipeline

You can easily try out depth estimation using the pipeline function from Hugging Face.

- **Load the model and create the pipeline:**

```python
from transformers import pipeline
import torch
from accelerate.test_utils.testing import get_backend

# Automatically detects the underlying device type (CUDA, CPU, XPU, MPS, etc.)
device, _, _ = get_backend()
checkpoint = "depth-anything/Depth-Anything-V2-base-hf"
pipe = pipeline("depth-estimation", model=checkpoint, device=device)
```

- **Choose an image:**

For example, use an image of a bee:

```python
from PIL import Image
import requests

url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/bee.jpg"
image = Image.open(requests.get(url, stream=True).raw)
```

- **Run the depth estimation:**

```python
predictions = pipe(image)
```

The pipeline returns a dictionary with two entries:
1. `predicted_depth`: A tensor with the depth values in meters for each pixel.
2. `depth`: A PIL image visualizing the depth estimation.

- **Visualize the result:**

```python
predictions["depth"]
```

#### 3. Depth Estimation Inference by Hand

If you want to replicate the depth estimation manually:

- **Load the model and processor for ZoeDepth (absolute depth model):**

```python
from transformers import AutoImageProcessor, AutoModelForDepthEstimation

checkpoint = "Intel/zoedepth-nyu-kitti"

image_processor = AutoImageProcessor.from_pretrained(checkpoint)
model = AutoModelForDepthEstimation.from_pretrained(checkpoint).to(device)
```

- **Prepare the image:**

The image processor will handle necessary transformations such as resizing and normalization:

```python
pixel_values = image_processor(image, return_tensors="pt").pixel_values.to(device)
```

- **Run the model:**

```python
import torch

with torch.no_grad():
    outputs = model(pixel_values)
```

- **Post-process the output:**

Remove padding and resize the depth map to match the original image size:

```python
# ZoeDepth dynamically pads the input image. Pass the original image size to resize it.
post_processed_output = image_processor.post_process_depth_estimation(
    outputs,
    source_sizes=[(image.height, image.width)],
)

predicted_depth = post_processed_output[0]["predicted_depth"]
depth = (predicted_depth - predicted_depth.min()) / (predicted_depth.max() - predicted_depth.min())
depth = depth.detach().cpu().numpy() * 255
depth = Image.fromarray(depth.astype("uint8"))
```

- **Visualize the depth map:**

```python
depth.show()
```

#### 4. Additional Step (for ZoeDepth Model)

ZoeDepth model performs inference on both the original and flipped images, and averages out the results. You can use the following approach:

```python
with torch.no_grad():
    outputs = model(pixel_values)
    outputs_flipped = model(pixel_values=torch.flip(pixel_values, dims=[3]))

post_processed_output = image_processor.post_process_depth_estimation(
    outputs,
    source_sizes=[(image.height, image.width)],
    outputs_flipped=outputs_flipped,
)
```

This approach improves the accuracy of depth estimation by incorporating both orientations of the input image.

#### Conclusion

Monocular depth estimation models such as Depth Anything V2 and ZoeDepth can provide either relative or absolute depth predictions, depending on the task at hand. You can use Hugging Face's pre-trained models and pipelines to easily run inference for depth estimation, or you can process the results manually for more control over the process.