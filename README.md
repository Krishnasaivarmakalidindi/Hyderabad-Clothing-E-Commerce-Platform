# Hyderabad Clothing E-Commerce Platform

A locally-focused, profitability-first clothing e-commerce platform designed for Hyderabad-based manufacturers and customers.

## 🚀 Recent Updates (UI Overhaul)
- **Premium Design System**: Complete visual redesign with modern gradients, glassmorphism, and animations.
- **Enhanced UX**: Sticky navigation, advanced product filtering, and interactive image galleries.
- **Performance**: Optimized with `framer-motion` for smooth transitions and `react-intersection-observer` for lazy loading.
- **Mobile First**: Fully responsive layout for all devices.

## Key Differentiators

- **Low Commission**: 5-10% vs 15-30% on national platforms
- **Fast Payouts**: 7-14 days vs 45+ days
- **Telugu Support**: Full bilingual UI + product descriptions
- **Return Rate Reduction**: Target <15% vs 25-40% industry standard
- **Local Logistics**: Dedicated Hyderabad partner for faster delivery
- **Seller-First**: Profitability focus, not volume

## Project Structure

```
├── backend/          # Node.js + Express API
├── frontend/         # Next.js customer app + seller/admin dashboards
├── database/         # PostgreSQL schema & migrations
└── docs/            # Documentation
```

## Tech Stack

### Frontend
- **Framework**: Next.js (React with SSR)
- **Styling**: Tailwind CSS
- **UI Library**: Radix UI
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Zod
- **i18n**: next-i18next (Telugu/English)

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Bull
- **Authentication**: JWT + OAuth 2.0

### Third-Party Services
- **Payments**: Razorpay
- **SMS/WhatsApp**: Twilio
- **Email**: SendGrid
- **Storage**: AWS S3
- **Logistics**: Shiprocket API

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure your .env.local file
npm run dev
```

3. **Database Setup**
```bash
cd database
# Run migrations
psql -U postgres -f schema.sql
```

## Development Phases

### Phase 1: MVP (Weeks 1-12)
- ✅ Core product listing & checkout
- ✅ Size recommendation system
- ✅ Payment integration (Razorpay)
- ✅ Basic return processing
- ✅ Seller onboarding
- ✅ Email notifications

### Phase 2: Post-Launch (Weeks 13-24)
- WhatsApp integration
- Telugu language support
- Fraud detection (ML)
- Exchange-first return flow
- Automated dispute resolution

### Phase 3: Growth (Weeks 25-52)
- Advanced ML recommendations
- Voice search
- System optimization
- Geographic expansion

## Key Features

### For Customers
- Advanced size guide + body type quiz
- WhatsApp seller consultation
- Exchange-first return model
- Real-time order tracking
- Telugu + English support
- Transparent all-in pricing

### For Sellers
- Zero-tech onboarding (admin handles catalog)
- 5-10% commission (vs 15-30%)
- 7-14 day payouts (vs 45+ days)
- Platform covers return logistics
- Professional photography provided
- Real-time inventory sync

### For Platform Admin
- Automated return processing
- Fraud detection dashboard
- Seller onboarding queue
- Dispute resolution automation
- Real-time analytics

## Target Metrics

### Month 3
- 500 monthly signups
- 20 active sellers
- 500 products listed
- Return rate: <20%

### Month 12
- 5,000+ monthly signups
- 100+ active sellers
- 5,000+ products listed
- Return rate: <15%
- ₹50 lakhs GMV

## License

Proprietary - All rights reserved

## Contact

For business inquiries: support@hyderabadclothing.com
