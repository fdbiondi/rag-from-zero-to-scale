---
title: "¿Qué es RAG y por qué lo necesitas?"
author: "Federico Andrés Biondi"
date: "2026"
language: "es"
chapter: 1
version: "1.0"
---

# Capítulo 1. ¿Qué es RAG y por qué lo necesitas?

## ¿Por qué importa?

Un modelo de lenguaje puede producir una explicación clara y convincente, incluso cuando no tiene evidencia suficiente para responder. Esa cualidad hace que sea útil para conversar y, a la vez, riesgoso para tareas en las que un dato debe ser actual, específico o verificable. Preguntarle a un modelo «¿cuál es nuestra política de reintegros?» no garantiza que conozca la política de una empresa; su entrenamiento general no equivale a consultar el documento vigente de esa empresa.

La generación aumentada por recuperación —RAG, por *retrieval-augmented generation*— combina recuperación de información con generación de texto. Antes de redactar, el sistema busca pasajes en un conjunto de fuentes elegido por el equipo. Luego entrega esos pasajes y la pregunta a un modelo, que construye una respuesta condicionada por el contexto recuperado. Es como pedirle a una persona que conteste una consulta después de abrir el manual correcto, en lugar de confiar solamente en lo que recuerda.

RAG importa cuando la respuesta debe apoyarse en material que cambia, que pertenece a una organización o que necesita trazabilidad. Puede permitir que un equipo actualice información reemplazando documentos e índices, sin volver a entrenar el modelo base. También puede exponer qué pasajes se usaron, reducir respuestas inventadas y ayudar a diagnosticar errores. Ninguno de esos beneficios aparece automáticamente: dependen de que las fuentes sean correctas, la recuperación encuentre evidencia pertinente y la generación respete sus límites.

El nombre puede sugerir que se «agrega» conocimiento al modelo. Esa descripción es imprecisa. En RAG, la evidencia suele acompañar a cada solicitud como contexto temporal. Los parámetros internos del modelo no se actualizan por consultar una base vectorial. La diferencia es relevante: el contenido recuperado puede cambiar entre dos consultas y queda disponible para inspección, mientras que el conocimiento aprendido durante el entrenamiento está incorporado en los parámetros y es mucho más difícil de atribuir a un origen concreto.

Este capítulo construye el modelo mental para el resto del libro: qué problema resuelve RAG, qué partes intervienen, qué no puede resolver y cómo se compara con alternativas. Los capítulos 2 y 3 profundizan, respectivamente, en representaciones y decisiones de arquitectura.

## ¿Cómo funciona?

### Del texto a una respuesta fundamentada

Un sistema RAG sencillo tiene dos recorridos. El primero ocurre antes de que alguien haga preguntas: prepara y organiza las fuentes. El segundo se ejecuta ante cada consulta: busca evidencia y produce una respuesta. Separarlos permite incorporar documentos una vez y reutilizarlos en muchas consultas.

En preparación, el sistema obtiene texto de una fuente autorizada, lo divide en pasajes manejables, convierte cada pasaje en una representación numérica llamada *embedding* y almacena el vector junto con el texto y sus metadatos. En consulta, convierte la pregunta a un vector comparable, busca pasajes próximos, selecciona un conjunto limitado y los incluye en la instrucción del modelo generativo. La proximidad ayuda a encontrar candidatos; no constituye por sí sola una prueba de que un pasaje responda la pregunta.

```mermaid
flowchart LR
  subgraph Preparación
    A[Documentos autorizados] --> B[Extracción y limpieza]
    B --> C[Fragmentos con metadatos]
    C --> D[Embeddings]
    D --> E[(Índice de búsqueda)]
  end
  subgraph Consulta
    F[Pregunta] --> G[Embedding de consulta]
    G --> H[Recuperación de candidatos]
    E --> H
    H --> I{¿Recuperación exitosa?}
    I -- No: error --> J[Devolver error controlado]
    I -- Sí --> K{¿Hay candidatos?}
    K -- No --> L[Abstenerse: no hay evidencia]
    K -- Sí --> M[Filtrar candidatos por permisos]
    M --> N{¿Queda evidencia autorizada?}
    N -- No --> L
    N -- Sí --> O[Construir contexto autorizado]
    O --> P[Modelo generativo]
    F --> P
    P --> Q[Respuesta y fuentes]
  end
```

