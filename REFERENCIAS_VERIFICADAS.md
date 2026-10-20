# Curated verified references / Referencias depuradas

**Verification date / Fecha de revisión:** 2026-10-20. The supplied `FUENTES_Y_REFERENCIAS.md` has many links that were **not** carried into this list because they were outdated, redundant, generic, or not individually verified. These URLs have been checked through web retrieval; they do not imply that all linked product versions or third-party infrastructure have been tested.

1. Lewis et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (2020): https://arxiv.org/abs/2005.11401
2. Gao et al., *Retrieval-Augmented Generation for Large Language Models: A Survey* (2023): https://arxiv.org/abs/2312.10997
3. OpenAI embedding documentation: https://developers.openai.com/api/docs/guides/embeddings
4. OpenAI `text-embedding-3-small` model and pricing: https://developers.openai.com/api/docs/models/text-embedding-3-small
5. OpenAI `gpt-4.1-mini` model and pricing (listed as deprecated; do not choose for a new long-lived deployment without checking replacements): https://developers.openai.com/api/docs/models/gpt-4.1-mini
6. Anthropic model pricing: https://docs.anthropic.com/en/docs/about-claude/pricing
7. Pinecone pricing: https://www.pinecone.io/pricing/
8. Amazon EKS documentation: https://docs.aws.amazon.com/eks/latest/userguide/

## Dated cost worked example / Ejemplo de costos con fecha

**Assumption / Supuesto:** 1,000 users × 5 queries/day × 30 days = **150,000 monthly queries**. Each query consumes an assumed 800 input tokens for retrieval+context and 250 output tokens. Embedding the query consumes another 100 tokens. Token numbers are planning assumptions, **not measured usage**.

| Component / Componente | Calculation / Cálculo | Monthly USD / USD mes |
|---|---:|---:|
| GPT-4.1 mini input (historical listed rate, model deprecated) | 150,000 × 800 / 1,000,000 × $0.40 | $48.00 |
| GPT-4.1 mini output | 150,000 × 250 / 1,000,000 × $1.60 | $60.00 |
| `text-embedding-3-small` query embeddings | 150,000 × 100 / 1,000,000 × $0.02 | $0.30 |
| **Illustrative API subtotal / Subtotal ilustrativo** | | **$108.30** |

This excludes initial ingestion, Qdrant/Pinecone or pgvector storage, network, monitoring, taxes, retries, reserved or provisioned compute, and development time. A local model substitutes GPU/CPU/RAM/energy cost for per-token API charges. Pricing depends on region/provider and may change after verification. For current deployments, recalculate using active models and contract-specific prices. See chapters 10 and 13.

For comparison, at the verified Anthropic Sonnet 5.5 rates ($2 per million input and $10 per million output tokens), under **the same assumed token counts** the model-only cost would be `(120M × $2 + 37.5M × $10)/1M = $615/month`, excluding embeddings and infrastructure. Model quality, caching and tokenization may change the actual token counts.
