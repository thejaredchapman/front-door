# Build log: Front Door (formerly LoanLens), Habitat for Humanity OC hackathon, Lane 3 · Fund it

How the "Path to Home" funding guide was built, and what it costs. Newest entries at the bottom.

## 1. What it costs to run (per call)

LoanLens is a static site with no backend. Every call a visitor triggers:

| Call | Runs where | Cost per call | Notes |
| --- | --- | --- | --- |
| "Explain it to me" button (109 on the guide page) | Browser | $0.00 | Pre-written simple text, no AI call, works offline |
| "Find my plan" questionnaire (12 questions, plan scoring, pros/cons, money lessons) | Browser | $0.00 | Rules in `src/data/plans.js`; answers stay in localStorage |
| "Print / save my plan" | Browser print dialog | $0.00 | One-page print layout |
| Personal report (`#/report`) | Browser | $0.00 | Built from quiz answers; print or save as PDF |
| Calendar download (.ics) | Browser (file generated locally) | $0.00 | Works with Google, Apple, Outlook |
| Provider emails | User's own email app (`mailto:`) / clipboard | $0.00 | Drafts only; nothing is sent by LoanLens |
| Loan matrix, quote comparer, fund simulator, donor tax calculator | Browser | $0.00 | Pure JavaScript |
| Interest saver (extra payments, biweekly, shorter terms) | Browser | $0.00 | Pure JavaScript |
| Readiness packet ("form generator") | Browser + print | $0.00 | Built from quiz answers; nothing uploaded |
| Language switch (es, zh, fr, ar) | Browser (cached JSON per language) | $0.00 | Dictionaries ship with the site; loaded only when chosen |
| Google Fonts for Chinese / Arabic | fonts.googleapis.com | $0.00 | Loaded only when that language is chosen |
| News + program status (`/updates/news.json`, `/updates/status.json`) | Same site (static files) | $0.00 | One fetch per visit |
| **Daily check: rate** (Freddie Mac CSV) | GitHub Actions → freddiemac.com | $0.00 | No AI needed |
| **Daily check: each watched page** | GitHub Actions → official sites | $0.00 per unchanged page | Pages are fingerprinted; the model is called **only when a page changed** |
| **Daily check: model call** (default `claude-haiku-5-5`) | Anthropic API | logged per call in `docs/daily-check-log.jsonl` | ~1 call per changed page; set `PRICE_INPUT_PER_MTOK` / `PRICE_OUTPUT_PER_MTOK` to log dollars |
| "Explain everything simply" switch | Browser | $0.00 | Same pre-written text, saved in localStorage |
| Income-group check, program matching | Browser | $0.00 | 2026 HCD limits and program list ship in the bundle |
| Fund-the-gap math (§50052.5) | Browser | $0.00 | Pure JavaScript |
| Live weather (calculator city panel) | api.open-meteo.com | $0.00 | Free, no key |
| Google Fonts | fonts.googleapis.com | $0.00 | Free |
| Hosting | Static host (Vercel/Netlify/GitHub Pages free tier) | $0.00 | `dist/` is ~376 KB JS / 41 KB CSS before gzip |

**Running cost per visitor: $0.** If AI-generated explanations, live program checks, or a document search are added later, each would become a paid call and must be added to this table with its model and per-call estimate.

## 2. What it cost to build (AI assistance)

Built with Claude Code (model: Claude Opus 5.5) on 2026-11-07.

| Step | Who | Usage recorded |
| --- | --- | --- |
| Read app code; extract text from the 6 hackathon PDFs (`pdftotext`) | Main session | included in session total |
| Web research: current 2026 programs (CalHFA, FHA/VA/HomeReady/Home Possible, GNND, GSFA, OC & city DPA, credit unions, Prop 1/37) | Research subagent | **165,005 tokens, 82 tool calls, ~7 min** |
| Design + implementation of the guide, data files, gap calculator | Main session | included in session total |
| Verification: lint, build, math checks, server-side render of both views | Main session | included in session total |

**Actual cost per service** (from `npm run cost-report`, which writes `src/data/buildCosts.json`; also shown on *How this was built* in the app):

