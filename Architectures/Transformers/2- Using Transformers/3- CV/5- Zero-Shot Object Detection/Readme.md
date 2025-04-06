### Zero-Shot Object Detection

Object detection models typically need labeled image datasets to train on, and they are confined to recognizing only the objects from the dataset used for training. **Zero-shot object detection** introduces an innovative approach where models can detect objects without being trained on specific labeled datasets. One such model is **OWL-ViT** (Open-Vocabulary Vision Transformer), which allows detection based on free-text descriptions, thus offering **open-vocabulary object detection**.

### How OWL-ViT Works

OWL-ViT leverages multi-modal representations, combining **CLIP** (Contrastive Language-Image Pretraining) with lightweight object classification and localization heads. Here's how it works:

- **CLIP** uses text and image embeddings to link textual descriptions and images.
- **ViT** (Vision Transformer) processes image patches, while CLIP's text encoder handles free-text queries.
- OWL-ViT enables object detection by embedding textual descriptions into CLIP’s text encoder and passing these along with the image to the model. This allows the model to detect objects based on the text, without needing labeled images.

The model is first trained with CLIP, then fine-tuned using object detection datasets with a bipartite matching loss function, making it suitable for detecting objects from textual descriptions even without prior training on specific datasets.

### Using OWL-ViT for Object Detection

To begin using OWL-ViT for zero-shot object detection, follow these steps:

1. **Install Necessary Libraries:**
   Install the required libraries for the task.

   ```bash
   pip install -q transformers
   ```

2. **Setup the Pipeline for Zero-Shot Detection:**
   The easiest way to run inference is by using the Hugging Face `pipeline`:

   ```python
   from transformers import pipeline

   checkpoint = "google/owlv2-base-patch16-ensemble"
   detector = pipeline(model=checkpoint, task="zero-shot-object-detection")
   ```

3. **Load an Image:**
   Choose an image, for example, from the **NASA Great Images** dataset. We will use an image of astronaut Eileen Collins.

   ```python
   import skimage
   import numpy as np
   from PIL import Image

   image = skimage.data.astronaut()
   image = Image.fromarray(np.uint8(image)).convert("RGB")
   ```

4. **Run Detection with Text Prompts:**
   Provide the image and a set of text prompts describing the objects to look for:

   ```python
   predictions = detector(
       image,
       candidate_labels=["human face", "rocket", "nasa badge", "star-spangled banner"],
   )
   ```

   The model will return the bounding boxes and labels for the detected objects, with confidence scores.

5. **Visualize the Results:**
   You can visualize the detected objects by drawing bounding boxes around them.

   ```python
   from PIL import ImageDraw

   draw = ImageDraw.Draw(image)

   for prediction in predictions:
       box = prediction["box"]
       label = prediction["label"]
       score = prediction["score"]

       xmin, ymin, xmax, ymax = box.values()
       draw.rectangle((xmin, ymin, xmax, ymax), outline="red", width=1)
       draw.text((xmin, ymin), f"{label}: {round(score,2)}", fill="white")

   image.show()
   ```

### Manually Handling Zero-Shot Detection

You can manually load the model and processor, use a different image, and detect objects by passing image inputs and text queries to the processor.

1. **Load Model and Processor:**
   ```python
   from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection

   model = AutoModelForZeroShotObjectDetection.from_pretrained(checkpoint)
   processor = AutoProcessor.from_pretrained(checkpoint)
   ```

2. **Choose a Different Image:**
   Use a different image (e.g., a beach photo):

   ```python
   import requests

   url = "https://unsplash.com/photos/oj0zeY2Ltk4/download?force=true&w=640"
   im = Image.open(requests.get(url, stream=True).raw)
   ```

3. **Prepare the Input:**
   Provide the text queries for the objects you want to find:

   ```python
   text_queries = ["hat", "book", "sunglasses", "camera"]
   inputs = processor(text=text_queries, images=im, return_tensors="pt")
   ```

