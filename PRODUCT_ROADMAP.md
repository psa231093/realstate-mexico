# Urbanify - Product Roadmap & Feature Tracker

> Last Updated: December 2024
> Status: Active Development

---

## Table of Contents
1. [Current State](#current-state)
2. [Competitive Analysis](#competitive-analysis)
3. [Feature Roadmap](#feature-roadmap)
4. [Implementation Phases](#implementation-phases)
5. [Revenue Opportunities](#revenue-opportunities)
6. [Progress Tracker](#progress-tracker)

---

## Current State

### Implemented Features

| Category | Feature | Status |
|----------|---------|--------|
| **Search & Discovery** | Property search with filters | Done |
| | Map view (Mapbox) | Done |
| | Grid view with sidebar filters | Done |
| | Save favorite properties | Done |
| | Save search criteria | Done |
| | Recently viewed | Done |
| | Price per m² display | Done |
| **Calculators** | Capacidad de Compra (Affordability) | Done |
| | INFONAVIT Calculator | Done |
| | Investment Calculator (Cap Rate, ROI) | Done |
| **Property Listing** | Multi-step listing wizard | Done |
| | AI-generated descriptions (Claude) | Done |
| | Image upload with compression | Done |
| | Seller type selection | Done |
| **User Management** | Google OAuth | Done |
| | User profile & avatar | Done |
| | Dashboard | Done |
| **Communication** | WhatsApp integration | Done |
| **UI/UX** | Dark mode | Done |
| | Responsive design | Done |
| | Modern Zillow-style interface | Done |

### Tech Stack
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL (Supabase)
- Auth: Supabase Auth (Google OAuth)
- Storage: Supabase Storage
- Maps: Mapbox GL
- AI: Claude API (Anthropic)

---

## Competitive Analysis

### Main Competitors in Mexico

| Platform | Strengths | Weaknesses |
|----------|-----------|------------|
| **Inmuebles24** | Market leader, 6M+ monthly visits, virtual tours, agent CRM | Cluttered UI, same as Vivanuncios |
| **Vivanuncios** | Large inventory, combo with Inmuebles24 | Same owner as Inmuebles24, no differentiation |
| **Metros Cubicos** | Mercado Libre integration, high visibility | Not real estate focused, limited features |
| **Lamudi** | Clean interface, international backing | Smaller inventory in Mexico |
| **Casas y Terrenos** | Local focus | Outdated interface |

### Our Differentiation Strategy
1. **Trust & Transparency** - Verification system, fraud prevention
2. **Intelligence** - Colonia reports, price analysis, market data
3. **Financial Tools** - Calculator suite (already ahead)
4. **User Experience** - Modern, fast, intuitive
5. **Specialized Markets** - Expats, investors, INFONAVIT users

---

## Feature Roadmap

### Tier 1: Must-Have (Competitive Parity)

#### 1.1 Trust & Verification System
- [ ] Verified seller badge (INE verification)
- [ ] Verified property badge (documents uploaded)
- [ ] Agent license verification
- [ ] User reviews & ratings for agents/sellers
- [ ] Report fraudulent listing button
- [ ] Trust score algorithm

#### 1.2 In-App Messaging
- [ ] Real-time chat between buyers/sellers
- [ ] Message templates for common inquiries
- [ ] Lead tracking for sellers
- [ ] Push notifications (email initially)
- [ ] Chat history in dashboard
- [ ] Unread message counter

#### 1.3 Virtual Tours
- [ ] 360° photo viewer integration
- [ ] Video tour uploads (MP4)
- [ ] YouTube video embedding
- [ ] Matterport integration (future)

#### 1.4 Advanced Search
- [ ] Draw on map to search
- [ ] Search by commute time
- [ ] "Similar properties" recommendations
- [ ] Recently sold comparables
- [ ] Natural language search (AI)

---

### Tier 2: Differentiation (Stand Out)

#### 2.1 Colonia Intelligence Reports
- [ ] Safety score (INEGI crime data integration)
- [ ] Walkability score
- [ ] Public transport access score
- [ ] Schools nearby with ratings
- [ ] Hospitals/clinics proximity
- [ ] Supermarkets & amenities map
- [ ] Average price per m² by colonia
- [ ] Price trend charts (historical)
- [ ] Demographic data
- [ ] Noise level estimation

#### 2.2 Smart Price Analysis
- [ ] "Good deal" indicator badge
- [ ] Price vs market average comparison
- [ ] Price history chart for listing
- [ ] Appreciation forecast
- [ ] Price drop alerts (email)
- [ ] Overpriced/underpriced warning

#### 2.3 Additional Calculators
- [ ] FOVISSSTE Calculator (government workers)
- [ ] Gastos de Escrituracion Calculator
- [ ] Rent vs Buy Calculator
- [ ] Predial (property tax) estimator
- [ ] HOA/maintenance fee impact calculator
- [ ] Renovation ROI calculator

#### 2.4 Property Enhancements
- [ ] Days on market indicator
- [ ] Price change history
- [ ] Estimated rental income
- [ ] Monthly mortgage estimate on cards
- [ ] QR code for each listing
- [ ] Print-friendly property page
- [ ] Share to WhatsApp (listing link)
- [ ] PDF property brochure generator

---

### Tier 3: Innovation (Market Leadership)

#### 3.1 Expat Portal
- [ ] Full English interface toggle
- [ ] USD pricing toggle
- [ ] Fideicomiso explanation section
- [ ] Restricted zone guidance
- [ ] Expat-friendly agent directory
- [ ] Relocation guides by city
- [ ] Currency converter widget

#### 3.2 Pre-Construction / Developer Section
- [ ] New development listings
- [ ] Payment plan calculator
- [ ] Construction progress tracking
- [ ] Developer profiles & verification
- [ ] Project timeline visualization
- [ ] Amenities comparison tool

#### 3.3 AI Features
- [ ] "Find my dream home" conversational search
- [ ] Personalized property recommendations
- [ ] Smart alerts based on behavior
- [ ] AI property valuation estimate
- [ ] Chatbot for common questions
- [ ] Auto-categorization of listings

#### 3.4 Agent Toolkit (B2B)
- [ ] Agent CRM dashboard
- [ ] Comparable Market Analysis (CMA) tool
- [ ] Lead management system
- [ ] Listing analytics (views, saves, inquiries)
- [ ] Premium placement options
- [ ] Auto-response setup
- [ ] Performance reports
- [ ] Multi-property management

#### 3.5 Rental Market Intelligence
- [ ] Airbnb yield calculator by zone
- [ ] Short-term vs long-term comparison
- [ ] Occupancy rate estimates
- [ ] Seasonal trend analysis
- [ ] Rental demand heatmap

#### 3.6 Document Management
- [ ] Secure document vault
- [ ] Escritura templates
- [ ] Contract templates
- [ ] Legal checklist for buying
- [ ] Document verification status
- [ ] Notary connection service

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Complete calculator suite and quick wins

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| FOVISSSTE Calculator | High | Medium | Pending |
| Gastos de Escrituracion Calculator | High | Medium | Pending |
| Rent vs Buy Calculator | High | Medium | Pending |
| Days on market indicator | High | Low | Pending |
| Estimated monthly payment on cards | High | Low | Pending |
| Price drop history on listings | Medium | Low | Pending |
| Share listing to WhatsApp | Medium | Low | Pending |
| QR code for listings | Low | Low | Pending |

### Phase 2: Communication (Weeks 3-4)
**Goal:** Enable buyer-seller communication

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Basic in-app messaging | High | High | Pending |
| Email notifications for messages | High | Medium | Pending |
| Message templates | Medium | Low | Pending |
| Inquiry management dashboard | High | Medium | Pending |
| Video tour upload support | Medium | Medium | Pending |
| YouTube embed for listings | Medium | Low | Pending |

### Phase 3: Trust & Intelligence (Weeks 5-8)
**Goal:** Build trust and provide market intelligence

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| Verified seller badges | High | High | Pending |
| Colonia safety scores (CDMX) | High | High | Pending |
| Price comparison analysis | High | Medium | Pending |
| Similar properties algorithm | Medium | High | Pending |
| User reviews for agents | Medium | Medium | Pending |
| Report listing feature | High | Low | Pending |

### Phase 4: Expansion (Weeks 9-12)
**Goal:** New markets and revenue streams

| Feature | Priority | Effort | Status |
|---------|----------|--------|--------|
| English language toggle | High | Medium | Pending |
| Agent CRM dashboard | High | High | Pending |
| Listing analytics | High | Medium | Pending |
| Premium listing options | High | Medium | Pending |
| Pre-construction section | Medium | High | Pending |
| AI property recommendations | Medium | High | Pending |

---

## Revenue Opportunities

### Immediate Revenue Streams

| Stream | Model | Potential | Phase |
|--------|-------|-----------|-------|
| Featured Listings | Per listing fee | High | 2 |
| Bump/Refresh Listings | Per action fee | Medium | 2 |
| Agent Subscriptions | Monthly/annual | High | 4 |
| Lead Generation | Per lead fee | High | 3 |
| Premium Analytics | Subscription | Medium | 4 |

### Future Revenue Streams

| Stream | Model | Potential | Phase |
|--------|-------|-----------|-------|
| Mortgage Referrals | Commission | High | Future |
| Notary Referrals | Commission | Medium | Future |
| Insurance Referrals | Commission | Medium | Future |
| Moving Services | Commission | Low | Future |
| Advertising | CPM/CPC | Medium | Future |
| API Access | Usage-based | Low | Future |

---

## Progress Tracker

### Phase 1 Progress
```
Overall: 0% Complete
[                    ] 0/8 features
```

#### Detailed Status

| # | Feature | Status | Assigned | Notes |
|---|---------|--------|----------|-------|
| 1.1 | FOVISSSTE Calculator | Not Started | - | Similar to INFONAVIT |
| 1.2 | Gastos de Escrituracion | Not Started | - | Critical for buyers |
| 1.3 | Rent vs Buy Calculator | Not Started | - | High user value |
| 1.4 | Days on market | Not Started | - | Quick win |
| 1.5 | Monthly payment on cards | Not Started | - | Quick win |
| 1.6 | Price drop history | Not Started | - | Requires schema update |
| 1.7 | WhatsApp share listing | Not Started | - | Quick win |
| 1.8 | QR codes | Not Started | - | Low priority |

---

## Technical Debt & Infrastructure

### Current Issues
- [ ] Build has SSR warnings (useSearchParams needs Suspense)
- [ ] Need to add proper error boundaries
- [ ] Image optimization could be improved
- [ ] SEO meta tags need completion

### Infrastructure Needs
- [ ] Set up staging environment
- [ ] Configure CI/CD pipeline
- [ ] Add monitoring (Sentry or similar)
- [ ] Set up analytics (Mixpanel/Amplitude)
- [ ] Performance monitoring
- [ ] Database backups verification

### Security Checklist
- [ ] Rate limiting on API routes
- [ ] Input sanitization audit
- [ ] SQL injection prevention (Prisma helps)
- [ ] XSS prevention audit
- [ ] CSRF protection
- [ ] Secure headers configuration

---

## KPIs to Track

### User Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User registration rate
- User retention (7-day, 30-day)

### Engagement Metrics
- Properties viewed per session
- Search to inquiry conversion rate
- Calculator usage rate
- Time on site
- Bounce rate

### Business Metrics
- Number of listings
- Inquiries per listing
- Featured listing purchases
- Agent subscriptions
- Revenue per user

### Quality Metrics
- Page load time
- Error rate
- Uptime percentage
- Mobile vs desktop usage

---

## Meeting Notes & Decisions

### December 2024
- Initial roadmap created
- Prioritized calculator suite completion
- Identified trust/verification as key differentiator
- Decided to focus on CDMX for colonia data initially

---

## Resources & References

### Competitor Research
- [Inmuebles24](https://www.inmuebles24.com/)
- [Vivanuncios](https://www.vivanuncios.com.mx/)
- [Lamudi Mexico](https://www.lamudi.com.mx/)
- [Mercado Libre Inmuebles](https://www.mercadolibre.com.mx/c/inmuebles)

### Data Sources for Colonia Intelligence
- INEGI (crime, demographics)
- Google Places API (amenities)
- OpenStreetMap (walkability)
- Government open data portals

### Mexican Real Estate Resources
- INFONAVIT official rates
- FOVISSSTE official documentation
- Notary fee guidelines by state
- ISAI rates by state

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| Dec 2024 | Initial roadmap created | - |
| Dec 2024 | Added Phase 1 features (calculators, quick wins) | - |
| Dec 2024 | Implemented INFONAVIT, Investment calculators | - |
| Dec 2024 | Added WhatsApp integration | - |
| Dec 2024 | Added Price per m² display | - |
| Dec 2024 | Created SmartToolsSection homepage | - |
| Dec 2024 | Added calculator navigation dropdown | - |

---

*This document should be updated as features are implemented and priorities change.*
