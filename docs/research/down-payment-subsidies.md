# Down payment subsidies: Orange County, CA and statewide

All facts checked **2026-11-07**. The machine-readable version is `down-payment-subsidies.json` (25 records).
Rule: an amount only appears as fact if it was seen on an official page or official document. Everything else is marked **UNVERIFIED**, with the reason.

Shared reference, 2026 HCD Orange County limits (seen on the MAP package, Garden Grove, and Brea pages):
80% AMI for 4 people is $148,850; 120% AMI for 4 people is $166,300.

---

## 1. Corrections to `src/data/programs.js` / `plans.js`

| id | Field | Current data | What the source says | Source |
|---|---|---|---|---|
| `oc-map` | gives | Up to $80,000 | Up to $80,000 **and no more than 20% of price**. Admin is Affordable Housing Clearinghouse (949-859-9255); $33.50 fee; no minimum credit score | MAP package 5/5/2026 |
| `oc-map` | who | "unincorporated OC or a participating city" | **Only** unincorporated OC + Brea, Cypress, Dana Point, La Palma, Laguna Beach, Laguna Hills, Laguna Woods, Los Alamitos, Placentia, San Juan Capistrano, Seal Beach, Stanton, Villa Park, Yorba Linda. Anaheim, Santa Ana, Irvine, Garden Grove, Fullerton, Costa Mesa, HB, etc. are **not** eligible | same |
| `oc-map` | status | conflicting | Still conflicting: the Clearinghouse page says "now open and accepting Applications" (undated), but search indexes title the same URL "NOTICE: Program Currently Closed". Leave `conflicting` and add the city list to the matcher | affordable-housing.org |
| `santa-ana` | gives | Up to $120,000 | Up to **$120,000 low income / $80,000 moderate income** (official-domain snippet). maxCategory should be `moderate`. Adds a rule: live or work in Santa Ana 32+ hrs/week for 6 months (veterans exempt) | santa-ana.org (403), search snippet |
| `santa-ana` | funding | — | HCD CalHome award of **$4,893,250 for 37 loans** (10/2/2025). The "$10M / $2.3M" allocation is from **Oct 2023**, not 2026 | HCD award list PDF |
| `anaheim` | gives | $50,000 at 1%, or "up to $80,000" | **$50,000, 1% simple, 30-yr deferred**; up to 20% combined DPA; 3% buyer funds; 12-month live/work priority. Drop the $80,000, which only appears on an unsourced aggregator | anaheim.net/6695 (403, snippet) + 2 secondary |
| `anaheim` | who | income up to $200,000 | Conflicting: 150% AMI (staff report via Voice of OC; 4p about $207,900) vs "$200,000 or less" (2025 city release). Still **UNVERIFIED** | |
| `calhfa-myhome` | who | "$274,000 (confirm)" | **$274,000 confirmed**, effective 06.30.2026 | CalHFA income PDF |
| `dream-for-all` | who | "$219,000" | **$219,000 confirmed**, effective 06.30.2026. No 2027 round announced. 5/20/2026: additional 2026 vouchers released | CalHFA DFA page + PDF |
| `calhfa-zip` | gives | 0% for closing costs | Add amount: **up to 3% of the first mortgage loan amount** | CalHFA CalPLUS flyer |
| `calhfa-myaccess` | status | unverified | Amount **verified: up to 2.5% of first mortgage**, down payment and/or closing. Credit minimum still unverified | CalHFA flyer |
| `gsfa-platinum` | type | `grant` | **Wrong.** Standard = up to 5% as a **15-yr amortizing second at the first-mortgage rate (monthly payments)**. Select = 3.5% amortizing second + up to 1.5% gift "subject to market conditions." Assist-to-Own = 3.5% 0% deferred + up to 2% gift (5.5%) for GSFA member-county employees. No current promotion on the page | gsfahome.org |
| `fhlb-wish` | gives | "Matching grants" | **4:1 match, up to $32,837**; $13M for 2026; members can enroll through 3/12/2027 | fhlbsf.com |
| `mcc` | catch | rate 15–20% | **"Up to 15%"** per City of Brea's MCC page. County page confirms "available and currently funded." NHF has no MCC page online. Income and price limits still **UNVERIFIED** | Brea, ocgov.com |
| `prop37` | status | "Passing in early returns" | **Projected to pass (AP), Yes 61.8%** as of 11/6/2026 5:37pm; certification 12/11/2026. LAO does not state a $1.5M cap ("certain limits"), so mark the $1.5M unverified | LAO; californiatoday.com |
| Prop 1 | — | "$500M CalHFA homebuyer money" | **Wrong figure.** Prop 1 has **$1.1B for homeownership** (first-time buyer deferred loans + land/repair). $500M is the infrastructure category. Projected to pass, Yes 60.5%. No program yet | LAO |
| `buena-park` | gives | $60,000 at 3% | No official page found. A Redfin guide says $58,000 (undated). Buena Park is **not** on the 2025 CalHome award list. Suggest `closed` or keep `unverified`, phrased as "likely inactive" | |
| `fullerton` | — | deferred loan | No city loan found. The city page (403) appears to refer buyers to the Clearinghouse. Fullerton is not MAP-eligible. Suggest removing or making it a referral-only entry | |
| `garden-grove` | — | (verified) | Unchanged amounts. 2026 CalHome application posted; workshops Oct 13 / Nov 10 / Dec 8, 2026; HCD award **$2,204,000 for 16 loans** (10/2/2025). Moderate tier is 120% AMI | ggcity.org; HCD |
| `habitat-oc` | — | — | FYI: Habitat OC's CalHome **mortgage-assistance** application ($5.5M) was **not funded** in HOSN Round 2 | HCD award list |