4. **Get Predictions and Visualize:**
   After passing the inputs to the model and post-processing, you can visualize the results:

   ```python
   import torch

   with torch.no_grad():
       outputs = model(**inputs)
       target_sizes = torch.tensor([im.size[::-1]])
       results = processor.post_process_object_detection(outputs, threshold=0.1, target_sizes=target_sizes)[0]

   draw = ImageDraw.Draw(im)

   scores = results["scores"].tolist()
   labels = results["labels"].tolist()
   boxes = results["boxes"].tolist()

   for box, score, label in zip(boxes, scores, labels):
       xmin, ymin, xmax, ymax = box
       draw.rectangle((xmin, ymin, xmax, ymax), outline="red", width=1)
       draw.text((xmin, ymin), f"{text_queries[label]}: {round(score,2)}", fill="white")

   im.show()
   ```

### Batch Object Detection

You can also pass multiple images and text queries in a batch for detection:

1. **Batch Processing:**
   For processing multiple images, pass a list of images and queries:

   ```python
   images = [image, im]
   text_queries = [
       ["human face", "rocket", "nasa badge", "star-spangled banner"],
       ["hat", "book", "sunglasses", "camera"],
   ]
   inputs = processor(text=text_queries, images=images, return_tensors="pt")
   ```

2. **Post-process and Visualize the Results:**
   After running the model, visualize the detected objects for each image:

   ```python
   with torch.no_grad():
       outputs = model(**inputs)
       target_sizes = [x.size[::-1] for x in images]
       results = processor.post_process_object_detection(outputs, threshold=0.1, target_sizes=target_sizes)

   image_idx = 1
   draw = ImageDraw.Draw(images[image_idx])

   scores = results[image_idx]["scores"].tolist()
   labels = results[image_idx]["labels"].tolist()
   boxes = results[image_idx]["boxes"].tolist()

   for box, score, label in zip(boxes, scores, labels):
       xmin, ymin, xmax, ymax = box
       draw.rectangle((xmin, ymin, xmax, ymax), outline="red", width=1)
       draw.text((xmin, ymin), f"{text_queries[image_idx][label]}: {round(score,2)}", fill="white")

   images[image_idx].show()
   ```

### Image-Guided Object Detection

OWL-ViT also supports **image-guided object detection**, where a query image is used to find similar objects in a target image. For instance, if you have an image of a cat, you can find similar cats in another image.

1. **Prepare Query and Target Images:**
   ```python
   url_target = "http://images.cocodataset.org/val2017/000000039769.jpg"
   url_query = "http://images.cocodataset.org/val2017/000000524280.jpg"
   image_target = Image.open(requests.get(url_target, stream=True).raw)
   query_image = Image.open(requests.get(url_query, stream=True).raw)
   ```

2. **Pre-process Inputs and Run Image-guided Detection:**
   Use the query image for detection in the target image:

   ```python
   inputs = processor(images=image_target, query_images=query_image, return_tensors="pt")

   with torch.no_grad():
       outputs = model.image_guided_detection(**inputs)
       target_sizes = torch.tensor([image_target.size[::-1]])
       results = processor.post_process_image_guided_detection(outputs=outputs, target_sizes=target_sizes)[0]

   draw = ImageDraw.Draw(image_target)

   scores = results["scores"].tolist()
   boxes = results["boxes"].tolist()

   for box, score in zip(boxes, scores):
       xmin, ymin, xmax, ymax = box
       draw.rectangle((xmin, ymin, xmax, ymax), outline="white", width=4)

   image_target.show()
   ```

### Conclusion

Zero-shot object detection with OWL-ViT provides a flexible and powerful approach for detecting objects in images using text descriptions or even image queries, without the need for traditional training on labeled datasets. This capability enables detection across a wide range of object categories, making it a valuable tool for various real-world applications.