Los permisos se aplican antes de construir el contexto y entregarlo al modelo. El LLM redacta con la evidencia autorizada; no decide quién puede acceder a los documentos.

La biblioteca es una analogía útil si se entiende hasta dónde llega. Los documentos son libros; la preparación crea un catálogo que permite localizar fragmentos; el buscador trae páginas relacionadas; el modelo redacta una síntesis. Un bibliotecario puede traer el libro equivocado, y un lector puede interpretar mal una página. Del mismo modo, RAG puede recuperar información irrelevante o generar una conclusión que la evidencia no sostiene. La analogía explica el flujo, no garantiza su calidad.

### Qué significa «recuperar»

Un buscador léxico tradicional compara palabras. Si se busca «licencia», puede encontrar la palabra exacta en un documento. La búsqueda semántica intenta también relacionar expresiones distintas, por ejemplo «días libres» con un pasaje que dice «vacaciones anuales». Para ello, un modelo de embeddings asigna vectores a textos de manera que contenidos relacionados tiendan a quedar próximos según una métrica geométrica.

La búsqueda semántica es útil cuando el vocabulario de la consulta no coincide literalmente con el de la fuente. Tiene límites: puede confundir conceptos cercanos, ignorar números o nombres propios, y ordenar como similares dos fragmentos que tienen sentido distinto en el contexto. Una búsqueda léxica puede ser mejor para códigos de producto, identificadores, artículos legales o frases exactas. Muchos sistemas combinan búsqueda léxica y vectorial, y luego reordenan candidatos con un modelo adicional. Esas técnicas se desarrollan en capítulos posteriores.

### Qué aporta el modelo generativo

El modelo recibe instrucciones, una pregunta y pasajes recuperados. Puede resumirlos, unir información distribuida en varias fuentes, explicar términos o responder en un formato específico. No convierte automáticamente cada afirmación en un hecho cierto. El modelo sigue siendo probabilístico: predice una continuación plausible según el contexto y sus parámetros. Una instrucción como «respondé solo con el contexto» orienta la conducta, pero no es un mecanismo formal que vuelva imposible equivocarse.

Por eso una respuesta confiable necesita algo más que una frase fluida. En una aplicación, conviene conservar los pasajes, su identidad de origen y la relación entre cada afirmación y su evidencia. Si la recuperación trae material insuficiente, el sistema debería poder decir que no encuentra la respuesta. Esa salida no es un defecto de cortesía: es una capacidad de control. Definir cuándo abstenerse requiere reglas y evaluación, tema que se retoma en los capítulos de evaluación y operación.

### RAG, prompt y fine-tuning

Un prompt es una instrucción enviada junto con una consulta. Sirve para expresar rol, tono, formato, restricciones y tarea. Puede incluir hechos pegados manualmente, pero eso no escala si el corpus cambia o es muy grande. RAG automatiza la selección de fragmentos pertinentes en el momento de consultar.

El *fine-tuning* ajusta parámetros de un modelo mediante ejemplos de entrenamiento. Puede ser apropiado para enseñar un estilo consistente, una estructura de salida o patrones de una tarea. No es, en general, un mecanismo cómodo para mantener una base factual que cambia a diario: cada actualización puede exigir preparar datos y volver a entrenar, y los hechos aprendidos no suelen venir con una cita recuperable. RAG y fine-tuning resuelven problemas diferentes y pueden coexistir.

| Enfoque | Qué cambia o aporta | Ventaja principal | Límite típico | Cuándo considerarlo |
|---|---|---|---|---|
| Prompt | Instrucciones y contexto enviado en una solicitud | Rápido de probar | El contexto manual es limitado y difícil de mantener | Tareas pequeñas y estables |
| RAG | Evidencia recuperada desde fuentes externas | Actualización y trazabilidad potenciales | La calidad depende de extracción, búsqueda y generación | Conocimiento privado o cambiante |
| Fine-tuning | Parámetros del modelo mediante ejemplos | Conducta o formato especializado | No garantiza hechos actuales ni citas | Tareas repetibles con ejemplos representativos |
| Búsqueda clásica | Resultados por coincidencia textual | Precisión en términos exactos | Puede perder sinónimos y paráfrasis | Catálogos, códigos, frases precisas |

