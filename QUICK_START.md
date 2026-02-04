# Quick Start Guide - Hyderabad Clothing E-Commerce Platform

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed and running
- [ ] Redis 6+ installed and running (optional for MVP)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## Installation Methods

Choose one of the following methods:

### Method 1: Manual Setup (Recommended for Development)

#### Step 1: Install PostgreSQL

**Windows:**
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Install Redis (Optional)

**Windows:**
```powershell
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use WSL2 with Linux instructions
```

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

#### Step 3: Clone and Setup Backend

```bash
cd backend
npm install
```

#### Step 4: Setup Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hyderabad_clothing;

# Exit psql
\q

# Run schema
psql -U postgres -d hyderabad_clothing -f ../database/schema.sql
```

#### Step 5: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hyderabad_clothing
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hyderabad_clothing
DB_USER=postgres
DB_PASSWORD=your_password

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=change_this_to_random_string
```

#### Step 6: Start Backend

```powershell
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
Server running on: http://localhost:5000
```

#### Step 7: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

#### Step 8: Start Frontend

```powershell
cd frontend
npm run dev
```

Visit: http://localhost:3000

---

### Method 2: Docker Setup (Easiest)

#### Prerequisites
- Docker Desktop installed
- Docker Compose installed

#### Start Everything

```powershell
# From project root
docker-compose up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 5000
- Frontend on port 3000

Visit: http://localhost:3000

---

## Testing the Installation

### 1. Test Backend Health

```powershell
# PowerShell
Invoke-WebRequest http://localhost:5000/health

# Or use browser: http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Hyderabad Clothing API is running",
  "environment": "development"
}
```

### 2. Test User Registration

```powershell
# PowerShell
$body = @{
    email = "test@example.com"
    phoneNumber = "+919876543210"
    password = "test123"
    fullName = "Test User"
    userType = "customer"
    preferredLanguage = "en"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/v1/auth/register -Method Post -Body $body -ContentType "application/json"
```

### 3. Test Login

```powershell
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/v1/auth/login -Method Post -Body $loginBody -ContentType "application/json"

# Save token for later
$token = $response.data.token
```

### 4. Test Protected Endpoint

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri http://localhost:5000/api/v1/auth/me -Method Get -Headers $headers
```

### 5. Test Frontend

Visit http://localhost:3000 and you should see:
- Homepage with "Hyderabad's First Local-First Clothing Platform"
- Navigation links
- Features section
- Stats section

---

## Common Issues & Solutions

### Issue 1: "Database connection failed"

**Solution:**
```powershell
# Check PostgreSQL is running
Get-Service -Name *postgres*

# If not running, start it
net start postgresql-x64-14

# Verify connection manually
psql -U postgres -d hyderabad_clothing
```

### Issue 2: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in backend/.env
PORT=5001
```

### Issue 3: "Cannot find module 'xyz'"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Redis connection failed"

**Solution (if Redis not installed):**
```javascript
// In backend/.env, comment out Redis temporarily
# REDIS_HOST=localhost
# REDIS_PORT=6379

// Or install Redis (optional for MVP)
```

### Issue 5: "Database schema not loaded"

**Solution:**
```powershell
# Re-run schema
psql -U postgres -d hyderabad_clothing -f database/schema.sql

# Verify tables exist
psql -U postgres -d hyderabad_clothing -c "\dt"
```

---

## Development Workflow

### 1. Start Development Environment

```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database logs (optional)
# Watch PostgreSQL logs
```

### 2. Make Changes

- Edit files in `backend/src/` or `frontend/`
- Changes auto-reload (hot reload enabled)

### 3. Check Logs

Backend logs show:
- Database queries
- API requests
- Errors

### 4. Test API Changes

Use Postman, Thunder Client, or PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/v1/products -Method Get
```

---

## Next Steps After Installation

### 1. Create Test Data

**Create Seller Account:**
```powershell
$sellerBody = @{
    email = "seller@example.com"
    phoneNumber = "+919876543211"
    password = "seller123"
    fullName = "Test Seller"
    userType = "seller"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/v1/auth/register -Method Post -Body $sellerBody -ContentType "application/json"
```

**Create Admin Account:**
```sql
-- Use the pre-created admin account:
-- Email: admin@hyderabadclothing.com
-- Password: admin123 (CHANGE THIS!)
```

### 2. Implement Missing Features

Priority order:
1. Complete product controller (seller product creation)
2. Build product listing page
3. Build product detail page
4. Implement cart functionality
5. Build checkout flow
6. Integrate Razorpay payment

### 3. Setup Third-Party Services

#### Razorpay (Test Mode)
1. Sign up: https://razorpay.com/
2. Get test API keys
3. Add to `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

#### SendGrid (Email)
1. Sign up: https://sendgrid.com/
2. Create API key
3. Add to `.env`:
   ```env
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=noreply@test.com
   ```

---

## Development Commands Reference

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start           # Start production server
npm run lint        # Run ESLint
npm test            # Run tests (when implemented)
```

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Database
```powershell
# Connect to database
psql -U postgres -d hyderabad_clothing

# List tables
\dt

# Describe table
\d users

# Run query
SELECT * FROM users;

# Exit
\q
```

---

## Useful VS Code Extensions

1. **ESLint** - JavaScript/TypeScript linting
2. **Prettier** - Code formatting
3. **Thunder Client** - API testing
4. **PostgreSQL** - Database management
5. **GitLens** - Git integration
6. **Tailwind CSS IntelliSense** - Tailwind autocompletion

---

## Environment Variables Reference

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hyderabad_clothing
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_SITE_NAME=Hyderabad Clothing
```

---

## Getting Help

### Documentation
- API Docs: `docs/API_DOCUMENTATION.md`
- Setup Guide: `docs/SETUP_GUIDE.md`
- Deployment: `docs/DEPLOYMENT.md`

### Quick Links
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Success Checklist

After setup, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Database connection working
- [ ] Can register a user
- [ ] Can login
- [ ] Can access protected endpoints
- [ ] Homepage loads correctly
- [ ] No console errors

---

**You're all set! Start building amazing features! 🚀**