| Service | Actual usage | Cost |
| --- | --- | --- |
| Claude Code (Claude Opus 5.5) | 549 model calls, 931,832 output tokens, 192,628,703 cache-read tokens | **$74.78** (API list price) |
| Anthropic API (Claude Haiku 5.5) | 1 key check (23 in / 9 out tokens); 0 translation calls; 0 daily-check calls | $0.000007 |
| ElevenLabs | 0 runs (no valid ElevenLabs key yet) | $0 |
| RentCast | not connected | $0 |
| Google Maps Platform | not connected | $0 |
| Vercel | 3 production deploys, `/api/rates` function | $0 extra (existing Pro team plan) |
| GitHub | public repo, 0 Actions runs | $0 |
| Public data (Freddie Mac, HCD, FHFA, CalHFA, lender pages, Open-Meteo, Google Fonts) | | $0 |

Claude Code list prices for Opus 5.5 (https://platform.claude.com/docs/en/about-claude/pricing, checked 2026-11-07): $4 per million input tokens, $5 per million 5-minute cache writes, $0.20 per million cache reads, $20 per million output. This is the pay-as-you-go price. On a Claude subscription, the bill is the plan fee instead.

Claude Code by part of the build:

| Part | Model calls | Output tokens | Cache-read tokens | Cost |
| --- | --- | --- | --- | --- |
| Main build session (design, code, tests, data checks) | 374 | 758,509 | 178,836,082 | $64.21 |
| Research down payment subsidies | 45 | 45,598 | 4,668,099 | $2.78 |
| Research new California housing laws | 33 | 46,451 | 3,218,998 | $2.43 |
| Research low-income homebuyer programs | 26 | 26,558 | 2,263,608 | $1.74 |
| Research cheapest mortgage lenders | 26 | 32,105 | 1,964,726 | $1.69 |
| Verify OC program numbers | 30 | 9,964 | 1,380,030 | $0.78 |
| Read ElevenLabs voice design docs | 6 | 5,861 | 208,621 | $0.53 |
| Read RentCast listings API docs | 4 | 4,041 | 74,436 | $0.36 |
| Fetch Habitat brand colors | 2 | 1,118 | 4,438 | $0.13 |
| Fetch Anthropic API pricing | 3 | 1,627 | 9,665 | $0.12 |

## 3. How it was built (steps)

1. **Inputs read.** Habitat OC 2025 Impact Report, FY2025 audited financials, HCD 2026 income limits (revised June 23, 2026), County of Orange Housing Element (Feb 2025), Prop 1 (2026) text, CEC 2025 Single-Family Compliance Manual, plus the Lane 3 data-sources brief and the SYNTHETIC one-home deal.
2. **Facts extracted with citations** → `src/data/ocFacts.js`, `src/data/incomeLimits.js`.
3. **Research agent** checked live program pages. Each program carries a status: verified / unverified / conflicting / closed / future → `src/data/programs.js`.
4. **Plain + ELI5 text written for every passage** (glossary, story, programs, steps). The `Explain` component shows plain English with an "Explain it to me" button; a page-wide switch flips everything to simple words.
5. **Features built** (`src/components/funding/`):
   - *Where do I fit?* household size + income → 2026 OC income group, % of AMI, matched programs.
   - *By job* tabs: firefighters/EMS, police, nurses/healthcare, teachers/school staff, other public workers, everyone else (honest about what does **not** exist in CA).
   - *Story*: "Ana and Luis find their way home," 7 chapters with a live payment stack.
   - *Checklist*, *Habitat OC* (how the silent second protects owners), *All programs* directory with filters.
   - *Fund the gap* (Lane 3): family price derived from HSC §50052.5 + 2026 AMI + 7.18% rate; cost-to-create vs. family + subsidies + earned income + fundraising; rate (+0.22 pt) and delay sensitivity. Defaults are the SYNTHETIC deal, labeled as such.
   - *What's new*: Prop 1 ($10B + $1.25B vets, ~$1.1B homebuyer-related), Prop 37, 2025 Energy Code.
   - *Glossary*, *Sources*, *How this was built*.
6. **Calculator updates**: default home rate 7.18% (Freddie Mac PMMS, Nov 5, 2026); callout linking to the guide; persisted-state key bumped to v3 so stale 7.25% defaults reset.
7. **Verification**: `npm run lint` clean, `npm run build` passes, math spot-checks (§50052.5 budget reconciles to the cent), both views server-rendered without errors.

## 4. Update: "Find my plan" one-page questionnaire

- New view `#/plan` (top nav: **Find my plan**). The calculator banner and the guide's main button now point here.
- 12 questions in 3 parts: family & money (household, income, monthly debts, savings); **credit history** (score band, late payments and collections, bankruptcy and foreclosure timing); you, your job & **groups you belong to** (first-time buyer, first-generation, occupation, credit unions, military, tribe, labor union, UCI, voucher, Habitat orientation, homebuyer class, preferred city).
- 12 plans scored "Good fit / Maybe / Not a fit right now", each with "why", 👍 good things, and 👎 watch-outs: build-credit-first, Habitat OC, FHA + CalHFA MyHome, HomeReady/Home Possible, city 0% loan + BMR home, VA/CalVet, SchoolsFirst + $7,500 grant, Firefighters First CU, GSFA Platinum Select, Section 184, HCV homeownership, Dream For All (next round).
- Credit rules use standard agency waiting periods: FHA 2 yrs after bankruptcy / 3 after foreclosure; conventional 4 / 7; VA 2 / 2. Lenders can be stricter.
- "Other helpers to call" (NeighborWorks OC, MCC, FHLB WISH, your credit union, union, employer HR, UCI) and **money lessons** tailored to the answers (credit score, debt-to-income with their number, the 30% rule, emergency cushion, scams).
- Verified with 4 test personas (CNA with late payments, firefighter credit-union member, school aide with unknown credit, veteran with a recent bankruptcy) and a server-side render.

## 5. Update: zero-down, job-based, and group-based starts

- Results now have a **Ways to get started** filter: 💵 $0 or almost $0 down · 🧑‍🚒 Based on my job · 🤝 Through a group I belong to, each showing how many plans are open to the user.
- Every plan shows **Cash you need up front** and a concrete **👣 First step**.
- New plans: **$0-down stack** (FHA/conventional + CalHFA MyHome + ZIP), **Orange County's CU Zero Down** (2026 terms unverified), **HUD Good Neighbor Next Door** ($100 down with FHA, 50% off, no OC homes found), **UC Irvine campus homes**.
- Plain + ELI5 notes per filter: "zero down ≠ zero cash" (deposit, inspection, closing costs), ask HR about job benefits, joining a credit union is an easy first step.
- Running cost unchanged: $0 per visitor.

## 6. Update: fund, timeline, rates, California counties, matrix, personal report

- **Community fund (`#/fund`)**: concept for a 501(c)(3)-hosted community down payment fund (residents, companies, employer match); fund simulator (families helped per year); donor after-tax cost calculator; tax benefits for buyers (MCC, refund splitting with Form 8888, IRA $10K first-home withdrawal, 401(k) loans, CLT property tax treatment), donors and employers (charitable deductions incl. 2026 non-itemizer deduction, corporate gifts, employer-assisted housing, ReStore donations), and labeled **policy ideas** (CA first-home savings account, 50% state credit modeled on the College Access Tax Credit, tax-free employer help, pre-tax payroll savings, matched refunds, EAH tax credit). Clarifies that "pre-tax" giving to someone else's down payment isn't possible under current law.
- **My timeline**: standard vs fast-track schedule from the answers, "how to go faster" per step, .ics calendar export, and provider email drafts (counselor, lender, Habitat, city/county, credit union, employer HR).
- **Why so pricey? (`#rates` in the guide)**: why rates are high, supply and demand, consequences, plain-English takeaway, how to find a lender with a lower rate (7 tips + CFPB/NMLS links), and a 3-quote comparer (points vs fees over N years).
- **California counties**: all 58 counties' 2026 HCD income limits extracted from the PDF (Alameda/Alpine acutely-low rows hand-corrected; every county's 4-person median checked against its AMI). County picker on the quiz, guide, and gap tool; Orange County featured. Outside OC, local programs switch to "find your local version"; USDA rural loans added.
- **Loan matrix**: 9 loan types × 9 features; each row is checked against the quiz; live cash-up-front and monthly estimates at a chosen price; tap any cell for a detailed plain and ELI5 explanation; sort and filter.
- **Personal report (`#/report`)**: snapshot, 100-point readiness score (credit 25, debt 20, savings 20, programs 20, prep 15), affordability and what-ifs, strengths and gaps, 12-month phased plan with savings and debt targets, best plans with pros and cons, loans that fit, contacts, money lessons, words to know. Printable.
- Verified with personas in Orange, Fresno, and Los Angeles counties; all five views server-rendered without errors.