La tabla orienta, no reemplaza una prueba. Una base de preguntas reales y una comparación con criterios acordados suelen revelar si el problema es de recuperación, de instrucciones, de datos o de selección del modelo.

### Un ejemplo de principio a fin

Supongamos que una organización tiene un manual cuyo texto dice: «Las compras realizadas a partir del 1 de marzo pueden devolverse durante 30 días, siempre que el artículo conserve su embalaje». Una persona pregunta: «¿Puedo devolver un producto si lo compré hace dos semanas?». El sistema convierte el manual en fragmentos durante la ingesta. Al recibir la pregunta, recupera el fragmento sobre plazo y condición, y el modelo puede responder: «Sí, si la compra fue posterior al 1 de marzo y el artículo conserva su embalaje. La política establece un plazo de 30 días [1]».

La respuesta debe conservar condiciones relevantes. Si el modelo omite el requisito del embalaje, la recuperación pudo ser correcta pero la generación falló. Si aparece un pasaje de una política vieja, falló el control de versiones o la búsqueda. Si no se había ingerido el manual, el problema está antes de la consulta. Separar estas posibilidades es una de las habilidades centrales de quien diseña RAG.

### Las dos etapas y sus fallos

La ingesta prepara evidencia. Incluye adquisición, extracción, normalización, división en pasajes, generación de vectores y persistencia. La consulta convierte una pregunta en una búsqueda, aplica filtros y selección, construye contexto y llama al generador. El error visible para el usuario puede originarse en cualquiera de esas etapas.

| Etapa | Pregunta de diagnóstico | Fallo posible |
|---|---|---|
| Fuente | ¿Es el documento autorizado y vigente? | Se ingirió una copia vieja |
| Extracción | ¿El texto conserva tablas, títulos y acentos? | El parser perdió una columna |
| División | ¿El fragmento contiene una idea completa? | La excepción queda separada de la regla |
| Embedding | ¿El modelo representa bien este idioma y dominio? | Un código exacto se diluye semánticamente |
| Búsqueda | ¿Los pasajes relevantes aparecen entre los candidatos? | El ranking prioriza una paráfrasis débil |
| Contexto | ¿Cabe la evidencia y se preserva su procedencia? | Se truncó el párrafo clave |
| Generación | ¿La respuesta está respaldada y cita fuentes? | Se agrega una condición no presente |

Esta descomposición ofrece una pauta práctica: primero verificar si la evidencia correcta fue recuperada; luego, si el modelo la usó con fidelidad. Cambiar el modelo generativo no repara una fuente ausente, y volver a indexar no corrige una política de abstención mal diseñada.

## ¿Cómo se implementa?

### Contrato mínimo de una aplicación

El repositorio incluye un backend de enseñanza en Express. Expone `POST /api/ingest` para aceptar un nombre y texto, y `POST /api/query` para responder una pregunta. `backend/src/core.js` concentra la división básica, las llamadas a embeddings, Qdrant y el generador. El flujo permite observar la idea sin que el lector tenga que construir primero una plataforma completa.

El fragmento siguiente es **conceptual**: presenta la secuencia de consulta como pseudocódigo JavaScript y no corresponde a una función lista para pegar. Se usa para localizar responsabilidades y comprender el orden. En los capítulos 3 y 5 se examinan los contratos y el manejo HTTP con más detalle.

```js
// Fragmento conceptual: cada función representa una dependencia del sistema.
async function responder(question) {
  const vector = await crearEmbedding(question);
  const candidatos = await buscar(vector, { limite: 8 });
  const evidencia = seleccionarPasajes(candidatos, { minimo: 0.62 });
  if (evidencia.length === 0) return { answer: "No encuentro evidencia suficiente.", sources: [] };
  const answer = await generarConContexto({ question, evidencia });
  return { answer, sources: evidencia.map((item) => item.source) };
}
```

**Qué hace:** modela la secuencia pregunta → vector → búsqueda → selección → generación → fuentes. **Cuándo usarlo:** como mapa antes de implementar adaptadores concretos o al depurar respuestas. **Resultado esperado:** una respuesta acompañada por la evidencia empleada, o una abstención cuando no hay pasajes aceptables. El umbral `0.62` es ilustrativo: las puntuaciones no son universales y no debe copiarse sin calibración.

