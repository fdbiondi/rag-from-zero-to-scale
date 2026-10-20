# Auditoría editorial y técnica — edición en español

**Alcance:** los 20 archivos `ESPAÑOL/book-es-cap1.md` a `book-es-cap20.md`, contrastados con `README.md`, `ESPAÑOL/toc-es.md`, `VALIDATION.md` y `REFERENCIAS_VERIFICADAS.md`. Revisión documental estática; no se modificaron capítulos ni se ejecutaron los ejemplos, enlaces, contenedores o despliegues.

## Dictamen ejecutivo

La secuencia del índice está cubierta en el orden anunciado y el README describe con claridad un borrador didáctico: 20 capítulos breves, una demo local y límites explícitos de producción. No hay una omisión de capítulos frente al índice ni una promesa del README de que el manuscrito ya sea un libro terminado. En cambio, sí queda una brecha sustancial entre la ambición del título («de cero a escala») y la profundidad comprobable: gran parte del contenido avanzado es orientación conceptual, listas y snippets aislados; la validación del repositorio confirma que faltan laboratorios integrales, adaptadores reales, OCR/parsers, autenticación/aislamiento y despliegue completo.

La mayor fortaleza editorial es la cautela técnica: los capítulos suelen distinguir demo de producción, marcar ejemplos conceptuales y advertir sobre permisos, privacidad, costos y evaluación. La principal debilidad es que esa cautela se repite más de lo que se transforma en recorridos reproducibles. El libro explica qué decidir, pero rara vez acompaña al lector con un mismo corpus, resultados medidos y artefactos que permitan comprobar cada decisión de punta a punta.

## Hallazgos transversales

### Prioridad crítica

- **Definir y cumplir el alcance editorial de la edición.** `README.md` y `VALIDATION.md` declaran correctamente que no es aún un libro terminado de 200–300 páginas; los capítulos son borradores concisos. Antes de publicarlo como libro, ampliar cada tramo con laboratorios integrados y resultados verificados, o ajustar portada, descripción y expectativas para presentarlo inequívocamente como guía introductoria/borrador. No describir la demo como plataforma productiva.
- **Cerrar el camino ejecutable anunciado.** El índice ordena una progresión práctica, pero las instrucciones avanzadas no desembocan en infraestructura probada: Kind despliega sólo API; Qdrant/Ollama no forman parte del clúster y faltan IaC/Helm, autenticación y parsers (según `VALIDATION.md`). Incorporar una ruta validada que conecte los ejemplos con límites de seguridad, o etiquetar sistemáticamente esos pasajes como diseño conceptual y posponer el reclamo de «escala».

### Prioridad alta

- **Añadir un caso conductor y una evaluación reproducible.** Desde capítulos 1–20 usar un corpus público/sintético versionado, preguntas con evidencia esperada, baseline, configuración y resultados. Hoy cada capítulo ofrece ejemplos distintos y las evaluaciones propuestas no incluyen un conjunto compartido ni métricas observadas. Esto impide comparar chunking, embeddings, filtros, caché, reranking y cambios de modelo.
- **Completar el ciclo de calidad y amenaza.** Se explican abstención, citas, inyección, autorización y telemetría, pero no hay una batería integrada de pruebas adversariales ni contrato comprobable de citas (origen/página/versión), ni criterios medidos de fidelidad y abstención. Agregar casos negativos, conflictivos, fuera de alcance y entre tenants, con resultados esperados y verificación en API.
- **Distinguir de manera uniforme ejemplos ejecutables, pseudocódigo y fragmentos parciales.** Varios capítulos marcan limitaciones, pero los bloques conviven con comandos concretos y pueden leerse como implementaciones listas. Cada ejemplo debe indicar dependencias, contexto, datos de entrada/salida, errores/seguridad omitidos y estado de verificación; la sección de validación debe corresponder exactamente al código publicado.
- **Revisar progresión y referencias cruzadas.** La numeración global es coherente, pero hay solapamiento notable entre 3/4/5, 7/8/11, 12/13/14 y 15/16/17/20. Definir una responsabilidad única por capítulo y reemplazar recapitulaciones por referencias breves. Verificar cada referencia cruzada y que las promesas de continuidad correspondan al capítulo siguiente lógico.

### Prioridad media