## 7. Update: private lending, quiz flow, teachers

- **Private lending**: guide section (CDFIs/community banks, bank-statement non-QM, ITIN mortgages, family gifts and loans, seller financing, rent-to-own, hard money) with risk levels, typical-terms ranges (not quotes), red flags, and lender checks (NMLS, CA DFPI, CA DRE, CFPB). The quiz adds Q13 (pay type, SSN or ITIN) and Q14 (family help, seller financing). New plans and a "🏦 Private lending" filter. The matrix adds non-QM, ITIN, seller-finance, and hard-money rows (example rate premiums). Agency loans and Habitat OC are marked unavailable for ITIN filers.
- **Quiz flow**: results stay hidden until "Show my plan" is pressed; progress counter and skipped-question note; "None of these" buttons for checkbox questions. The **personal report is embedded at the bottom** of the results, with "Print just my report".
- **Teachers**: new "Teacher & school-staff boost" plan (Teacher Loan Forgiveness, PSLF, income-driven repayment lowering DTI, 10-month contract salary, CA Teacher Housing Act district housing, 403(b) loans), an expanded guide tab, a district-HR email draft, a teacher money lesson, and fund drives by PTAs and hospital foundations.

## 8. Update: UI refresh, pages, languages (frontend-design)

- **Design**: "civic ledger": same paper/ink/gold identity, calmer; 17px body text, one idea per page, big tap targets, consistent page headers, numbered ledger lists, a single strong CTA per page.
- **Pages** (hash router in `src/router.js`, old links redirect): Home · Start here · Find my plan (4-step quiz `#/plan/1–4`) · Results (`#/results/plans|compare|timeline|report`, hidden until the quiz is done) · Learn index + 16 topic pages (`#/learn/<topic>`, previous/next) · Calculator (with interest saver) · Give (overview, taxes, donate).
- **Navigation**: sticky masthead; **Back** and **Home** buttons plus breadcrumbs on every inner page; **hamburger drawer** on mobile (Escape to close, focus returns, scroll lock); skip link.
- **New content**: Start-here suggested plans (10 personas), job title + employer with employer-specific tips, disability path (plan + learn page), interest saver (8 ways to pay less interest), readiness packet (personalized document checklist, programs, questions), donate page (test mode, checkout not yet connected).
- **Languages**: English, Español, 中文, Français, العربية (right-to-left, script fonts loaded on demand). 76 menu/button strings hand-translated (`src/i18n/locales/ui.*.json`). Everything else comes from the AI script.

