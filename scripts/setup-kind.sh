#!/usr/bin/env sh
set -eu
kind create cluster --name rag-book --config kind-config.yaml
docker build -t rag-backend:dev ./backend
kind load docker-image rag-backend:dev --name rag-book
kubectl apply -f k8s/app.yaml
echo 'The API requires Qdrant and Ollama reachable by Kubernetes DNS. Deploy those or point ConfigMap at accessible endpoints before query tests.'
kubectl rollout status deployment/rag-api --timeout=120s
kubectl port-forward svc/rag-api 3001:3001
