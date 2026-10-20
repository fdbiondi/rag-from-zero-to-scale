---
title: "Bases de datos vectoriales"
author: "Federico Andrés Biondi"
date: "2026"
language: "es"
chapter: 8
version: "1.0"
---

# Capítulo 8. Bases de datos vectoriales

## ¿Por qué importa?

Pinecone y Weaviate delegan operación en servicios especializados; Qdrant ofrece una base vectorial sencilla de ejecutar en contenedor; PostgreSQL con pgvector reutiliza infraestructura relacional. Elegir depende del filtrado, operaciones, volumen y experiencia del equipo. Al migrar, cambia el índice completo si cambia el modelo de embeddings.

## ¿Cómo se hace?

Trabajá sobre el repositorio de acompañamiento. Conservá los nombres de variables, las dimensiones de embeddings y los contratos HTTP. Antes de sustituir un proveedor, medí un caso correcto y uno incorrecto. El código de referencia usa `backend/src/core.js` para centralizar la integración y `backend/src/server.js` para validar el tráfico HTTP.

## Comparación operativa

| Servicio | Costo (modelo) | Privacidad | Cuándo usar | Setup | Latencia |
|---|---|---|---|---|---|
| Pinecone | Usage-based | Managed SaaS | Dedicated retrieval | Consultar documentación oficial | Medir p95 localmente |
| Weaviate | Cloud or self-hosted | Configurable | Hybrid workloads | Consultar documentación oficial | Medir p95 localmente |
| PostgreSQL + pgvector | Compute + storage | Self-controlled | Existing SQL stack | Consultar documentación oficial | Medir p95 localmente |
| Qdrant | Cloud or Docker | Self-controlled | Fast local prototype | Consultar documentación oficial | Medir p95 localmente |

## Laboratorio: instrucciones verificables

Estos bloques se ejecutan desde la raíz del repositorio una vez iniciados los contenedores, salvo que se indique lo contrario. Las salidas mostradas son patrones esperados; los identificadores y el texto de respuesta pueden variar.

### 1. Revisar logs backend

```bash
# From repository root / Desde la raíz del repositorio
docker compose -f docker-compose.dev.yml logs --tail=20 backend
# Expected / Esperado: Recent logs / Logs recientes
```

### 2. Ejecutar pruebas unitarias

```bash
# From repository root / Desde la raíz del repositorio
cd backend && node --test test/core.test.js
# Expected / Esperado: 5 tests pass / 5 pruebas exitosas
```

### 3. Comprobar API

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS http://localhost:3001/health
# Expected / Esperado: {"status":"ok"}
```

### 4. Ingerir un documento

```bash
# From repository root / Desde la raíz del repositorio
curl -fsS -X POST http://localhost:3001/api/ingest -H 'Content-Type: application/json' -d '{"name":"demo.txt","text":"The warranty lasts two years."}'
# Expected / Esperado: JSON with documentId and chunks / JSON con documentId y chunks
```

## Tres entornos: el mismo contrato HTTP

**A. Local simple (Docker Compose).** Copiá `.env.example` a `.env`, ejecutá `sh scripts/setup-dev.sh`, y comprobá `http://localhost:5173` (frontend), `http://localhost:3001/health` (API), `http://localhost:6333` (Qdrant) y `http://localhost:11434` (Ollama). Esto requiere Docker instalado y conexión para descargar imágenes y modelos.

**B. Testing (Kind).** Ejecutá `sh scripts/setup-kind.sh`. Usá `kubectl get pods` y `kubectl port-forward svc/rag-api 3001:3001`. Importante: el manifiesto incluido solo despliega el backend; para que funcionen ingesta y consulta debés desplegar Qdrant y Ollama dentro del clúster o configurar destinos accesibles. El health check sí permite probar la red del backend.

**C. Producción.** Publicá una imagen en tu registry, configurá secretos y servicios persistentes administrados y actualizá con `IMAGE=<your-image> sh scripts/deploy-prod.sh`. No es un aprovisionamiento cloud completo: EKS requiere VPC, nodos y control de acceso; Cloud Run y Azure Container Apps requieren sus propios despliegues, además de un vector store accesible. Presupuestá cada componente por separado.

## Errores frecuentes y criterio de avance

- Evitá guardar llaves API en Git o en React.
- Una recuperación sin documentos debe informarse con claridad y no inventar una respuesta.
- Un modelo distinto puede cambiar las dimensiones: creá un índice nuevo y reingerí.
- El ejemplo no implementa autenticación, colas de ingesta ni controles multi-tenant. Incorporalos antes de exponer datos reales.
- Proseguí si podés explicar dónde ocurre la recuperación, obtener una fuente trazable y detectar un fallo de proveedor.

**Siguiente:** [Capítulo 9](book-es-cap9.md).
