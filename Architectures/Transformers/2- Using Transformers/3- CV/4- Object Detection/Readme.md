
---

### Object Detection with Model Evaluation and Fine-Tuning

#### 1. **Model Output Structure**
First, define a structure for the output of the object detection model. This is typically a tuple containing the logits (the raw prediction scores) and the predicted bounding boxes.

```python
from dataclasses import dataclass
import torch

@dataclass
class ModelOutput:
    logits: torch.Tensor
    pred_boxes: torch.Tensor
```

#### 2. **Metric Computation**
Now, let's write the function to compute the Mean Average Precision (mAP) and other evaluation metrics. These are the common metrics used to evaluate the performance of object detection models.

The function below will:
- Take the evaluation results from the model (predictions and targets).
- Format the predictions and targets.
- Compute the mAP and its variants for each class (i.e., precision and recall at different thresholds).

```python
import numpy as np
import torch
from torchmetrics.detection.mean_ap import MeanAveragePrecision
from functools import partial

# Converts YOLO-format bounding boxes to Pascal VOC format (x_min, y_min, x_max, y_max)
def convert_bbox_yolo_to_pascal(boxes, original_size):
    # Assuming boxes are normalized to [0, 1], and original_size is (height, width)
    height, width = original_size
    boxes = boxes * torch.tensor([width, height, width, height])
    return boxes

# Function to compute evaluation metrics
@torch.no_grad()
def compute_metrics(evaluation_results, image_processor, threshold=0.0, id2label=None):
    predictions, targets = evaluation_results.predictions, evaluation_results.label_ids

    image_sizes = []
    post_processed_targets = []
    post_processed_predictions = []

    # Collect targets and predictions in the required format for metric computation
    for batch in targets:
        batch_image_sizes = torch.tensor(np.array([x["orig_size"] for x in batch]))
        image_sizes.append(batch_image_sizes)
        
        for image_target in batch:
            boxes = torch.tensor(image_target["boxes"])
            boxes = convert_bbox_yolo_to_pascal(boxes, image_target["orig_size"])
            labels = torch.tensor(image_target["class_labels"])
            post_processed_targets.append({"boxes": boxes, "labels": labels})

    for batch, target_sizes in zip(predictions, image_sizes):
        batch_logits, batch_boxes = batch[1], batch[2]
        output = ModelOutput(logits=torch.tensor(batch_logits), pred_boxes=torch.tensor(batch_boxes))
        
        post_processed_output = image_processor.post_process_object_detection(
            output, threshold=threshold, target_sizes=target_sizes
        )
        post_processed_predictions.extend(post_processed_output)

    # Compute mAP
    metric = MeanAveragePrecision(box_format="xyxy", class_metrics=True)
    metric.update(post_processed_predictions, post_processed_targets)
    metrics = metric.compute()

    # Include per-class metrics for better readability
    classes = metrics.pop("classes")
    map_per_class = metrics.pop("map_per_class")
    mar_100_per_class = metrics.pop("mar_100_per_class")
    
    for class_id, class_map, class_mar in zip(classes, map_per_class, mar_100_per_class):
        class_name = id2label[class_id.item()] if id2label is not None else class_id.item()
        metrics[f"map_{class_name}"] = class_map
        metrics[f"mar_100_{class_name}"] = class_mar

    metrics = {k: round(v.item(), 4) for k, v in metrics.items()}
    return metrics
```

- **`convert_bbox_yolo_to_pascal`**: This function converts the YOLO-style bounding boxes (in normalized coordinates) into the Pascal VOC format (in absolute pixel coordinates). It's important to adapt the format for the metric calculation.
  
- **`compute_metrics`**: This function computes the mean average precision (mAP) and other metrics like mean average recall (mAR) based on the predicted and true bounding boxes.

#### 3. **Training the Object Detection Model**

To fine-tune a pre-trained object detection model, follow these steps:

1. **Load Pretrained Model**:
   We will load a model using the `AutoModelForObjectDetection` API, making sure to pass the correct label mappings (id2label and label2id).

```python
from transformers import AutoModelForObjectDetection

model = AutoModelForObjectDetection.from_pretrained(
    MODEL_NAME,  # Model checkpoint name
    id2label=id2label,  # Mapping of class ids to class labels
    label2id=label2id,  # Mapping of class labels to ids
    ignore_mismatched_sizes=True,  # Replace the classification head if the size doesn't match
)
```

2. **Define Training Parameters**:
   Define the hyperparameters like number of epochs, batch size, learning rate, and others using `TrainingArguments`.

```python
from transformers import TrainingArguments

training_args = TrainingArguments(
    output_dir="detr_finetuned_cppe5",  # Directory to save the model
    num_train_epochs=30,  # Number of epochs
    fp16=False,  # Use 16-bit precision for faster computation (if supported)
    per_device_train_batch_size=8,  # Batch size for training
    dataloader_num_workers=4,  # Number of workers for data loading
    learning_rate=5e-5,  # Learning rate
    lr_scheduler_type="cosine",  # Learning rate scheduler
    weight_decay=1e-4,  # Regularization
    max_grad_norm=0.01,  # Gradient clipping to avoid explosion
    metric_for_best_model="eval_map",  # Metric to choose the best model
    greater_is_better=True,  # Higher map is better
    load_best_model_at_end=True,  # Load the best model after training
    eval_strategy="epoch",  # Evaluate after each epoch
    save_strategy="epoch",  # Save the model after each epoch
    save_total_limit=2,  # Limit the number of saved models
    remove_unused_columns=False,  # Avoid removing the image column
    eval_do_concat_batches=False,  # Prevent concatenating batches during evaluation
    push_to_hub=True,  # Upload the model to Hugging Face Hub
)
```

3. **Train the Model**:
   Now, create the `Trainer` instance, which handles the training loop, and call `train()` to fine-tune the model.

```python
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=cppe5["train"],  # Training dataset
    eval_dataset=cppe5["validation"],  # Validation dataset
    processing_class=image_processor,  # Image processor for preprocessing
    data_collator=collate_fn,  # Function to collate data during training
    compute_metrics=eval_compute_metrics_fn,  # Metric function
)

trainer.train()  # Start the training process
```

4. **Training Output**:
   After training, you can monitor metrics like mAP (Mean Average Precision), mAR (Mean Average Recall), and class-specific mAPs across the different classes (e.g., 'Coverall', 'Face Shield', etc.).

#### 4. **Key Hyperparameters and Configuration Notes**

- **`remove_unused_columns=False`**: This ensures that we don’t lose important columns like the image data during training.
- **`eval_do_concat_batches=False`**: This setting ensures proper evaluation because images have different numbers of target boxes, and concatenating batches would mix them up.
- **`push_to_hub=True`**: If you want to share your fine-tuned model with others, you can push it to the Hugging Face Model Hub.

---