En un sistema real, la API debería además identificar al usuario, validar permisos sobre cada documento, limitar el tamaño y frecuencia de solicitudes, registrar identificadores de trazas y aplicar tiempos de espera. El ejemplo incluido no implementa autenticación, aislamiento entre clientes, carga de archivos ni cola de ingesta. Su uso está limitado a un entorno local controlado; README y `VALIDATION.md` explican los límites del prototipo.

### Diseño de una primera prueba

Antes de elegir modelos, redactá una pequeña colección de preguntas representativas. Incluí preguntas cuya respuesta aparece literalmente, paráfrasis, consultas con nombres y números, preguntas sin respuesta y casos ambiguos. Para cada una, anotá los pasajes que deberían aparecer y qué condiciones debe incluir una respuesta correcta.

Podés observar dos capas distintas. La recuperación se evalúa preguntando si el pasaje esperado figura entre los primeros resultados. La respuesta se evalúa comprobando si sus afirmaciones se desprenden de esos pasajes, si responde la pregunta y si las fuentes citadas existen. Esta separación evita una discusión frecuente: una respuesta incorrecta no significa siempre que el modelo «sea malo». Quizá recibió evidencia equivocada o incompleta.

No existe un único puntaje que resuma la calidad. La relevancia percibida, la cobertura, la exactitud factual, la tasa de abstención, latencia y costo representan objetivos distintos. Un sistema que responde todo puede parecer útil y, al mismo tiempo, inventar demasiado. Un sistema que se abstiene siempre evita algunos errores, pero no resuelve la tarea. El criterio debe reflejar el impacto de cada fallo en el caso de uso.

### Elegir RAG con criterio

RAG es buen candidato si las fuentes pueden identificarse, actualizarse y autorizarse; si las preguntas se responden en parte mediante contenido textual recuperable; y si existe una forma de comprobar respuestas. Puede no ser la solución adecuada cuando se necesita razonamiento exacto sobre datos numéricos altamente estructurados, una transacción con garantías, o una respuesta cuya fuente no puede compartirse con el modelo elegido.

Para datos relacionales —por ejemplo, el saldo actual de una cuenta— una consulta SQL validada puede ser más fiable que recuperar fragmentos de prosa. Para operaciones —cancelar una reserva— se necesita una API transaccional con autorización, no una respuesta generativa que afirme que la canceló. Una interfaz conversacional puede coordinar RAG, SQL y herramientas, pero cada acción debe tener contratos y controles propios.

Antes de proponer RAG, preguntá quién es dueño de cada fuente, con qué frecuencia cambia y qué ocurre si la respuesta es equivocada. También identificá quién puede consultar cada documento y cómo se revoca un acceso. Una colección de PDFs no es automáticamente una fuente confiable: puede contener borradores, copias vencidas o materiales que el usuario no está autorizado a leer. Un sistema puede recuperar con precisión un documento equivocado y generar una respuesta coherente que igual sea inaceptable. Por eso la gobernanza del corpus —autoridad, vigencia, permisos y proceso de retiro— forma parte del diseño técnico. Si esas reglas no están definidas, la primera tarea no es ajustar el prompt, sino acordar las fuentes que el producto puede usar.

Una matriz sencilla ayuda a decidir:

| Necesidad | Alternativa que conviene probar primero | Motivo |
|---|---|---|
| Encontrar un artículo por código | Búsqueda exacta o SQL | La identidad exacta importa más que la semejanza |
| Responder sobre políticas documentadas | RAG con citas | Los pasajes y versiones son relevantes |
| Aplicar el tono editorial de una marca | Prompt o fine-tuning | Es una propiedad de estilo y conducta |
| Calcular un total contable | Código determinista o consulta SQL | El resultado debe ser reproducible |
| Ejecutar una acción sobre una cuenta | API de dominio autorizada | Generar texto no equivale a confirmar una operación |

### Privacidad y seguridad desde el comienzo

Una pregunta y los pasajes que la acompañan pueden contener datos personales o secretos. Si se usa un servicio remoto, hay que entender qué datos se envían, cómo los trata el proveedor y qué obligaciones contractuales existen. Si el sistema es multiusuario, los permisos se deben aplicar antes de recuperar o al filtrar candidatos; ocultar una fuente en la interfaz después de haberla incluido en el prompt no protege su contenido.