- **Unificar la voz y los términos en español.** Predomina el voseo rioplatense («consultá», «elegí», «probá») pero aparecen formas de tuteo/imperativo neutro («describe», «registra», «consulta») y anglicismos con traducciones variables. Elegir una guía de estilo, normalizar imperativos, género/número, cursivas, siglas en primera mención y equivalencias (fragmento/chunk, recuperación/retrieval, reranker/reordenador, almacén/base vectorial).
- **Mejorar el aparato visual.** Hay un diagrama Mermaid por capítulo, pero varios muestran flujos genéricos y no identifican límites de confianza, estados de error, datos/versiones o decisiones que el texto sí considera importantes. Añadir pies/propósito y revisar legibilidad al renderizar; incluir al menos una arquitectura general común y diagramas diferenciados donde agreguen información.
- **Hacer revisión bibliográfica capítulo por capítulo.** El registro común depura referencias y advierte vigencia, lo que es positivo, pero muchas referencias de capítulos se reducen a artículos fundacionales o documentación de proveedores. Añadir fuentes primarias para conceptos técnicos específicos y vincular afirmaciones a ellas; verificar URL, título y disponibilidad al cierre editorial. Evitar presentar documentación comercial cambiante como fundamento teórico.

### Prioridad baja

- **Normalizar estructura y microestilo.** Se repiten plantillas («¿Por qué importa? / ¿Cómo funciona? / ¿Cómo se implementa? / errores / ejercicios / referencias») útiles para orientarse pero mecánicas, con variaciones de «prácticas» y «buenas prácticas». Alinear títulos, uso de «Siguiente», puntuación de tablas, formato de nombres de servicios y llamadas al repositorio.
- **Hacer que ejercicios produzcan artefactos acumulables.** Reescribirlos para que cada uno entregue una pieza del caso conductor (corpus, test set, política, traza, informe), con criterio de aceptación y una respuesta de referencia cuando corresponda.

## Hallazgos por capítulo

La prioridad indicada es la del trabajo editorial recomendado para ese capítulo; los defectos sistémicos se desarrollan arriba.

### Capítulo 1 — ¿Qué es RAG y por qué lo necesitas? — **Media**

- La explicación inicial y el diagrama introducen recuperación y generación con claridad, pero la comparación con prompting/fine-tuning y la decisión «cuándo elegir RAG» quedan en criterios narrativos. Añadir una matriz de decisión con caso, fuente de verdad, actualización, permisos, costo y alternativa sin RAG; recorrer un ejemplo concreto de respuesta con cita y abstención.
- El contrato mínimo de aplicación y la primera prueba no fijan un corpus ni una línea base reutilizada después. Convertir ese ejemplo en el caso conductor de todo el libro y presentar explícitamente qué será evaluado (recall de evidencia, fidelidad, latencia).
- El diagrama del flujo principal no muestra fallos de recuperación, evidencia insuficiente ni autorización. Extenderlo con ramas de no-resultados y error, señalando que el LLM no decide permisos.

### Capítulo 2 — Embeddings, vectores, chunking y prompting — **Alta**

- Es el capítulo fundacional más denso, pero cubre embeddings, métricas, fragmentación, búsqueda híbrida, contexto y prompting en una sola pasada. Profundizar en cómo se entrena/limita un embedding y en recuperación densa frente a léxica; aclarar que similitud semántica depende del objetivo/dominio y no equivale a comprensión.
- El código de fragmentación por párrafos tiene un caso límite: un párrafo individual mayor que `maxCaracteres` se emite sin dividir, por lo que el límite prometido no se cumple. Añadir tratamiento explícito o delimitar su contrato con una prueba de entrada larga y salida esperada.
- El ejemplo de prompt interpola texto recuperado en etiquetas XML sin escapar contenido. Aunque se advierte que los delimitadores no son una barrera, mostrar el riesgo concreto de cierre de etiqueta/inyección y preferir una serialización estructurada o codificación segura; incluir prueba adversarial.
- El ejercicio de experimento no incluye plantilla de evaluación lista para usar. Añadir preguntas, pasajes relevantes, definición de Recall@k/precisión y ejemplo de comparación antes/después en el corpus conductor.

### Capítulo 3 — Arquitectura de ingesta y consulta — **Alta**

