# Docker Guide - BudgetFlow

Questa guida ti mostra come far girare BudgetFlow completamente in Docker.

## 📦 Che cos'è Docker?

Docker consente di creare **container** - ambienti isolati che includono tutto il necessario (Node.js, dipendenze, etc.). Garantisce che l'app giri identicamente ovunque.

---

## 🚀 Quick Start with Docker Compose

La forma più semplice per far girare tutto (frontend + backend) è usare Docker Compose:

### Prerequisiti
- **Docker Desktop** installato ([download](https://www.docker.com/products/docker-desktop))
- Oppure Docker CLI su Linux

### Step 1: Avvia i container

```bash
cd /Users/federicoguarda/Developer/github/personali/BudgetFlow

# Builda e avvia i container
docker-compose up --build

# O in background:
docker-compose up -d --build
```

### Step 2: Accedi all'app

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

### Step 3: Ferma i container

```bash
docker-compose down

# Con eliminazione dei volumi:
docker-compose down -v
```

---

## 🏗️ Build Manuale (Advanced)

Se vuoi builda e far girare i container singolarmente:

### Backend

```bash
# Build dell'immagine
cd backend
docker build -t budgetflow-backend:latest .

# Run del container
docker run -d \
  --name budgetflow-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=http://localhost:5173 \
  budgetflow-backend:latest

# Vedi i log
docker logs budgetflow-backend

# Ferma il container
docker stop budgetflow-backend
docker rm budgetflow-backend
```

### Frontend

```bash
# Build dell'immagine
cd client
docker build -t budgetflow-frontend:latest .

# Run del container
docker run -d \
  --name budgetflow-frontend \
  -p 5173:80 \
  budgetflow-frontend:latest

# Accedi a http://localhost:5173

# Ferma il container
docker stop budgetflow-frontend
docker rm budgetflow-frontend
```

---

## 🔧 Comandi Utili Docker

```bash
# Lista di tutte le immagini
docker images

# Lista di tutti i container in esecuzione
docker ps

# Lista di TUTTI i container (anche fermi)
docker ps -a

# Vedi i log di un container
docker logs <container-id>

# Entra in un container (debug)
docker exec -it <container-id> /bin/sh

# Elimina un'immagine
docker rmi <image-id>

# Elimina un container
docker rm <container-id>

# Build con tag custom
docker build -t myapp:v1.0 .

# Push su Docker Hub
docker push username/myapp:v1.0
```

---

## 📝 Dockerfile Explained

### Backend (NestJS)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

**Caratteristiche:**
- ✅ Multi-stage build (più piccolo)
- ✅ Alpine Linux (minimale ~150MB)
- ✅ Solo dipendenze di produzione in runtime
- ✅ Non-root user per sicurezza
- ✅ Health check integrato
- ✅ Segnali gestiti correttamente

### Frontend (Vue)

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Caratteristiche:**
- ✅ Build con Node.js
- ✅ Serve con Nginx (super veloce)
- ✅ Gzip compression
- ✅ Cache busting per asset
- ✅ API proxy integrato

---

## 🐳 Docker Compose Explained

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - CORS_ORIGIN=http://localhost:5173
    networks:
      - budgetflow-network

  frontend:
    build: ./client
    ports:
      - "5173:5173"
    depends_on:
      - backend
    networks:
      - budgetflow-network

networks:
  budgetflow-network:
    driver: bridge
```

**Caratteristiche:**
- ✅ Definisce servizi (backend, frontend)
- ✅ Espone porte
- ✅ Variabili ambiente
- ✅ Network condiviso (servizi parlano tra loro)
- ✅ Dipendenze gestite automaticamente

---

## 🌐 Deployment su Cloud

### Docker Hub

```bash
# Login
docker login

# Tag
docker tag budgetflow-backend:latest username/budgetflow-backend:latest

# Push
docker push username/budgetflow-backend:latest
```

### Railway.app (consigliato)

1. Vai su [railway.app](https://railway.app)
2. Collega GitHub
3. Railway auto-rileva il Dockerfile
4. Deploy con un click!

### AWS ECS

```bash
# Build
docker build -t budgetflow-backend .

# Tag
docker tag budgetflow-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/budgetflow:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/budgetflow:latest
```

---

## 📊 Monitoraggio e Logging

```bash
# Vedi statistiche (CPU, memoria, etc)
docker stats

# Vedi i log in real-time
docker logs -f <container-id>

# Esporta i log
docker logs <container-id> > app.log
```

---

## 🔐 Security Best Practices

✅ **Already implemented:**
- Non-root user (nobody per Nginx, nestjs per Node)
- Alpine Linux (minimale, meno vulnerabilità)
- Multi-stage builds (niente dev tools in prod)
- Health checks

✅ **Aggiungi in produzione:**
- Scansiona immagini per vulnerabilità: `docker scan budgetflow-backend`
- Usa image signing
- Registry privato per immagini sensibili
- Network policies

---

## 🆚 Confronto: Native vs Docker

| Aspetto | Native | Docker |
|---------|--------|--------|
| Setup | Facile | Medio |
| Dipendenze | Manual | Automatico |
| Consistency | Dev ≠ Prod | Dev = Prod |
| Scalability | Difficile | Facile |
| Deploy | Complesso | Semplice |
| Performance | Nativo | ~2% overhead |

---

## 📚 Risorse Utili

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Hub](https://hub.docker.com/)

---

## ❓ FAQ

**Q: Docker rallenterebbe l'app?**
A: No, l'overhead è ~2%. Per applicazioni CPU-intensive, il guadagno di isolation e deployment supera il costo.

**Q: Posso usare Docker solo per il backend?**
A: Sì! Continua a sviluppare il frontend con `npm run dev` e il backend in Docker.

**Q: Come faccio il debug dentro Docker?**
A: `docker exec -it <container-id> /bin/sh` per accedere al container.

**Q: Posso usare Docker Compose in produzione?**
A: No, usa Kubernetes o servizi cloud (Railway, AWS ECS, etc).

---

## 🚀 Prossimi Step

1. Installa Docker Desktop
2. Esegui `docker-compose up`
3. Verifica http://localhost:5173
4. Deploy su Railway o AWS

**Happy containerizing! 🐳**
