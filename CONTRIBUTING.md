# Contributing to BlackSentinel Nexus FREE

Thank you for your interest in contributing to BlackSentinel Nexus FREE!

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.0.0

## Supported Platforms

| Platform | Status |
|----------|--------|
| Linux (Ubuntu, Debian, CentOS, Fedora, Arch) | Fully supported |
| macOS | Fully supported |
| Windows (PowerShell, CMD, Git Bash) | Fully supported |
| Docker (any OS) | Fully supported |

## Development Setup

### All Platforms (Node.js scripts)

```bash
# Clone the repository
git clone https://github.com/BlackSentinel-Cibersecurity/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Run the project
pnpm install && pnpm build && pnpm dev
```

### macOS

```bash
# Install Node.js
brew install node@20

# Install pnpm
npm install -g pnpm

# Run the project
pnpm install && pnpm build && pnpm dev
```

### Windows

```powershell
# Install Node.js (via winget)
winget install OpenJS.NodeJS.LTS

# Install pnpm
npm install -g pnpm

# Run the project
pnpm install; pnpm build; pnpm dev
```

### Docker

```bash
docker-compose up -d
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm start` | Start in production mode |
| `pnpm stop` | Stop all running servers |
| `pnpm reset-db` | Reset database to fresh state |
| `pnpm lint` | Run linting |
| `pnpm typecheck` | Run type checking |

## Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm typecheck` to verify
4. Test your changes locally
5. Submit a pull request

## Code Style

- TypeScript strict mode is enabled
- Use existing patterns and conventions in the codebase
- Keep components and services focused on single responsibility
- Add types for all new interfaces and DTOs

## Cross-Platform Guidelines

- All scripts in `scripts/` are written in Node.js (not bash)
- Use `path.join()` for file paths (never hardcoded `/` or `\`)
- Use `child_process` with `shell: true` for cross-platform command execution
- Test on multiple platforms when possible

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
