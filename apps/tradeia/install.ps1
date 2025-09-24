# TradeIA Installation Script for Windows
# Handles dependency installation with proper error handling

Write-Host "🚀 Installing TradeIA Dependencies..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Yellow

# Function to check if command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check Node.js version
Write-Host "`n📋 Checking Node.js version..." -ForegroundColor Cyan
if (Test-Command node) {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

    # Extract major version
    $nodeMajor = [int]($nodeVersion -replace '^v', '' -split '\.')[0]
    if ($nodeMajor -lt 18) {
        Write-Host "❌ Node.js version $nodeVersion is not supported. Please upgrade to Node.js 18 or higher." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

# Check package manager
Write-Host "`n📋 Checking package manager..." -ForegroundColor Cyan
$packageManager = $null

if (Test-Command pnpm) {
    $packageManager = "pnpm"
    Write-Host "✅ Using pnpm" -ForegroundColor Green
} elseif (Test-Command yarn) {
    $packageManager = "yarn"
    Write-Host "✅ Using yarn" -ForegroundColor Green
} elseif (Test-Command npm) {
    $packageManager = "npm"
    Write-Host "✅ Using npm" -ForegroundColor Green
} else {
    Write-Host "❌ No package manager found. Please install npm, pnpm, or yarn." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
try {
    switch ($packageManager) {
        "pnpm" { & pnpm install }
        "yarn" { & yarn install }
        "npm" { & npm install }
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Dependencies installed successfully!" -ForegroundColor Green
    } else {
        throw "Installation failed"
    }
} catch {
    Write-Host "`n❌ Dependency installation failed!" -ForegroundColor Red
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Clear package manager cache:" -ForegroundColor White
    switch ($packageManager) {
        "pnpm" { Write-Host "   pnpm store prune" -ForegroundColor White }
        "yarn" { Write-Host "   yarn cache clean" -ForegroundColor White }
        "npm" { Write-Host "   npm cache clean --force" -ForegroundColor White }
    }
    Write-Host "`n2. Delete node_modules and reinstall:" -ForegroundColor White
    Write-Host "   Remove-Item -Recurse -Force node_modules" -ForegroundColor White
    Write-Host "   Remove-Item package-lock.json, pnpm-lock.yaml, yarn.lock -ErrorAction SilentlyContinue" -ForegroundColor White
    Write-Host "   .\install.ps1" -ForegroundColor White
    Write-Host "`n3. Check Node.js version:" -ForegroundColor White
    Write-Host "   node --version  # Should be 18+" -ForegroundColor White
    exit 1
}

# Setup husky (optional)
Write-Host "`n🔧 Setting up Git hooks (optional)..." -ForegroundColor Cyan
if (Test-Path .git) {
    if (Test-Command husky) {
        Write-Host "✅ Setting up husky..." -ForegroundColor Green
        try {
            & npx husky install
        } catch {
            Write-Host "⚠️  Husky setup failed, but continuing..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Husky not available, skipping Git hooks setup" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Not a Git repository, skipping husky setup" -ForegroundColor Blue
}

# Validate installation
Write-Host "`n🔍 Validating installation..." -ForegroundColor Cyan
if (Test-Path node_modules) {
    Write-Host "✅ node_modules directory exists" -ForegroundColor Green

    # Check for critical dependencies
    $criticalDeps = @("next", "@supabase/supabase-js", "react", "typescript")
    $missingDeps = @()

    foreach ($dep in $criticalDeps) {
        if (!(Test-Path "node_modules/$dep")) {
            $missingDeps += $dep
        }
    }

    if ($missingDeps.Count -eq 0) {
        Write-Host "✅ All critical dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing critical dependencies: $($missingDeps -join ', ')" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ node_modules directory not found" -ForegroundColor Red
    exit 1
}

# Check build
Write-Host "`n🔨 Testing build..." -ForegroundColor Cyan
try {
    & npm run type-check
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
    } else {
        throw "TypeScript compilation failed"
    }
} catch {
    Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

# Final success message
Write-Host "`n🎉 TradeIA installation completed successfully!" -ForegroundColor Green
Write-Host "`n🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure environment variables:" -ForegroundColor White
Write-Host "   Copy-Item vercel.env.example .env.local" -ForegroundColor White
Write-Host "   # Edit .env.local with your credentials" -ForegroundColor White
Write-Host "`n2. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host "`n3. Run tests:" -ForegroundColor White
Write-Host "   npm run test:all" -ForegroundColor White
Write-Host "`n4. Validate API compliance:" -ForegroundColor White
Write-Host "   npm run validate:api" -ForegroundColor White
Write-Host "`n📚 For more information, see README.md" -ForegroundColor Blue