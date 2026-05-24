<div align="center">

# PRISMA

**PR Intelligence Security Monitor Agent**

*AI-powered pull request review, security analysis, and code intelligence — directly inside GitHub.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)

</div>

---

## Overview

PRISMA (PR Intelligence Security Monitor Agent) is an AI-powered pull request review assistant that integrates with GitHub to automatically analyze pull requests in real time.

The platform detects security vulnerabilities, risky coding patterns, code smells, and performance issues, then generates structured review feedback posted directly inside GitHub pull requests — without any manual intervention.

---

## Features

| Category | Details |
|---|---|
| **GitHub Integration** | Real-time webhook integration, automatic PR comments, REST API support |
| **AI Analysis** | AI-powered review generation, code smell detection, performance issue flagging |
| **Security** | Vulnerability detection with severity classification (Critical / High / Medium / Low) |
| **Dashboard** | Interactive review dashboard, inline diff viewer, repository activity tracking, review analytics |

---
## Demo Video

[![Watch the Demo](https://img.youtube.com/vi/TumYwdceRh4/maxresdefault.jpg)](https://youtu.be/TumYwdceRh4)

## Pitch Deck

[View PRISMA Pitch Deck](https://1drv.ms/p/c/8faab0c6b892720b/IQD8Eyln0CqNT4f6q5U1uVcPAcox3QzrSwIkmX9gO4AHIbA?e=RjNwK1)

## Tech Stack

### Frontend
- **React** — Component-based UI
- **Recharts** — Review analytics and data visualization

### Backend
- **FastAPI** — High-performance Python API server
- **Python 3.10+**

### AI Integration
- **Groq API** with **GPT-OSS 120B**

### Integrations
- **GitHub Webhooks** — Real-time event triggers
- **GitHub REST API** — PR diff fetching and comment posting

---

## How It Works

```
Developer opens/updates a PR
        │
        ▼
GitHub Webhook triggers PRISMA backend
        │
        ▼
PR diff fetched via GitHub REST API
        │
        ▼
AI engine analyzes changed code
        │
        ▼
Vulnerabilities & issues detected
        │
        ▼
Structured review feedback generated
        │
        ▼
AI review posted as GitHub PR comment
        │
        ▼
Review metadata stored for analytics
```

---

## Project Structure

```
PRISMA/
├── backend/
│   ├── app/
│   │   ├── ai/           # AI review engine
│   │   ├── api/          # API route handlers
│   │   ├── github/       # GitHub webhook & REST integration
│   │   ├── storage/      # Review metadata persistence
│   │   └── main.py       # Application entrypoint
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard pages
│   │   ├── api.js        # Backend API client
│   │   └── App.js        # App root
│   ├── package.json
│   └── public/
│
└── README.md
```

---

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A GitHub account with webhook access
- A Groq API key

---

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GITHUB_TOKEN=your_github_token
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

> Backend runs at: `http://127.0.0.1:8000`

---

### Frontend

```bash
cd frontend
npm install
npm start
```

> Frontend runs at: `http://localhost:3000`

---

### GitHub Webhook Configuration

1. Go to your repository → **Settings** → **Webhooks** → **Add webhook**
2. Set the **Payload URL** to:
   ```
   https://your-ngrok-url/webhook/github
   ```
3. Set **Content type** to `application/json`
4. Under **Events**, enable: **Pull requests**

---

## Security Issues Detected

PRISMA analyzes PR diffs for a range of common vulnerability patterns, including:

- SQL Injection
- Unsafe `eval()` usage
- Hardcoded credentials
- Insecure authentication logic
- Performance bottlenecks
- Code quality issues

---

## Dashboard Modules

| Module | Purpose |
|---|---|
| **Command Center** | High-level overview of review activity |
| **Reviews Explorer** | Browse and filter all AI-generated reviews |
| **Inline Diff Viewer** | View highlighted code changes per review |
| **Severity Analytics** | Visualize issue distribution by severity |
| **Repository Monitoring** | Track activity across connected repositories |

---

## Roadmap

- [ ] GitLab support
- [ ] Multi-repository organization management
- [ ] AI-generated autofix suggestions
- [ ] Team collaboration workflows
- [ ] CI/CD pipeline integration
- [ ] Authentication and RBAC
- [ ] Persistent database support

---

## Demo

PRISMA demonstrates end-to-end automated PR analysis:

- Real-time PR analysis on open/update events
- Automated AI review generation
- GitHub comment integration
- Interactive frontend review visualization

---

## License

This project is licensed under the [MIT License](LICENSE).
