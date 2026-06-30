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

# Kill existing processes
echo "Stopping existing processes..."
kill $(lsof -ti:3001) 2>/dev/null || true
kill $(lsof -ti:3000) 2>/dev/null || true
sleep 1

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
echo "  Login:  admin@blacksentinel.io / Admin@123"
echo ""

# Wait for processes
wait
