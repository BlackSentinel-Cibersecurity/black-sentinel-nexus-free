#!/bin/bash
# BlackSentinel Nexus Free - Stop Script

echo "Stopping BlackSentinel Nexus FREE..."

# Kill API
echo "Stopping API (port 3001)..."
kill $(lsof -ti:3001) 2>/dev/null && echo "  API stopped" || echo "  API not running"

# Kill Web
echo "Stopping Web (port 3000)..."
kill $(lsof -ti:3000) 2>/dev/null && echo "  Web stopped" || echo "  Web not running"

echo ""
echo "BlackSentinel Nexus FREE stopped."