- Es el capítulo que debería fijar el contrato central, pero después varios capítulos vuelven a describir flujos y estados. Consolidar aquí contratos de documento, fragmento, consulta, cita, estados de ingesta, versión e idempotencia; que capítulos 4–6 implementen explícitamente esos mismos contratos.
- La sección de cola/API introduce el patrón, pero no cierra semántica de reintentos, duplicados, DLQ, actualización atómica ni borrado. Agregar una secuencia concreta de fallos/reintento y transiciones de estado; distinguir aceptación HTTP de indexación disponible.
- Los ejemplos de curl dependen de servicios locales y resultados variables. Incluir respuesta JSON real anonimizada/sintética, errores esperados y vínculo con el contrato del README; no basta con «JSON con answer y sources».

### Capítulo 4 — Entorno local y primer RAG — **Media**

- El recorrido Compose es práctico y consciente de los límites, aunque es mayormente una guía de arranque. Añadir verificación de versiones, estados esperados por servicio, salida observada de ingesta/consulta y procedimiento de limpieza/reinicio sin borrar datos por accidente.
- El diagnóstico cubre capas, pero no ofrece una tabla síntoma → comando → resultado → causa probable. Aterrizar la distinción contenedor/red/servicio/modelo con errores reproducibles y enlazar la secuencia con el capítulo 20.
- Asegurar que todos los comandos coincidan con el estado real del repositorio y los modelos configurados en README/Compose; indicar plataforma/recursos en los que se verificó el recorrido.

### Capítulo 5 — Backend con Express — **Alta**

- La ruta mínima enseña HTTP y separación de capas, pero los snippets no forman un servicio backend completo ni cubren de forma sistemática validación de esquema, límites de cuerpo, autenticación, rate limiting, cancelación y permisos. Añadir una implementación progresiva ejecutable sobre el backend existente o mantener claramente la etiqueta conceptual en cada bloque.
- La sección de resiliencia debe relacionar timeout de cliente, proveedor y proxy, y distinguir errores recuperables, 4xx, 429, 5xx y respuesta vacía sin evidencia. Añadir una tabla de contrato HTTP compartida con frontend y capítulo 20.
- El texto de seguridad es sólido en principios, pero no incluye pruebas que demuestren que un ID de documento no permite leerlo sin permiso. Incluir pruebas de autorización en la API; CORS no debe volver a aparecer como sustituto de autenticación.

### Capítulo 6 — Frontend con React — **Media**

- Buen tratamiento de estados, fuentes y accesibilidad; sin embargo, el componente de fuentes consume `url` y `excerpt` y queda en manos del lector saber qué se debe validar. Especificar contrato de fuentes seguras, sanitización/URLs permitidas, autorización al abrir y estados de cita no disponible.
- Los ejemplos de formularios/solicitudes no configuran cancelación efectiva ni muestran cómo evitar respuesta obsoleta tras navegación/unmount. Añadir implementación coherente (AbortController o equivalente) y prueba de carrera, no sólo recomendación.
- El capítulo no valida el comportamiento en la UI real ni conecta todos los estados con la API de demo. Añadir una práctica que ejecute consulta/ingesta, error y respuesta sin fuentes, incluyendo teclado/lector de pantalla; distinguir lo demostrado de lo propuesto.

### Capítulo 7 — Elegir un proveedor de embeddings — **Alta**

- Explica bien la incompatibilidad entre espacios, pero la comparación de proveedores/clases queda sin benchmark común ni decisión basada en corpus. Añadir tabla de evaluación con idioma, dominio, costo de indexación/consulta, dimensión, límites, latencia y política de datos, usando medición fechada o declarando explícitamente que no se comparan productos.
- El cambio de modelo se describe como migración controlada; falta un procedimiento completo para duplicar índice, backfill, comparar resultados y volver atrás, incluido tratamiento de escrituras concurrentes. Referenciar el único flujo de migración del capítulo 8/11 para no duplicar versiones incompatibles.
- Los ejemplos de proveedor necesitan resultados, errores de cuota y timeout, límites por lote y reintentos no duplicadores; añadirlos o mantenerlos como pseudocódigo no ejecutable.

### Capítulo 8 — Bases de datos vectoriales — **Alta**