## 9. AI translation script (cost per call is logged)

- `npm run translate:dry` → currently **1,801 strings (~19,600 words)** per language, about 1,725 still to translate per language.
- `ANTHROPIC_API_KEY=… npm run translate` translates only missing strings in batches of 40, caches them in `src/i18n/locales/<lang>.json`, and appends **one line per API call** to `docs/translation-log.jsonl` (model, strings, input/output tokens, USD cost when `PRICE_INPUT_PER_MTOK` / `PRICE_OUTPUT_PER_MTOK` are set).
- Default model `claude-haiku-5-5` (cheapest); use `--model claude-sonnet-5-5` for higher-quality Arabic or Chinese if the budget allows. Re-runs only pay for new or changed text.
- Not covered: sentences built at runtime with numbers inside (for example some plan "why" reasons) stay in English for now.
- Translations have not been run yet; that needs your API key.

## 10. Update: menu fix, mortgages only, research merged, lender finder, News, daily check

- **Hamburger menu fixed** (mobile only). Causes: the sticky header's `backdrop-filter` trapped the fixed-position drawer inside the header, and unlayered custom CSS overrode Tailwind's `lg:hidden`. Fixes: drawer rendered via a React portal into `<body>`; all custom CSS moved into `@layer base` / `@layer components`. **Verified in headless Chrome**: 390px (drawer 844/844px tall, overlay, focus to close button, Escape closes and returns focus, scroll lock), 1024px and 1280px (no hamburger, links fit), Arabic RTL (drawer slides from the left).
- **Mortgages only**: auto, personal, and student loan products removed; saved settings migrate to mortgage defaults (3.5% down, 15/20/30-year terms).
- **Two research subagents** (run in parallel, results in `docs/research/`):
  - Down payment subsidies, **189,050 tokens / 103 tool calls**: OC MAP limited to unincorporated OC + 14 cities; GSFA is mostly a second loan; CalHFA OC limits confirmed ($274K / $219K); WISH 4:1 up to $32,837; Santa Ana $80K moderate tier + live/work rule; Anaheim $50K at 1%; Fullerton and Buena Park inactive; new big-bank grants, FHLB middle-income grant (closed), Anaheim hotel-worker fund (coming).
  - Cheapest lenders, **132,647 tokens / 59 tool calls**: published rates (dated) for SchoolsFirst, Orange County's CU, Navy Federal, Firefighters First; 2024 HMDA medians for OC (what borrowers actually paid).
  - Not applied: one agent claim that Prop 1's $500M wasn't for homebuyers; the bill text in the hackathon PDF assigns $500M to CalHFA's Home Purchase Assistance Fund.
