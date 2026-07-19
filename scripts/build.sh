#!/bin/bash
# BlackSentinel Nexus Free - Build Script
set -e

echo "=========================================="
echo "BlackSentinel Nexus FREE - Build"
echo "=========================================="
echo ""

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required (>= 18)"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is required (>= 9.0.0)"
    echo "Install: npm install -g pnpm"
    exit 1
fi

echo "Node.js: $(node -v)"
echo "pnpm:    $(pnpm -v)"

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build shared packages in dependency order
echo ""
echo "Building @bsn/types..."
pnpm --filter @bsn/types build

echo ""
echo "Building @bsn/ui..."
pnpm --filter @bsn/ui build

# Build applications
echo ""
echo "Building @bsn/api..."
pnpm --filter @bsn/api build

echo ""
echo "Building @bsn/web..."
pnpm --filter @bsn/web build

echo ""
echo "=========================================="
echo "Build complete!"
echo "=========================================="
echo ""
echo "To start: ./scripts/start.sh"
echo ""
echo "FREE VERSION LIMITS:"
echo "  - Max 3 users"
echo "  - 10 connector templates"
echo "  - 2 correlation rules"
echo "  - EN/ES languages only"
echo "  - No PDF export"
echo ""
