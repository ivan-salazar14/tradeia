#!/bin/bash

# TradeIA Installation Script
# Handles dependency installation with proper error handling

set -e

echo "🚀 Installing TradeIA Dependencies..."
echo "===================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js version
echo "📋 Checking Node.js version..."
if command_exists node; then
    NODE_VERSION=$(node --version | sed 's/v//')
    echo "✅ Node.js version: $NODE_VERSION"

    # Check if Node version is compatible (18+)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo "❌ Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 18 or higher."
        exit 1
    fi
else
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check npm/pnpm/yarn
echo ""
echo "📋 Checking package manager..."
PACKAGE_MANAGER=""

if command_exists pnpm; then
    PACKAGE_MANAGER="pnpm"
    echo "✅ Using pnpm"
elif command_exists yarn; then
    PACKAGE_MANAGER="yarn"
    echo "✅ Using yarn"
elif command_exists npm; then
    PACKAGE_MANAGER="npm"
    echo "✅ Using npm"
else
    echo "❌ No package manager found. Please install npm, pnpm, or yarn."
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Dependency installation failed!"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Clear package manager cache:"
    if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
        echo "   pnpm store prune"
    elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
        echo "   yarn cache clean"
    else
        echo "   npm cache clean --force"
    fi
    echo ""
    echo "2. Delete node_modules and reinstall:"
    echo "   rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock"
    echo "   ./install.sh"
    echo ""
    echo "3. Check Node.js version:"
    echo "   node --version  # Should be 18+"
    exit 1
fi

# Setup husky (optional)
echo ""
echo "🔧 Setting up Git hooks (optional)..."
if [ -d ".git" ]; then
    if command_exists husky; then
        echo "✅ Setting up husky..."
        npx husky install || echo "⚠️  Husky setup failed, but continuing..."
    else
        echo "⚠️  Husky not available, skipping Git hooks setup"
    fi
else
    echo "ℹ️  Not a Git repository, skipping husky setup"
fi

# Validate installation
echo ""
echo "🔍 Validating installation..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules directory exists"

    # Check for critical dependencies
    CRITICAL_DEPS=("next" "@supabase/supabase-js" "react" "typescript")
    MISSING_DEPS=()

    for dep in "${CRITICAL_DEPS[@]}"; do
        if [ ! -d "node_modules/$dep" ]; then
            MISSING_DEPS+=("$dep")
        fi
    done

    if [ ${#MISSING_DEPS[@]} -eq 0 ]; then
        echo "✅ All critical dependencies installed"
    else
        echo "❌ Missing critical dependencies: ${MISSING_DEPS[*]}"
        exit 1
    fi
else
    echo "❌ node_modules directory not found"
    exit 1
fi

# Check build
echo ""
echo "🔨 Testing build..."
if npm run type-check; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Final success message
echo ""
echo "🎉 TradeIA installation completed successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Configure environment variables:"
echo "   cp vercel.env.example .env.local"
echo "   # Edit .env.local with your credentials"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Run tests:"
echo "   npm run test:all"
echo ""
echo "4. Validate API compliance:"
echo "   npm run validate:api"
echo ""
echo "📚 For more information, see README.md"