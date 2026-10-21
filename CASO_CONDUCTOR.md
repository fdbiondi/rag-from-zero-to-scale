# Caso conductor: Asistente de Operaciones de Nébula

> **Todos los nombres, organizaciones, documentos, IDs, fechas, políticas, métricas y resultados de ejemplo de este caso son sintéticos.** No describen una empresa real ni contienen datos personales. El corpus se creó con fines educativos.

## Propósito

A lo largo de los 20 capítulos se construye un asistente de documentación empresarial para **Nébula Sistemas**, una compañía ficticia. El asistente responde preguntas sobre soporte, cambios, continuidad operativa y compras a partir de documentos aprobados. Debe citar evidencia versionada, respetar permisos y abstenerse cuando el corpus no alcanza. No toma decisiones de seguridad, compras ni cumplimiento por cuenta de una persona.

El caso permite enseñar el ciclo completo: los documentos ingresan con metadatos y clasificación; se convierten en fragmentos; se indexan y recuperan bajo filtros de autorización; un modelo genera una respuesta condicionada a la evidencia; la API devuelve respuesta, fuentes y estado; la interfaz muestra las citas; la evaluación mide recuperación, fidelidad, abstención, seguridad y operación.

## Alcance y límites

El MVP inicial conserva el stack didáctico del repositorio: Node.js/Express para API y orquestación, React para interfaz, Docker Compose para servicios locales, Ollama para embeddings y generación locales, y Qdrant para búsqueda vectorial. La carga inicial es texto Markdown/JSON sintético. Los ejemplos de proveedores remotos, búsqueda léxica/híbrida, reranking, colas, nube y escalado se presentan como extensiones que deben tener sus propios adaptadores y evidencia. El stack inicial no implica que el demo actual tenga autenticación o autorización; la seguridad descrita aquí es el contrato objetivo del proyecto didáctico y requiere implementación explícita antes de exponerlo.

## Personajes operativos y permisos

Los sujetos son identidades sintéticas del entorno de pruebas, no personas reales:

- `role:employee`: solo documentos marcados `public` y `employees`.
- `role:ops`: documentos `public`, `employees` y `operations`.
- `role:procurement`: documentos `public`, `employees` y `procurement`.
- `role:admin`: todos los ámbitos del corpus de prueba.

La identidad y los grupos efectivos se derivan del servidor/autenticación. El cliente no elige `tenantId`, grupo ni permisos. Cada recuperación y lectura posterior aplica la política; el prompt y el LLM nunca conceden acceso. Los casos entre tenant usan `tenant-nebula` y `tenant-orbita`, dos organizaciones enteramente ficticias.

## Contrato compartido

Los ejemplos del libro deben mantener estos nombres y semánticas. Los archivos bajo `datos/` son JSON Lines UTF-8: un objeto JSON completo por línea. Fechas y tiempos usan ISO 8601 UTC; los IDs son estables. Los textos del corpus están en español.

### Documento (`RagDocument`)

```json
{
  "schemaVersion": "1.0",
  "documentId": "NEB-OPS-001",
  "tenantId": "tenant-nebula",
  "title": "Ventana de mantenimiento",
  "sourceUri": "synthetic://nebula/NEB-OPS-001/v2",
  "version": "2",
  "status": "approved",
  "effectiveFrom": "2026-09-01T00:00:00Z",
  "effectiveTo": null,
  "updatedAt": "2026-08-20T12:00:00Z",
  "language": "es",
  "classification": "operations",
  "allowedGroups": ["ops", "admin"],
  "metadata": {"documentType": "procedure", "owner": "synthetic-team-ops", "tags": ["maintenance"]},
  "content": "Ventana ordinaria...",
  "contentSha256": "synthetic-placeholder",
  "synthetic": true
}
```

`status` toma `draft`, `approved` o `superseded`. Solo `approved` vigente es elegible para respuestas corrientes; versiones anteriores pueden conservarse para consultas históricas cuando la política lo permita. `documentId` identifica el documento lógico; `version` identifica una revisión inmutable. `sourceUri` es un identificador opaco y no una URL navegable. El hash se calcula sobre el contenido normalizado al implementar; el marcador ilustrativo no es un hash utilizable.

### Fragmento (`RagChunk`)

```json
{
  "chunkId": "NEB-OPS-001:v2:0001",
  "documentId": "NEB-OPS-001",
  "documentVersion": "2",
  "tenantId": "tenant-nebula",
  "ordinal": 1,
  "text": "La ventana ordinaria es el segundo martes...",
  "tokenCount": 18,
  "locator": {"section": "Calendario", "page": null, "startChar": 0, "endChar": 96},
  "metadata": {"status": "approved", "effectiveFrom": "2026-09-01T00:00:00Z", "classification": "operations", "allowedGroups": ["ops", "admin"]},
  "synthetic": true
}
```

El ID de fragmento es determinista para documento, versión y ordinal. Texto y metadatos se almacenan juntos; ningún fragmento puede perder tenant, versión, vigencia o ACL. Un fragmento no es evidencia citable por sí solo hasta que se pueda remontar al documento y localizador fuente.

