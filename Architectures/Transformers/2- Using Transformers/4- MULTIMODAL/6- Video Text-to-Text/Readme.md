
---

**Video-text-to-text Models (VLMs)**  
Video-text-to-text models, or video language models, are similar to image-text-to-text models but are designed to process video inputs. These models can perform tasks such as video captioning and question answering by leveraging temporal dependencies between video frames. Unlike image models that process individual images, video models handle multiple frames from videos to capture the sequence and flow of actions.

### Types of Video LMs:
- **Base Models** for fine-tuning
- **Chat Fine-tuned Models** for conversation
- **Instruction Fine-tuned Models**

This guide demonstrates using the **instruction fine-tuned model** `llava-hf/llava-interleave-qwen-7b-hf` (or `llava-interleave-qwen-0.5b-hf` for smaller hardware).

### Setup and Installation:
1. Install dependencies:
   ```bash
   pip install -q transformers accelerate flash_attn
   ```

2. Initialize the model and processor:
   ```python
   from transformers import LlavaProcessor, LlavaForConditionalGeneration
   import torch
   model_id = "llava-hf/llava-interleave-qwen-0.5b-hf"
   
   processor = LlavaProcessor.from_pretrained(model_id)
   model = LlavaForConditionalGeneration.from_pretrained(model_id, torch_dtype=torch.float16)
   model.to("cuda")  # or another hardware accelerator
   ```

### Handling Video Frames:
Since video input is a series of frames, you must first sample frames from a video and replace `<video>` tokens with `<image>` tokens in the prompt. Here’s how:

1. Utility functions for handling video:
   ```python
   def replace_video_with_images(text, frames):
       return text.replace("<video>", "<image>" * frames)
   
   def sample_frames(url, num_frames):
       response = requests.get(url)
       path_id = str(uuid.uuid4())
       path = f"./{path_id}.mp4"
       with open(path, "wb") as f:
           f.write(response.content)
       video = cv2.VideoCapture(path)
       total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
       interval = total_frames // num_frames
       frames = []
       for i in range(total_frames):
           ret, frame = video.read()
           pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
           if not ret:
               continue
           if i % interval == 0:
               frames.append(pil_img)
       video.release()
       return frames[:num_frames]
   ```

2. Get video inputs and sample frames:
   ```python
   video_1 = sample_frames("https://huggingface.co/spaces/merve/llava-interleave/resolve/main/cats_1.mp4", 6)
   video_2 = sample_frames("https://huggingface.co/spaces/merve/llava-interleave/resolve/main/cats_2.mp4", 6)
   videos = video_1 + video_2
   ```

3. Create the prompt and preprocess:
   ```python
   user_prompt = "Are these two cats in these two videos doing the same thing?"
   toks = "<image>" * 12
   prompt = "<|im_start|>user"+ toks + f"\n{user_prompt}<|im_end|><|im_start|>assistant"
   inputs = processor(text=prompt, images=videos, return_tensors="pt").to(model.device, model.dtype)
   ```

4. Generate the output:
   ```python
   output = model.generate(**inputs, max_new_tokens=100, do_sample=False)
   print(processor.decode(output[0][2:], skip_special_tokens=True)[len(user_prompt)+10:])
   ```

   **Output Example**:
   ```text
   The first cat is shown in a relaxed state, with its eyes closed and a content expression, while the second cat is shown in a more active state, with its mouth open wide, possibly in a yawn or a vocalization.
   ```

### Streaming:
You can stream the output in real-time by using the `TextIteratorStreamer` class to handle token generation in a separate thread, allowing you to stream text responses progressively.

### Model Quantization:
For smaller hardware, you can quantize models to int8 precision using **Quanto**. Install the required dependencies:
```bash
pip install -U quanto bitsandbytes
```
Then initialize the quantized model:
```python
from transformers import AutoModelForImageTextToText, QuantoConfig
quantization_config = QuantoConfig(weights="int8")
quantized_model = AutoModelForImageTextToText.from_pretrained(
    model_id, device_map="cuda", quantization_config=quantization_config
)
```

### Further Reading:
- [Image-text-to-text task page](https://huggingface.co/tasks/image-text-to-text)
- [Vision Language Models Explained](https://huggingface.co/blog/vision-language-models)

--- 
