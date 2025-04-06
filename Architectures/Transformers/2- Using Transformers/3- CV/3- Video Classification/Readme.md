**Video Classification**

Video classification is the process of assigning a label or class to an entire video. Typically, each video is associated with only one class. These models take a video as input and predict the class to which the video belongs. Real-world applications of video classification include action/activity recognition, which is useful in fitness apps, and aiding vision-impaired individuals, especially when commuting.

### Goal of this Guide
This guide will walk you through:

1. Fine-tuning the **VideoMAE** model on a subset of the UCF101 dataset.
2. Using the fine-tuned model for inference.

Before you begin, ensure you have installed the necessary libraries:

```bash
pip install -q pytorchvideo transformers evaluate
```

We’ll use **PyTorchVideo** to process and prepare the video data.

### Step 1: Log in to Hugging Face
To upload and share your model with the community, log in to your Hugging Face account:

```python
from huggingface_hub import notebook_login
notebook_login()
```

### Step 2: Load the UCF101 Dataset
Start by loading a subset of the UCF-101 dataset for experimentation. This step ensures that everything works smoothly before training on the full dataset:

```python
from huggingface_hub import hf_hub_download

hf_dataset_identifier = "sayakpaul/ucf101-subset"
filename = "UCF101_subset.tar.gz"
file_path = hf_hub_download(repo_id=hf_dataset_identifier, filename=filename, repo_type="dataset")
```

After downloading the subset, extract the archive:

```python
import tarfile

with tarfile.open(file_path) as t:
     t.extractall(".")
```

The dataset is organized into subfolders, such as:

```
UCF101_subset/
    train/
        BandMarching/
            video_1.mp4
            ...
        Archery/
            video_1.mp4
            ...
    val/
        ...
    test/
        ...
```

You can count the total number of videos:

```python
import pathlib
dataset_root_path = pathlib.Path("UCF101_subset")

video_count_train = len(list(dataset_root_path.glob("train/*/*.avi")))
video_count_val = len(list(dataset_root_path.glob("val/*/*.avi")))
video_count_test = len(list(dataset_root_path.glob("test/*/*.avi")))

video_total = video_count_train + video_count_val + video_count_test
print(f"Total videos: {video_total}")
```

### Step 3: Prepare Class Labels
You will need to extract and map the class labels. This will allow you to map class names to integers for model training:

```python
class_labels = sorted({str(path).split("/")[2] for path in all_video_file_paths})
label2id = {label: i for i, label in enumerate(class_labels)}
id2label = {i: label for label, i in label2id.items()}

print(f"Unique classes: {list(label2id.keys())}.")
```

In this case, there are 10 unique classes, and each class has 30 videos in the training set.

### Step 4: Load the Pretrained Model
Load the **VideoMAE** model with pre-trained parameters. The encoder is pretrained, and the classification head is randomly initialized. This enables you to fine-tune the model for video classification:

```python
from transformers import VideoMAEImageProcessor, VideoMAEForVideoClassification

model_ckpt = "MCG-NJU/videomae-base"
image_processor = VideoMAEImageProcessor.from_pretrained(model_ckpt)
model = VideoMAEForVideoClassification.from_pretrained(
    model_ckpt,
    label2id=label2id,
    id2label=id2label,
    ignore_mismatched_sizes=True,
)
```

**Important**: Some weights are not used (such as the decoder), and new weights (like the classifier layer) are randomly initialized. This is expected, and you need to fine-tune the model before using it for inference.

### Step 5: Prepare Video Data for Training
Use **PyTorchVideo** for preprocessing the video data. This includes transformations like temporal subsampling, normalization, and random cropping for training. The validation and test sets will use similar transformations but without random cropping or flipping.

First, define constants for video processing:

```python
mean = image_processor.image_mean
std = image_processor.image_std
resize_to = (height, width)  # Based on the model configuration
```

Now, apply the transformations:

```python
from pytorchvideo.transforms import (
    ApplyTransformToKey,
    Normalize,
    UniformTemporalSubsample,
    RandomCrop,
    RandomHorizontalFlip,
)
from torchvision.transforms import Compose

train_transform = Compose([
    ApplyTransformToKey(
        key="video",
        transform=Compose([
            UniformTemporalSubsample(num_frames_to_sample),
            Normalize(mean, std),
            RandomCrop(resize_to),
            RandomHorizontalFlip(p=0.5),
        ])
    ),
])

train_dataset = pytorchvideo.data.Ucf101(
    data_path=os.path.join(dataset_root_path, "train"),
    clip_sampler=pytorchvideo.data.make_clip_sampler("random", clip_duration),
    transform=train_transform,
)
```

Repeat similar steps for the validation and test sets:

```python
val_transform = Compose([
    ApplyTransformToKey(
        key="video",
        transform=Compose([
            UniformTemporalSubsample(num_frames_to_sample),
            Normalize(mean, std),
            Resize(resize_to),
        ])
    ),
])
```

### Step 6: Train the Model
Now, train the model using the **Trainer** from Hugging Face's `transformers` library. Configure training parameters such as batch size, number of epochs, and learning rate:

```python
from transformers import TrainingArguments, Trainer

args = TrainingArguments(
    "videomae-finetuned",
    remove_unused_columns=False,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=16,
    warmup_ratio=0.1,
    logging_steps=10,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    push_to_hub=True,
    max_steps=(train_dataset.num_videos // batch_size) * num_epochs,
)

trainer = Trainer(
    model,
    args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)

trainer.train()
```

### Step 7: Share Your Model
Once training is complete, you can upload your model to Hugging Face Hub so others can use it:

```python
trainer.push_to_hub()
```

### Step 8: Inference with Your Fine-Tuned Model
After training, you can use your fine-tuned model for inference on new videos. Load a video from the test set and classify it:

```python
from transformers import pipeline

video_cls = pipeline(model="my_awesome_video_cls_model")
video_cls("path_to_video.mp4")
```

The model will return a prediction with the class and score, helping you determine what the video is about.

---
