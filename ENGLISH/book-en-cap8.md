---
title: "Vector databases"
author: "Federico Andrés Biondi"
date: "2026"
language: "en"
chapter: 8
version: "1.0"
---

# Chapter 8. Vector databases

## Why does this matter?

Pinecone and Weaviate offer specialized managed retrieval; Qdrant runs conveniently in containers; PostgreSQL with pgvector reuses relational operations. Choose based on filtering, workload, operations, and team expertise. Rebuild the index when migrating across incompatible embedding models.

## How is it done?

Work with the companion repository. Preserve variable names, embedding dimensions, and HTTP contracts. Before replacing a provider, benchmark one correct and one incorrect case. The reference uses `backend/src/core.js` for integration logic and `backend/src/server.js` for validating HTTP traffic.

## Operational comparison

| Service | Cost model | Privacy | When to use | Setup | Latency |
|---|---|---|---|---|---|
| Pinecone | Usage-based | Managed SaaS | Dedicated retrieval | Read official documentation | Measure p95 locally |
| Weaviate | Cloud or self-hosted | Configurable | Hybrid workloads | Read official documentation | Measure p95 locally |
| PostgreSQL + pgvector | Compute + storage | Self-controlled | Existing SQL stack | Read official documentation | Measure p95 locally |
| Qdrant | Cloud or Docker | Self-controlled | Fast local prototype | Read official documentation | Measure p95 locally |

## Lab: verifiable instructions

Run these blocks from repository root after starting the containers, except where noted. Expected outputs describe patterns; identifiers and response text can differ.

### 1. Inspect backend logs

```bash
# From repository root / Desde la raíz del repositorio
docker compose -f docker-compose.dev.yml logs --tail=20 backend
# Expected / Esperado: Recent logs / Logs recientes
```

### 2. Run unit tests

```bash
# From repository root / Desde la raíz del repositorio
cd backend && node --test test/core.test.js
# Expected / Esperado: 5 tests pass / 5 pruebas exitosas
```

### 3. Check API health

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:3001/health
# Expected / Esperado: {"status":"ok"}
```

### 4. Ingest a document

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/ingest -H 'Content-Type: application/json' -d '{"name":"demo.txt","text":"The warranty lasts two years."}'
# Expected / Esperado: JSON with documentId and chunks / JSON con documentId y chunks
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

**Next:** [Chapter 9](book-en-cap9.md).
