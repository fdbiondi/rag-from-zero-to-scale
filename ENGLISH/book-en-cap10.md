---
title: "Local versus remote LLMs"
author: "Federico Andrés Biondi"
date: "2026"
language: "en"
chapter: 10
version: "1.0"
---

# Chapter 10. Local versus remote LLMs

## Why does this matter?

The generative model synthesizes retrieved passages. Claude and GPT avoid managing GPUs; Ollama with Mistral or Llama provides local control at a memory cost; Groq hosts inference for open models. Evaluate answer accuracy and end-to-end latency rather than token speed alone. Bound context and never treat retrieved data as instructions.

## How is it done?

Work with the companion repository. Preserve variable names, embedding dimensions, and HTTP contracts. Before replacing a provider, benchmark one correct and one incorrect case. The reference uses `backend/src/core.js` for integration logic and `backend/src/server.js` for validating HTTP traffic.

## Operational comparison

| Service | Cost model | Privacy | When to use | Setup | Latency |
|---|---|---|---|---|---|
| Claude | Token-based | Managed API | High-quality synthesis | Read official documentation | Measure p95 locally |
| GPT | Token-based | Managed API | Broad integrations | Read official documentation | Measure p95 locally |
| Ollama | Hardware/energy | Local by default | Privacy-first | Read official documentation | Measure p95 locally |
| Groq | Token-based | Managed API | Hosted open models | Read official documentation | Measure p95 locally |

## Lab: verifiable instructions

Run these blocks from repository root after starting the containers, except where noted. Expected outputs describe patterns; identifiers and response text can differ.

### 1. Check API health

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:3001/health
# Expected / Esperado: {"status":"ok"}
```

### 2. Ingest a document

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/ingest -H 'Content-Type: application/json' -d '{"name":"demo.txt","text":"The warranty lasts two years."}'
# Expected / Esperado: JSON with documentId and chunks / JSON con documentId y chunks
```

### 3. Ask a question

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/query -H 'Content-Type: application/json' -d '{"question":"How long is the warranty?"}'
# Expected / Esperado: JSON answer and sources / JSON con answer y sources
```

### 4. Check local LLM

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:11434/api/tags
# Expected / Esperado: JSON models list / JSON con modelos
```

## Three environments, one HTTP contract

**A. Simple local (Docker Compose).** Copy `.env.example` to `.env`, run `sh scripts/setup-dev.sh`, and inspect `http://localhost:5173` (frontend), `http://localhost:3001/health` (API), `http://localhost:6333` (Qdrant), and `http://localhost:11434` (Ollama). Docker and connectivity for images and models are required.

**B. Testing (Kind).** Run `sh scripts/setup-kind.sh`, then `kubectl get pods` and `kubectl port-forward svc/rag-api 3001:3001`. Important: the included manifest deploys only the backend. To test ingestion/querying, also deploy Qdrant and Ollama in the cluster or configure reachable services. The health check is useful for API networking tests.

**C. Production.** Publish an image to your registry, configure secrets and durable managed services, then run `IMAGE=<your-image> sh scripts/deploy-prod.sh`. This does not provision a complete cloud environment: EKS needs VPC, nodes, and IAM; Cloud Run and Azure Container Apps need their own deployment workflows and a reachable vector store. Budget each component separately.

## Frequent mistakes and exit criteria

- Never commit API credentials or put them in React.
- No retrieved document should produce an honest empty-evidence response, not a fabricated claim.
- A new embedding model may change dimensions: create a new index and reingest.
- The reference omits authentication, ingestion queues, and multi-tenant authorization. Implement those before exposing real data.
- Continue when you can identify retrieval, obtain a traceable source, and recognize an upstream failure.

**Next:** [Chapter 11](book-en-cap11.md).
