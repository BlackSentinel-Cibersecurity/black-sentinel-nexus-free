#!/bin/bash
# BlackSentinel Nexus Free - Build Script
set -e

echo "=========================================="
echo "BlackSentinel Nexus FREE - Build"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required"
    exit 1
fi

echo "Node.js: $(node -v)"

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install

# Build API
echo ""
echo "Building API..."
cd apps/api && pnpm build && cd ../..

# Build Web
echo ""
echo "Building Web..."
cd apps/web && pnpm build && cd ../..

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
