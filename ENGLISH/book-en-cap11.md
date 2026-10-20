---
title: "Document storage"
author: "Federico Andrés Biondi"
date: "2026"
language: "en"
chapter: 11
version: "1.0"
---

# Chapter 11. Document storage

## Why does this matter?

Do not mix original files, metadata, and vectors without a retention policy. PostgreSQL with pgvector combines transactional data and retrieval; MongoDB with Qdrant separates metadata from search; S3 with Pinecone keeps originals and embeddings independent. Implement deletion propagation, versioning, and retention.

## How is it done?

Work with the companion repository. Preserve variable names, embedding dimensions, and HTTP contracts. Before replacing a provider, benchmark one correct and one incorrect case. The reference uses `backend/src/core.js` for integration logic and `backend/src/server.js` for validating HTTP traffic.

## Operational comparison

| Service | Cost model | Privacy | When to use | Setup | Latency |
|---|---|---|---|---|---|
| PostgreSQL + pgvector | DB hosting | Single data boundary | Relational apps | Read official documentation | Measure p95 locally |
| MongoDB + Qdrant | Two deployments | Configurable | Document-shaped metadata | Read official documentation | Measure p95 locally |
| S3 + Pinecone | Storage + index | Managed providers | Large source files | Read official documentation | Measure p95 locally |

## Lab: verifiable instructions

Run these blocks from repository root after starting the containers, except where noted. Expected outputs describe patterns; identifiers and response text can differ.

### 1. Ingest a document

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/ingest -H 'Content-Type: application/json' -d '{"name":"demo.txt","text":"The warranty lasts two years."}'
# Expected / Esperado: JSON with documentId and chunks / JSON con documentId y chunks
```

### 2. Ask a question

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/query -H 'Content-Type: application/json' -d '{"question":"How long is the warranty?"}'
# Expected / Esperado: JSON answer and sources / JSON con answer y sources
```

### 3. Check local LLM

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:11434/api/tags
# Expected / Esperado: JSON models list / JSON con modelos
```

### 4. Check vector DB

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:6333/collections
# Expected / Esperado: JSON collections list / JSON con colecciones
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

**Next:** [Chapter 12](book-en-cap12.md).
