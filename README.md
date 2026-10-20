# RAG from Zero to Scale — companion repository / repositorio de acompañamiento

**Author / Autor:** Federico Andrés Biondi · 2026

> **Editorial status / Estado editorial: working draft / borrador de trabajo.** Both 20-chapter tracks exist, with translated explanations and identical lab commands. This is **not yet** a 200–300-page finished book, nor a production-ready platform. See `VALIDATION.md` before publication.

## Español: inicio rápido

1. Instalá Docker Engine con Docker Compose (v2) y Git.
2. Verificá 8 GB RAM mínimos sugeridos, 16 GB preferibles, 12 GB libres de disco aproximadamente y conexión para descargar modelos. Los tamaños pueden cambiar.
3. Desde esta carpeta ejecutá `sh scripts/setup-dev.sh`. El script crea `.env` a partir de `.env.example` y levanta Qdrant, Ollama, backend y frontend.
4. Esperá a que terminen las descargas de `nomic-embed-text` y `llama3.2:1b`.
5. Visitá <http://localhost:5173>, pegá un documento, indexalo y consultalo. API: <http://localhost:3001/health>.
6. Leé [la tabla de contenidos](ESPAÑOL/toc-es.md) y [la ruta maestra](diagrama-flujo-maestro.md).

## English: quick start

1. Install Docker Engine with Docker Compose (v2) and Git.
2. Allow at least approximately 8 GB RAM (16 GB preferable), 12 GB free storage, and internet for model downloads. Sizes may change.
3. Run `sh scripts/setup-dev.sh` from this folder. It creates `.env` and launches Qdrant, Ollama, backend and frontend.
4. Wait for `nomic-embed-text` and `llama3.2:1b` downloads.
5. Open <http://localhost:5173>, paste a document, index it, and ask about its contents. API: <http://localhost:3001/health>.
6. Follow the [table of contents](ENGLISH/toc-en.md) and [master reading map](diagrama-flujo-maestro.md).

## HTTP examples / Ejemplos HTTP

```bash
curl -fsS http://localhost:3001/health
# Expected: {"status":"ok"}

curl -fsS -X POST http://localhost:3001/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{"name":"manual.txt","text":"Our support hours are Monday to Friday."}'
# Expected: {"documentId":"...","chunks":1}

curl -fsS -X POST http://localhost:3001/api/query \
  -H 'Content-Type: application/json' \
  -d '{"question":"When is support available?"}'
# Expected: answer with source passages
```

## Optional remote inference / Inferencia remota opcional

Update `.env` with `EMBED_PROVIDER=openai`, `CHAT_PROVIDER=openai` and `OPENAI_API_KEY=...` (do not commit `.env`). For remote embeddings, use a fresh Qdrant collection because embedding dimensions and space differ. Restart the backend with `docker compose -f docker-compose.dev.yml up -d --force-recreate backend`. The pinned npm dependencies are Express, CORS and dotenv; provider integrations use HTTP rather than relying on an unverified SDK release. No Anthropic or Pinecone SDK is declared as an installed dependency.

## Tests / Pruebas

```bash
cd backend
node --test
# Expected: 5 passing unit tests
```

This command requires no installed npm packages for the current unit tests. Docker and cloud end-to-end tests remain pending.

## Repository layout / Estructura

- `ESPAÑOL/`, `ENGLISH/`: 20 matched chapters per language, cover, contents, appendices, glossary, author.
- `backend/`, `frontend/`: runnable development example.
- `docker-compose.dev.yml`: local services.
- `kind-config.yaml`, `k8s/`: backend-only Kind teaching example (upstream services not deployed).
- `scripts/`: local setup, Kind setup, Kubernetes image rollout.
- `REFERENCIAS_VERIFICADAS.md`: curated sources and dated price methodology.
- `VALIDATION.md`: verified facts and outstanding publication tasks.

## Security / Seguridad

The demo has no user authentication, document authorization, tenant isolation, file upload parser, queue, or enforced rate limit. **Never expose it to the public internet or ingest confidential user data.** Kubernetes and cloud instructions are conceptual and need full infrastructure work before production.

## GitHub

The archive is git-ready. To publish, create a repository under your GitHub account and run `git init`, `git add .`, `git commit -m 'Initial companion draft'`, `git remote add origin <your-repo-url>`, `git push -u origin main` (set your default branch before pushing). No public GitHub repository has been created by this delivery.
