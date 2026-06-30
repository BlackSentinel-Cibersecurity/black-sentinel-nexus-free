# BlackSentinel Nexus FREE

## New Generation SIEM - Free Edition

BlackSentinel Nexus is a next-generation Security Operations Platform (SIEM) with AI-powered correlation, real-time monitoring, and automated response capabilities.

**This is the FREE edition** with limited features. For full capabilities, upgrade to Enterprise.

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

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0

### Installation

```bash
# Clone or copy this directory to your target location
cd black-sentinel-nexus-free

# Install dependencies
pnpm install

# Build the project
./scripts/build.sh
```

### Running

```bash
# Start the application
./scripts/start.sh
```

The application will be available at:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/api/v1/health

### Default Credentials

- **Email**: admin@blacksentinel.io
- **Password**: Admin@123

---

## Features Included

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
  - AWS CloudTrail
  - CrowdStrike Falcon
  - Palo Alto Networks
  - Splunk
  - Okta
  - Jira
  - Slack
  - Microsoft Teams
  - Syslog TCP/UDP
  - VirusTotal

### Reporting
- Executive security reports
- Technical security reports
- Incident investigation reports
- JSON format (no PDF export)

### Digital Twin
- 4-node infrastructure visualization
- Real-time status monitoring
- Risk level indicators

---

## Project Structure

```
black-sentinel-nexus-free/
  apps/
    api/          # NestJS backend
    web/          # Next.js frontend
  packages/
    ui/           # Shared UI components
  scripts/        # Build and run scripts
  images/         # Logo and assets
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

Create a `.env` file:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_TYPE=sqlite
DB_DATABASE=black_sentinel.db

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# AI (Optional)
AI_API_KEY=your-openai-api-key
```

---

## Upgrade to Enterprise

For full capabilities, contact sales@blacksentinel.io or visit:
- Unlimited users
- 64 connector templates
- 5+ correlation rules
- 5 languages (EN, ES, PT, DE, FR)
- PDF report export
- Advanced AI correlation
- Full threat intelligence
- Priority support

---

## License

Copyright (c) 2024 BlackSentinel. All rights reserved.

This software is proprietary and confidential.
Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