- La explicación de índices aproximados, filtros y familias es útil, pero falta comparar exactitud/recall, memoria, construcción y costo de ANN con una medición reproducible. Añadir criterio para cuándo basta búsqueda exacta o pgvector y cuándo un servicio separado aporta valor.
- El esquema SQL es alternativo y el ejemplo Qdrant refleja la demo, pero no se muestra una operación equivalente de upsert/búsqueda/filtro con respuesta verificable ni se comparan consistencia, borrado y límites de filtros entre alternativas. Incluir matriz basada en requisitos, no marcas.
- Aclarar con un ejemplo que filtros de tenant deben aplicarse durante búsqueda y también en lecturas posteriores; no confiar en filtros de UI. Vincular al contrato de permisos del capítulo 11/15/16.

### Capítulo 9 — Estrategias de caché — **Media**

- Se cubren claves, TTL, invalidación y cache stampede; los ejemplos de memoria/Redis son conceptuales y la demo no incluye Redis. Añadir un ejemplo mínimo ejecutable o una prueba manual con hit/miss, expiración, invalidación tras reindexación y separación por ámbito de autorización.
- La clave segura se explica en abstracto, pero falta especificar canonicalización de consulta, versión de prompt/modelo/índice, locale y alcance efectivo, además de cómo evitar colisiones y datos personales en claves.
- Profundizar en cuándo no cachear respuesta final y cómo medir hit rate junto a antigüedad, tasa de respuesta obsoleta y mejora neta de latencia/costo. Incluir caso donde una caché aparentemente eficaz da una filtración o resultado desactualizado.

### Capítulo 10 — LLM local frente a remoto — **Media**

- La comparación separa correctamente inferencia de embeddings y menciona costo por respuesta útil. Falta una matriz concreta con criterios de decisión y un mismo set de calidad/latencia/privacidad; no presentar proveedores/modelos como opciones equivalentes sin resultados y fecha de disponibilidad.
- El fallback híbrido puede ocultar diferencias de política, formato de salida, datos enviados y calidad. Especificar qué datos pasan a proveedor alternativo, condición de fallback, idempotencia/cancelación y cómo se informa al usuario.
- El ejemplo de configuración presenta nombres de variables y endpoints: contrastarlos con el backend real y añadir una prueba que confirme que un secreto no termina en bundle/logs. La referencia a modelo con estado cambiante debe mantener advertencia junto a la recomendación.

### Capítulo 11 — Almacenamiento de documentos — **Alta**

- Buen énfasis en identidad, versiones, consistencia y borrado, pero el esquema y pseudocódigo no concretan transacciones/saga entre objeto, base relacional y vector store. Añadir secuencia de fallo y reconciliación para «objeto guardado, vector falló» y «borrado parcial».
- El ejemplo de lectura con filtro de tenant necesita demostrar identidad derivada del servidor y no recibida del cliente, autorización por documento y consulta secundaria segura. Incorporar pruebas negativas entre tenants.
- El borrado coordinado no define límites de retención de backups ni acuse final de borrado. Precisar estados, plazo, qué copias sobreviven temporalmente y cómo comprobar caché/índice/archivos temporales, manteniendo consistencia con capítulos 12, 15, 16 y 17.
- La sección de parsers no resuelve extracción real (PDF escaneado, OCR, DOCX, tablas, páginas). README/VALIDATION lo declaran pendiente: agregar laboratorio o ponerlo explícitamente en la hoja de ruta en vez de dejar que el tratamiento de «documentos» sugiera ingesta general.

### Capítulo 12 — Del MVP a producción — **Alta**

- Es el puente de promesa principal, pero la lista de preparación y snippets no constituyen un despliegue verificable. Convertir el checklist en puertas de salida con evidencia requerida (permisos, restore, carga, incidentes, SLO, rollback) y un perfil de producción reproducible.
- El código de cola/worker debe cubrir deduplicación persistente, reintentos con backoff, DLQ, expiración/cancelación y recuperación tras caída; señalar dónde persiste cada estado. No presentar el fragmento como suficiente para ingesta durable.
- La estrategia de backups y migración necesita un ejercicio de restauración cronometrado y criterio de RPO/RTO. El texto ya diferencia objetivos y SLA; completar con un escenario probado, no sólo recomendaciones.
- Alinear lenguaje de disponibilidad/seguridad con el hecho declarado en README de que no hay auth, aislamiento, backups ni rate limit en el demo; el capítulo debe terminar en una lista explícita de brechas del repo.

### Capítulo 13 — Arquitecturas según la escala — **Alta**

