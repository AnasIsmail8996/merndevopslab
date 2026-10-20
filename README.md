# MERN DevOps Todo

Containerized Todo app with React (Vite), Express, MongoDB, Docker Compose, and Nginx.

## Stack

- **Frontend:** React, Redux Toolkit, React Hook Form, Vite
- **Backend:** Node.js, Express, Mongoose
- **Proxy:** Nginx (public entrypoint)
- **Database:** MongoDB (`mongo` service in Docker Compose)

## Prerequisites

- Node.js 20+
- Docker and Docker Compose

## Project layout

```text
mern-devops-project/
├── frontend/
├── backend/
├── nginx/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Environment setup

1. Copy the backend example env and edit values:

```bash
cp backend/.env.example backend/.env
```

2. Set `MONGODB_URI` and `PORT` in `backend/.env`.

Docker Compose (service name `mongo`):

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/mern-todos
```

Local `npm run` with MongoDB on your machine:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-todos
```

Optional frontend env (defaults to `/api` behind Nginx):

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_BASE_URL=/api
```

Do not commit real secrets. `backend/.env` is gitignored.

## Local development

### Backend

```bash
cd backend
npm install
npm run dev
```

API listens on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves on `http://localhost:5173` and proxies `/api` to the backend.

## Docker

Build and start all services (frontend, backend, nginx):

```bash
docker compose up --build -d
```

App URL: `http://localhost` (or set `NGINX_PORT`, e.g. `NGINX_PORT=8080 docker compose up --build -d`).

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose down
```

Only Nginx is published. Backend and frontend stay on the Compose network.

## API

Base path: `/api/todos`

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/todos` | List todos |
| `POST` | `/api/todos` | Create a todo |
| `PATCH` | `/api/todos/:id` | Update a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |

Health check: `GET /api/health`

### Examples

Create:

```bash
curl -X POST http://localhost/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Ship the MERN stack\"}"
```

List:

```bash
curl http://localhost/api/todos
```

Update:

```bash
curl -X PATCH http://localhost/api/todos/<id> \
  -H "Content-Type: application/json" \
  -d "{\"completed\":true}"
```

Delete:

```bash
curl -X DELETE http://localhost/api/todos/<id>
```

Invalid MongoDB ids return `400`. Missing todos return `404`.
