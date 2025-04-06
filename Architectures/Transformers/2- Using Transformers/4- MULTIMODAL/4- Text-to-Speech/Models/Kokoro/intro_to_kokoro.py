pip install -q kokoro>=0.3.4 soundfile

from kokoro import KPipeline
import soundfile as sf

# Initialize the pipeline
pipeline = KPipeline(lang_code='a')  # 'a' for American English

# Text to convert
text = """Introducing DeepSeek R1—where advanced AI research meets next-level language modeling! At its core, DeepSeek R1 fuses a state-of-the-art transformer architecture with an innovative dynamic retrieval module. This unique hybrid structure is engineered to combine deep contextual understanding with rapid, real-time memory retrieval. Each deep contextual layer has been meticulously designed to capture nuanced language patterns, while an efficient attention mechanism prioritizes critical data. Coupled with dynamic memory integration, this model processes complex queries with remarkable precision. Extensive benchmarking on datasets such as SQuAD and GLUE confirms that DeepSeek R1 not only achieves exceptional language comprehension and generation but also offers significantly reduced latency—ideal for real-time applications. Detailed ablation studies underpin its design, revealing that every component—from deep contextual layers to dynamic memory retrieval—plays a critical role. This rigorous testing ensures that no element is redundant, optimizing performance for both research and practical deployment. Engineered with scalability in mind, DeepSeek R1 is not just a laboratory marvel. Its architecture is robust enough to power next-generation chatbots, intelligent search engines, and advanced content creation tools—bridging the gap between theoretical excellence and practical application. DeepSeek R1 isn’t merely an incremental improvement; it’s a paradigm shift that sets new benchmarks for AI research and commercial applications. Its comprehensive design promises to inspire future innovations and redefine what’s possible in natural language processing."""

# Generate audio for the entire text
generator = pipeline(
    text,
    voice='af_heart',
    speed=1.0
)

# Collect audio data from all segments
audio_data = []
for i, (_, _, audio) in enumerate(generator):
    audio_data.append(audio)

# Concatenate all audio segments
final_audio = []
for segment in audio_data:
    final_audio.extend(segment)

# Save the complete audio to a single file
sf.write('speech_complete.wav', final_audio, 24000)