- **Combined result: lender finder** (`#/learn/lenders` and the **Where to borrow** results tab): lenders sorted by whether you can join, then by how much of *your* down payment help they unlock (members-only grants > CalHFA > city loans > address-dependent bank grants), then by real 2024 costs.
- **News** (`#/news`, home page strip, nav): seeded with verified items (rates, Prop 1/37 projections, HCD limits, Dream For All, SchoolsFirst grant, WISH, OC MAP area, energy code). Auto-found items are labeled "Found by daily check".
- **Daily Haiku refresh**: `scripts/daily-check.mjs` + `scripts/watchlist.json` (17 official pages incl. 3 lender rate pages) + `.github/workflows/daily-check.yml` (daily 15:00 UTC). Updates `src/data/rate.json` from the Freddie Mac CSV, fingerprints pages (respects robots.txt, identifies itself), asks Haiku only about changed pages, writes `public/updates/status.json` and `news.json`, logs each call's cost, and **opens a pull request for a person to approve**. The rate is now read from `rate.json` everywhere instead of being hard-coded.

## 11. Update: more loan types, five-buyers narrative

- **Every kind of mortgage** (`#/learn/loan-types`): chattel/manufactured, FHA 2–4 unit house hack, jumbo (buying); HELOC, home equity loan, reverse mortgage/HECM (already own); DSCR, commercial, SBA 504/7(a) (investors and business, clearly marked "not for buying your family home"). Each has typical 2026 ranges (labeled as not quotes), good things, watch-outs, "if money is tight", and simple-words versions.
- **Loan matrix**: added Jumbo (only above $1,249,125 in OC) and Chattel (example +2.5 pt rate, 20-year term, space rent reminder).
- **Five buyers, one market** (`#/learn/five-buyers`, linked from "Why homes cost so much", Start here, and the learn index): low (home health aide, $58K), middle ($125K, officially "low income" in OC), upper-middle (teacher + nurse, $210K), high ($420K), ultra-high ($1.5M). Affordability is computed live from the current rate: about $165K / $390K / $708K / $1.56M / $7M vs. a $1.3M+ typical home; income needed for the typical home about $325K plus about $260K down. Three of five can't afford it: "It's not just you."

## 12. Update: Front Door rename, warm & friendly redesign, DTI slider, amortization explorer, document verification

