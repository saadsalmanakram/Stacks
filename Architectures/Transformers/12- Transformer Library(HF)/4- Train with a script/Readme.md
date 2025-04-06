
---

### Setup and Running Example Scripts

#### 1. Setup

Before running the example scripts, clone the 🤗 Transformers repository and install it from source in a new virtual environment:

```bash
git clone https://github.com/huggingface/transformers
cd transformers
pip install .
```

For older versions of the example scripts, checkout the specific version (e.g., v3.5.1):

```bash
git checkout tags/v3.5.1
```

After setting the correct version, navigate to the example folder and install the requirements:

```bash
pip install -r requirements.txt
```

#### 2. Run a Summarization Script (PyTorch)

You can fine-tune a model like T5-small on the CNN/DailyMail dataset for summarization. Here is how to run the PyTorch-based summarization training script:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

- `model_name_or_path`: Specifies the model to use (e.g., `google-t5/t5-small`).
- `dataset_name`: Dataset to be used for training (e.g., `cnn_dailymail`).
- `source_prefix`: Adds the prefix that T5 requires for summarization tasks (e.g., `summarize:`).
- `output_dir`: Directory to store the output.
- `per_device_train_batch_size`/`per_device_eval_batch_size`: Batch size for training and evaluation.

#### 3. Distributed Training and Mixed Precision

For distributed training and mixed precision, add the `fp16` argument to enable mixed precision. You also need to set the number of GPUs with the `nproc_per_node` argument:

```bash
torchrun \
    --nproc_per_node 8 pytorch/summarization/run_summarization.py \
    --fp16 \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

#### 4. Run on TPUs (PyTorch)

To run on a TPU, use the `xla_spawn.py` script. Here's an example to train on 8 TPU cores:

```bash
python xla_spawn.py --num_cores 8 \
    summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

#### 5. Run with 🤗 Accelerate (PyTorch)

Use 🤗 Accelerate for flexible training setups. Install 🤗 Accelerate first:

```bash
pip install git+https://github.com/huggingface/accelerate
```

Once installed, configure 🤗 Accelerate with:

```bash
accelerate config
```

Test the setup:

```bash
accelerate test
```

Now, you can run the training script using 🤗 Accelerate with:

```bash
accelerate launch run_summarization_no_trainer.py \
    --model_name_or_path google-t5/t5-small \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir ~/tmp/tst-summarization
```

#### 6. Use a Custom Dataset

If you want to use your custom dataset (CSV or JSON Lines), specify the dataset files and column names. Example:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --train_file path_to_csv_or_jsonlines_file \
    --validation_file path_to_csv_or_jsonlines_file \
    --text_column text_column_name \
    --summary_column summary_column_name \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --overwrite_output_dir \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --predict_with_generate
```

#### 7. Test a Script

To quickly test the script with a smaller number of dataset examples (useful to ensure that everything is working before full training), add:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --max_train_samples 50 \
    --max_eval_samples 50 \
    --max_predict_samples 50 \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

#### 8. Resume Training from Checkpoint

You can resume training from a checkpoint if the process was interrupted. Use the following argument to load the previous output:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --output_dir previous_output_dir \
    --predict_with_generate
```

Or specify a specific checkpoint folder:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --resume_from_checkpoint path_to_specific_checkpoint \
    --predict_with_generate
```

#### 9. Share Your Model

After training, you can share your model on the Hugging Face Model Hub:

```bash
huggingface-cli login
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path google-t5/t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --push_to_hub \
    --push_to_hub_model_id finetuned-t5-cnn_dailymail \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

---
