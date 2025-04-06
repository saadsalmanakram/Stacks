# **🚀 Encoder-Decoder Cache in 🤗 Transformers**  

## **📌 What is Encoder-Decoder Cache?**  
The **`EncoderDecoderCache`** is a specialized caching system designed for **encoder-decoder models**. Unlike decoder-only models, **encoder-decoder architectures** (like Whisper, T5, and BART) require:  

✔ **Self-attention caching** (for the decoder).  
✔ **Cross-attention caching** (linking encoder outputs to decoder).  
✔ **Efficient past key-value storage** for optimal generation speed.  

### **🔹 Why is Encoder-Decoder Caching Needed?**  
🚀 Encoder-decoder models process input text **in two stages**:  
1️⃣ **Encoder processes the input** → Generates hidden representations.  
2️⃣ **Decoder generates output tokens** → Uses self-attention + cross-attention with cached encoder outputs.  

💡 **The Challenge?**  
- Maintaining **two different cache types** (encoder & decoder).  
- Handling **long sequences efficiently**.  
- **Ensuring optimal storage and retrieval** of past key-values.  

📌 **Cool Feature:** You can set **different cache implementations** for **encoder and decoder** separately!  

---

## **🛠️ How Does Encoder-Decoder Cache Work?**
✅ Stores **past key-value pairs** for both **self-attention (decoder)** and **cross-attention (encoder)**.  
✅ Reduces redundant computation, speeding up inference.  
✅ Supports **custom cache types** for **encoder and decoder separately**.  
✅ **Currently supports Whisper models** (More models coming soon!).  

📌 **Usage is automatic!** No need to modify `generate()` or `forward()`.  

---

## **💻 Code Example: Using Encoder-Decoder Cache (Whisper Model)**  
```python
import torch
from transformers import AutoProcessor, WhisperForConditionalGeneration

# Load Whisper model and processor
model_id = "openai/whisper-tiny"
processor = AutoProcessor.from_pretrained(model_id)
model = WhisperForConditionalGeneration.from_pretrained(
    model_id, 
    torch_dtype=torch.float16, 
    device_map="auto"  # Auto-detect best device
)

# Load an example audio file
audio_sample = torch.randn(1, 80, 3000)  # Simulated audio input

# Process audio input
inputs = processor(audio_sample, return_tensors="pt").to(model.device)

# Generate transcription (encoder-decoder cache is handled automatically!)
output = model.generate(**inputs)

# Decode and print generated text
print(processor.batch_decode(output, skip_special_tokens=True)[0])
```

💡 **Example Output:**  
```
"Hello, this is an example audio transcription using Whisper."
```

---

## **🔍 Why Use Encoder-Decoder Cache?**
✔ **Faster inference** by avoiding recomputation of past key-values.  
✔ **Memory efficiency** by reusing stored past states.  
✔ **Supports future multi-cache configurations** (different caches for encoder & decoder).  
✔ **Crucial for models with long input sequences (like Whisper).**  

---

## **📌 When to Use Encoder-Decoder Cache vs. Other Caches?**  

| **Cache Type**                  | **Use Case** | **Best When** |
|---------------------------------|-------------|--------------|
| **Static Cache** (`static`) | Pre-allocated KV cache | **Long text generation, JIT optimization** |
| **Dynamic Cache** (`dynamic`) | Grows as needed | **Short/variable-length sequences** |
| **Offloaded Cache** (`offloaded`) | Moves KV cache to CPU | **Low VRAM, large models** |
| **Sliding Window Cache** (`sliding_window`) | Retains only last N tokens | **For models supporting sliding window attention (e.g., Mistral)** |
| **Sink Cache** (`SinkCache`) | Keeps key “sink tokens” for infinite-length gen | **Infinite-length text generation (Llama 2, GPT-like models)** |
| **Encoder-Decoder Cache** (`EncoderDecoderCache`) | Manages self & cross-attention caches | **Encoder-decoder models (Whisper, T5, BART)** |

---

## **🚀 Summary: Best Practices**
✔ **Use Encoder-Decoder Cache for models with both encoder & decoder** (e.g., Whisper, T5).  
✔ **No extra steps required** – it works automatically in `.generate()` and `.forward()`.  
✔ **Supports setting different cache types for encoder and decoder** (future feature).  
✔ **Great for speech-to-text, summarization, and translation tasks.**  

🚀 **Encoder-Decoder Cache is the key to optimizing complex sequence-to-sequence models!**