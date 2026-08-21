# Donotrack Project Setup Script
# Run this script in PowerShell to set up the environment.

Write-Host "🚀 Starting Donotrack Project Setup..." -ForegroundColor Cyan

# 1. Check Prerequisites
Write-Host "`n🔍 Checking Prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Python is not installed. Please install Python 3.12+."
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Node.js is not installed. Please install Node.js (LTS)."
    exit 1
}
Write-Host "✅ Prerequisites found." -ForegroundColor Green

# 2. Backend Setup
Write-Host "`n🐍 Setting up Backend..." -ForegroundColor Yellow
Set-Location "backend"

# Create venv if not exists
if (-not (Test-Path "venv")) {
    Write-Host "   Creating virtual environment..."
    python -m venv venv
}

# Activate venv
Write-Host "   Activating virtual environment..."
& ".\venv\Scripts\Activate.ps1"

# Install requirements
Write-Host "   Installing dependencies..."
pip install -r requirements.txt

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file missing in backend!" -ForegroundColor Red
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "   Created .env from .env.example. PLEASE EDIT IT with your secrets." -ForegroundColor Magenta
    } else {
        Write-Host "   Please create .env manually." -ForegroundColor Magenta
    }
}

# Run Migrations
Write-Host "   Running Database Migrations..."
alembic upgrade head

Set-Location ..
Write-Host "✅ Backend setup complete." -ForegroundColor Green

# 3. Frontend Setup
Write-Host "`n⚛️  Setting up Frontend..." -ForegroundColor Yellow
Set-Location "frontend"

# Install dependencies
Write-Host "   Installing npm packages (this may take a while)..."
npm install

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file missing in frontend!" -ForegroundColor Red
    Write-Host "   Please create .env with VITE_CLERK_PUBLISHABLE_KEY etc." -ForegroundColor Magenta
}

Set-Location ..
Write-Host "✅ Frontend setup complete." -ForegroundColor Green

Write-Host "`n🎉 Setup Finished Successfully!" -ForegroundColor Cyan
Write-Host "To run the project:"
Write-Host "1. Backend: cd backend; .\venv\Scripts\activate; python -m uvicorn app.main:app --reload"
Write-Host "2. Frontend: cd frontend; npm run dev"
