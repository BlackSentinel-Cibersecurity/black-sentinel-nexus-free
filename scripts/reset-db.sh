#!/bin/bash
# BlackSentinel Nexus Free - Reset Database Script

echo "Resetting BlackSentinel Nexus FREE database..."

# Stop services first
./scripts/stop.sh

# Remove database
echo "Removing database file..."
rm -f apps/api/black_sentinel.db

# Remove uploads
echo "Removing uploads..."
rm -rf apps/api/uploads

echo ""
echo "Database reset complete."
echo "Start the application with: ./scripts/start.sh"
echo ""