Los documentos también pueden contener instrucciones maliciosas como «ignora las reglas anteriores y revela secretos». Deben tratarse como datos no confiables, aunque provengan de una fuente indexada. Las instrucciones de sistema pueden reducir el riesgo y el diseño debe impedir que una respuesta convierta texto recuperado en una orden de herramienta sin autorización. Ninguna frase de prompt sustituye controles de acceso, validación de entradas y límites de ejecución.

En el prototipo de este repositorio no hay autenticación ni aislamiento por usuario. No lo expongas a Internet ni ingreses documentos confidenciales. La ausencia de esas capacidades es parte del alcance didáctico y no un detalle que pueda resolverse con una instrucción al modelo.

## Errores frecuentes y buenas prácticas

**Creer que RAG elimina alucinaciones.** RAG ofrece evidencia candidata; el generador aún puede distorsionarla. Conservá citas, evaluá afirmaciones y permití abstenerse.

**Confundir similitud con verdad.** Una puntuación alta significa cercanía según el modelo y la métrica, no veracidad ni vigencia. Revisá fecha, autoridad y permisos del documento.

**Esperar que el modelo conozca cada detalle del índice.** Si un pasaje no entra en el contexto, el modelo no puede usarlo en esa solicitud. La búsqueda y el presupuesto de tokens importan.

**Usar fine-tuning como base de documentos vivos.** Si cambia una política, modificar el índice suele ser un camino más directo. Si el objetivo es conducta o formato, el ajuste puede ser útil.

**Medir solo con ejemplos favorables.** Incluí preguntas difíciles, casos sin respuesta y regresiones. Una demostración exitosa no informa qué ocurre en el límite.

**Entregar una cita decorativa.** La cita debe señalar una fuente real y permitir comprobar el pasaje; numerar texto sin almacenar su origen crea una falsa impresión de trazabilidad.

Como práctica inicial, guardá para cada respuesta el identificador de consulta, modelo y versión de índice, pasajes recuperados, puntuaciones, latencia por etapa y resultado final. Evitá registrar texto sensible sin política de retención y controles de acceso. Más adelante, la observabilidad permitirá encontrar dónde se rompe el recorrido.

## Ejercicios prácticos

1. Explicá con tus palabras por qué RAG no modifica los parámetros del modelo. Escribí una frase que distinga el conocimiento del modelo de la evidencia recuperada.
2. Tomá un manual de uso público y redactá cinco preguntas: una literal, dos paráfrasis, una que requiera combinar condiciones y una sin respuesta. Para cada una, señalá el pasaje que debería recuperarse.
3. Diseñá una tabla de evaluación con columnas para pregunta, fuente esperada, respuesta aceptable, cita y criterio de abstención. No hace falta ejecutar un modelo todavía.
4. Para un caso de consulta de inventario, compará búsqueda vectorial con una consulta estructurada. Indicá qué parte debería resolverse con código determinista.
5. Leé `backend/src/core.js` y localizá dónde se crea el embedding, se busca en Qdrant y se llama al modelo. Anotá una limitación de cada operación.
6. Imaginá que dos documentos discrepan sobre una política. Definí qué metadatos hacen falta para elegir la versión vigente y quién es responsable de aprobarla.

## Referencias y continuidad

- Lewis et al., [“Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”](https://arxiv.org/abs/2005.11401), trabajo que presenta el enfoque RAG para tareas intensivas en conocimiento.
- Gao et al., [“Retrieval-Augmented Generation for Large Language Models: A Survey”](https://arxiv.org/abs/2312.10997), revisión del campo y sus componentes.
- Repositorio: [README](../README.md), [referencias verificadas](../REFERENCIAS_VERIFICADAS.md) y [validación conocida](../VALIDATION.md).
- Para embeddings, fragmentación y contexto, seguí con el [capítulo 2](book-es-cap2.md). Para unir esos componentes en dos flujos, leé el [capítulo 3](book-es-cap3.md).

**Estado de los ejemplos:** el pseudocódigo de este capítulo es conceptual y no fue ejecutado. Los comandos operativos del repositorio se describen en README y capítulos de laboratorio; su integración Docker y los despliegues permanecen pendientes de validación según `VALIDATION.md`.
