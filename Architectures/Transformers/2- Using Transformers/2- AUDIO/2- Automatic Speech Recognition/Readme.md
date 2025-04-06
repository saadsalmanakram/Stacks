
---

# **Automatic Speech Recognition (ASR)**  
**[Open In Colab](https://colab.research.google.com/) | [Open In Studio Lab](https://studiolab.sagemaker.aws/)**  

Automatic speech recognition (ASR) converts a speech signal to text, mapping a sequence of audio inputs to text outputs. Virtual assistants like Siri and Alexa use ASR models to help users every day, and there are many other useful user-facing applications like live captioning and note-taking during meetings.  

### **This guide will show you how to:**  
✅ Fine-tune Wav2Vec2 on the MInDS-14 dataset to transcribe audio to text.  
✅ Use your fine-tuned model for inference.  

For all compatible architectures and checkpoints, visit the **[ASR Task Page](https://huggingface.co/tasks/automatic-speech-recognition)**.  

---

## **Installation**  

Before you begin, install the required libraries:  

```bash
pip install transformers datasets evaluate jiwer
```

**Login to Hugging Face** (optional but recommended for model sharing):  

```python
from huggingface_hub import notebook_login

notebook_login()
```

---

## **Load MInDS-14 Dataset**  

First, load a smaller subset of the MInDS-14 dataset from 🤗 Datasets:  

```python
from datasets import load_dataset, Audio

minds = load_dataset("PolyAI/minds14", name="en-US", split="train[:100]")
```

**Split dataset into train/test sets:**  

```python
minds = minds.train_test_split(test_size=0.2)
```

**View dataset structure:**  

```python
print(minds)
```

```text
DatasetDict({
    train: Dataset({
        features: ['path', 'audio', 'transcription', 'english_transcription', 'intent_class', 'lang_id'],
        num_rows: 16
    })
    test: Dataset({
        features: ['path', 'audio', 'transcription', 'english_transcription', 'intent_class', 'lang_id'],
        num_rows: 4
    })
})
```

---

## **Preprocessing**  

Since we only need the `audio` and `transcription` columns, remove the unnecessary ones:  

```python
minds = minds.remove_columns(["english_transcription", "intent_class", "lang_id"])
```

**Resampling Audio to 16kHz for Wav2Vec2 Compatibility:**  

```python
processor = AutoProcessor.from_pretrained("facebook/wav2vec2-base")
minds = minds.cast_column("audio", Audio(sampling_rate=16_000))
```

---

## **Prepare Dataset for Training**  

Convert text to uppercase (as Wav2Vec2 is trained on uppercase text):  

```python
def uppercase(example):
    return {"transcription": example["transcription"].upper()}

minds = minds.map(uppercase)
```

**Tokenization & Feature Extraction:**  

```python
def prepare_dataset(batch):
    audio = batch["audio"]
    batch = processor(audio["array"], sampling_rate=audio["sampling_rate"], text=batch["transcription"])
    batch["input_length"] = len(batch["input_values"][0])
    return batch

encoded_minds = minds.map(prepare_dataset, remove_columns=minds.column_names["train"], num_proc=4)
```

---

## **Data Collator for Dynamic Padding**  

```python
import torch
from dataclasses import dataclass, field
from typing import Any, Dict, List, Union

@dataclass
class DataCollatorCTCWithPadding:
    processor: AutoProcessor
    padding: Union[bool, str] = "longest"

    def __call__(self, features: List[Dict[str, Union[List[int], torch.Tensor]]]) -> Dict[str, torch.Tensor]:
        input_features = [{"input_values": feature["input_values"][0]} for feature in features]
        label_features = [{"input_ids": feature["labels"]} for feature in features]

        batch = self.processor.pad(input_features, padding=self.padding, return_tensors="pt")
        labels_batch = self.processor.pad(labels=label_features, padding=self.padding, return_tensors="pt")

        labels = labels_batch["input_ids"].masked_fill(labels_batch.attention_mask.ne(1), -100)
        batch["labels"] = labels

        return batch

data_collator = DataCollatorCTCWithPadding(processor=processor, padding="longest")
```

---

## **Evaluation (WER - Word Error Rate)**  

```python
import evaluate

wer = evaluate.load("wer")

def compute_metrics(pred):
    pred_logits = pred.predictions
    pred_ids = np.argmax(pred_logits, axis=-1)

    pred.label_ids[pred.label_ids == -100] = processor.tokenizer.pad_token_id

    pred_str = processor.batch_decode(pred_ids)
    label_str = processor.batch_decode(pred.label_ids, group_tokens=False)

    wer_score = wer.compute(predictions=pred_str, references=label_str)
    return {"wer": wer_score}
```

---

## **Fine-tune Wav2Vec2 Model**  

```python
from transformers import AutoModelForCTC, TrainingArguments, Trainer

model = AutoModelForCTC.from_pretrained(
    "facebook/wav2vec2-base",
    ctc_loss_reduction="mean",
    pad_token_id=processor.tokenizer.pad_token_id,
)

training_args = TrainingArguments(
    output_dir="my_awesome_asr_mind_model",
    per_device_train_batch_size=8,
    gradient_accumulation_steps=2,
    learning_rate=1e-5,
    warmup_steps=500,
    max_steps=2000,
    gradient_checkpointing=True,
    fp16=True,
    group_by_length=True,
    eval_strategy="steps",
    per_device_eval_batch_size=8,
    save_steps=1000,
    eval_steps=1000,
    logging_steps=25,
    load_best_model_at_end=True,
    metric_for_best_model="wer",
    greater_is_better=False,
    push_to_hub=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_minds["train"],
    eval_dataset=encoded_minds["test"],
    tokenizer=processor,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
```

**Push Model to Hugging Face Hub:**  

```python
trainer.push_to_hub()
```

---

## **Inference**  

**Load a sample audio file:**  

```python
dataset = load_dataset("PolyAI/minds14", "en-US", split="train")
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
audio_file = dataset[0]["audio"]["path"]
```

**Use ASR pipeline for transcription:**  

```python
from transformers import pipeline

transcriber = pipeline("automatic-speech-recognition", model="stevhliu/my_awesome_asr_minds_model")
transcriber(audio_file)
```

**Expected Output Example:**  

```text
{'text': 'I WOUD LIKE TO SET UP A JOINT ACCOUNT WITH MY PARTNER'}
```

---

## **Manual Inference Without Pipeline**  

```python
from transformers import AutoProcessor, AutoModelForCTC
import torch

processor = AutoProcessor.from_pretrained("stevhliu/my_awesome_asr_mind_model")
inputs = processor(dataset[0]["audio"]["array"], sampling_rate=16000, return_tensors="pt")

model = AutoModelForCTC.from_pretrained("stevhliu/my_awesome_asr_mind_model")
with torch.no_grad():
    logits = model(**inputs).logits

predicted_ids = torch.argmax(logits, dim=-1)
transcription = processor.batch_decode(predicted_ids)
print(transcription)
```

**Output:**  

```text
['I WOUD LIKE TO SET UP A JOINT ACCOUNT WITH MY PARTNER']
```

---

### **Conclusion**  

You have successfully:  
✔️ Loaded and preprocessed the MInDS-14 dataset.  
✔️ Fine-tuned the Wav2Vec2 model for speech recognition.  
✔️ Evaluated the model with WER.  
✔️ Deployed and tested ASR inference.  

For advanced fine-tuning, refer to:  
- **[Hugging Face ASR Guide](https://huggingface.co/docs/transformers/tasks/asr)**  
- **[Multilingual ASR](https://huggingface.co/blog/mms)**
