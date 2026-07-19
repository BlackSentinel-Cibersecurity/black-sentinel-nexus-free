# BlackSentinel Nexus FREE

**New Generation Security Operations Platform (SIEM) - Free Edition**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)

BlackSentinel Nexus is a next-generation Security Operations Platform with AI-powered correlation, real-time monitoring, and automated response capabilities.

**This is the FREE edition** with limited features. For full capabilities, see [Enterprise Features](#enterprise-features).

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/your-org/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free
docker-compose up -d
```

### Option 2: Local Development

```bash
# Prerequisites
# - Node.js >= 18
# - pnpm >= 9.0.0

git clone https://github.com/your-org/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# Install dependencies
pnpm install

# Build shared packages
pnpm --filter @bsn/types build
pnpm --filter @bsn/ui build

# Copy environment variables
cp .env.example apps/api/.env

# Start development servers
pnpm dev
```

### Access the Application

| Service | URL |
|---------|-----|
| Web UI | http://localhost:3000 |
| API | http://localhost:3001 |
| API Docs | http://localhost:3001/docs |
| Health Check | http://localhost:3001/api/v1/health |

### Default Credentials

- **Email**: admin@blacksentinel.io
- **Password**: Admin@123

---

## FREE Version Limitations

| Feature | FREE | Enterprise |
|---------|------|------------|
| Users | 3 max | Unlimited |
| Connector Templates | 10 | 64 |
| Correlation Rules | 2 | 5+ |
| Languages | EN, ES | EN, ES, PT, DE, FR |
| Digital Twin Nodes | 4 | 8+ |
| Report Templates | 3 | 6 |
| PDF Export | No | Yes |
| AI Correlation | Basic | Advanced |
| Threat Intelligence | Basic | Full |

---

## Features

### Core SIEM
- Real-time security event monitoring
- Incident management and tracking
- Asset inventory and risk scoring
- Threat intelligence feeds
- Security event correlation

### AI Correlation
- Neural brain visualization
- Brute force detection
- Port scan detection
- Real-time alert generation

### Automation (SOAR)
- Playbook management
- Automated incident response
- Step-based workflow execution

### Integration
- 10 connector templates:
  - AWS CloudTrail, CrowdStrike Falcon, Palo Alto Networks
  - Splunk, Okta, Jira, Slack, Microsoft Teams
  - Syslog TCP/UDP, VirusTotal

### Reporting
- Executive security reports
- Technical security reports
- Incident investigation reports
- JSON format (no PDF export in FREE edition)

### Digital Twin
- 4-node infrastructure visualization
- Real-time status monitoring
- Risk level indicators

---

## Project Structure

```
black-sentinel-nexus-free/
  apps/
    api/              # NestJS backend
    web/              # Next.js frontend
  packages/
    types/            # Shared TypeScript types
    ui/               # Shared React components
  scripts/            # Build and run scripts
  docker-compose.yml  # Docker deployment
```

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register

### Core
- `GET/POST /api/v1/events` - Security events
- `GET/POST /api/v1/incidents` - Incidents
- `GET/POST /api/v1/assets` - Assets
- `GET /api/v1/threats` - Threat intelligence

### AI & Correlation
- `POST /api/v1/ai/analyze` - AI analysis
- `GET /api/v1/correlation/rules` - Correlation rules
- `GET /api/v1/correlation/alerts` - Active alerts

### Automation
- `GET/POST /api/v1/playbooks` - Playbooks
- `POST /api/v1/playbooks/:id/execute` - Execute playbook

### Settings
- `GET/PATCH /api/v1/settings` - User settings
- `GET/POST /api/v1/users` - User management (max 3)
- `GET/POST /api/v1/connectors` - Connectors (10 templates)

---

## Environment Variables

Copy `.env.example` to `apps/api/.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | API server port | `3001` |
| `DATABASE_TYPE` | Database type (`sqlite` or `postgres`) | `sqlite` |
| `DATABASE_PATH` | SQLite database path | `./black_sentinel.db` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | JWT token expiry | `24h` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `AI_API_KEY` | OpenAI API key (optional) | - |
| `SMTP_HOST` | SMTP server for notifications (optional) | - |

---

## Enterprise Features

For full capabilities, contact sales@blacksentinel.io:

- Unlimited users
- 64 connector templates
- 5+ correlation rules
- 5 languages (EN, ES, PT, DE, FR)
- PDF report export
- Advanced AI correlation
- Full threat intelligence
- Priority support

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 BlackSentinel
