---
title: "Apendices"
author: "Federico Andrés Biondi"
date: "2026"
language: "es"
chapter: 0
version: "1.0"
---

# Apéndices

## Checklist previo a producción

- [ ] Autenticación en API y autorización sobre cada documento y tenant.
- [ ] Subidas validadas por tipo, tamaño y análisis antimalware.
- [ ] Cifrado en tránsito y en reposo; secretos fuera del repositorio.
- [ ] Backup probado con restauración, borrado e incident response.
- [ ] Pruebas de recuperación con preguntas de referencia y citas auditables.
- [ ] Monitoreo de p95, tokens, errores 429/5xx y gasto acumulado.
- [ ] Límites de consultas por usuario, retención y registro consentido.

## Preguntas frecuentes

**¿Puedo usar solo mi portátil?** Sí para un modelo pequeño; memoria y descargas influyen mucho.  
**¿Por qué no aparece mi respuesta?** Confirmá que hay documentos y revisá `/api/query` y logs.  
**¿Se pueden mezclar modelos?** No en el mismo índice sin estrategia explícita de dimensiones y espacio vectorial.  
**¿RAG evita alucinaciones?** No; ayuda a fundamentar, pero la evaluación sigue siendo esencial.
