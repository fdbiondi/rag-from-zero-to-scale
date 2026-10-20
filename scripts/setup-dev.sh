#!/usr/bin/env sh
set -eu
if [ ! -f .env ]; then cp .env.example .env; fi
docker compose -f docker-compose.dev.yml up -d --build
echo 'Pulling local models; may take many minutes and several GB.'
docker compose -f docker-compose.dev.yml exec ollama ollama pull nomic-embed-text
docker compose -f docker-compose.dev.yml exec ollama ollama pull llama3.2:1b
echo 'Open http://localhost:5173 ; API http://localhost:3001/health'
