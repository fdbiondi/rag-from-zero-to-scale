---
title: "Apendices"
author: "Federico Andrés Biondi"
date: "2026"
language: "en"
chapter: 0
version: "1.0"
---

# Appendices

## Production readiness checklist

- [ ] API authentication and document/tenant authorization.
- [ ] Upload type/size validation and malware scanning.
- [ ] Encryption in transit and at rest; secrets outside source control.
- [ ] Tested backup and restore, deletion and incident response.
- [ ] Retrieval test set with reference questions and auditable citations.
- [ ] p95, tokens, 429/5xx errors, and accumulated spend monitoring.
- [ ] Per-user rate limits, retention policy, and consent-based logging.

## FAQ

**Can I use only a laptop?** Yes for a small model; memory and download time matter.  
**Why is an answer missing?** Confirm data exists and inspect `/api/query` and logs.  
**Can I mix embedding models?** Not in one vector index without a deliberate dimensions and vector-space strategy.  
**Does RAG eliminate hallucinations?** No; it helps ground answers, but evaluation remains mandatory.