---

## 2. New programs found

| Program | Amount / type | Income | Status | Verified |
|---|---|---|---|---|
| **FHLBank SF Middle-Income DPA (2026)** | Grant up to **$40,000**; buyer puts in $10,000+ | 80.01–140% AMI | **Closed**: $13M allocation reached | Yes |
| **Anaheim Hotel Worker Housing Fund (ATID)** | Up to $100,000 loan (≤120% AMI) / $50,000 DPA (120–150%) | 4p up to $174,600 / $207,000 | Under development; outreach Nov 2026 | No (news only, OCBJ 10/26/2026) |
| **Brea Homebuyer Program** (BMR units) | Below-market price; 45-yr profit share | 4p $166,300 | Waitlist | Yes |
| **Bank of America Down Payment Grant** | 3% up to $10,000 (+ America's Home Grant lender credit up to $7,500) | "Income limits apply" | Select markets; OC unconfirmed | Partial |
| **Chase Homebuyer Grant** | **$2,500 or $5,000** (current page; the $7,500 tier is from 2024 press) | Census-tract based | Tract lookup needed | Partial |
| **Wells Fargo Homebuyer Access** | $10,000 grant + up to $5,000 closing credit (≤80% AMI) | Varies by area | "Certain areas"; Anaheim-Santa Ana-Irvine seen only in a snippet | Partial |
| **U.S. Bank American Dream / Access Home Loan** | Greater of $5,500 or 3% up to $10,000; Access: $12,500 + $5,000 credit (select locations, no OC pilot found) | ≤ area median or LMI tract | Available in CA | Yes (American Dream) |
| **Citi Lender Paid Assistance** | Up to $7,500 lender credit | Reported ≤120% AMI | Select markets | No (JS page) |
| **SCHFA (LA/OC JPA)** | Reported 4% grant with first mortgage | — | Unknown, likely inactive | No |
| **Prop 1 (2026)** | $1.1B homeownership | Low/moderate | Passed (projected); no program | Yes (LAO) |

**Cities with no city down payment program:**
- Confirmed on an official page: Rancho Santa Margarita ("does not offer any form of first-time homebuyer assistance").
- Tustin's FAQ covers only below-market units (3% own funds). A search snippet says Tustin "does not offer the First Time Homebuyer Program at this time," but that text was not on the fetched page.
- Not found, so absence is unverified: Costa Mesa, Westminster, Orange, La Habra, Huntington Beach (its city page lists only county, state, and FHLB resources), Irvine (resource links only), Fountain Valley, Mission Viejo, Lake Forest, Laguna Niguel, San Clemente.
- Placentia and the other 13 MAP cities rely on OC MAP.

**County PLHA:** The OC housing page mentions a PLHA Five-Year Plan, but no homebuyer-assistance use of PLHA funds was found. **UNVERIFIED / none found.**

**Employer programs:** Beyond the existing SchoolsFirst, UCI ICHA, and GSFA Select entries, only the Anaheim ATID hotel fund was found. Nothing found for CHOC, Providence, Kaiser, school districts, or County of Orange employees.

---

## 3. Program detail (verified records)

### County of Orange MAP
- Up to $80,000, capped at 20% of price. 3% simple interest, fixed. 30-yr deferred; due on sale, transfer, non-occupancy, or refinance.
- Income at or below 80% AMI (1p $104,200 up to 8p $196,500).
- Price no more than 85% of the OC median; the dollar figure is not published.
- All buyers first-time (3 years). 1% minimum contribution. 8-hr Clearinghouse class. Fixed-rate first mortgage, CLTV no more than 100%.
- Status: **conflicting.**
- Sources: https://housing.oc.gov/housing-development (HTML) and https://affordable-housing.org/resources/pdfs/map-program/map-application-package-05-05-26.pdf (text PDF).

### Garden Grove FTHB
- $110,000 (80% AMI) or $50,000 (120% AMI) at 0%, 30-yr deferred.
- 3% down. Workshop required. Housing cost no more than 45% of income.
- Status: open (2026 application posted).
- Source: https://ggcity.org/FTHB (HTML with an income table).

### CalHFA
- MyHome: 3.5% (FHA) or 3% (conventional), deferred.
- ZIP: up to 3% of the first mortgage, 0%.
- MyAccess: up to 2.5% of the first mortgage.
- OC income limit: $274,000.
- Dream For All: 20% up to $150,000; 20% appreciation share (15% at or below 80% AMI); OC limit $219,000. **Closed**, no 2027 date.
- Sources: calhfa.ca.gov program pages (HTML); income PDFs have a text layer.

### GSFA Platinum
- See the corrections table. First mortgage max $832,750, no price limit, FICO 640, DTI 50%, no first-time-buyer rule.
- Whether Orange County is a GSFA member county (needed for Assist-to-Own) was not confirmed.
- Source: HTML.

### FHLBank SF WISH 2026
- 4:1 match up to $32,837. 80% AMI. First-time buyer. Counseling.
- Open to member enrollment through 3/12/2027.
- The participant list on the official page rendered empty.

### FHLBank SF Middle-Income DPA 2026
- Up to $40,000. 80.01–140% AMI. $10,000 buyer contribution.
- **Closed** (allocation reached).
- The Huntington Beach city page still shows an older $50,000 / $10M version.

---

## 4. Still UNVERIFIED

1. **OC MAP open/closed status.** Conflicting signals on the Clearinghouse site. Call (949) 859-9255.
2. **Santa Ana My First Home.** The city site blocks automated access (403). The 2026 status, income table, and term are not seen on an official page. A Feb 2026 secondary source says applications were closed.
3. **Anaheim.** The site blocks access (403). The $50,000 / 1% / 30-yr terms are consistent across sources, but the income cap (150% AMI vs $200,000) and intake status are unknown.
4. **OC MCC.** Credit rate ("up to 15%" comes only from the City of Brea), income and price limits.
5. **Buena Park and Fullerton.** No official program found.
6. **Lender grants in OC.** BofA, Chase, Wells, and Citi all say "select markets" or census tracts. OC eligibility needs an address-level check with each lender's tool.
7. **GSFA Assist-to-Own.** Whether Orange County is a member county.
8. **Prop 37 price cap** ($1.5M) and **Prop 1 CalHFA share.** Neither is defined yet.
9. **Irvine Community Land Trust.** No for-sale offering found. The city page shows a Pacifica Place interest list "open through November 16" (tenure unclear).
10. **SCHFA** 4% grant. No official page.

---

## 5. Scraping notes

| Site | Format | Scrapable? |
|---|---|---|
| housing.oc.gov | HTML | Yes |
| affordable-housing.org (MAP PDFs) | Text PDF | Yes (pdftotext) |
| ggcity.org | HTML table + PDFs | Yes |
| cityofbrea.gov, tustinca.org, cityofrsm.org, huntingtonbeachca.gov, cityofirvine.gov | HTML | Yes |
| calhfa.ca.gov | HTML + text PDFs | Yes |
| gsfahome.org, fhlbsf.com | HTML | Yes (FHLB participant list may be JS) |
| ocgov.com (MCC) | HTML, large | Yes, but no numbers on the page |
| hcd.ca.gov award lists | Text PDF | Yes |
| lao.ca.gov | HTML | Yes |
| **santa-ana.org, anaheim.net, cityoffullerton.com, cypressca.org** | **HTTP 403 to automated clients** | **No.** Needs a manual check or a different data source. Do not bypass |
| citi.com | JS-rendered | No (needs a headless browser) |
| BofA, Chase, Wells Fargo, U.S. Bank | HTML | Yes for amounts; geography needs interactive tools |
| nhfloan.org | HTML, no MCC page (mcc.html returns 404) | n/a |

Note: search results for "Orange County down payment" are flooded with **Orange County, Florida** programs (ocfl.net, eHousingPlus guides). Exclude these from any scraper.