- La arquitectura evolutiva y el ejemplo Kubernetes ayudan a organizar decisiones, pero no hay cargas cuantificadas ni modelos de capacidad (QPS, tamaño de corpus, tasa de ingesta, concurrencia, memoria/índice, crecimiento). Incorporar escenarios pequeño/medio/grande con supuestos y cálculos, no etiquetas abstractas de escala.
- El manifiesto conceptual no es una arquitectura desplegable RAG y puede leerse aislado de limitaciones del Kind del repositorio. Señalar claramente qué componentes faltan (vector DB, modelo, almacenamiento, workers, secretos, autoscaling) y comparar costos/operación de monolito frente a separación.
- Desarrollar particionado, replicación y cuello de botella con criterios verificables; enlazar métricas que se usarían para decidir el cambio y evitar que «más réplicas» se interprete como mejora automática.

### Capítulo 14 — Despliegue cloud — **Alta**

- El capítulo compara modelos operativos y cita AWS/Azure/GCP/Kubernetes, pero no ofrece un despliegue completo reproducible en ninguno. Elegir una ruta de referencia, fijar versiones/región/supuestos, proveer IaC/manifestos y validar desde creación hasta consulta/rollback; para las otras, limitarse a diferencias.
- El Deployment ilustrativo no completa dependencias, persistencia, secretos, red, identidad, políticas, ingress, backup ni escalado. Añadir arquitectura y lista de recursos con límites de responsabilidad; verificar YAML y explicar qué no despliega.
- La sección de disponibilidad/recuperación debe aportar un ejercicio de fallo/restauración y costos fechados con calculadora/supuestos. Las referencias comerciales deben ir acompañadas por fecha/metodología o enlazar a las referencias verificadas sin convertir una estimación en cotización.

### Capítulo 15 — RAG en empresas — **Alta**

- El capítulo cubre identidad, gobierno, prompt injection y supervisión, pero los controles empresariales quedan en gran medida como recomendaciones. Añadir modelo de amenazas, matriz rol/recurso/acción y pruebas de autorización en consulta, ingesta, descarga, caché, trazas y borrado.
- El caso de pólizas/procedimientos requiere diferenciar respuesta informativa de decisión regulada, vigencia/contradicciones y escalamiento humano. Incluir un caso completo con fuentes versionadas, respuesta citada y abstención, más criterios de aceptación.
- Completar ciclo de gobierno: dueño de fuente, clasificación, aprobación, retención, auditoría, revisión de permisos y proceso de incidente. Precisar qué es control técnico del sistema y qué es política organizacional.

### Capítulo 16 — RAG para startups SaaS — **Alta**

- Se enfoca apropiadamente en tenant, cuotas y operación multiusuario, pero repite bastante los capítulos 11, 12 y 15 sin una frontera explícita. Reorientar a decisiones SaaS (modelo de aislamiento por plan/tamaño, límites de ruido entre tenants, onboarding/borrado, cuotas y costo unitario) y referenciar los fundamentos compartidos.
- El middleware y consulta filtrada son conceptuales; falta mostrar que tenant/org se deriva de identidad validada, que todos los caminos de búsqueda/lectura/caché/exportación lo aplican y que las pruebas de integración impiden acceso cruzado. Prioridad alta por impacto de fuga.
- La sección comercial debe incluir un ejemplo transparente de costo por tenant/consulta e impacto de límites/overages, separado de tarifas actuales; incluir estrategia ante tenant ruidoso y colas compartidas.

### Capítulo 17 — RAG para consumidores — **Media**

- Es uno de los capítulos más completos en privacidad, memoria, accesibilidad y experiencia; debe reducir duplicación de seguridad/borrado con capítulos 11, 15, 16 y 20 y conservar su foco en consentimiento, control y utilidad personal.
- El componente React muestra `href={source.url}`. Validar esquema/origen de URL antes de renderizar y explicar que autorizar la fuente al crear la respuesta no necesariamente autoriza una descarga posterior. Añadir ejemplo de fuente inválida y estado de eliminación pendiente.
- El endpoint de memoria menciona middleware asumido, almacenamiento conceptual y consentimiento, pero sólo cubre creación. Completar contrato de listar/leer/editar/borrar/expirar y prueba de separación de propietario, o reducir el ejemplo a pseudocódigo con límites visibles.
- La evaluación de daño y utilidad está bien planteada, pero falta protocolo concreto de revisión de alto riesgo y cómo resolver contradicciones/correcciones reportadas sin retener datos de más.

