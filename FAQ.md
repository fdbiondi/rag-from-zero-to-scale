# FAQ / Preguntas frecuentes

## ¿Cuál es el primer archivo? / Which file first?

Read `diagrama-flujo-maestro.md`, then `ESPAÑOL/toc-es.md` or `ENGLISH/toc-en.md`.

## ¿Necesito una API key? / Do I need an API key?

No for the Ollama + Qdrant Docker path. Yes for remote OpenAI calls.

## ¿Puedo usar información sensible? / Can I use confidential data?

Not with the supplied demo. Add authentication, authorization before retrieval, encryption, retention rules, and audit logging.

## ¿Kind es idéntico a EKS? / Is Kind the same as EKS?

No. Kind is a local Kubernetes test environment. This repository only includes a backend manifest; deploy or connect Ollama and Qdrant independently.

## ¿Se puede cambiar Pinecone a PostgreSQL en cinco minutos? / Can Pinecone be switched to PostgreSQL in five minutes?

Not for a real dataset without pre-existing migration tooling. You must provision pgvector, create compatible columns/indexes, export source documents, reindex vectors, validate filters and permissions, and benchmark queries. A five-minute *configuration* change is possible only after prebuilding and testing both adapters.
