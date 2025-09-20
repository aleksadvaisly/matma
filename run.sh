#!/bin/bash

# MATMA Portal - Development Runner Script
# Usage: ./run.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PORT=9005

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        MATMA Portal - Launcher         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Check if Prisma is initialized
if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}Initializing Prisma...${NC}"
    npx prisma init --datasource-provider sqlite
fi

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate

# Push database schema
echo -e "${YELLOW}Setting up database...${NC}"
npx prisma db push --skip-generate

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local...${NC}"
    cat > .env.local << EOF
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_NAME="MATMA Portal"
EOF
fi

# Kill any process on port 9005
echo -e "${YELLOW}Checking port $PORT...${NC}"
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Port $PORT is in use. Killing existing process...${NC}"
    lsof -Pi :$PORT -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Start the development server
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Starting MATMA Portal on port $PORT${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}➜${NC} Local:   http://localhost:${PORT}"
echo -e "  ${GREEN}➜${NC} Network: http://$(ipconfig getifaddr en0 2>/dev/null || echo "127.0.0.1"):${PORT}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start Next.js on port 9005
PORT=$PORT npm run dev