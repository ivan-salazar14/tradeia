#!/bin/bash

# Vercel Build Script for TradeIA
# This script runs during Vercel deployment to ensure all components are properly built

set -e

echo "🚀 Starting TradeIA Vercel Build Process..."

# Install dependencies - use --ignore-scripts to avoid issues with husky and other postinstall scripts
echo "📦 Installing dependencies..."
npm install --ignore-scripts --no-audit --no-fund

# Build Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Validate build output
echo "✅ Validating build output..."
if [ ! -d ".next" ]; then
    echo "❌ Build failed: .next directory not found"
    exit 1
fi

# Check for required API routes
echo "🔍 Checking API routes..."
required_routes=(
    "api/health/route.ts"
    "api/signals/route.ts"
    "api/auth/login/route.ts"
)

for route in "${required_routes[@]}"; do
    if [ ! -f "src/app/$route" ]; then
        echo "❌ Required API route missing: $route"
        exit 1
    fi
done

# Validate environment variables (warn if missing)
echo "🌍 Checking environment variables..."
required_env_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
)

for env_var in "${required_env_vars[@]}"; do
    if [ -z "${!env_var}" ]; then
        echo "⚠️  Warning: $env_var is not set"
    fi
done

# Run basic health check
echo "🏥 Running basic health validation..."
node -e "
const fs = require('fs');
const path = require('path');

// Check if critical files exist
const criticalFiles = [
    '.next/server/app/api/health/route.js',
    '.next/server/app/api/signals/route.js',
    'package.json'
];

criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        console.error('❌ Critical file missing:', file);
        process.exit(1);
    }
});

console.log('✅ All critical files present');
"

# Generate build summary
echo "📊 Build Summary:"
echo "  - Node.js version: $(node --version)"
echo "  - NPM version: $(npm --version)"
echo "  - Build directory: $(pwd)/.next"
echo "  - Build size: $(du -sh .next | cut -f1)"
echo "  - API routes: $(find src/app/api -name "route.ts" | wc -l)"

echo "🎉 TradeIA build completed successfully!"
echo "🚀 Ready for deployment to Vercel"
