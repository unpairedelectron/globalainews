Source: https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization
Title: GPU Memory Calculation and Configuration - vLLM-Omni
Fetched: 2026-10-04T09:51:33.891Z

[Skip to content](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/#gpu-memory-calculation-and-configuration)

[Provide feedback](https://github.com/vllm-project/vllm-omni/issues/new?template=100-documentation.yml&title=%5BDocs%5D%20Feedback%20for%20%60%2Fprojects%2Fvllm-omni%2Fen%2Flatest%2Fconfiguration%2Fgpu_memory_utilization%2F%60&body=%F0%9F%93%84%20**Reference%3A**%0Ahttps%3A%2F%2Fdocs.vllm.ai%2Fprojects%2Fvllm-omni%2Fen%2Flatest%2Fconfiguration%2Fgpu_memory_utilization%2F%0A%0A%F0%9F%93%9D%20**Feedback%3A**%0A_Your%20response_ "Provide feedback") [Edit this page](https://github.com/vllm-project/vllm-omni/edit/main/docs/configuration/gpu_memory_utilization.md "Edit this page")

# GPU Memory Calculation and Configuration [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#gpu-memory-calculation-and-configuration "Permanent link")

This guide explains how to calculate GPU memory requirements and properly configure `gpu_memory_utilization` for vLLM-Omni stages.

## Overview [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#overview "Permanent link")

`gpu_memory_utilization` is a critical parameter that controls how much GPU memory each stage can use. It's specified as a fraction between 0.0 and 1.0, where: - `0.8` means 80% of the GPU's total memory - `1.0` means 100% of the GPU's total memory (not recommended, leaves no buffer)

## How Memory is Calculated [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#how-memory-is-calculated "Permanent link")

### Memory Allocation Formula [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#memory-allocation-formula "Permanent link")

For each stage, vLLM-Omni calculates the requested memory as:

```
requested_memory = total_gpu_memory × gpu_memory_utilization
```

The system checks that:

```
free_memory ≥ requested_memory
```

If this condition is not met, the stage will fail to initialize with an error message showing the memory requirements.

### Memory Components [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#memory-components "Permanent link")

The total memory used by a stage includes:

1. **Model Weights**: The size of the model parameters loaded on the GPU
2. **KV Cache**: Memory for storing key-value cache during generation
3. **Activation Memory**: Temporary memory for intermediate computations
4. **System Overhead**: Memory used by CUDA, PyTorch, and other system components
5. **Non-Torch Memory**: Memory allocated outside of PyTorch (e.g., CUDA graphs)

### Example Calculation [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#example-calculation "Permanent link")

For a GPU with 80GB total memory: - `gpu_memory_utilization: 0.8` → 64GB available for the stage - `gpu_memory_utilization: 0.6` → 48GB available for the stage - `gpu_memory_utilization: 0.15` → 12GB available for the stage

## Setting Up `gpu_memory_utilization` [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#setting-up-gpu_memory_utilization "Permanent link")

### Step 1: Determine GPU Memory [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#step-1-determine-gpu-memory "Permanent link")

First, check your GPU's total memory:

```
# Using nvidia-smi
nvidia-smi --query-gpu=memory.total --format=csv

# Or using Python
python -c "import torch; print(f'{torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB')"
```

### Step 2: Estimate Model Memory Requirements [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#step-2-estimate-model-memory-requirements "Permanent link")

#### For Autoregressive (AR) Stages [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#for-autoregressive-ar-stages "Permanent link")

AR stages typically need more memory due to: - Large model weights - KV cache for attention - Activation buffers

#### For Diffusion/Generation Stages [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#for-diffusiongeneration-stages "Permanent link")

Diffusion stages (like code2wav) typically need less memory: - Smaller model components - Different memory access patterns

**Typical values:** \- `0.1 - 0.3` for most diffusion stages

### Step 3: Consider Multi-Stage Scenarios [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#step-3-consider-multi-stage-scenarios "Permanent link")

When multiple stages share the same GPU, you must ensure the sum of their `gpu_memory_utilization` values doesn't exceed 1.0.

**Example: Two stages on GPU 0**

```
stages:
  - stage_id: 0
    devices: "0"
    gpu_memory_utilization: 0.6  # Uses 60% of GPU 0

  - stage_id: 1
    devices: "0"
    gpu_memory_utilization: 0.3  # Uses 30% of GPU 0
    # Total: 90% of GPU 0 (safe, leaves 10% buffer)
```

**Important:** If stages run on different GPUs, each can use up to 1.0 independently.

### Step 4: Account for Tensor Parallelism [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#step-4-account-for-tensor-parallelism "Permanent link")

When using `tensor_parallel_size > 1`, the model is split across multiple GPUs, so each GPU needs less memory.

**Example: 2-way tensor parallelism**

```
stages:
  - stage_id: 0
    devices: "0,1"  # Uses both GPUs
    tensor_parallel_size: 2
    gpu_memory_utilization: 0.6  # 60% per GPU
    # Model is split, so each GPU uses ~30% of model memory
```

## Examples [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#examples "Permanent link")

### Qwen3-Omni-MoE on 2x H100-80GB [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#qwen3-omni-moe-on-2x-h100-80gb "Permanent link")

```
base_config: /path/to/vllm_omni/deploy/qwen3_omni_moe.yaml

stages:
  - stage_id: 0  # Thinker stage with TP=2
    devices: "0,1"
    tensor_parallel_size: 2
    gpu_memory_utilization: 0.6  # 48GB per GPU

  - stage_id: 1  # Talker stage
    devices: "1"
    gpu_memory_utilization: 0.3  # 24GB on GPU 1

  - stage_id: 2  # Code2Wav stage
    devices: "0"
    gpu_memory_utilization: 0.1  # 8GB on GPU 0
```

**Note:** Stage 0 uses GPUs 0 and 1, so the combined utilization is `0.7` on GPU 0 and `0.9` on GPU 1. Keep the sum of all resident stages below `1.0` on each device.

## Troubleshooting [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#troubleshooting "Permanent link")

### Error: "Free memory is less than desired GPU memory utilization" [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#error-free-memory-is-less-than-desired-gpu-memory-utilization "Permanent link")

This means the GPU doesn't have enough free memory when the stage starts.

**Solutions:** 1\. Free up memory by closing other processes 2. Reduce `gpu_memory_utilization` for this stage 3. Use a GPU with more memory 4. Move the stage to a different GPU

### Error: OOM during inference [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#error-oom-during-inference "Permanent link")

The stage initialized but ran out of memory during processing.

**Solutions:** 1\. Reduce `max_num_batched_tokens` 2\. Reduce `max_num_seqs` in engine\_args 3. Lower `gpu_memory_utilization` slightly 4. Enable quantization if supported

### Memory Not Fully Utilized [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#memory-not-fully-utilized "Permanent link")

If you see low memory usage, you can: 1. Increase `gpu_memory_utilization` to allow larger KV cache 2. Increase `max_num_batched_tokens` for better batching 3. Check if other stages are limiting throughput

## Useful formula for Memory Calculation [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#useful-formula-for-memory-calculation "Permanent link")

### KV Cache Memory [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#kv-cache-memory "Permanent link")

The KV cache size depends on: - Number of sequences in batch - Sequence length (prompt + generation) - Model hidden size - Number of attention heads - Number of layers

approximate Formula:

```
kv_cache_memory ≈ batch_size × seq_len × hidden_size × num_layers × 2 × dtype_size
```

2 for k & v

### Model Weight Memory [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#model-weight-memory "Permanent link")

```
model_memory ≈ num_parameters × dtype_size
```

For example: - 7B parameters in FP16: ~14GB - 7B parameters in FP32: ~28GB - 7B parameters in INT8: ~7GB

### Activation Memory [¶](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/\#activation-memory "Permanent link")

Activation memory is typically smaller but varies with: - Batch size - Sequence length - Model architecture

It's usually 10-30% of model weight memory during inference.

Back to top

Versions**[latest](https://docs.vllm.ai/projects/vllm-omni/en/latest/configuration/gpu_memory_utilization/)**[stable](https://docs.vllm.ai/projects/vllm-omni/en/stable/configuration/gpu_memory_utilization/)[v0.30.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.30.0/configuration/gpu_memory_utilization/)[v0.28.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.28.0/configuration/gpu_memory_utilization/)[v0.26.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.26.0/configuration/gpu_memory_utilization/)[v0.24.1](https://docs.vllm.ai/projects/vllm-omni/en/v0.24.1/configuration/gpu_memory_utilization/)[v0.24.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.24.0/configuration/gpu_memory_utilization/)[v0.22.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.22.0/configuration/gpu_memory_utilization/)[v0.20.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.20.0/configuration/gpu_memory_utilization/)[v0.18.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.18.0/configuration/gpu_memory_utilization/)[v0.16.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.16.0/configuration/gpu_memory_utilization/)[v0.14.0](https://docs.vllm.ai/projects/vllm-omni/en/v0.14.0/configuration/gpu_memory_utilization/)On Read the Docs[Project Home](https://app.readthedocs.org/projects/vllm-omni/?utm_source=vllm-omni&utm_content=flyout)[Builds](https://app.readthedocs.org/projects/vllm-omni/builds/?utm_source=vllm-omni&utm_content=flyout)Search

* * *

[Addons documentation](https://docs.readthedocs.io/page/addons.html?utm_source=vllm-omni&utm_content=flyout) ― Hosted by
[Read the Docs](https://about.readthedocs.com/?utm_source=vllm-omni&utm_content=flyout)