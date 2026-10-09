#!/bin/bash
# BlackSentinel Nexus Free - Start Script
set -e

echo "=========================================="
echo "BlackSentinel Nexus FREE - Starting"
echo "=========================================="
echo ""
echo "FREE VERSION LIMITS:"
echo "  - Max 3 users"
echo "  - 10 connector templates"
echo "  - 2 correlation rules"
echo "  - EN/ES languages only"
echo "  - No PDF export"
echo ""

# Check if .env exists, copy from .env.example if not
if [ ! -f apps/api/.env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example apps/api/.env
fi

# Kill existing processes on ports
echo "Stopping existing processes..."
if lsof -ti:3001 &> /dev/null; then
    kill $(lsof -ti:3001) 2>/dev/null || true
    sleep 1
fi
if lsof -ti:3000 &> /dev/null; then
    kill $(lsof -ti:3000) 2>/dev/null || true
    sleep 1
fi

# Start API
echo "Starting API on port 3001..."
cd apps/api && pnpm dev &
API_PID=$!
sleep 3

# Start Web
echo "Starting Web on port 3000..."
cd ../web && pnpm dev &
WEB_PID=$!

echo ""
echo "=========================================="
echo "BlackSentinel Nexus FREE is running!"
echo "=========================================="
echo ""
echo "  Web:    http://localhost:3000"
echo "  API:    http://localhost:3001"
echo "  Docs:   http://localhost:3001/docs"
echo "  Health: http://localhost:3001/api/v1/health"
echo ""
echo "  Login:  admin@blacksentinel.io / the password printed in the API log on first start"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

# Wait for processes
wait
