#!/usr/bin/env sh
set -eu
: "${IMAGE:?Set IMAGE to your published container registry image}"
kubectl set image deployment/rag-api "api=$IMAGE"
kubectl rollout status deployment/rag-api --timeout=300s
