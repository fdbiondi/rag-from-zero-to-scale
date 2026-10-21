# Datos del caso conductor

**Contenido íntegramente sintético.** Los nombres de entidades y sujetos, IDs, documentos, fechas, reglas y respuestas son inventados para enseñanza; no usar como política real.

`documentos.jsonl` tiene un objeto `RagDocument` por línea y `evaluacion.jsonl` un objeto de consulta de evaluación por línea. Contratos y semántica: `../CASO_CONDUCTOR.md`. UTF-8, un JSON válido por línea. Los IDs y textos se mantienen estables entre ejercicios para permitir comparar variantes.

## Uso

1. Leer cada línea como JSON, validar `schemaVersion` y conservar el objeto original.
2. Ingerir solo documentos `approved` vigentes para consultas corrientes. Se puede incluir versiones supersedidas en un índice histórico separado para ejercicios de consultas «as of».
3. Aplicar tenant, estado, vigencia y ACL antes de exponer contenido al generador. El rol del escenario se resuelve en servidor; no confiar en valores suministrados por un usuario.
4. Comparar respuesta y fuentes con `expectedAnswer` y `expectedSourceIds`. La redacción puede variar; la evidencia y disposición deben coincidir.
5. No llamar resultados «medidos» si solo se copiaron las expectativas de este archivo. Registrar configuración y fecha en cualquier ejecución real.

Hay preguntas positivas, fuera de alcance/sin respuesta, conflicto temporal, instrucción adversarial en contenido y acceso no autorizado (incluido cruce de tenant). Los documentos son texto de prueba; el texto marcado como instrucción en `NEB-SEC-001` debe tratarse como contenido no confiable, nunca como instrucción del sistema.
