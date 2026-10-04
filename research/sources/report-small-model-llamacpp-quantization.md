Source: https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md
Title: llama.cpp/tools/quantize/README.md at master · ggml-org/llama.cpp · GitHub
Fetched: 2026-10-04T09:50:28.742Z

[Skip to content](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md) to refresh your session.Dismiss alert

{{ message }}

[ggml-org](https://github.com/ggml-org)/ **[llama.cpp](https://github.com/ggml-org/llama.cpp)** Public

- [Notifications](https://github.com/login?return_to=%2Fggml-org%2Fllama.cpp) You must be signed in to change notification settings
- [Fork\\
24k](https://github.com/login?return_to=%2Fggml-org%2Fllama.cpp)
- [Star\\
130k](https://github.com/login?return_to=%2Fggml-org%2Fllama.cpp)


## Collapse file tree

## Files

master

Search this repository(forward slash)` forward slash/`

/

# README.md

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

![pcuenca](https://avatars.githubusercontent.com/u/1177582?v=4&size=40)![CISC](https://avatars.githubusercontent.com/u/1629204?v=4&size=40)

[pcuenca](https://github.com/ggml-org/llama.cpp/commits?author=pcuenca)

and

[CISC](https://github.com/ggml-org/llama.cpp/commits?author=CISC)

[docs: Update quantization readme (](https://github.com/ggml-org/llama.cpp/commit/ad1b88ca0d37a2171efba1c04f1a3531c78f1b52) [#24133](https://github.com/ggml-org/llama.cpp/pull/24133) [)](https://github.com/ggml-org/llama.cpp/commit/ad1b88ca0d37a2171efba1c04f1a3531c78f1b52)

Open commit detailssuccess

4 months agoJun 5, 2026

[ad1b88c](https://github.com/ggml-org/llama.cpp/commit/ad1b88ca0d37a2171efba1c04f1a3531c78f1b52) · 4 months agoJun 5, 2026

## History

[History](https://github.com/ggml-org/llama.cpp/commits/master/tools/quantize/README.md)

Open commit details

[View commit history for this file.](https://github.com/ggml-org/llama.cpp/commits/master/tools/quantize/README.md) History

196 lines (146 loc) · 12.1 KB

· Code owner: @ggerganov

/

# README.md

Copy path

Top

## File metadata and controls

- Preview

- Code

- Blame


196 lines (146 loc) · 12.1 KB

· Code owner: @ggerganov

[Raw](https://github.com/ggml-org/llama.cpp/raw/refs/heads/master/tools/quantize/README.md)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Outline

Edit and raw actions

# quantize

[Permalink: quantize](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#quantize)

This tool takes a GGUF input model file, typically in a high-precision format like F32 or BF16, and converts it to a quantized format.
Quantization reduces the precision of model weights (e.g., from 32-bit floats to 4-bit integers), which shrinks the model's size and can speed up inference.
This process however, may introduce some accuracy loss which is usually measured in [Perplexity](https://huggingface.co/docs/transformers/en/perplexity) (ppl) and/or [Kullback–Leibler Divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence) (kld).
This can be minimized by using a suitable imatrix file.

You can also use the [GGUF-my-repo](https://huggingface.co/spaces/ggml-org/gguf-my-repo) space on Hugging Face to build your own quants without any setup. It syncs from llama.cpp `main` every 6 hours.

## Overview

[Permalink: Overview](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#overview)

Quantization is done in two phases:

- Convert the original model to GGUF format.
- Quantize the converted GGUF file.

If the model supports multimodal inputs (images or audio), you also need to convert and quantize the multimodal encoders and projectors.

To perform these tasks, you need to install the Python requirements:

```
python3 -m pip install -r requirements.txt
```

Or if you use `uv`:

```
uv pip install -r requirements.txt --index-strategy unsafe-best-match
```

## Prepare the input GGUF file

[Permalink: Prepare the input GGUF file](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#prepare-the-input-gguf-file)

To convert a model from a Hugging Face repo, you can use a command like the following:

```
python convert_hf_to_gguf.py --outfile gemma-4-E2B-it-bf16.gguf --outtype bf16 --remote google/gemma-4-E2B-it
```

Notes:

- In the usual case where the model is distributed in 16-bit format, `--outtype auto` (or omitting `--outtype` entirely) also works well.
- If you have previously downloaded the model locally, specify the directory and remove the `--remote` flag.
- For compatibility reasons, the Python requirements install transformers 4, but more and more models (like Gemma 4) require transformers 5. You can safely `pip install -U transformers` to get the latest version.

## Quantize the GGUF

[Permalink: Quantize the GGUF](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#quantize-the-gguf)

After you have created a high-quality GGUF version of the model, you use `llama-quantize` to apply quantization. For example, quantize to `Q4_K_M` using a command like the following:

```
./build/bin/llama-quantize gemma-4-E2B-it-bf16.gguf gemma-4-E2B-it-Q4_K_M.gguf Q4_K_M
```

Various quantization methods are described [later in this document](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#quantize).

Options:

- `--allow-requantize` allow requantizing tensors that have already been quantized. Warning: This can severely reduce quality compared to quantizing from 16bit or 32bit
- `--leave-output-tensor` leave output.weight un(re)quantized. Increases model size but may also increase quality, especially when requantizing
- `--pure` disable k-quant mixtures and quantizes all tensors to the same type
- `--imatrix file_name` use data in file\_name as importance matrix for quant optimizations
- `--include-weights tensor_name` use importance matrix for this tensor (can be specified multiple times)
- `--exclude-weights tensor_name` use importance matrix for the tensors **not** specified (include/exclude cannot be mixed)
- `--output-tensor-type` use a specific quant type for the output.weight tensor
- `--token-embedding-type` use a specific quant type for the token embeddings tensor
- `--keep-split` generate the quantized model in the same shards as the input file instead of a single quantized file

Advanced options:

- `--tensor-type` quantize specific tensor(s) to specific quant types. Supports regex syntax. May be specified multiple times.
- `--prune-layers` prune (remove) the layers in the list
- `--override-kv` option to override model metadata by key in the quantized model. May be specified multiple times.

## (Optional) Convert the multimodal components

[Permalink: (Optional) Convert the multimodal components](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#optional-convert-the-multimodal-components)

llama.cpp will convert the LLM portion of the source model, which is enough for conversational applications. If the model accepts multimodal inputs and you wish to take advantage of them, you need to create a separate GGUF file. This file is generically known as `mmproj`, for "multimedia projector"; however, it may contain various components such as vision or audio encoders in addition to projections.

Multimodal components are usually much smaller than the LLMs they come with. In addition, their quality has a direct impact on the quality of LLM generations, because these components are in charge of preparing the inputs for the LLM: the closer inputs are to data seen during training, the better LLM results will be.

For these reasons, multimodal components are usually kept in a high-quality format such as bf16 or q8. The impact on speed and memory from using a smaller quant is negligible, but overall quality could be impacted.

```
python convert_hf_to_gguf.py --mmproj --outfile mmproj-gemma-4-E2B-it-Q8_0.gguf --outtype q8_0 --remote google/gemma-4-E2B-it
```

## Run the quantized model

[Permalink: Run the quantized model](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#run-the-quantized-model)

```
./build/bin/llama cli -m ./gemma-4-E2B-it-Q4_K_M.gguf --mmproj ./mmproj-gemma-4-E2B-it-Q8_0.gguf --image <input_image> --prompt "Describe this image"
```

## Quantization Examples

[Permalink: Quantization Examples](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#quantization-examples)

```
# naive Q4_K_M quantization using default settings and 8 CPU threads. Output will be "ggml-model-Q4_K_M.gguf"
./llama-quantize input-model-f32.gguf q4_k_m 8
```

```
#  quantize model enabling re-quantization, leaving the output tensor unquantized and all others quantized at the same level (Q4_K)
./llama-quantize --allow-requantize --leave-output-tensor --pure input-model-f32.gguf q4_k_m 8
```

```
# quantize model using an importance matrix for specified tensors only (attn_v and ffn_down)
./llama-quantize --imatrix imatrix.gguf --include-weights attn_v --include-weights ffn_down input-model-f32.gguf q4_k_m 8
```

```
# quantize model setting output tensor to Q5_K_M, token embeddings to Q3_K_M, and keeping the input file's shards
./llama-quantize --imatrix imatrix.gguf --output-tensor-type q5_k --token-embedding-type q3_k --keep-split input-model-f32.gguf q4_k_m 8
```

```
# quantize model using a regex to quantize attn_k tensors in odd layers to Q5_K_M and attn_q tensors in even layers to Q3_K_M
./llama-quantize --imatrix imatrix.gguf --tensor-type "\.(\d*[13579])\.attn_k=q5_k" --tensor-type "\.(\d*[02468])\.attn_q=q3_k" input-model-f32.gguf q4_k_m 8
```

```
# quantize model setting tensors attn_v and ffn_down to Q5_K_M and pruning layers 20, 21, and 22
./llama-quantize --imatrix imatrix.gguf --tensor-type attn_v=q5_k --tensor-type ffn_down=q5_k --prune-layers 20,21,22 input-model-f32.gguf q4_k_m 8
```

```
# override expert used count metadata to 16, prune layers 20, 21, and 22 without quantizing the model (copy tensors) and use specified name for the output file
./llama-quantize --imatrix imatrix.gguf --override-kv qwen3moe.expert_used_count=int:16 --prune-layers 20,21,22 input-model-f32.gguf pruned-model-f32.gguf copy 8
```

## Memory/Disk Requirements

[Permalink: Memory/Disk Requirements](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#memorydisk-requirements)

When running the larger models, make sure you have enough disk space to store all the intermediate files.
As the models are currently fully loaded into memory, you will need adequate disk space to save them and sufficient RAM to load them. At the moment, memory and disk requirements are the same. For example (Llama 3.1):

| Model | Original size | Quantized size (Q4\_K\_M) |
| --: | --: | --: |
| 8B | 32.1 GB | 4.9 GB |
| 70B | 280.9 GB | 43.1 GB |
| 405B | 1,625.1 GB | 249.1 GB |

## Quantization

[Permalink: Quantization](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#quantization)

Several quantization methods are supported. They differ in the resulting model disk size and inference speed. For example,

### [meta-llama/Llama-3.1-8B](https://huggingface.co/meta-llama/Llama-3.1-8B)

[Permalink: meta-llama/Llama-3.1-8B](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#meta-llamallama-31-8b)

| Measure | IQ1\_S | IQ1\_M | IQ2\_XXS | IQ2\_XS | IQ2\_S | IQ2\_M |
| --- | --- | --- | --- | --- | --- | --- |
| bits/weight | 2.0042 | 2.1460 | 2.3824 | 2.5882 | 2.7403 | 2.9294 |
| size (GiB) | 1.87 | 2.01 | 2.23 | 2.42 | 2.56 | 2.74 |
| prompt processing t/s @ 512 | 858.88 ±1.22 | 847.99 ±0.47 | 852.39 ±0.85 | 826.99 ±12.51 | 783.55 ±13.73 | 787.68 ±7.00 |
| text generation t/s @ 128 | 79.73 ±0.79 | 72.92 ±0.14 | 79.86 ±0.22 | 78.04 ±0.46 | 77.30 ±2.47 | 74.44 ±0.15 |

| Measure | IQ3\_XXS | IQ3\_XS | IQ3\_S | IQ3\_M | IQ4\_XS | IQ4\_NL |
| --- | --- | --- | --- | --- | --- | --- |
| bits/weight | 3.2548 | 3.4977 | 3.6606 | 3.7628 | 4.4597 | 4.6818 |
| size (GiB) | 3.04 | 3.27 | 3.42 | 3.52 | 4.17 | 4.38 |
| prompt processing t/s @ 512 | 813.88 ±6.53 | 708.71 ±1.26 | 798.78 ±8.81 | 768.70 ±13.73 | 771.80 ±11.38 | 806.03 ±7.07 |
| text generation t/s @ 128 | 73.95 ±0.20 | 71.67 ±0.54 | 69.31 ±0.63 | 70.15 ±0.33 | 77.51 ±0.20 | 76.63 ±0.28 |

| Measure | Q2\_K\_S | Q2\_K | Q3\_K\_S | Q3\_K\_M | Q3\_K\_L | Q4\_K\_S |
| --- | --- | --- | --- | --- | --- | --- |
| bits/weight | 2.9697 | 3.1593 | 3.6429 | 3.9960 | 4.2979 | 4.6672 |
| size (GiB) | 2.78 | 2.95 | 3.41 | 3.74 | 4.02 | 4.36 |
| prompt processing t/s @ 512 | 798.91 ±6.40 | 784.45 ±7.85 | 752.17 ±7.94 | 783.44 ±9.92 | 761.17 ±7.55 | 818.55 ±9.58 |
| text generation t/s @ 128 | 90.01 ±0.12 | 79.85 ±0.20 | 69.84 ±0.18 | 71.68 ±0.22 | 69.38 ±0.49 | 76.71 ±0.20 |

| Measure | Q4\_K\_S | Q4\_K\_M | Q5\_K\_S | Q5\_K\_M | Q6\_K | Q8\_0 |
| --- | --- | --- | --- | --- | --- | --- |
| bits/weight | 4.6672 | 4.8944 | 5.5704 | 5.7036 | 6.5633 | 8.5008 |
| size (GiB) | 4.36 | 4.58 | 5.21 | 5.33 | 6.14 | 7.95 |
| prompt processing t/s @ 512 | 818.55 ±9.58 | 821.81 ±21.44 | 752.52 ±0.99 | 758.69 ±7.43 | 812.01 ±10.82 | 865.09 ±8.30 |
| text generation t/s @ 128 | 76.71 ±0.20 | 71.93 ±1.52 | 69.53 ±0.18 | 67.23 ±1.08 | 58.67 ±3.13 | 50.93 ±0.08 |

| Measure | F16 |
| --- | --- |
| bits/weight | 16.0005 |
| size (GiB) | 14.96 |
| prompt processing t/s @ 512 | 923.49 ±0.53 |
| text generation t/s @ 128 | 29.17 ±0.04 |

## Background information on llama-quantize

[Permalink: Background information on llama-quantize](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md#background-information-on-llama-quantize)

- [k-quants](https://github.com/ggml-org/llama.cpp/pull/1684)
- k-quants improvements and i-quants
  - [#2707](https://github.com/ggml-org/llama.cpp/pull/2707)
  - [#2807](https://github.com/ggml-org/llama.cpp/pull/2807)
  - [#4773 - 2-bit i-quants (inference)](https://github.com/ggml-org/llama.cpp/pull/4773)
  - [#4856 - 2-bit i-quants (inference)](https://github.com/ggml-org/llama.cpp/pull/4856)
  - [#4861 - importance matrix](https://github.com/ggml-org/llama.cpp/pull/4861)
  - [#4872 - MoE models](https://github.com/ggml-org/llama.cpp/pull/4872)
  - [#4897 - 2-bit quantization](https://github.com/ggml-org/llama.cpp/pull/4897)
  - [#4930 - imatrix for all k-quants](https://github.com/ggml-org/llama.cpp/pull/4930)
  - [#4951 - imatrix on the GPU](https://github.com/ggml-org/llama.cpp/pull/4957)
  - [#4969 - imatrix for legacy quants](https://github.com/ggml-org/llama.cpp/pull/4969)
  - [#4996 - k-quants tuning](https://github.com/ggml-org/llama.cpp/pull/4996)
  - [#5060 - Q3\_K\_XS](https://github.com/ggml-org/llama.cpp/pull/5060)
  - [#5196 - 3-bit i-quants](https://github.com/ggml-org/llama.cpp/pull/5196)
  - [quantization tuning](https://github.com/ggml-org/llama.cpp/pull/5320), [another one](https://github.com/ggml-org/llama.cpp/pull/5334), and [another one](https://github.com/ggml-org/llama.cpp/pull/5361)

You can’t perform that action at this time.