- **Renamed** LoanLens → **Front Door** (UI, page title, emails, calendar files, scripts, README). New house-and-door logo and favicon. Saved user data carries over (storage key unchanged).
- **Warm & friendly look** (chosen by the user): Fraunces (soft) + Nunito; cream background, white rounded cards, deep-sage actions (AA contrast with white text), apricot/coral accents, pill buttons and chips, soft shadows. Implemented as a theme layer over the existing components plus utility overrides, so every page changed at once. Home rebuilt around "Hi! Let's find your way home." with one big *Find my plan* tile and Learn / Calculator / News / Give tiles. Screenshots checked at 390px and 1280px.
- **DTI slider 30–35%** (default 30%, labeled Comfortable / Moderate / Stretch): one shared setting (`housingRatio`) used by the calculator (both modes, replacing the old free-form 28% DTI field), the results summary, the personal report, money lessons, and Five Buyers. Lenders' ~43% all-debt cap still applies as a second check. Stored setting migrated (v2).
- **Amortization explorer** (calculator): pick any payment (slider, ← →, quick jumps: first, year 5, year 10, tipping point, PMI ends, last) to see principal / interest / tax / insurance / PMI for that payment, running totals (balance, equity, principal and interest paid), a tappable yearly principal-vs-interest chart, and a year → month schedule. PMI stops when the balance reaches 78% of the price. Verified in Chrome: 7.18% / 30 yr tipping point at payment 245; PMI ends at payment 151 with 3.5% down.
- **Document verification ("jev")**: `npm run verify:docs` extracts the hackathon PDFs with `pdftotext` and checks every income-limit number for all 58 counties (2,784 numbers, in order), Prop 1 allocations, Habitat Impact Report and audit facts, Housing Element table, HCD memo date, and Energy Code rules. Writes `docs/verification-report.md`; exits 1 on failure. **Result: 117/119.** The 2 flagged rows (Alameda, Alpine "acutely low") wrap across two lines in the PDF; column positions confirm the app's values. A fix to make the checker understand wrapped rows was paused at the user's request.

## 13. Update: New California laws

