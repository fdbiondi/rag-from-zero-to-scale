---
title: "Building the React frontend"
author: "Federico Andrés Biondi"
date: "2026"
language: "en"
chapter: 6
version: "1.0"
---

# Chapter 6. Building the React frontend

## Why does this matter?

React tracks document, question, response, and error separately. Ingestion and querying are asynchronous operations that can fail: show progress and retrieved sources. Never expose provider keys in the browser or connect a managed vector database directly from public frontend code.

## How is it done?

Work with the companion repository. Preserve variable names, embedding dimensions, and HTTP contracts. Before replacing a provider, benchmark one correct and one incorrect case. The reference uses `backend/src/core.js` for integration logic and `backend/src/server.js` for validating HTTP traffic.

## Lab: verifiable instructions

Run these blocks from repository root after starting the containers, except where noted. Expected outputs describe patterns; identifiers and response text can differ.

### 1. Check vector DB

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:6333/collections
# Expected / Esperado: JSON collections list / JSON con colecciones
```

### 2. Check containers

```bash
# From repository root / Desde la raíz del repositorio
docker compose -f docker-compose.dev.yml ps
# Expected / Esperado: Four running services / Cuatro servicios en ejecución
```

### 3. Inspect backend logs

```bash
# From repository root / Desde la raíz del repositorio
docker compose -f docker-compose.dev.yml logs --tail=20 backend
# Expected / Esperado: Recent logs / Logs recientes
```

### 4. Run unit tests

```bash
# From repository root / Desde la raíz del repositorio
cd backend && node --test test/core.test.js
# Expected / Esperado: 5 tests pass / 5 pruebas exitosas
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

**Next:** [Chapter 7](book-en-cap7.md).
