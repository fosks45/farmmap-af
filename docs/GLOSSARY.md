# Farmmap — Glossary of Acronyms and Terms

Covers all acronyms and abbreviations used in the Farmmap (003-farmmap) evidence pack, specification, architecture documents, and compliance assessments.

---

## Pipeline and Product

| Acronym / Term | Full Form | Usage in this project |
|---|---|---|
| ADR | Architecture Decision Record | Numbered decision documents (ADR-0001 through ADR-0010) in `architecture-pack/adrs/`. Each covers one architectural choice (stack, map, multi-tenancy, auth, payments, etc.). |
| B2B | Business to Business | Farmmap's potential school/cooperative channel. F17 (Bulk Listing Claim) serves the B2B use case at v1. Full B2B tier deferred to v2. |
| BMC | Business Model Canvas | The structured canvas produced in Phase 4.5. Covers customer segments, value propositions, channels, revenue streams, key resources, key activities, key partners, cost structure. |
| CAC | Customer Acquisition Cost | Cost to acquire one paying Bronze farm shop owner. Estimated £120–250 via personal rep; lower via FRA partnership channel. |
| CTA | Call to Action | A prompt in the UI directing a user to take an action (e.g. "Claim this listing", "Upgrade to Bronze"). |
| EBITDA | Earnings Before Interest, Tax, Depreciation and Amortisation | Operating profitability measure used in the financial model. |
| ELM | Environment Land Management (scheme) | UK agricultural policy replacing direct payments under the Common Agricultural Policy. Incentivises farm diversification including farm shops. PESTEL Political tailwind. |
| F1–F16 | Feature 1–16 (Must-Have) | The 16 Must-Have features defined in `spec.md`. F17–F24 are Should-Have. F1 = interactive map; F5 = reviews; F6 = ordering waitlist; F8 = Bronze tier; F9 = Silver tier; F10 = Gold tier; etc. |
| FBO | Food Business Operator | Any person or business that runs a food business, including farm shops. FBOs must be registered with their local authority. Relevant to compliance at Silver/Gold marketplace tier. |
| GMV | Gross Merchandise Value | Total value of marketplace orders processed through Silver/Gold tiers, before commission is deducted. Used to calculate Farmmap's 3%/5% commission revenue. |
| GTM | Go to Market | The Farmmap launch strategy. Phase 1: SEO + PR ("Britain's honesty boxes mapped"). Phase 2: Traffic-triggered farm shop owner acquisition + FRA. Phase 3: Bronze monetisation. Phase 4: Silver marketplace + portfolio. |
| IA | Information Architecture | The screen and navigation structure defined in `design-pack/information-architecture.md`. 41 named screens across consumer, owner, and admin areas. |
| J1–J9 | Job to be Done 1–9 | The nine JTBDs mapped in `personas-pack/jtbd-map.md` (e.g. J1 = impulse discovery; J5 = capture passing trade; J9 = portfolio replication). |
| JTBD | Jobs to be Done | Christensen-format user motivation statements: "When [situation], I want to [motivation], so I can [outcome]." |
| KPI | Key Performance Indicator | Measurable success metrics. Primary: 100,000 monthly map visitors within 12 months of launch. |
| LTV | Lifetime Value | Expected revenue per farm shop over the subscription lifetime. Bronze LTV ~£1,367; Silver LTV ~£9,166; Gold LTV ~£34,860 (gross profit basis). |
| MoSCoW | Must / Should / Could / Won't | Prioritisation applied to Farmmap features. F1–F16 = Must; F17–F24 = Should; specific items in Won't-Have section. |
| MRR | Monthly Recurring Revenue | Predictable monthly subscription income. Break-even point identified in `business-plan-pack/financial-model.md`. |
| MVP | Minimum Viable Product | The minimum version of the product sufficient to test a hypothesis. Farmmap v1 is the directory MVP (consumer browsing, free claim). |
| NFR | Non-Functional Requirement | Requirements that define how the product performs rather than what it does (performance, accessibility, security, SEO). Documented in `spec.md`. |
| P1–P6 | Persona 1–6 | The six canonical user personas (P1 Sarah Whitfield/Weekend Forager through P6 Brigid O'Sullivan/Irish Cooperative Manager). |
| PESTEL | Political, Economic, Social, Technological, Environmental, Legal | Environmental analysis framework applied in `market-pack/pestel-analysis.md`. Key Farmmap findings: ELM tailwind (Political), FRA 66% no-website finding (Economic), food provenance trend (Social), PostGIS maturity (Technological). |
| PSF | Problem-Solution Fit | Assessment from `discovery-pack/problem-solution-fit.md`. Farmmap verdict: PARTIAL (4 strong, 4 partial, 1 missing). |
| SAM | Serviceable Addressable Market | The addressable fraction of the TAM for Farmmap: ~5,700 farm shops + honesty boxes with digital discovery potential. |
| SME | Small and Medium Enterprise | Farm shops are predominantly SMEs. The Bronze pricing (£20/month) is calibrated to be affordable for farm-scale businesses. |
| SOM | Serviceable Obtainable Market | Realistically capturable market. Farmmap base case: £164k revenue Year 3; £450k Year 5 standalone; £2.2m Year 5 across the 7-vertical portfolio. |
| SWOT | Strengths, Weaknesses, Opportunities, Threats | Strategic synthesis in `market-pack/swot/swot-analysis.md`. Key strength: 953-listing head start + farmmap.co.uk domain. Key threat: yourhonestybox.com expansion to UK. |
| TAM | Total Addressable Market | Farmmap TAM: £1.77bn (UK farm shops + farmers markets + honesty boxes + Ireland). |

---

## Technology

| Acronym / Term | Full Form | Usage in this project |
|---|---|---|
| ADR | Architecture Decision Record | See Pipeline section. |
| AES | Advanced Encryption Standard | AES-256-GCM used for encrypting C3+ data fields (emails, names, addresses, order data) at the application layer before Supabase insert. |
| API | Application Programming Interface | Next.js App Router route handlers serving the OpenAPI 3.1 contract (`architecture-pack/contracts/openapi.yaml`). |
| CDN | Content Delivery Network | Supabase's built-in CDN serves listing photos and product images. Static assets served via Vercel's edge network. |
| CI | Continuous Integration | GitHub Actions pipeline running lint, typecheck, Vitest tests, and Lighthouse CI performance gate on every push. |
| CLS | Cumulative Layout Shift | Core Web Vital measuring visual stability. Hard limit: < 0.1 on all listing detail pages. |
| CSS | Cascading Style Sheets | Styling via Tailwind CSS utility classes. Design tokens mapped to CSS custom properties in `globals.css`. |
| GA4 | Google Analytics 4 | Third-party analytics tool. Not used at Farmmap v1 — replaced by Plausible (cookieless, EU-hosted) + server-side event store. |
| GeoJSON | — | A JSON format for encoding geographic data structures. Used for the MapLibre map pin source endpoint (`GET /api/listings/geojson`). |
| GIST | Generalized Inverted Search Tree | PostgreSQL index type used for PostGIS spatial queries. Required for efficient `ST_DWithin` radius searches on the `listings.location` column. |
| HTML | HyperText Markup Language | Non-map HTML fallback pages are mandatory for SEO. Every listing renders as complete HTML without JavaScript (React Server Components). |
| HMAC | Hash-Based Message Authentication Code | HMAC-SHA256 used for deterministic email lookup index (`users.email_hash`). |
| INP | Interaction to Next Paint | Core Web Vital measuring responsiveness. Hard limit: < 200ms on map pin interactions. |
| JWT | JSON Web Token | Supabase Auth issues JWTs for session management. Row Level Security policies verify the JWT `sub` claim on every database operation. |
| JSON-LD | JSON Linked Data | Structured data format injected as `<script type="application/ld+json">` on all listing and county pages for SEO rich results. Schema types: `LocalBusiness`, `FoodEstablishment`, `AggregateRating`, `Product`, `BreadcrumbList`. |
| LCP | Largest Contentful Paint | Core Web Vital measuring load performance. Hard limits: < 2.0s on listing detail pages; < 2.5s on county pages; < 3.0s for map with 953+ pins. |
| ODbL | Open Database Licence | The licence under which OpenStreetMap data is published. Attribution "© OpenStreetMap contributors" required on all map displays. |
| OSM | OpenStreetMap | The open-source mapping dataset used for Farmmap's map tiles via MapLibre GL JS. Free to use under ODbL. |
| PostGIS | — | Spatial extension for PostgreSQL enabling geographic queries. Used for: radius-based "near me" searches (`ST_DWithin`), GeoJSON generation (`ST_AsGeoJSON`), Eircode + postcode coordinate storage (`GEOMETRY(Point, 4326)`). |
| PR | Pull Request | GitHub pull request. Self-improvement retrospective raises improvement PRs against agent definitions. Foundry upgrade is on PR #1. |
| PWA | Progressive Web Application | Farmmap is delivered as a responsive web app + PWA. Install prompt shown after first session. Offline mode deferred to v2. |
| RLS | Row Level Security | Supabase/PostgreSQL feature enforcing data isolation at database row level. Core mechanism for Farmmap's multi-tenancy (every query automatically scoped to the correct `directory_id`). |
| RSC | React Server Component | Next.js 14 App Router server-rendered components. Used for all listing detail, county, and SEO-critical pages (no client-side JS required for indexable content). |
| SEO | Search Engine Optimisation | Primary consumer acquisition channel. Key strategies: server-rendered listing pages, JSON-LD structured data, `/listings/[type]/[country]/[county]/[slug]` URL structure, sitemap.xml, "farm shop near me" and "honesty box near me" keyword targeting. |
| SSR | Server-Side Rendering | HTML generated on the server before delivery to the browser. Required for Farmmap's SEO pages. Implemented via Next.js React Server Components. |
| URL | Uniform Resource Locator | Farmmap URL structure: stable, semantic, hierarchical — `/listings/[type]/[country]/[county]/[slug]`. Never changes after assignment (301 redirects if renamed). |
| UX | User Experience | The design discipline covering information architecture, user flows, wireframes, and accessibility audit. Phase 6 in the pipeline. |

---

## Compliance and Legal

| Acronym / Term | Full Form | Usage in this project |
|---|---|---|
| B2B | Business to Business | See Pipeline section. |
| CDPA | Copyright, Designs and Patents Act 1988 | Governs copyright in the UK including database rights. Relevant to: the yourhonestybox.com seed data (consent obtained, confirmed), the exam paper copyright analogy, OpenStreetMap ODbL licence. |
| CCR | Consumer Contracts Regulations 2013 | Grants consumers a 14-day right to cancel distance contracts. Applies to Bronze/Silver/Gold subscription sign-ups. Must be disclosed at checkout. |
| CRA | Consumer Rights Act 2015 | Requires digital content to be of satisfactory quality, fit for purpose, and as described. Applies to all Farmmap subscription tiers. |
| DPA | Data Protection Act 2018 | The UK legislation implementing UK GDPR. Farmmap's primary data protection law for UK users. |
| DMCC | Digital Markets, Competition and Consumers Act 2024 | New UK consumer legislation (in force 2026). Includes subscription trap regulations, auto-renewal rules, and easy cancellation requirements. Applies to all Farmmap subscription tiers. |
| DPC | Data Protection Commission | The Irish data protection supervisory authority. Applies to all Farmmap processing of personal data for users resident in the Republic of Ireland (separate to UK ICO). |
| DPIA | Data Protection Impact Assessment | Required when processing is likely to result in high risk to individuals. Farmmap compliance: no DPIA required at v1. |
| DPO | Data Protection Officer | Role responsible for overseeing data protection compliance. Farmmap requires DPO awareness of dual ICO/DPC regulatory position before v1 launch. |
| EAA | European Accessibility Act | Directive 2019/882, enforced from June 2025. Applies to digital products placed on the EU market. References EN 301 549 which maps to WCAG 2.1 AA. |
| EU GDPR | European Union General Data Protection Regulation | Applies to Farmmap's processing of personal data for users in the Republic of Ireland. |
| FCA | Financial Conduct Authority | UK financial services regulator. Farmmap's use of Stripe Connect Standard (shop is merchant of record) is confirmed to keep Farmmap outside FCA authorisation requirements. |
| FSMA | Financial Services and Markets Act 2000 | Primary UK financial services legislation. Section 19 makes unauthorised regulated activities a criminal offence. Farmmap is not in scope (confirmed by `financial-services-assessment.md`). |
| ICO | Information Commissioner's Office | UK data protection supervisory authority. Governs UK GDPR compliance, the Children's Code, and PECR enforcement for Farmmap. |
| IP | Intellectual Property | Farmmap IP includes: farmmap.co.uk domain (owned), yourhonestybox.com data (consented), Farm Retail Association data (sourced). See `ip-copyright-assessment.md`. |
| OSA | Online Safety Act 2023 | UK legislation governing user-generated content. Farmmap's pre-moderation model (reviews and photos approved before display) is the strongest compliance position. Assessment: likely not a regulated service at v1 scale. |
| PCI | Payment Card Industry (Data Security Standard) | Farmmap compliance level: SAQ-A. Stripe Connect Standard means card data never enters Farmmap's systems. See `pci-dss-assessment.md`. |
| PCI-DSS | Payment Card Industry Data Security Standard | Full form of PCI above. |
| PECR | Privacy and Electronic Communications Regulations 2003 | UK cookie and electronic marketing law. Requires Farmmap's cookie consent banner, cookie policy page, and consent-gated analytics. |
| PII | Personally Identifiable Information | Data that can identify a person directly or indirectly. Classified as C3 (minimum) in Farmmap's data model. Encrypted at rest (AES-256-GCM). |
| SAQ | Self-Assessment Questionnaire | PCI-DSS compliance self-assessment. Farmmap qualifies for SAQ-A (fully outsourced card processing). |
| UK GDPR | United Kingdom General Data Protection Regulation | UK's post-Brexit data protection regulation, implemented via DPA 2018. Applies to all Farmmap processing of UK users' personal data. |
| WCAG | Web Content Accessibility Guidelines | International accessibility standard. Farmmap targets WCAG 2.2 AA as the minimum. Mandatory for Equality Act 2010 and EAA compliance. |

---

## Data Classification (§8.5 — used throughout data-model.md)

| Class | Meaning | Farmmap examples |
|-------|---------|-----------------|
| C0 | Public | Listing name, county, location coordinates, opening hours, OSM tiles, listing_type |
| C1 | Internal | Subscription status, session metadata, Silver month count, order count for Gold gate |
| C3 | Customer PII | User email, display_name, delivery address, order buyer details — all AES-256-GCM encrypted |
| C4 | Customer Financial | Stripe subscription ID, Stripe customer ID, Stripe Connect account ID — encrypted |
| C6 | Authentication Secrets | Passwords (Argon2id hashed), JWT tokens, API keys — never logged |

*Classes C2, C5, C7, C8 are not used in Farmmap v1 — no special category data, no children's accounts, no crown jewels assets.*

---

## Organisations and Sources Cited

| Abbreviation | Full Name | Relevance to Farmmap |
|---|---|---|
| AHDB | Agriculture and Horticulture Development Board | UK levy-funded organisation for agriculture. Source for farm sector data. |
| DEFRA | Department for Environment, Food and Rural Affairs | UK government department. Source for rural land, farming, and food policy data. |
| FRA | Farm Retail Association (also: FARMA) | UK trade body for farm shops. Source for 3,000–3,500 UK farm shop count and 66% no-website statistic. Priority partnership target for Farmmap. |
| FSA | Food Standards Agency | UK food safety regulator. Source for consumer food purchasing data (Food and You 2 Wave 7 survey). |
| CLA | Country Land and Business Association | Representative body for rural businesses. Source for ELM-driven farm diversification trend data. |
| ELM | Environment Land Management scheme | See Technology section. |
| ONS | Office for National Statistics | UK statistics body. Source for consumer spending and rural demographic data. |
| WRAP | Waste & Resources Action Programme | UK sustainability charity. Source for food waste and food miles consumer awareness data. |

---

*Last updated: 2026-05-17 | Scope: 003-farmmap only*
*The foundry-wide glossary is at `specs/GLOSSARY.md`*