### Capítulo 18 — Observabilidad y monitoreo — **Alta**

- El contenido teórico de logs/métricas/trazas y calidad es sólido, pero los ejemplos son incompatibles entre sí: el middleware usa import ESM/`req.route`; el repositorio y configuración deben confirmar módulo, y se advierte que middleware previo a rutas quizá no tenga `req.route`. `measured` recibe un argumento `operation` sin usar. Corregir los ejemplos para que compilen en el contexto declarado y no incluir código deliberadamente muerto.
- Conectar señales con instrumentación real o dejar una guía exacta para añadirla: actualmente `metrics.observe` no existe y no hay SDK ni colector. Dar esquema de métrica/unidad/buckets, propagación de trace context, códigos de error y configuración de salud listos para probar, o rotular todos los bloques como pseudocódigo.
- Los ejemplos de `/health`, readiness y liveness aparecen en varias secciones; consolidar diferencias y dar probes compatibles con el despliegue de referencia. No hacer llamada al modelo en cada probe.
- Añadir panel/runbook basado en una incidencia de ejemplo con datos sintéticos: detección, aislamiento de etapa, mitigación y señal de recuperación. Cubrir cardinalidad/privacidad con valores concretos.

### Capítulo 19 — Optimización avanzada — **Alta**

- La disciplina experimental es buena, pero capítulo no contiene resultados medidos; es un catálogo de técnicas. Ejecutar al menos un experimento completo en el corpus conductor (baseline vectorial vs. híbrida/RRF o reranking), mostrar errores y regresiones, Recall@k, latencia/costo con fecha y configuración.
- El ejemplo RRF omite relevancia de permisos/identidad en la propia función de fusión y no maneja metadatos ni candidatos repetidos entre rankings más allá de ID. Aclarar que autorización filtra cada recuperación antes de fusionar; incluir tests de orden, duplicados y caso vacío.
- El ejemplo comparativo cambia simultáneamente método, topK y reranking, contradiciendo la recomendación previa de variar una variable principal. Corregir experimento para aislar variables o explicar diseño factorial y atribución.
- Definir protocolo estadístico mínimo (tamaño del set, intervalos/variabilidad, revisión de errores por segmento y guardrails) antes de recomendar despliegue gradual.

### Capítulo 20 — Diagnóstico y solución de problemas — **Alta**

- El árbol de decisión y el énfasis en conservar evidencia son un buen cierre, pero se repiten contenidos de observabilidad (18), optimización (19) y producción (12). Convertirlo en runbook operacional que remita a esos fundamentos y resuelva incidentes concretos paso a paso.
- Los comandos de comprobación consultan localhost desde el host y no demuestran conectividad desde el contenedor API; explicitar contexto de ejecución, precondiciones y resultado esperado. Añadir diagnósticos por Docker/Compose y códigos de salida.
- El ejemplo de `fetch` reproduce una consulta pero falta timeout/cancelación y tratamiento de respuesta no JSON; completar para que los errores sean interpretables, manteniendo el límite de datos sintéticos.
- Incorporar matriz de incidentes con síntomas, evidencia segura, causa probable, mitigación reversible y verificación final para: documento no indexado, respuesta sin fuente, fuga de tenant, proveedor 429/timeout, colección incompatible y borrado incompleto. La fuga de alcance debe priorizar contención y escalamiento, no pruebas informales con datos reales.

## Coherencia con índice y README