### Consulta (`RagQuery`)

```json
{
  "queryId": "q-001",
  "tenantId": "tenant-nebula",
  "subject": {"subjectId": "synthetic:ops-01", "groups": ["ops"]},
  "question": "¿Cuándo es la ventana ordinaria de mantenimiento?",
  "locale": "es",
  "asOf": "2026-10-01T00:00:00Z",
  "topK": 5,
  "filters": {"status": "approved", "effectiveAt": "asOf"},
  "expectedDisposition": "answer",
  "synthetic": true
}
```

El endpoint público no acepta `groups` como autoridad: el ejemplo muestra el contexto ya resuelto por middleware confiable. `asOf` permite reproducir vigencia; `topK` es configurable y se registra. Consulta sin `asOf` usa el instante de recepción.

### Fuente (`RagSource`)

```json
{
  "sourceId": "NEB-OPS-001:v2:0001",
  "documentId": "NEB-OPS-001",
  "title": "Ventana de mantenimiento",
  "version": "2",
  "status": "approved",
  "effectiveFrom": "2026-09-01T00:00:00Z",
  "locator": {"section": "Calendario", "page": null},
  "excerpt": "La ventana ordinaria es el segundo martes...",
  "score": 0.82,
  "sourceUri": "synthetic://nebula/NEB-OPS-001/v2"
}
```

En `datos/evaluacion.jsonl`, `expectedSourceIds` usa la forma lógica `documentId:version` (por ejemplo `NEB-OPS-001:v2`); la API puede devolver varios IDs de fragmento `chunkId` que pertenecen a esa fuente lógica. La API devuelve solo fuentes autorizadas y realmente recuperadas. `score` es diagnóstico, no probabilidad de verdad. La UI no abre `sourceUri` sin una ruta de acceso validada; al mostrar citas debe indicar título, versión y localizador.

### Respuesta (`RagResponse`)

```json
{
  "queryId": "q-001",
  "status": "answered",
  "answer": "La ventana ordinaria es el segundo martes de cada mes, de 02:00 a 03:00 UTC.",
  "sources": [],
  "abstentionReason": null,
  "model": {"provider": "ollama", "model": "llama3.2:1b", "promptVersion": "answer-v1"},
  "retrieval": {"provider": "qdrant", "collection": "nebula-v1", "embeddingModel": "nomic-embed-text", "topK": 5},
  "timingsMs": {"retrieval": 12, "generation": 340, "total": 365},
  "synthetic": true
}
```

`status` puede ser `answered`, `abstained`, `refused` o `error`. En `answered`, cada afirmación factual debe poder justificarse con al menos una fuente devuelta. `abstentionReason` identifica falta de evidencia, conflicto no resuelto o fuera de alcance. `refused` cubre acceso no autorizado y no debe filtrar si el recurso existe. Errores técnicos tienen código estable y mensaje seguro.

## Dataset y reproducibilidad

- `datos/documentos.jsonl`: ocho documentos ficticios, con versiones, vigencia, clasificación, tenant, grupos permitidos y metadatos. Incluye una revisión supersedida y una regla contradictoria con resolución por vigencia/fecha.
- `datos/evaluacion.jsonl`: consultas con respuesta de referencia, fuentes aceptables, disposición esperada, sujeto/grupos del escenario y etiquetas.
- `datos/README.md`: reglas de uso, extracción, normalización y evolución del conjunto.

El set es deliberadamente pequeño para poder inspeccionarse y no pretende estimar calidad de producción. Las respuestas esperadas describen contenido y evidencia aceptable, no exigen una redacción literal. Versionar corpus y set de evaluación juntos; cada resultado debe registrar hash/commit de ambos, fecha, configuración, proveedores/versiones, topK y semilla cuando aplique. Los resultados cuantitativos medidos solo se publicarán después de ejecutar la receta; cifras ilustrativas deben etiquetarse como tales.

## Progresión en los 20 capítulos

Cada capítulo conserva su tema propio y aporta un cambio verificable al mismo sistema. El artefacto acumulable sugerido se añade al repositorio de acompañamiento sin reemplazar los capítulos existentes.

