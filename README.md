# Front Door

*Formerly LoanLens.* **Making homeownership affordable for working families**: see what you can afford and every way to make a home more affordable, in plain language, with Orange County first. Built for the Habitat for Humanity of Orange County hackathon (Lane 3 · Fund it). Uses Habitat's color palette with respect; not an official Habitat for Humanity site.

**Present it:** [one-page handout](public/presentation/handout.html) · [slides](public/presentation/slides.html) (also served at `/presentation/` on the site)

Meet **Doorie** 🏡, the house mascot and chatbot: tap Doorie on any page to ask about home loans in Orange County. Doorie answers only from Front Door's checked content (no AI, $0 per question, nothing leaves the device) and sends off-topic questions to Google.

**See what a loan really costs, and whether you can afford it, before you apply.**

Front Door is a client-side loan and affordability calculator. Pick a loan type, enter a price or your salary, and it shows the full monthly payment, how that payment splits between principal, interest, taxes and insurance, and a payment-by-payment amortization schedule. For homes, it also shows the city you'd be buying in, the jobs that pay enough to qualify, and a link to matching listings.

There is no backend and no account. Your inputs are saved in your browser's local storage.

## Path to Home: getting funded on a modest income

Start with **Find my plan** (`#/plan`): a one-page, 12-question quiz covering income, debts, savings, credit history, first-time buyer status, job, and groups you belong to. It scores 12 loan plans as good fit, maybe, or not yet, with pros and cons in plain words, other helpers to call, and money lessons. You can print it for a counselor.

Also: **News** (`#/news`) kept current by a **daily Haiku check** (`npm run daily-check`, GitHub Action opens a PR for review), a **lender finder** that pairs the cheapest OC lenders with the down payment help each accepts, **personal report** (`#/report`), **loan matrix**, **timeline with calendar export and provider emails**, **community down payment fund** (`#/fund`), and a **why-rates-are-high / find-a-lower-rate** explainer. Works for all 58 California counties (2026 HCD income limits), with Orange County featured.

Then open **Path to Home guide** in the top nav (or go to `#/funding`). It's a guide for low- and moderate-income buyers in Orange County, CA, built for the Habitat for Humanity OC hackathon (Lane 3 · Fund it).

- **Where do I fit?** Enter household size and income to see your 2026 OC income group (HCD limits) and the programs that match.
- **By job:** firefighters/EMS, police, nurses/healthcare, teachers/school staff, other public workers, and everyone else.
- **A story** ("Ana and Luis find their way home") that walks through the whole process.
- **"Explain it to me"** on every passage, plus a page-wide *explain everything simply* switch.
- **Fund the gap:** derives the family's affordable price from Health & Safety Code §50052.5 and balances it against cost to create, subsidies, earned income, and fundraising.
- **Status on every program:** verified, unverified, closed, or coming later, with links to sources.

How it was built and what it costs: [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md). Every visitor call costs $0.

## Features

- **Mortgages only**: 15/20/30-year fixed home loans with taxes, insurance, and PMI; default rate comes from `src/data/rate.json` (updated by the daily check).

- **Two ways to search**
  - **By property or price:** enter what you want to buy and get the monthly payment and the salary you need to qualify.
  - **By salary:** enter your income and DTI limit and get the maximum price you can afford.
- **Full PITI breakdown** for mortgages: principal and interest, property tax, homeowner's insurance, and PMI (applied when the down payment is under 20%). Tax, insurance and PMI are switched off for the other loan types.
- **Charts and schedule:** a payment breakdown chart and a month-by-month amortization table with running balance and cumulative interest.
- **Orange County cities:** all 34 OC cities plus unincorporated areas. Each shows local down payment help (city programs, whether the County Mortgage Assistance Program covers it, below-market homes, Habitat), live weather from Open-Meteo, and the property-tax (~1.1%) and insurance (~$1,800/yr) estimates used in the payment.
- **Matching jobs:** occupations across 10 categories whose median salary is within 15% of the salary you need.
- **Realtor.com links:** a pre-filled search for the selected city and your price range.

## Getting started

You need Node.js 20 or later and npm.

```bash
git clone https://github.com/thejaredchapman/loan_lens.git
cd loan_lens
npm install
npm run dev
```

Open the URL Vite prints, usually <http://localhost:5173>.

### Scripts

| `npm run verify:docs` | Check the app's facts against the source PDFs (writes `docs/verification-report.md`) |
| `npm run daily-check` | Refresh rate, program status and news (Haiku only for changed pages) |
| `npm run translate` | AI-translate missing strings (es, vi, zh, fr, ar); logs cost per call |

