Source: https://arxiv.org/html/2404.06654v1
Title: RULER: What’s the Real Context Size of Your Long-Context Language Models?
Fetched: 2026-10-04 via webFetch
Publication record: arXiv:2404.06654v1, first posted 2024-04-09; later published at COLM 2024.

## Relevant evidence

The paper introduces RULER, a synthetic benchmark with 13 task configurations across retrieval, multi-hop tracing, aggregation and question answering. It evaluates ten long-context language models. The authors report that models can score nearly perfectly on a basic needle-in-a-haystack retrieval task while showing substantial performance drops on more complex tasks as context length increases.

The paper tests sequence lengths from 4K to 128K. Among the systems tested, only four maintained what the authors call satisfactory performance at 32K, although all tested models advertised context sizes of at least 32K. The paper’s findings are about the evaluated 2024 systems and its chosen tasks; they are not measurements of current 2026 product models.

## Citation scope

Use the study to explain why a maximum input length and reliable performance across long-context tasks are different measurements. Do not apply its numerical results directly to newer systems.