| Cap. | Tema | Evolución del caso y artefacto acumulable |
|---|---|---|
| 1 | Qué es RAG | Formular la necesidad, escoger el asistente frente a FAQ/prompting, responder una pregunta y abstenerse con el corpus sintético. Artefacto: objetivo y primera respuesta citada. |
| 2 | Embeddings, chunking y prompting | Fragmentar `NEB-OPS-001`, inspeccionar evidencia y probar un texto con instrucción maliciosa. Artefacto: regla de fragmentación y ejemplo adversarial. |
| 3 | Arquitectura de ingesta y consulta | Adoptar los contratos de documento, chunk, consulta, fuente y respuesta; fijar estados e idempotencia. Artefacto: esquema y secuencia de ingestión/consulta. |
| 4 | Entorno local y primer RAG | Arrancar Docker Compose, Ollama y Qdrant; cargar los documentos y efectuar una consulta local. Artefacto: receta y salida observada, fechadas. |
| 5 | Backend con Express | Exponer ingesta/consulta, validar payload, mapear errores y aplicar política antes de recuperar. Artefacto: contrato HTTP y ejemplo JSON. |
| 6 | Frontend con React | Presentar respuesta, estado de abstención, error y fuentes versionadas; gestionar solicitud cancelada. Artefacto: flujo de interfaz accesible. |
| 7 | Proveedor de embeddings | Medir el set con el embedding local y definir interfaz reemplazable; comparar un segundo proveedor solo si está configurado. Artefacto: configuración y tabla con datos medidos o explícitamente pendientes. |
| 8 | Bases vectoriales | Indexar Qdrant con metadatos, filtrar tenant/vigencia/ACL en búsqueda y plantear backend alternativo equivalente. Artefacto: consulta filtrada y comparación de capacidades. |
| 9 | Caché | Cachear una respuesta permitida con clave que incluya consulta normalizada, tenant, grupos efectivos y versiones de índice/prompt; invalidar al cambiar versión o ACL. Artefacto: casos hit/miss/invalidación. |
| 10 | LLM local frente a remoto | Comparar Ollama con un adaptador remoto mediante la misma batería; registrar qué datos salen del entorno y la política de fallback. Artefacto: matriz de calidad, latencia y privacidad. |
| 11 | Almacenamiento | Mantener documento original lógico, versiones, estado y referencia de fragmentos; ensayar reingesta y borrado coordinado. Artefacto: ciclo de vida y reconciliación. |
| 12 | Del MVP a producción | Convertir supuestos en puertas de salida: autenticación, autorización, backups, rate limit, restauración y rollback. Artefacto: lista de brechas con evidencia requerida; no afirmar que demo es productivo. |
| 13 | Arquitecturas según escala | Dimensionar solicitudes/corpus a partir de supuestos explícitos; decidir si separar API, worker e índice. Artefacto: escenarios de carga y umbral de evolución. |
| 14 | Despliegue cloud | Traducir la arquitectura a una ruta cloud conceptual y mapa de equivalencias de adaptadores; registrar lo que el repositorio aún no despliega. Artefacto: arquitectura y plan de despliegue verificable. |
| 15 | RAG en empresas | Aplicar clasificación, dueño, vigencia, rol y revisión humana; validar contradicción, abstención y prompt injection. Artefacto: matriz rol-recurso-acción y resultados adversariales. |
| 16 | RAG para SaaS | Ejecutar el mismo caso con `tenant-nebula` y `tenant-orbita`, derivando tenant de identidad validada y evitando ruido/fuga entre tenants. Artefacto: aislamiento y cuotas por tenant. |
| 17 | RAG para consumidores | Reutilizar documentos permitidos desde perspectiva del usuario: consentimiento, fuentes comprensibles, feedback y control de historial. Artefacto: recorrido de usuario y criterios de utilidad/daño. |
| 18 | Observabilidad | Instrumentar etapas de ingesta, autorización, recuperación, generación y render; no registrar texto sensible innecesario. Artefacto: evento sintético, métricas y runbook. |
| 19 | Optimización avanzada | Cambiar una variable por experimento: chunking, híbrida, reranking o modelo. Medir contra el mismo set y revisar regresiones por segmento. Artefacto: informe reproducible de experimento. |
| 20 | Diagnóstico | Resolver incidentes reproducibles: documento no vigente, fuente ausente, denegación, timeout y colección incompatible. Artefacto: runbook con evidencia segura y mitigación reversible. |

## Sustitución de proveedores

Las interfaces pertenecen al dominio de la aplicación y separan al menos `EmbeddingProvider.embed(texts)`, `VectorStore.upsert/search/delete`, `ChatProvider.generate(input)` y `DocumentStore.getVersion/putVersion`. Ollama, Qdrant y Docker Compose son implementaciones iniciales, no tipos presentes en el contrato público. Mantener modelo, dimensión/vector space, colección, versión de prompt, proveedor y tiempos en la configuración de ejecución. Un cambio de embedding requiere colección paralela, reindexación y comparación antes del cambio de lectura; no se mezclan vectores de espacios distintos. Un cambio de almacén debe conservar semántica de filtro y borrado. La evaluación común mide comportamiento, no nombres de marcas.

## Ejemplo ilustrativo de extremo a extremo

Consulta sintética: `q-001`, sujeto con grupo `ops`, fecha de referencia 2026-10-01. Pregunta: «¿Cuándo es la ventana ordinaria de mantenimiento?» La evidencia es `NEB-OPS-001`, versión 2, sección «Calendario». Resultado esperado: «El segundo martes de cada mes, de 02:00 a 03:00 UTC», con esa fuente citada. La versión 1 quedó supersedida y no debe ganar una consulta corriente. Esta es una expectativa del dataset; no es una salida observada de Ollama/Qdrant.

Una persona con grupo `employee` pregunta por el costo del proveedor. La información existe en `NEB-PROC-001`, pero el grupo no tiene permiso. Resultado esperado: `refused` o respuesta genérica de acceso denegado, sin contenido, fuente ni confirmación de existencia. La evaluación mide fuga de información, no solo exactitud semántica.
