# Deployment Guide - Hyderabad Clothing E-Commerce Platform

## Production Deployment

### Prerequisites
- AWS Account (or any cloud provider)
- Domain name registered
- SSL certificate
- PostgreSQL database (AWS RDS recommended)
- Redis instance (AWS ElastiCache recommended)

---

## Backend Deployment (AWS EC2 / Heroku)

### Option 1: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS
   # t3.medium or larger
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

4. **Install Dependencies**
   ```bash
   npm ci --production
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Setup PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name hyderabad-clothing-api
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.hyderabadclothing.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **SSL Certificate**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.hyderabadclothing.com
   ```

### Option 2: Heroku

1. **Create Heroku App**
   ```bash
   heroku create hyderabad-clothing-api
   ```

2. **Add PostgreSQL & Redis**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   heroku addons:create heroku-redis:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret_here
   # ... other env vars
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Frontend Deployment (Vercel)

### Recommended: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_RAZORPAY_KEY_ID`

5. **Custom Domain**
   - Add custom domain in Vercel dashboard
   - Update DNS records

---

## Database Setup (AWS RDS)

1. **Create PostgreSQL Instance**
   - Engine: PostgreSQL 14.x
   - Instance class: db.t3.micro (for start)
   - Storage: 20 GB SSD
   - Publicly accessible: No
   - VPC: Same as backend

2. **Connect & Initialize**
   ```bash
   psql -h <rds-endpoint> -U postgres -d postgres -f database/schema.sql
   ```

3. **Security Group**
   - Allow inbound on port 5432 from backend security group

---

## Redis Setup (AWS ElastiCache)

1. **Create Redis Cluster**
   - Engine: Redis 6.x
   - Node type: cache.t3.micro
   - Number of nodes: 1

2. **Update Backend Config**
   ```env
   REDIS_HOST=<elasticache-endpoint>
   REDIS_PORT=6379
   ```

---

## Environment Variables (Production)

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/hyderabad_clothing

# Redis
REDIS_HOST=elasticache-endpoint
REDIS_PORT=6379

# JWT
JWT_SECRET=super_secure_secret_change_this

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# SendGrid
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@hyderabadclothing.com

# AWS S3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=ap-south-1
AWS_S3_BUCKET=hyderabad-clothing-prod

# Frontend URL
FRONTEND_URL=https://hyderabadclothing.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.hyderabadclothing.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_SITE_NAME=Hyderabad Clothing
NEXT_PUBLIC_SITE_URL=https://hyderabadclothing.com
```

---

## CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "hyderabad-clothing-api"
          heroku_email: ${{secrets.HEROKU_EMAIL}}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{secrets.VERCEL_TOKEN}}
          vercel-org-id: ${{secrets.ORG_ID}}
          vercel-project-id: ${{secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

---

## Monitoring & Logging

1. **Sentry (Error Tracking)**
   ```bash
   npm install @sentry/node @sentry/nextjs
   ```

2. **LogRocket (Session Replay)**
   ```bash
   npm install logrocket
   ```

3. **AWS CloudWatch (Logs)**
   - Configure CloudWatch agent on EC2

---

## Performance Optimization

1. **Enable CDN**
   - CloudFront for S3 images
   - Vercel Edge Network for frontend

2. **Database Optimization**
   - Enable query caching
   - Add read replicas for scale

3. **Redis Caching**
   - Cache product listings
   - Cache user sessions

---

## Security Checklist

- ✅ SSL/TLS certificates installed
- ✅ Environment variables secured
- ✅ Database not publicly accessible
- ✅ Rate limiting enabled
- ✅ CORS configured properly
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CSRF tokens implemented
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Security headers (Helmet.js)

---

## Backup Strategy

1. **Database Backups**
   - RDS automated backups (daily)
   - Point-in-time recovery enabled
   - Manual snapshots before major changes

2. **Code Backups**
   - Git repository (GitHub/GitLab)
   - Multiple branches for rollback

3. **Media Backups**
   - S3 versioning enabled
   - Cross-region replication

---

## Post-Deployment Checklist

- ✅ Health check endpoint working
- ✅ SSL certificate valid
- ✅ Domain DNS configured
- ✅ Database migrations applied
- ✅ Environment variables set
- ✅ Payment gateway in live mode
- ✅ Email sending working
- ✅ WhatsApp notifications working
- ✅ Monitoring alerts configured
- ✅ Backup strategy implemented
- ✅ CDN configured
- ✅ Error tracking active

---

## Scaling Plan

### Month 1-3 (MVP)
- Single backend server
- Single database instance
- Basic caching

### Month 4-6 (Growth)
- Load balancer
- Multiple backend instances
- Database read replicas
- Enhanced caching

### Month 7-12 (Scale)
- Microservices architecture
- Database sharding
- Multiple Redis clusters
- Geographic distribution
