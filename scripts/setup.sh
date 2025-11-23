#!/bin/bash

# Freelance Framework Setup Script
# Helps bootstrap new projects from this framework

set -e

echo "=================================="
echo "  Freelance Framework Setup"
echo "=================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")
if [[ "$NODE_VERSION" == "not installed" ]]; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "Node.js version: $NODE_VERSION"
echo ""

# Check if this is a fresh clone
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this from the project root."
    exit 1
fi

# Prompt for project name
read -p "Enter your project name (lowercase, no spaces): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo "Error: Project name is required."
    exit 1
fi

# Update package.json
echo "Updating package.json..."
sed -i.bak "s/\"name\": \"studio-haus\"/\"name\": \"$PROJECT_NAME\"/" package.json
rm -f package.json.bak

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "Please edit .env.local with your credentials."
    else
        echo "Warning: .env.example not found. Creating basic .env.local..."
        cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-change-in-production"

# OAuth Providers (optional)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""

# Stripe (optional)
# STRIPE_SECRET_KEY=""
# STRIPE_WEBHOOK_SECRET=""
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
EOF
    fi
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "Generating Prisma client..."
npm run db:generate

echo ""
echo "=================================="
echo "  Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Update src/config/site.ts with your branding"
echo "3. Run: npm run dev"
echo ""
echo "Optional:"
echo "- Set up database: npm run db:push"
echo "- Run tests: npm test"
echo ""