### Core scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## How to use it

1. **Choose a loan type** at the top of the page. Rates, terms and limits update to match.
2. **Choose a search mode.**
   - *Property:* enter a price, down payment %, interest rate and term. For home loans, also pick a city so local tax and insurance are included.
   - *Salary:* enter your annual salary and DTI limit. Front Door works backward to the most you can afford.
3. **Read the results:** the monthly payment, the split between its parts, total interest over the life of the loan, and the required salary.
4. **Expand the amortization schedule** to see every payment.
5. **Explore the city, jobs and listings** below the results to get a feel for what that budget buys.

Your last inputs are remembered the next time you open the app.

## How the math works

- **Monthly payment:** the standard amortization formula, `P × r(1+r)^n / ((1+r)^n − 1)`, where `r` is the monthly rate and `n` the number of payments. A 0% rate falls back to `P / n`.
- **PITI:** principal and interest, plus `price × tax rate / 12`, `insurance / 12`, and `loan × PMI rate / 12` when the down payment is under 20%.
- **Required salary:** `total monthly payment / max DTI × 12`.
- **Max affordable price:** the monthly budget (`salary / 12 × DTI`) is solved against the PITI formula for the price.

The code is in `src/utils/amortization.js` and `src/utils/affordability.js`.

> Results are estimates for planning, not a loan offer or financial advice. City figures, job salaries and default rates are static sample data and will drift from real market numbers.

## How it was created

Built in one day (Nov 7, 2026) by our team directing [Claude Code](https://www.anthropic.com/claude-code), Anthropic's AI coding agent. Five research agents ran in parallel on live official sources (programs, down payment subsidies, cheapest lenders, California laws, brand colors; ~683K tokens, 319 tool calls). Facts were extracted from the hackathon PDFs with [pdftotext](https://poppler.freedesktop.org/) and are re-checked by `npm run verify:docs`. Every page was tested with ESLint, a production build, and headless-Chrome screenshots on phone and desktop. Full history and costs: [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md).

## Technologies and external services

- **App:** [React 19](https://react.dev/), [Vite 7](https://vite.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Zustand 5](https://zustand.docs.pmnd.rs/); a tiny custom hash router and i18n layer (English, Español, Tiếng Việt, 中文, Français, العربية with right-to-left).
- **AI (build time only):** [Claude Code](https://www.anthropic.com/claude-code); [Claude Haiku via the Anthropic API](https://docs.anthropic.com/) for the daily check and translations (cost logged per call).
- **Automation:** [GitHub Actions](https://github.com/features/actions) (daily check opens a pull request), [Node.js](https://nodejs.org/) scripts, [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) for screenshots, [ESLint](https://eslint.org/).
- **Data:** [Freddie Mac PMMS](https://www.freddiemac.com/pmms), [HCD 2026 income limits](https://www.hcd.ca.gov/grants-and-funding/income-limits), [HMDA Data Browser](https://ffiec.cfpb.gov/data-browser/), [CalHFA](https://www.calhfa.ca.gov/homebuyer/programs/index.htm), [County of Orange housing](https://housing.oc.gov/housing-development), [LAO](https://lao.ca.gov/), [California Energy Commission](https://www.energy.ca.gov/).
- **At runtime:** [Open-Meteo](https://open-meteo.com/) (weather), [Google Fonts](https://fonts.google.com/) (Baloo 2, Nunito, Noto), links out to [Realtor.com](https://www.realtor.com/) and [Google](https://www.google.com/).
- The full list of every organization, data source, and tool (with links) is in [`src/data/externalServices.js`](src/data/externalServices.js) and on the site's *How this was built* and *Sources* pages.

## Tech stack

- [React 19](https://react.dev/) and [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/) with the `persist` middleware for saved inputs
- [Open-Meteo](https://open-meteo.com/) for live weather (no API key needed)

## Project structure

```
src/
  components/   UI: forms, results, chart, schedule, city panel, jobs, listings
  data/         mortgage product, Orange County cities, programs, income limits, job salaries
  hooks/        useCityData (city lookup + live weather)
  store/        Zustand store with persisted preferences
  utils/        amortization, affordability, formatters, Realtor.com URLs
docs/           design spec and plans for an Angular port and landing page
```

## Customizing

- **Loan types and defaults:** edit `src/data/loanProducts.js`.
- **Cities:** edit `src/data/ocCities.js` (name, coordinates, county-loan eligibility, city program ids).
- **Jobs:** edit `src/data/jobs.js`.

## Deploying

Front Door is a static site. Run `npm run build` and host the `dist/` folder anywhere, for example Vercel, Netlify or GitHub Pages.
