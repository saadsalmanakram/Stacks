
---

### Text to Speech (TTS)

**Open in Colab**  
**Open in Studio Lab**  

Text-to-speech (TTS) refers to the task of generating human-like speech from written text. Multiple TTS models are available in the 🤗 Transformers library, such as **Bark**, **MMS**, **VITS**, and **SpeechT5**. These models can generate speech in various languages and for different speakers, and some, like **Bark**, can even generate non-verbal communications like laughter, sighs, or crying.

The **text-to-speech** pipeline (or its alias **text-to-audio**) can be used for generating audio with pre-trained models like Bark. Here’s how to use the **text-to-speech** pipeline in Hugging Face Transformers:

```python
from transformers import pipeline

pipe = pipeline("text-to-speech", model="suno/bark-small")
text = "[clears throat] This is a test ... and I just took a long pause."
output = pipe(text)
```

You can listen to the audio output directly in a notebook using the following:

```python
from IPython.display import Audio
Audio(output["audio"], rate=output["sampling_rate"])
```

For further exploration on what **Bark** and other TTS models can do, you can refer to Hugging Face’s Audio course.

---

### Fine-tuning TTS Models (SpeechT5)

The **SpeechT5** model, which is pre-trained on both **speech-to-text** and **text-to-speech** tasks, can be fine-tuned for specific languages or speech datasets. For this guide, we'll show how to fine-tune **SpeechT5** using the **VoxPopuli** dataset for Dutch speech.

Before you start, ensure you have the necessary libraries installed:

```bash
pip install datasets soundfile speechbrain accelerate
```

Install **Hugging Face Transformers** from the source (to access some SpeechT5 features):

```bash
pip install git+https://github.com/huggingface/transformers.git
```

Check if you have access to a GPU:

```bash
!nvidia-smi
```

Alternatively for AMD GPUs:

```bash
!rocm-smi
```

Log into your **Hugging Face** account to upload models to the Hub:

```python
from huggingface_hub import notebook_login

notebook_login()
```

---

### Loading the Dataset

The **VoxPopuli** dataset contains speech samples from the European Parliament. We will use the Dutch (nl) subset of this dataset for training.

```python
from datasets import load_dataset, Audio

dataset = load_dataset("facebook/voxpopuli", "nl", split="train")
len(dataset)  # 20968 examples
```

Ensure the dataset has the correct sample rate (16 kHz):

```python
dataset = dataset.cast_column("audio", Audio(sampling_rate=16000))
```

---

### Preprocessing the Data

Load the **SpeechT5Processor** to prepare the dataset for training:

```python
from transformers import SpeechT5Processor

checkpoint = "microsoft/speecht5_tts"
processor = SpeechT5Processor.from_pretrained(checkpoint)
```

Clean the text for tokenization:

```python
tokenizer = processor.tokenizer
```

You can clean up special characters in the dataset using the following function:

```python
def cleanup_text(inputs):
    replacements = [
        ("à", "a"), ("ç", "c"), ("è", "e"), ("ë", "e"),
        ("í", "i"), ("ï", "i"), ("ö", "o"), ("ü", "u")
    ]
    for src, dst in replacements:
        inputs["normalized_text"] = inputs["normalized_text"].replace(src, dst)
    return inputs

dataset = dataset.map(cleanup_text)
```

---

### Speaker Embeddings

Since the **VoxPopuli** dataset contains multiple speakers, we need to generate speaker embeddings using **SpeechBrain’s pre-trained model**:

```python
import torch
from speechbrain.inference.classifiers import EncoderClassifier

spk_model_name = "speechbrain/spkrec-xvect-voxceleb"
speaker_model = EncoderClassifier.from_hparams(
    source=spk_model_name,
    savedir=os.path.join("/tmp", spk_model_name),
)

def create_speaker_embedding(waveform):
    with torch.no_grad():
        speaker_embeddings = speaker_model.encode_batch(torch.tensor(waveform))
        speaker_embeddings = torch.nn.functional.normalize(speaker_embeddings, dim=2)
        return speaker_embeddings.squeeze().cpu().numpy()
```

---

### Data Processing

Define the function that processes the dataset:

```python
def prepare_dataset(example):
    audio = example["audio"]
    example = processor(
        text=example["normalized_text"],
        audio_target=audio["array"],
        sampling_rate=audio["sampling_rate"],
        return_attention_mask=False,
    )
    example["labels"] = example["labels"][0]
    example["speaker_embeddings"] = create_speaker_embedding(audio["array"])
    return example
```

Apply this processing function across the dataset:

```python
dataset = dataset.map(prepare_dataset, remove_columns=dataset.column_names)
```

---

### Train-Test Split

Now, create a simple **train-test split**:

```python
dataset = dataset.train_test_split(test_size=0.1)
```

---

### Data Collator

Define a custom **data collator** to combine examples into batches:

```python
from dataclasses import dataclass
from typing import Any, Dict, List, Union
import torch

@dataclass
class TTSDataCollatorWithPadding:
    processor: Any

    def __call__(self, features: List[Dict[str, Union[List[int], torch.Tensor]]]) -> Dict[str, torch.Tensor]:
        input_ids = [{"input_ids": feature["input_ids"]} for feature in features]
        label_features = [{"input_values": feature["labels"]} for feature in features]
        speaker_features = [feature["speaker_embeddings"] for feature in features]

        batch = processor.pad(input_ids=input_ids, labels=label_features, return_tensors="pt")
        batch["labels"] = batch["labels"].masked_fill(batch.decoder_attention_mask.unsqueeze(-1).ne(1), -100)
        del batch["decoder_attention_mask"]

        if model.config.reduction_factor > 1:
            target_lengths = torch.tensor([len(feature["input_values"]) for feature in label_features])
            target_lengths = target_lengths.new([length - length % model.config.reduction_factor for length in target_lengths])
            max_length = max(target_lengths)
            batch["labels"] = batch["labels"][:, :max_length]

        batch["speaker_embeddings"] = torch.tensor(speaker_features)

        return batch
```

---

### Model Training

Load the **SpeechT5** model:

```python
from transformers import SpeechT5ForTextToSpeech

model = SpeechT5ForTextToSpeech.from_pretrained(checkpoint)
model.config.use_cache = False  # Disable cache for training
```

Define the **training arguments**:

```python
from transformers import Seq2SeqTrainingArguments

training_args = Seq2SeqTrainingArguments(
    output_dir="speecht5_finetuned_voxpopuli_nl",  # Change to a repo name of your choice
    per_device_train_batch_size=4,
    gradient_accumulation_steps=8,
    learning_rate=1e-5,
    warmup_steps=500,
    max_steps=4000,
    gradient_checkpointing=True,
    fp16=True,
    eval_strategy="steps",
    save_steps=1000,
    eval_steps=1000,
    logging_steps=25,
    report_to=["tensorboard"],
    load_best_model_at_end=True,
    greater_is_better=False,
    label_names=["labels"],
    push_to_hub=True,
)
```

Set up the **trainer** and start training:

```python
from transformers import Seq2SeqTrainer

trainer = Seq2SeqTrainer(
    args=training_args,
    model=model,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    data_collator=data_collator,
)
```

---

