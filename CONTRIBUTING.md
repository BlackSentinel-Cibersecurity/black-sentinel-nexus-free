# Contributing to BlackSentinel Nexus FREE

Thank you for your interest in contributing to BlackSentinel Nexus FREE!

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9.0.0

## Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/black-sentinel-nexus-free.git
cd black-sentinel-nexus-free

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example apps/api/.env

# Build shared packages
pnpm --filter @bsn/types build
pnpm --filter @bsn/ui build

# Start development servers
pnpm dev
```

The application will be available at:
- **Web UI**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs

### Default Credentials

- **Email**: admin@blacksentinel.io
- **Password**: Admin@123

## Project Structure

```
black-sentinel-nexus-free/
  apps/
    api/          # NestJS backend (port 3001)
    web/          # Next.js frontend (port 3000)
  packages/
    types/        # Shared TypeScript type definitions
    ui/           # Shared React component library
  scripts/        # Build and run scripts
```

## Available Scripts

```bash
# Development
pnpm dev              # Start both API and Web in dev mode
pnpm build            # Build all packages and apps
pnpm lint             # Run linting
pnpm typecheck        # Run type checking

# Individual packages
pnpm --filter @bsn/api dev       # Start API only
pnpm --filter @bsn/web dev       # Start Web only
pnpm --filter @bsn/types build   # Build types package
pnpm --filter @bsn/ui build      # Build UI package
```

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

## Reporting Issues

Please use the GitHub issue tracker to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
