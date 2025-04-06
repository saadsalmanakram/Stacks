
---

# **Audio Classification with Wav2Vec2 on MInDS-14**  
### **Introduction**  
Audio classification, similar to text classification, assigns a class label to input data. However, instead of text, we deal with raw audio waveforms. Practical applications include:  
- **Speaker intent detection**  
- **Language classification**  
- **Animal species recognition by sound**  

This guide will show you how to:  
✅ **Fine-tune Wav2Vec2** on the **MInDS-14** dataset to classify speaker intent.  
✅ **Use your fine-tuned model for inference**.  
✅ **Deploy the model for real-world applications**.  

For available models and checkpoints, check the **[task page](https://huggingface.co/models?pipeline_tag=audio-classification)**.  

---

## **Setup & Installation**  
First, install the required libraries:  

```bash
pip install transformers datasets evaluate
```
(Optional) Log in to your Hugging Face account to upload and share your model:  

```python
from huggingface_hub import notebook_login
notebook_login()
```

---

## **Load the Dataset (MInDS-14)**  
The **MInDS-14 dataset** from 🤗 Datasets provides labeled speech data for intent classification.  

```python
from datasets import load_dataset, Audio

minds = load_dataset("PolyAI/minds14", name="en-US", split="train")
```

### **Train-Test Split**  
Split the dataset into **train (80%)** and **test (20%)**:  

```python
minds = minds.train_test_split(test_size=0.2)
```

### **Dataset Overview**  
Check dataset structure:  

```python
minds
```
```
DatasetDict({
    train: Dataset({
        features: ['path', 'audio', 'transcription', 'english_transcription', 'intent_class', 'lang_id'],
        num_rows: 450
    })
    test: Dataset({
        features: ['path', 'audio', 'transcription', 'english_transcription', 'intent_class', 'lang_id'],
        num_rows: 113
    })
})
```

Since we only need the **audio** and **intent_class**, remove unnecessary columns:  

```python
minds = minds.remove_columns(["path", "transcription", "english_transcription", "lang_id"])
```

### **Sample Data**  
Check a sample entry:  

```python
minds["train"][0]
```
```
{'audio': {'array': array([...], dtype=float32), 'sampling_rate': 8000},
 'intent_class': 2}
```

---

## **Prepare Labels**  
Create mappings between **label names** and **IDs**:  

```python
labels = minds["train"].features["intent_class"].names
label2id, id2label = {}, {}
for i, label in enumerate(labels):
    label2id[label] = str(i)
    id2label[str(i)] = label
```

Check mapping for **class ID = 2**:  
```python
id2label[str(2)]
```
```
'app_error'
```

---

## **Preprocessing (Feature Extraction)**  
Load **Wav2Vec2 feature extractor**:  

```python
from transformers import AutoFeatureExtractor

feature_extractor = AutoFeatureExtractor.from_pretrained("facebook/wav2vec2-base")
```

The dataset has an **8kHz** sampling rate, but Wav2Vec2 requires **16kHz**. Resample:  

```python
minds = minds.cast_column("audio", Audio(sampling_rate=16_000))
```

### **Preprocessing Function**  
Process audio by:  
- **Extracting audio arrays**  
- **Resampling to the model's sampling rate**  
- **Applying truncation**  

```python
def preprocess_function(examples):
    audio_arrays = [x["array"] for x in examples["audio"]]
    inputs = feature_extractor(
        audio_arrays, sampling_rate=feature_extractor.sampling_rate, max_length=16000, truncation=True
    )
    return inputs
```

Apply preprocessing to the dataset:  

```python
encoded_minds = minds.map(preprocess_function, remove_columns="audio", batched=True)
encoded_minds = encoded_minds.rename_column("intent_class", "label")
```

---

## **Evaluation Metric (Accuracy)**  
Load accuracy metric from **🤗 Evaluate**:  

```python
import evaluate
import numpy as np

accuracy = evaluate.load("accuracy")

def compute_metrics(eval_pred):
    predictions = np.argmax(eval_pred.predictions, axis=1)
    return accuracy.compute(predictions=predictions, references=eval_pred.label_ids)
```

---

## **Fine-Tune Wav2Vec2 Model**  
Load **Wav2Vec2** with classification head:  

```python
from transformers import AutoModelForAudioClassification, TrainingArguments, Trainer

num_labels = len(id2label)
model = AutoModelForAudioClassification.from_pretrained(
    "facebook/wav2vec2-base", num_labels=num_labels, label2id=label2id, id2label=id2label
)
```

### **Training Arguments**  
Define hyperparameters:  

```python
training_args = TrainingArguments(
    output_dir="wav2vec2_minds14",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=3e-5,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    num_train_epochs=10,
    warmup_ratio=0.1,
    logging_steps=10,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    push_to_hub=True,
)
```

### **Trainer API**  
Pass the model, dataset, and training arguments to the `Trainer`:  

```python
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_minds["train"],
    eval_dataset=encoded_minds["test"],
    compute_metrics=compute_metrics,
)
```

Start training:  

```python
trainer.train()
```

Push the trained model to **Hugging Face Hub**:  

```python
trainer.push_to_hub()
```

---

## **Inference (Using the Trained Model)**  
### **Load an Audio File for Prediction**  
Resample the audio file to **16kHz**:  

```python
from datasets import load_dataset, Audio

dataset = load_dataset("PolyAI/minds14", name="en-US", split="train")
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
sampling_rate = dataset.features["audio"].sampling_rate
audio_file = dataset[0]["audio"]["path"]
```

### **Using Hugging Face Pipelines**  
Use the trained model for inference:  

```python
from transformers import pipeline

classifier = pipeline("audio-classification", model="wav2vec2_minds14")
classifier(audio_file)
```

Example Output:  
```
[
    {'score': 0.09, 'label': 'cash_deposit'},
    {'score': 0.08, 'label': 'app_error'},
    {'score': 0.07, 'label': 'joint_account'}
]
```

---

### **Manually Running Inference**  
Extract audio features:  

```python
from transformers import AutoFeatureExtractor

feature_extractor = AutoFeatureExtractor.from_pretrained("wav2vec2_minds14")
inputs = feature_extractor(dataset[0]["audio"]["array"], sampling_rate=sampling_rate, return_tensors="pt")
```

Pass inputs to the model:  

```python
from transformers import AutoModelForAudioClassification

model = AutoModelForAudioClassification.from_pretrained("wav2vec2_minds14")
with torch.no_grad():
    logits = model(**inputs).logits
```

Get the predicted class:  

```python
import torch

predicted_class_ids = torch.argmax(logits).item()
predicted_label = model.config.id2label[predicted_class_ids]
predicted_label
```
```
'cash_deposit'
```

---

## **Conclusion**  
You have successfully:  
✅ Loaded and preprocessed the **MInDS-14 dataset**  
✅ Fine-tuned **Wav2Vec2** for **speaker intent classification**  
✅ Evaluated the model using **accuracy**  
✅ Performed **inference** using Hugging Face Pipelines  