- Research subagent (**174,131 tokens / 72 tool calls**) → `docs/research/california-laws.{md,json}`: 49 laws and measures (43 verified, 6 not): 37 help, 9 mixed, 3 restrict. Sources: gov.ca.gov, HCD, CalHFA, CDI, DRE, BOE, LAO, Secretary of State (the Legislature's bill site blocked automated access).
- **Learn → New California laws** (`#/learn/laws`): filters for Helps / Mixed / Restricts, topic, and "Starts Jan 1, 2027"; each card has plain + simple versions, what it means for buyers, status, effective date, who it affects, research notes, and the official source. Linked from News and Start here.
- News: starter-home and townhome laws (SB 1116, AB 1751, AB 956), wildfire insurance protections (AB 2038, SB 876, new rate rules), Prop 45 appears to have failed (unverified, uncertified).
- Correction carried into the app: SB 79 (transit upzoning) does **not** apply in Orange County (not an "urban transit county" on HCD's list); the app never claimed otherwise, and the laws page now says so.
- Translation scan now includes the laws: 2,430 strings (~28,000 words) per language.

## 14. Update: Vietnamese + marketing plan

- **Tiếng Việt added** as the sixth language (second in the menu, after Español) for Orange County's Little Saigon community: 91 hand-translated interface strings (`src/i18n/locales/ui.vi.json`, placeholders checked), and the AI translation script now includes Vietnamese (2,355 strings to translate on the first run). Verified in Chrome: Vietnamese diacritics render in both Fraunces (headings) and Nunito (body); the "some text is still in English" notice appears in Vietnamese until `npm run translate` is run.
- **Marketing plan**: `docs/marketing/plan.md` (one-liner, audiences and messages, taglines, partner and community-media channels, launch moments, EN/ES copy, 60-second hackathon pitch, privacy-first metrics, launch checklist) plus a logo prompt for Gemini / ImageFX.

## 15. Update: calculator switched to Orange County cities

- Replaced the 50 US cities (and their unverifiable school/walk-score/demographic figures) with **all 34 Orange County cities + unincorporated OC** (`src/data/ocCities.js`). Default city: Santa Ana; saved settings migrate (store v3).
- City panel now shows **local help** (city loans for Santa Ana, Garden Grove, Anaheim; below-market homes for Irvine, Huntington Beach, Tustin, Brea; whether the County MAP covers the city; whether Habitat OC has built there), **live weather**, and the **estimates used in the payment** (~1.1% property tax, ~$1,800/yr insurance, with a Mello-Roos warning). Realtor.com links use each OC city.
- Quiz city question is now a dropdown of every OC city, so the plan says exactly whether the county's $80,000 loan applies, and the provider email goes to the right office (Clearinghouse for MAP cities, otherwise the city's housing office). Verified for Placentia (MAP), Westminster (no MAP, no city loan), and Garden Grove (city loan, no MAP).

## 16. Update: Habitat colors ("extremely cute"), Doorie mascot + chatbot, check-in wording, presentation, external links, GitHub

- **Habitat palette** read from habitat.org's own stylesheet (CSS variables: primary bright blue #0099cc, high-contrast blue #007399, dark blue #002f6c, bright green #c4d600, green #3aa047, orange #e55d25, yellow #ffd100); the official GB brand-guide page no longer lists colors. Footer notes: "uses Habitat's color palette with respect; not an official Habitat site."
- **Cute theme:** Baloo 2 headings (supports Vietnamese) + Nunito, sky background with confetti dots, chunky "squishy" 3D buttons, pastel tiles, reduced-motion respected.
- **Doorie** (`src/components/Mascot.jsx`): house mascot with wave / cheer / think moods (home hero, results, empty states, slides, handout, logo colors).
- **Doorie chatbot** (`src/data/doorie.js`, `src/components/DoorieChat.jsx`): floating button on every page; answers only Orange County home-loan questions from Front Door's content (24 curated answers + programs, glossary, loan types, lenders, 49 laws, 35 OC places); topic gate → off-topic → "try Google"; area gate → other states/counties → "I only cover Orange County"; Spanish/Vietnamese/Chinese/French/Arabic loan words understood; auto-links any organization mentioned. $0 per question, no AI, nothing leaves the device. Tested with 30+ questions (on-topic, off-topic, out-of-area, city-specific, other languages).
- **"Quiz" → friendly "check-in"** everywhere ("Take the check-in: see where you are", "See where I'm at", "Let's do your check-in first"), translated in all 5 languages.
- **Presentation:** `public/presentation/handout.html` (one-page, prints to PDF) and `public/presentation/slides.html` (8 slides, arrow keys, prints to PDF); every technology badge links out.
- **External links:** `src/data/externalServices.js` (~70 organizations, data sources, services, tools) shown on *How this was built* and *Sources*, used by Doorie, and in the README.
- **Research agent for brand colors:** 22,153 tokens / 3 tool calls (official page had no values; colors taken from habitat.org CSS instead).
- **GitHub:** new public repository `thejaredchapman/front-door`.

## 17. Update: affordability framing, ludicrous/fraud screens, Vercel, video

- **Reframed around affordability:** headline "Hi! Let's find a home you can afford.", tagline "Your path to an affordable home", results show "Affordable monthly payment" and "Price you can afford", Start here and Doorie lead with affordability, page title/description, handout, slides, video, and README updated. New **Affordability toolkit** (`#/learn/afford`): levers grouped by what they lower (price, cash needed, monthly payment, total cost) plus keeping it affordable, with the 30–35% slider and live examples (0.5% lower rate ≈ $134/mo on $400K; FHA mortgage insurance ≈ $183/mo).
- **Doorie screens:** ludicrous questions (pets or babies as borrowers, the moon, Monopoly money, a $5 house, keyboard mashing) get "That question is ludicrous… I won't answer it" with no answer; fraud (fake pay stubs, lying on an application, identity theft) gets a firm refusal and a link to a HUD counselor. Added answers for co-signers and family gifts, affordability, and private lending options (rent-to-own, seller financing, hard money). Doorie button is icon-only on phones so it never covers content.
- **Vercel:** new project `front-door` (production: https://front-door-chi.vercel.app); `vercel.json` pins Vite / `dist`. The older `amortization` project is untouched.
- **Video:** `npm run video:shots | video:voice | video:build` → 30 s 1080p MP4; ElevenLabs voiceover (75-word script ≈ 30 s, ≈ 430 credits) logged per run.

## 18. Known gaps to verify before launch

OC MAP open/closed · Anaheim amount/status · Santa Ana 2026 terms · OC MCC credit rate · CalHFA OC income limits ($274K / $219K from a secondary source) · any GNND listings in OC · next Dream For All round · Prop 1/37 certification and rollout · Habitat OC's current-project income band.

## 19. Home goal, program what-ifs, quote comparer, plan calendar, live rates (2026-11-07)

The ideas came from an outside spec ("Open Door OC"). Everything here is written in Front Door's own words and design.

- **Check-in:** new step 2, *Your goal*. Added household size 9+, a "Not sure" answer for first-time buyer, and military follow-up questions (connection, prior VA use, funding-fee exemption).
- **Math (`src/utils/homeGoal.js`, constants in `src/data/goalRules.js`):**
  - Payment cap = min(30–35% of income, 36% minus other debts, your comfort number).
  - Cash = down payment + 3% closing + reserve − assistance.
  - The price is found by 64-step bisection and rounded down to $1,000.
  - Savings timeline status codes: ready, no-goal, over-budget, no-saving, beyond-horizon, program-limit.
  - VA and MyHome what-ifs run one at a time, never stacked.
  - The report's total-debt check changed from 43% to 36% to match.
- **Privacy:** saving answers is now opt-in (`saveOnDevice`). Store v4 uses `partialize` to drop answers, tasks, and quotes unless saving is on. Migration keeps saving on for people who already had answers stored.
- **Plan calendar (`src/data/planTasks.js`, `PlanCalendar.jsx`):** 12 base tasks plus program tasks. Due-date priority: your own date, then a compressed schedule when the target is under 180 days away, then foundation tasks from today. The .ics export is all-day events for unfinished tasks only.
- **Loan Estimate comparer (`QuoteComparer.jsx`):**
  - Up to 12 quotes. Quotes made for a different amount or term are set aside.
  - Upfront = points + fees − credits.
  - 5-year cost = interest over 60 payments + upfront + mortgage insurance.
  - APR is shown exactly as the lender gives it.
- **Live rates (`api/rates.js`, `api/_lib/rates.js`):** a Vercel function plus a Vite dev middleware.
  - Parsers were tested on saved pages: OCCU 2 rows, SchoolsFirst 24, Sammamish 9.
  - Stale (more than 7 days old) and broken pages return status `stale` or `unavailable`, never old numbers.
  - All three sites' robots.txt files allow these pages.
- **Data correction:** the County MAP is now $120K (low income) / $80K (moderate income), administered by BKF Engineers. A subagent verified it on 2026-11-07 along with the CalHFA $274K limit, 2026 loan limits, VA fees, DFA closed, and Section 184 for CA.
- **Home page:** "Good news first" cards, then a "How Front Door is different" table.
- **README banner:** `docs/banner/` + `npm run banner`.
- **Cost:** $0 per use, since everything runs in the browser. `/api/rates` makes 3 outbound requests at most every 5 minutes (CDN cached). The verification subagent was a one-time research run.

## 20. Official document library (RAG), team credits, "How we solved it", stage colors (2026-11-07)

- **Document library:** `scripts/build-rag.mjs` (`npm run rag:build`) reads the curated folder `~/Downloads/rag`: 60 official PDFs plus `INDEX.csv` with source URLs. It extracts each page with `pdftotext` and packs the text into passages of about 140 words (never more than 220). Output is `public/rag/library.json`: 688 passages, 475 KB, loaded only when needed.
- **Search** (`src/utils/ragSearch.js`): BM25 in the browser.
  - Document titles are weighted twice, and a document can contribute at most 2 passages.
  - Doorie's multilingual keywords feed in, along with plain-language expansions (DPA, PMI, MCC, MAP, citizenship, and so on).
  - Shown in Doorie under each answer and on the new `#/learn/documents` page, with page numbers and official links (`#page=N` for official PDFs).
- **Summarize with AI** (`api/ask.js`): opt-in only. The browser sends just the question (300 characters max) and up to 5 passage numbers; the server looks up the passage text itself.
  - Claude Haiku 5.5 answers from those passages only, with [n] citations, in the question's language. Off-topic questions get OFFTOPIC.
  - Passages are treated as data, not instructions. Tested: an "ignore your rules" question was refused.
  - Limits: 20 per hour per IP, an in-memory cache, and logs record usage only, never the question.
  - Dev testing cost: 3 calls, about $0.0003 each (`docs/rag-ask-log.jsonl`).
- **Team:** Jared Chapman, Leia Lu, Derek Thompson, Premang Jha, Nastasja Terry. Listed in the footer, How this was built, How we solved it, README, handout, and slides.
- **How we solved this problem** (`#/learn/solved`): the problem, six steps of our approach, the result, and the team.
- **Color-coded plan stages:**
  - Foundation: blue (#0099cc)
  - Loan: green (#3aa047)
  - Home and offer: orange (#e55d25)
  - Close: navy (#002f6c)

  The colors appear on the stage cards, task bars, checkboxes, calendar chips, and a legend with per-stage progress.