- **Índice:** están presentes y enlazados los 20 capítulos, apéndices, glosario y autor; el orden del índice coincide con la numeración. No se detectó un capítulo ausente.
- **Objetivos del README:** la descripción de 20 capítulos y demo de acompañamiento se cumple a nivel estructural. El propio README los llama borradores de trabajo y niega que sea todavía un libro de 200–300 páginas o una plataforma productiva; `VALIDATION.md` confirma que falta expansión, integración y despliegue. La auditoría considera esto una brecha editorial explícitamente declarada, no una falsa afirmación del README.
- **Continuidad:** el bloque 1–6 va de conceptos a demo, backend y UI; 7–11 trata componentes de búsqueda/modelos/persistencia; 12–14 pasa a producción/escala/nube; 15–17 distingue contextos de organización/producto/consumo; 18–20 cierra con operación. La arquitectura general es razonable. Revisar los cruces especialmente entre capítulos 3–5, 7–8–11, 12–14, 15–17 y 18–20 para reducir reiteración y establecer contratos compartidos.
- **Código pareado con inglés:** `VALIDATION.md` registra que los bloques de código fueron generados de forma idéntica en ambos idiomas. Esto facilita equivalencia de comandos, pero esta auditoría no comparó línea por línea la edición inglesa; la promesa comprobada por el repo es la identidad de bloques, no equivalencia editorial plena de explicaciones.
- **Temas faltantes respecto a profundidad anunciada:** extracción real de PDF/DOCX/OCR y tablas; autenticación/autorización ejecutable; aislamiento multi-tenant comprobado; evaluación de calidad con datos y resultados; despliegue cloud reproducible; recuperación de backups; costos completos por cargas; migraciones y operación de extremo a extremo. Varios están declarados como pendientes en `VALIDATION.md` y deben permanecer visibles como tales.

## Plan de trabajo editorial ordenado

1. **Fijar contrato editorial y promesa del libro.** Decidir si esta entrega será guía breve o edición extensa; actualizar README/portada/índice si cambia la promesa. Definir lector objetivo, prerequisitos, variantes de español, vocabulario y criterio de «ejemplo verificado».
2. **Diseñar un caso conductor y set de evaluación.** Preparar corpus sintético/público con metadatos y permisos, consultas, evidencia esperada, casos sin respuesta/conflictivos/adversariales y resultados de referencia. Mantener identificadores/versiones para ejercicios.
3. **Cerrar los contratos técnicos base.** Unificar modelo de documento/chunk/fuente, API y errores, estados de ingesta, versionado, autorización y borrado en capítulos 2–6 y 11. Probar ejemplos contra el backend real; cada fragmento conceptual debe etiquetarse y cada fragmento ejecutable verificarse.
4. **Resolver seguridad y ciclo de datos antes de escala.** Implementar o documentar con precisión autenticación, aislamiento, autorización de fuentes, ingestión/parser, retención, eliminación, secretos y telemetría. Añadir pruebas negativas de acceso cruzado y prompt injection; separar estado de demo de arquitectura objetivo.
5. **Construir las prácticas de componentes y decisiones.** Con el caso conductor medir embeddings/chunking, motores/filtros, caché, modelos y persistencia (capítulos 2, 7–11). Mostrar una línea base y una variación cada vez, con resultados, costo/latencia y limitaciones.
6. **Completar producción, escala y nube.** Elegir al menos una arquitectura de referencia (capítulos 12–14), fijar versiones/supuestos, automatizar despliegue, probar carga, cola, fallo y restauración; adjuntar cálculos de capacidad/costo con fecha. Mantener alternativas de proveedor en matrices acotadas.
7. **Añadir operación comprobable.** Instrumentar una ruta de observabilidad, crear panel/alerta/runbook, ejecutar una incidencia sintética y completar un experimento de optimización. Hacer del capítulo 20 un índice práctico de diagnóstico, no una segunda exposición conceptual.
8. **Editar por coherencia y redundancia.** Revisar pares indicados, eliminar recapitulación repetida, comprobar todos los enlaces internos contra toc y separar teoría, decisión, implementación y validación.
9. **Revisión editorial y visual final.** Corregir voseo/tuteo y glosario, verificar afirmaciones y referencias externas, renderizar cada Mermaid y la maquetación completa. Comprobar tablas/código/saltos en PDF y actualizar fecha de verificación de fuentes.
10. **Puerta de publicación.** Actualizar `VALIDATION.md` sólo con evidencia nueva; revisar capítulos y comandos de principio a fin en un entorno limpio, registrar pruebas integrales fallidas/pendientes y publicar únicamente la versión cuyo alcance y validación coincidan.

## Limitaciones de esta auditoría

La revisión fue de los archivos fuente Markdown y documentos de alcance del repositorio. No se ejecutaron pruebas, snippets, enlaces externos, Mermaid ni render de PDF. Las afirmaciones sobre configuración real se limitan a lo declarado en README/VALIDATION y a inspección estática; los problemas de ejecución señalados arriba son puntos a verificar dentro del plan, no fallos de runtime confirmados.
