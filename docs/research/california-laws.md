# California laws that help or restrict home buyers (2024-2027)

Research for LoanLens. Checked 2026-11-07. Focus: low- and moderate-income buyers in Orange County.
Companion data file: `california-laws.json` (same entries, machine-readable).

## How this was checked

- Signing status was confirmed against official pages where possible: gov.ca.gov signing releases and legislative
  updates, DRE's 2025 end-of-year chaptered bill summaries, CA Department of Insurance (CDI) releases, BOE, HCD,
  CalHFA, LAO, and the Secretary of State.
- leginfo.legislature.ca.gov blocked automated access (Cloudflare 403), so bill text and chapter numbers were not read
  directly. Where provision details come from committee analyses or law-firm summaries, the entry says so in `notes`.
- `verified: false` means a key fact (signing, outcome, or the main provision) could not be confirmed on an official page.
- Most 2026 bills take effect January 1, 2027 unless noted.

## Key takeaways for Orange County buyers

**Helps most**
- Starter homes and townhomes: SB 1116 (2026) expands the small-lot starter-home law (SB 684/SB 1123), and AB 1751 (2026,
  by Fullerton's Asm. Quirk-Silva) creates a fast, CEQA-exempt path for for-sale townhome projects up to 150 units with
  10% set aside for lower-income buyers on 11+ unit projects. Both take effect Jan 1, 2027.
- House-hacking: AB 956 (2026) allows two detached ADUs per lot and stops HOAs from banning ADUs; SB 1117 cuts ADU fees.
  AB 1033 (2023) lets cities opt in to selling ADUs as condos (no OC city adoption confirmed).
- For-sale affordability: AB 2433 (2026) density bonus perks for for-sale homes; AB 672 (2026) keeps community land trust
  homes tax-exempt to 2032.
- Keeping your home: AB 2424 (2024) foreclosure delay if you list the home; SB 876 (2026) claim-handling reform;
  AB 2038 (2026) two-year non-renewal ban after a wildfire.
- Buyer transparency: AB 2992/AB 1521 (agent pay in writing and negotiable), AB 723 (altered photo disclosure),
  SB 410 (balcony inspection reports to condo buyers), AB 455 (smoking disclosure).

**Restricts or adds cost**
- Insurance: the Sustainable Insurance Strategy lets insurers price in modeled wildfire risk and reinsurance costs
  (more availability, but higher premiums are possible). A reported ~29% FAIR Plan rate increase (Oct 15, 2026) is unverified.
- AB 2992: buyers may have to pay their own agent if the seller won't.
- AB 2050: HOA reserve floor (starting 2032) can push dues up, which affects debt-to-income.
- Prop 19: inherited homes lose the low tax base unless the heir moves in; the repeal initiative did not make the 2026 ballot.
- SB 1383: labor standards on tall density-bonus projects (minor effect on typical starter homes).
- Local short-term rental bans/moratoria (Seal Beach, Fullerton) limit house-hacking income (unverified current status).

**Important correction for the app:** SB 79 (transit upzoning, effective July 1, 2026) applies only in "urban transit
counties". HCD's current list (Alameda, Los Angeles, Sacramento, San Diego, San Francisco, San Mateo, Santa Clara) does
NOT include Orange County, even though some news coverage said it did.

**Ballot measures (Nov 3, 2026):** Prop 1 and Prop 37 are projected to pass but are not certified; the SoS certifies on
December 11, 2026. Prop 45 (CEQA deadlines) appears to have failed in early returns.

## Did not become law (do not present as law)

- **AB 1903 (2026), condo construction-defect liability reform**: reported dead at the end of session (The Close,
  BillTrack50). No condo defect reform was signed in 2024-2026 per this research. A second condo bill (AB 1406, deposit
  caps) has unknown status. Not verified on leginfo.
- **AB 2387 (2026), Dream For All first-generation expansion**: last action found was a committee referral (March 2026);
  not on any signing list found. Unverified.
- **Prop 19 repeal initiative (AG 25-0017)**: not on the SoS list of qualified Nov 3, 2026 measures.
- **AB 2166 (2026), factory-built housing financing program**: vetoed (per Holland & Knight).
- **AB 1294 (2026)** was signed but is a rental welfare-exemption pilot limited to Alameda, Sacramento, and San Francisco;
  not relevant to OC buyers.

## All entries


### Housing supply and ownership

#### SB 1116 (Caballero, 2026): Starter Home Revitalization Act expansion (small-lot subdivisions)

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (More small, lower-priced for-sale homes can be approved quickly, including on lots where old deed rules blocked them.)
- **What it does:** Strengthens the 2023 Starter Home Revitalization Act (SB 684/SB 1123). Builders can split land into up to 10 small lots or homes with ministerial (no-hearing) approval. It raises the minimum allowed floor-area ratio to 1.25, caps front setbacks at 10 feet, removes the 5-acre limit for multifamily-zoned lots, sets a 60-day final map deadline, and voids CC&Rs or deed restrictions that would block these projects (except inside HOA/common-interest developments).
- **Simple version:** It makes it easier to build small, cheaper houses on small lots, so more first homes get built.
- **Who it affects:** Builders of small for-sale homes; first-time buyers looking for lower-priced detached or townhome-style homes
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed on gov.ca.gov. Provision details from Holland & Knight and Brownstein summaries; leginfo was not reachable (Cloudflare block).

#### SB 1123 (Caballero, 2024): Starter homes on vacant single-family lots

- **Status:** Signed September 19, 2024 (Chapter 294, Statutes of 2024 per bill trackers)
- **Effective:** 2025-07-01
- **Impact:** HELPS (Turns vacant single-family lots into sites for several smaller, cheaper starter homes.)
- **What it does:** Extends the SB 684 small-lot process to vacant lots zoned single-family, so up to 10 small homes can be approved ministerially. Single-family lots must be no larger than 1.5 acres.
- **Simple version:** An empty lot meant for one house can now get up to 10 small houses instead.
- **Who it affects:** Small builders; buyers seeking lower-priced new homes
- **Source:** https://www.gov.ca.gov/2024/09/19/governor-newsom-signs-bipartisan-housing-package-and-launches-prop-1-homekey-initiative/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed on gov.ca.gov. July 1, 2025 operative date and chapter number come from secondary sources (law-firm article, LegiScan), not leginfo.

#### SB 684 (Caballero, 2023): Starter Home Revitalization Act (original)

- **Status:** Signed October 11, 2023
- **Effective:** 2024-01-01
- **Impact:** HELPS (Speeds approval of small for-sale developments that produce entry-level homes.)
- **What it does:** Requires cities to approve, without a hearing, projects of 10 or fewer homes on multifamily-zoned urban lots under 5 acres, including small-lot subdivisions where each home can be sold separately.
- **Simple version:** Builders can put up to 10 small homes on a lot without a long fight at city hall.
- **Who it affects:** Small builders; buyers seeking entry-level for-sale homes
- **Source:** https://www.gov.ca.gov/2023/10/11/governor-newsom-signs-package-to-streamline-housing-and-expand-tenant-protections-in-california/
- **Checked:** 2026-11-07 | **Verified:** yes

#### SB 9 (Atkins, 2021): Lot splits and duplexes on single-family lots (baseline law)

- **Status:** Signed 2021
- **Effective:** 2022-01-01
- **Impact:** HELPS (Lets owners create a second home or lot, adding lower-cost units and equity-building options.)
- **What it does:** Lets an owner split a single-family lot in two and/or build up to two homes per lot with ministerial approval. Owners splitting a lot generally must sign an affidavit to live in one of the units for 3 years. Included as background for SB 450 and AB 1061.
- **Simple version:** One house lot can become two lots, so a family can build and sell or live in a second home.
- **Who it affects:** Homeowners with single-family lots (house-hacking, building equity); buyers of the new smaller units
- **Source:** https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/lot-splits-and-duplexes-sb-9.pdf
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Outside the 2024-2026 window; listed for context.

#### SB 450 (Atkins, 2024): SB 9 clean-up: limits local roadblocks to lot splits

- **Status:** Signed September 19, 2024
- **Effective:** 2025-01-01
- **Impact:** HELPS (Removes local tactics that made SB 9 lot splits too costly or slow to use.)
- **What it does:** Bars cities from applying SB 9-specific standards that are stricter than the underlying zone, limits lot-split standards to parcel design and improvements, and requires a decision within 60 days of a complete application or the project is deemed approved.
- **Simple version:** Cities can't invent extra rules to stop people from splitting lots, and they have to answer in 60 days.
- **Who it affects:** Homeowners using SB 9; small builders
- **Source:** https://www.gov.ca.gov/2024/09/19/governor-newsom-signs-bipartisan-housing-package-and-launches-prop-1-homekey-initiative/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed on gov.ca.gov ('SB 450 by Senator Toni Atkins — Housing development: approvals'). Provisions from Senate/Assembly analyses and BB&K/BWS summaries.

#### AB 1061 (Quirk-Silva, 2025): SB 9 lot splits allowed in historic districts

- **Status:** Signed October 10, 2025
- **Effective:** 2026-01-01
- **Impact:** HELPS (Opens more lots to SB 9 splits by ending blanket historic-district exclusions.)
- **What it does:** Removes SB 9's blanket exclusion for whole historic districts. Lot splits are still barred on individual landmarks and where the work would demolish or alter a contributing historic structure.
- **Simple version:** A neighborhood can't use a 'historic' label to block every lot split anymore.
- **Who it affects:** Owners in historic overlay districts
- **Source:** https://www.gov.ca.gov/2025/10/10/governor-newsom-builds-on-this-years-historic-housing-reforms-signs-legislation-to-accelerate-housing-and-affordability/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Exact trigger (demolish/alter contributing structure) from Senate analysis and BWS law-firm summary.

#### AB 1033 (Ting, 2023): Selling an ADU separately as a condo (local opt-in)

- **Status:** Signed October 11, 2023 (Chapter 752, Statutes of 2023)
- **Effective:** 2024-01-01
- **Impact:** HELPS (Could create very low-priced condo units, but only where a city opts in.)
- **What it does:** Allows, but does not require, a city or county to adopt an ordinance letting an ADU be sold separately from the main house as a condominium. Requires a safety inspection and lender (lienholder) consent before the condo plan is recorded. It only works where the local government has opted in.
- **Simple version:** If your city says yes, a backyard cottage can be sold as its own small home.
- **Who it affects:** Homeowners with ADUs; buyers looking for low-priced condo-style units
- **Source:** https://www.gov.ca.gov/2023/10/11/governor-newsom-signs-package-to-streamline-housing-and-expand-tenant-protections-in-california/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** No Orange County city ordinance adopting AB 1033 was confirmed in this research; check each city.

#### AB 956 (Quirk-Silva, 2026): Two detached ADUs per lot; HOAs can't ban ADUs

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Gives owners, including HOA owners, more rental income to help afford a mortgage.)
- **What it does:** Allows up to two detached ADUs on a lot with a single-family home (4-foot side/rear setbacks) and bars HOAs and deed restrictions from prohibiting or unreasonably restricting ADUs on lots zoned for single-family use.
- **Simple version:** You can build two backyard homes, and your HOA can't just say no.
- **Who it affects:** Homeowners (including in HOAs) who want rental income to help pay the mortgage
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Details from Holland & Knight and Brownstein summaries.

#### AB 1751 (Quirk-Silva, 2026): Missing Middle Townhome Ownership Act

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Speeds up for-sale townhomes, the classic first-home type, with a lower-income set-aside.)
- **What it does:** Creates a ministerial, CEQA-exempt approval path (60-day deadline) for qualifying for-sale townhome projects of up to 150 units. Projects of 11+ units must reserve at least 10% for lower-income households for 45 years. Does not override the Coastal Act.
- **Simple version:** It's faster to build rows of townhomes you can buy, and some must be priced for lower-income families.
- **Who it affects:** First-time and moderate-income buyers; townhome builders
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Author is Assemblymember Quirk-Silva (D-Fullerton, Orange County). Details from Brownstein and Holland & Knight.

#### AB 2433 (Alvarez, 2026): Affordable Homeownership Bonus (density bonus for for-sale projects)

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Makes for-sale projects with affordable units more attractive to builders.)
- **What it does:** Gives for-sale projects that include required affordable units two extra incentives/concessions beyond rental projects, allows the bonus as extra floor-area ratio, and clarifies that granting a density bonus is not discretionary.
- **Simple version:** Builders get extra perks for building homes people can buy, not just rent.
- **Who it affects:** Developers of for-sale housing; lower/moderate-income buyers of the affordable units
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes

#### SB 677 (Wiener, 2026) and SB 1169 (Grayson, 2026): Subdivision map appeals and longer map life

- **Status:** SB 677 signed (listed Sept 30, 2026 legislative update); SB 1169 signed per law-firm summaries
- **Effective:** 2027-01-01
- **Impact:** HELPS (Reduces delay and risk for new for-sale subdivisions.)
- **What it does:** SB 677 bars third parties from appealing subdivision map approvals for qualifying urban infill sites. SB 1169 extends tentative subdivision maps from 24 to 48 months (local extensions up to 36 months).
- **Simple version:** Neighbors can't easily stall new home lots, and builders get more time to finish.
- **Who it affects:** Builders of for-sale subdivisions, indirectly buyers
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** SB 677 signing confirmed on gov.ca.gov. SB 1169 signing only confirmed via Brownstein and Holland & Knight; not found on a gov.ca.gov page in this research.

#### SB 79 (Wiener, 2025): Abundant and Affordable Homes Near Transit Act

- **Status:** Signed October 10, 2025
- **Effective:** 2026-07-01
- **Impact:** MIXED (Adds supply (mostly multifamily) statewide, but currently does nothing directly for Orange County buyers.)
- **What it does:** Makes mid- and high-rise housing an allowed use near qualifying rail and bus stops in 'urban transit counties' (counties with more than 15 passenger rail stations). HCD currently lists Alameda, Los Angeles, Sacramento, San Diego, San Francisco, San Mateo, and Santa Clara. Orange County is NOT on HCD's current list, so SB 79 does not appear to apply in OC today.
- **Simple version:** More apartments can be built next to train stations, but not in Orange County yet.
- **Who it affects:** Mostly renters and condo buyers near transit in the listed counties
- **Source:** https://www.hcd.ca.gov/planning-and-research/sb79-tod/housing-element-sites
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Some news coverage listed Orange County among the counties; HCD's own page (last updated 8/19/2026) does not. Trust HCD.

#### AB 130 and SB 131 (Budget trailer bills, 2025): CEQA reform for infill housing

- **Status:** Signed June 30, 2025
- **Effective:** 2025-06-30
- **Impact:** HELPS (Cuts time and lawsuit risk for infill homes, lowering building costs.)
- **What it does:** AB 130 creates a statutory CEQA exemption for qualifying infill housing that meets local zoning and objective standards on urban sites (up to 20 acres per law-firm summaries). SB 131 narrows review for projects that miss an exemption by a single condition and exempts rezonings that implement a housing element.
- **Simple version:** Homes on empty city lots don't have to go through a long environmental fight anymore.
- **Who it affects:** Builders of infill housing; buyers and renters indirectly
- **Source:** https://www.gov.ca.gov/2025/06/30/governor-newsom-signs-into-law-groundbreaking-reforms-to-build-more-housing-affordability/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Not the same as AB 130 (2023), which was an unrelated HOA/fines bill. Acreage details from law-firm summaries.

#### Proposition 45 (Nov 3, 2026): Building an Affordable California Act (CEQA deadlines for essential projects)

- **Status:** Appears to have failed in early returns (about 54% No); not certified
- **Effective:** None if rejected
- **Impact:** MIXED (Could have cut building time and cost, but opponents said it weakened environmental protections; outcome not final.)
- **What it does:** Would have let housing and other 'essential' projects opt into a faster CEQA process with deadlines for environmental reports (365 business days) and lawsuits (30 days). Early returns show it losing.
- **Simple version:** A plan to speed up building rules looks like it lost.
- **Who it affects:** Builders; indirectly buyers
- **Source:** https://lao.ca.gov/BallotAnalysis/Proposition?number=45&year=2026
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** On SoS qualified list. Outcome from news reports (CalMatters, SF Standard, Planetizen), not certified results.


### Paths to ownership

#### AB 939 (Schultz, 2026): Nonprofit resale of density-bonus for-sale units

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** MIXED (Opens a path to ownership at a below-market price, but resale price limits cap how much equity the owner builds.)
- **What it does:** Lets a qualifying 501(c)(3) nonprofit buy affordable for-sale density-bonus units and resell them to lower-income buyers. Units stay affordable for 45 years, and owners keep at least 20% of the home's value increase.
- **Simple version:** A helper group can buy a home and sell it to you cheaply, but you share some of the profit when you sell.
- **Who it affects:** Lower-income first-time buyers
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes


### Costs and fees

#### SB 1117 (Cervantes, 2026): Lower impact fees on ADUs

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Lower fees make ADUs cheaper to build for owners using rental income.)
- **What it does:** Impact fees on an ADU larger than 750 sq ft can only be charged on the square footage above 750 (when fewer than two ADUs are proposed on the lot).
- **Simple version:** Building a backyard home costs less in city fees.
- **Who it affects:** Homeowners building ADUs
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes

#### AB 1815 (Wicks), AB 2058 (Harabedian), AB 2185 (Quirk-Silva), 2026: Factory-built housing cost cuts

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Lower approval costs for factory-built homes can lower prices.)
- **What it does:** Limits local building standards for factory-built homes beyond the state code, allows private quality-assurance inspections, caps local inspection/permit fees at 50% of fees for site-built homes, and requires state housing programs to update guidelines for factory-built projects by July 1, 2027.
- **Simple version:** Homes built in a factory get cheaper to approve, which can make them cheaper to buy.
- **Who it affects:** Buyers of modular/manufactured-style new homes; builders
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** AB 2166 (factory-built housing financing program) was vetoed per Holland & Knight.

#### SB 1383 (Arreguín, 2026): Density bonus can't override local labor standards

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** RESTRICTS (Can raise construction costs for tall projects, though it rarely touches the small for-sale homes most moderate-income buyers target.)
- **What it does:** Developers can't use density-bonus concessions to avoid local labor standards on buildings over 85 feet tall (with exceptions).
- **Simple version:** Tall buildings must still follow local worker-pay rules, which can raise building costs.
- **Who it affects:** Developers of tall projects; mainly affects high-rise rentals and condos
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** yes

#### SB 478 (Dodd, 2023): Honest Pricing Law (junk fees) and real estate

- **Status:** Signed 2023
- **Effective:** 2024-07-01
- **Impact:** HELPS (Pushes all-in pricing generally, but its reach into home buying is unconfirmed.)
- **What it does:** Makes it illegal for most businesses to advertise a price that leaves out mandatory fees (other than government taxes and shipping). It excludes transactions already covered by other pricing laws. Whether and how it applies to mortgage closing costs or real estate commissions was NOT confirmed; mortgage pricing is mostly governed by separate federal (TRID) rules.
- **Simple version:** Stores must show the real total price up front, but it's not clear this covers home-buying fees.
- **Who it affects:** Consumers generally; application to homebuying unclear
- **Source:** https://oag.ca.gov/hiddenfees
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** Law itself is real (AG guidance). Application to real estate transactions could not be confirmed on an official page.


### Buyer protections

#### AB 2992 (Nguyen, 2024): Written buyer-broker agreements required

- **Status:** Signed September 24, 2024
- **Effective:** 2025-01-01
- **Impact:** MIXED (More transparency and the fee is negotiable, but buyers may now have to cover agent pay if the seller won't, which is harder for cash-strapped buyers.)
- **What it does:** Buyers and their agent must sign a written buyer-broker agreement no later than when the buyer makes an offer. It must state the agent's pay, services, when pay is due, and how to end it. It can last no longer than 3 months and can't auto-renew. DRE regulations add a presumption that it's practicable to sign before showing a home.
- **Simple version:** Before you make an offer, you and your agent must write down what they do and how much they get paid.
- **Who it affects:** All homebuyers using an agent
- **Source:** https://www.dre.ca.gov/Licensees/Advisories/Advisory_2024_11_14_Changes_to_Buyer_Representation.html
- **Checked:** 2026-11-07 | **Verified:** yes

#### AB 1521 (Assembly Judiciary Committee, 2025): Fix: agent commissions are negotiable

- **Status:** Chaptered (Chapter 200, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Makes clear to buyers they can negotiate what they pay their agent.)
- **What it does:** Corrects a drafting error in AB 2992 so the required disclosure in buyer-broker agreements says real estate compensation is negotiable and not fixed by law.
- **Simple version:** The paper you sign now says clearly that you can bargain over your agent's fee.
- **Who it affects:** All homebuyers using an agent
- **Source:** https://dre.ca.gov/Newsroom/DRE_Updates/2026_05_06_EOY_Bill_Summaries_2025.html
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Effective date inferred from standard January 1 rule; DRE summary does not state it.

#### AB 723 (Pellerin, 2025): Disclosure of digitally altered listing photos

- **Status:** Signed October 10, 2025 (Chapter 497, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Protects buyers from misleading photos so they don't waste time or money.)
- **What it does:** Agents who use digitally altered images (for example virtual staging or AI edits) in ads must disclose it and, for online listings, include a link or QR code to the unaltered photo.
- **Simple version:** If a house photo was changed on a computer, the agent has to tell you and show the real photo.
- **Who it affects:** All buyers browsing listings; licensed agents
- **Source:** https://dre.ca.gov/Newsroom/DRE_Updates/2026_05_06_EOY_Bill_Summaries_2025.html
- **Checked:** 2026-11-07 | **Verified:** yes

#### AB 948 (Holden, 2021): Appraisal bias protections

- **Status:** Signed September 28, 2021 (Chapter 352, Statutes of 2021)
- **Effective:** 2022-07-01
- **Impact:** HELPS (Protects buyers of color and others from biased low appraisals that can kill a deal.)
- **What it does:** Since July 1, 2022 every California home purchase contract must include a notice about appraisal bias and how to report it. Appraisers may not base value on race, religion, national origin, or other protected traits, and since 2023 must take bias and cultural competency training.
- **Simple version:** The person who decides what your home is worth isn't allowed to be unfair because of who you are.
- **Who it affects:** All buyers and owners getting an appraisal (purchase or refinance)
- **Source:** https://www.brea.ca.gov/pdf/2025_brea_sunset_report.pdf
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Outside the 2024-2026 window; included because requested. No new 2024-2026 appraisal-bias statute was found.


### Disclosures

#### AB 455 (Ortega, 2025): Seller disclosure of smoking / thirdhand smoke

- **Status:** Chaptered (Chapter 263, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Gives buyers health-related information before they buy.)
- **What it does:** Sellers of single-family homes must disclose known tobacco or nicotine residue or smoking history. Thirdhand smoke info is added to the Homeowners' Guide to Environmental Hazards.
- **Simple version:** Sellers must tell you if people smoked in the house.
- **Who it affects:** Buyers of single-family homes; sellers (small added disclosure)
- **Source:** https://dre.ca.gov/Newsroom/DRE_Updates/2026_05_06_EOY_Bill_Summaries_2025.html
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Effective date inferred from standard January 1 rule.

#### SB 410 (Grayson, 2025): Balcony/elevated-element inspection report must go to condo buyers

- **Status:** Signed October 10, 2025 (Chapter 516, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Helps buyers spot costly upcoming repairs (and special assessments) before they commit.)
- **What it does:** Sellers in HOAs/condos must give buyers the association's most recent exterior elevated element (balcony, deck, stairway) inspection report, and these reports become association records.
- **Simple version:** Before you buy a condo, you get to see if the balconies and stairs were checked and safe.
- **Who it affects:** Condo and townhome buyers in HOAs
- **Source:** https://dre.ca.gov/Newsroom/DRE_Updates/2026_05_06_EOY_Bill_Summaries_2025.html
- **Checked:** 2026-11-07 | **Verified:** yes


### Keeping your home

#### AB 2424 (Schiavo, 2024): Foreclosure delay if the home is listed for sale

- **Status:** Signed September 20, 2024 (Chapter 311, Statutes of 2024)
- **Effective:** 2025-01-01
- **Impact:** HELPS (Gives struggling owners time to sell and keep their equity instead of losing it at auction.)
- **What it does:** If a borrower facing foreclosure gives the trustee a listing agreement with a licensed broker at least 5 days before the sale, the sale is postponed 45 days (and another 45 days if a purchase contract arrives). It also sets a minimum bid floor at the first sale and requires servicer notices to say a third party can request foreclosure notices.
- **Simple version:** If you're about to lose your home, listing it for sale buys you time to sell it yourself and keep your equity.
- **Who it affects:** Homeowners behind on payments
- **Source:** https://www.gov.ca.gov/2024/09/20/governor-newsom-signs-landmark-bill-to-protect-kids-from-social-media-addiction-takes-action-on-other-measures/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Chapter number from Senate Banking end-of-session report. Bid floor reported as 67% of fair market value by law firms (an earlier version said 75%); exact figure not confirmed on an official page.

#### AB 1278 (Harabedian, 2026): Interest on insurance payouts paid to the homeowner

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Puts interest earned on held insurance money back in the homeowner's pocket.)
- **What it does:** Builds on AB 493 (2025), which made mortgage servicers pay at least 2% interest on insurance money they hold after fire damage. AB 1278 lets that interest be paid to the borrower by check instead of being credited to the loss-draft account.
- **Simple version:** If the bank holds your insurance check while you rebuild, you get the interest it earns.
- **Who it affects:** Homeowners with a mortgage rebuilding after a disaster
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed on gov.ca.gov; provision details from Senate Judiciary analysis.


### Programs and funding

#### AB 179 (Housing budget trailer bill, 2026): Affordable housing finance overhaul and Disaster Rebuilding Assistance Program

- **Status:** Signed July 13, 2026
- **Effective:** 2026-07-13
- **Impact:** HELPS (Adds financing help for owners rebuilding after disasters.)
- **What it does:** Reorganizes how the state finances affordable housing. Creates a Disaster Rebuilding Assistance Program run by CalHFA ($56M General Fund + $44M National Mortgage Settlement funds) to help owners of disaster-damaged homes get construction financing. CalHFA must report on it by January 2027. No Dream For All changes were found in it.
- **Simple version:** The state set aside money to help people whose homes burned get loans to rebuild.
- **Who it affects:** Owners of disaster-damaged homes; affordable housing developers
- **Source:** https://lao.ca.gov/Publications/Report/5199
- **Checked:** 2026-11-07 | **Verified:** yes

#### CalHFA Dream For All (funded by 2025-26 Budget Act): Dream For All shared-appreciation down payment loan, 2026 round

- **Status:** 2026 application window Feb 24 to Mar 16, 2026 (closed); vouchers released May 20, 2026
- **Effective:** 2026-02-24
- **Impact:** HELPS (Provides large down payment help to first-generation buyers, though funding is limited and by lottery.)
- **What it does:** Up to 20% of the price as a shared-appreciation down payment loan for first-generation first-time buyers, chosen by random draw. $150M-$200M expected for 2026 from $300M in the 2025-26 budget; at least 10% for buyers in Qualified Census Tracts. Income limit about $168,000 in LA County (OC limit not stated in the release). No new 2026-27 appropriation was confirmed. AB 2387 (first-generation expansion) appears to have stalled in committee.
- **Simple version:** The state can pay part of your down payment, and you pay it back with a share of what your home gains in value.
- **Who it affects:** First-generation, first-time buyers under the income limit
- **Source:** https://www.calhfa.ca.gov/about/press/press-releases/2026/pr2026-01-16.htm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Program rules, not a new statute. AB 2387 status (last action committee referral, March 2026) from trackers only.

#### SB 750 (Cortese, 2026): CalHFA credit-enhancement study

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** HELPS (Could lead to cheaper or easier CalHFA loans in the future.)
- **What it does:** Directs a study of credit-enhancement mechanisms at the California Housing Finance Agency (tools that can make loans cheaper or easier to get). It is a study, not a new loan program.
- **Simple version:** The state will study new ways to make home loans easier to get.
- **Who it affects:** Future CalHFA borrowers
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Only the official title was confirmed; study scope and deadline not confirmed.

#### Proposition 1 (Nov 3, 2026): Veterans and Affordable Housing Bond Act of 2026

- **Status:** Projected to pass; NOT yet certified (certification due December 11, 2026)
- **Effective:** Upon certification
- **Impact:** HELPS (Funds down payment help and self-help ownership programs if certified.)
- **What it does:** $10 billion in housing bonds plus $1.25 billion for veterans' home loans, including money for CalHFA down payment help and CalHome/self-help programs. Already covered in the app.
- **Simple version:** The state borrows money to help people get homes, and some of it helps with down payments.
- **Who it affects:** Low- and moderate-income buyers, veterans
- **Source:** https://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Ballot status verified on SoS. Results are early returns only.

#### Proposition 37 (Nov 3, 2026): Loan program for middle-income buyers of qualified new homes

- **Status:** Projected to pass; NOT yet certified (certification due December 11, 2026)
- **Effective:** Upon certification; CalHFA must design the program
- **Impact:** HELPS (Could help middle-income buyers afford new homes if certified and implemented.)
- **What it does:** Lets CalHFA offer loans for part of the price of newly built homes to middle-income buyers. Already covered in the app.
- **Simple version:** The state could lend you part of the price of a brand-new home.
- **Who it affects:** Middle-income buyers of new construction
- **Source:** https://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Ballot status verified on SoS. Results are early returns only.


### Home insurance

#### CDI regulations: Catastrophe Modeling and Net Cost of Reinsurance (Sustainable Insurance Strategy): Wildfire catastrophe models and reinsurance costs in home insurance rates

- **Status:** Catastrophe modeling regulation finalized Dec 13, 2024; reinsurance regulation issued Dec 30, 2024; first rate filing approved Dec 2025
- **Effective:** 2025-01-02
- **Impact:** MIXED (Should bring back insurance availability and shrink the FAIR Plan, but premiums can rise because rates may include modeled fire risk and reinsurance costs.)
- **What it does:** Insurers may now use forward-looking wildfire catastrophe models (Verisk, Karen Clark, Moody's approved in 2025) and the cost of reinsurance in their rates, but only if they commit to write policies in wildfire-distressed areas equal to at least 85% of their statewide market share, growing 5% every two years until they get there. Models must credit home and community mitigation. Mercury and CSAA got the first approvals; by July 2026, 11 insurance groups had committed to grow in California.
- **Simple version:** Insurance companies can charge more based on future fire risk, but in return they have to sell more policies in risky places.
- **Who it affects:** All homeowners and buyers needing home insurance, especially near wildland areas (parts of south and east Orange County)
- **Source:** https://www.insurance.ca.gov/0400-news/0100-press-releases/2024/release065-2024.cfm
- **Checked:** 2026-11-07 | **Verified:** yes

#### AB 226 (Calderon, 2025): FAIR Plan Stability Act

- **Status:** Signed October 9, 2025 (Chapter 473, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** MIXED (Makes it more likely FAIR Plan claims get paid, but borrowing costs could eventually be passed on through insurance costs.)
- **What it does:** With the Insurance Commissioner's approval, the FAIR Plan (the insurer of last resort) can issue state-backed bonds through the IBank, take loans or lines of credit, and spread claim costs over years after a disaster.
- **Simple version:** The backup insurance plan can borrow money so it can pay claims after a big fire.
- **Who it affects:** FAIR Plan policyholders and, indirectly, all homeowners
- **Source:** https://www.insurance.ca.gov/0400-news/0100-press-releases/2025/release066-2025.cfm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Part of a five-bill package (AB 1, AB 226, AB 234, AB 290, SB 525) signed Oct 9, 2025. Effective date assumed Jan 1, 2026; not stated on the page.

#### AB 1 (Connolly, 2025): Home hardening and wildfire mitigation in insurance rules

- **Status:** Signed October 9, 2025
- **Effective:** 2026-01-01
- **Impact:** HELPS (Helps homeowners get insurance credit for fire-safety upgrades.)
- **What it does:** Requires the Department of Insurance to periodically (about every five years) review and possibly update its rules on which home-hardening and community wildfire-mitigation steps insurers must recognize.
- **Simple version:** If you make your home safer from fire, insurance rules have to keep up and give you credit.
- **Who it affects:** Homeowners in wildfire areas
- **Source:** https://www.gov.ca.gov/2025/10/09/governor-newsom-signs-bipartisan-package-of-bills-reforming-californias-insurer-of-last-resort/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed; provision details from CDI release and news summaries.

#### SB 525 (Jones, 2025): FAIR Plan coverage for manufactured homes

- **Status:** Signed October 9, 2025
- **Effective:** 2026-01-01
- **Impact:** HELPS (Gives mobile-home owners, often lower-income, a last-resort insurance option.)
- **What it does:** Adds FAIR Plan coverage for manufactured (mobile) homes.
- **Simple version:** Mobile home owners who can't find insurance can get it from the backup plan.
- **Who it affects:** Manufactured/mobile home owners, a key low-cost ownership option in Orange County
- **Source:** https://www.gov.ca.gov/2025/10/09/governor-newsom-signs-bipartisan-package-of-bills-reforming-californias-insurer-of-last-resort/
- **Checked:** 2026-11-07 | **Verified:** yes

#### SB 429 (2025): Public wildfire catastrophe model

- **Status:** Chaptered (Chapter 541, Statutes of 2025, per CDI)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Adds public scrutiny to the fire-risk models that drive premiums.)
- **What it does:** Sets up the nation's first public wildfire catastrophe model (with Cal Poly Humboldt) so the risk numbers behind insurance rates can be checked against a public benchmark.
- **Simple version:** The state is building its own fire-risk calculator so insurance companies' math can be checked.
- **Who it affects:** All homeowners in fire-risk areas
- **Source:** https://www.insurance.ca.gov/01-consumers/180-climate-change/public-wildfire-model.cfm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Author not confirmed in this research.

#### SB 876 (Padilla, 2026): Disaster Recovery Reform Act

- **Status:** Signed (announced September 29, 2026)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Protects owners' finances after a disaster through faster, fairer claims.)
- **What it does:** Doubles penalties for claim-handling violations during declared emergencies, requires restitution to go directly to policyholders, requires a status report within 15 days when a new adjuster is assigned, requires insurers to offer extended replacement cost and extra living-expense coverage and give updated rebuild cost estimates at new business and renewal, and applies code-upgrade coverage based on when you rebuild. Phased: Jan 1, 2027 and Jan 1, 2028.
- **Simple version:** After a disaster, insurance companies have to pay faster and treat you fairly, or they pay big fines.
- **Who it affects:** All homeowners and renters with property insurance
- **Source:** https://www.insurance.ca.gov/0400-news/0102-alerts/2026/Governor-signs-Commissioner-Lara-and-Sen.cfm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** One news source said Sept 27 and Jan 1, 2028; CDI says signed (release dated Sept 29/30) with phased dates starting Jan 1, 2027.

#### AB 2038 (Harabedian, 2026): Two-year ban on non-renewals after a wildfire

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Keeps fire-area homeowners insured, protecting their mortgage compliance.)
- **What it does:** Extends the post-wildfire moratorium on insurance cancellations and non-renewals in and next to a fire perimeter from one year to two, and lengthens required renewals for total-loss homes.
- **Simple version:** After a big fire, your insurance company can't drop you for two years.
- **Who it affects:** Homeowners in or near declared wildfire areas
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Signing confirmed on gov.ca.gov. Provision details from Assembly Insurance analysis and trade press; final text not read.

#### AB 2724 (Bauer-Kahan, 2026): More ZIP codes count as 'wildfire distressed areas'

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Forces more insurance availability in hard-to-insure neighborhoods.)
- **What it does:** As introduced, lowers the threshold for a 'distressed area' under the Sustainable Insurance Strategy from 15% of homes on the FAIR Plan to 10%, and has CDI review the list. More ZIP codes in the list means insurers using catastrophe models must write more policies there.
- **Simple version:** More neighborhoods get counted as hard-to-insure, so insurance companies must offer more policies there.
- **Who it affects:** Homeowners in high fire-risk ZIP codes with many FAIR Plan policies
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** Signing verified on gov.ca.gov (title 'Insurance: distressed areas'). The 10% threshold comes from the author's page about the introduced bill; final enacted text was not confirmed.

#### AB 1680 (Calderon, 2026): Make It FAIR Act (FAIR Plan oversight)

- **Status:** Signed 2026 (per CDI release dated Sept 30, 2026)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Improves service and claims handling for people stuck on the FAIR Plan.)
- **What it does:** Requires the FAIR Plan to carry out corrective actions from state exams and strengthens its operations, claims handling, financial accountability, and policyholder protections.
- **Simple version:** The backup insurance plan has to fix its problems and treat customers better.
- **Who it affects:** FAIR Plan policyholders
- **Source:** https://www.insurance.ca.gov/0400-news/0100-press-releases/2026/release035-2026.cfm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** CDI release does not state an effective date; Jan 1, 2027 assumed.

#### AB 1795 (Gipson, 2026): Smoke Damage Recovery Act

- **Status:** Signed 2026 (per CDI release dated Sept 30, 2026)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Makes smoke-damage claims more consistent and complete.)
- **What it does:** Sets science-based standards for investigating, testing, and cleaning smoke-damaged homes after wildfires, phased in 2027-2029.
- **Simple version:** If smoke gets into your home, insurance has to follow real rules for testing and cleaning it.
- **Who it affects:** Homeowners near wildfires
- **Source:** https://www.insurance.ca.gov/0400-news/0100-press-releases/2026/release035-2026.cfm
- **Checked:** 2026-11-07 | **Verified:** yes

#### FAIR Plan rate filing (regulatory decision, not a law): FAIR Plan dwelling rate increase

- **Status:** Reported approved at 29.1% average (35.8% requested)
- **Effective:** 2026-10-15
- **Impact:** RESTRICTS (Higher insurance costs raise monthly payments and make qualifying harder.)
- **What it does:** One news source reports the Department of Insurance approved an average 29.1% FAIR Plan increase for new and renewing policies starting October 15, 2026. Not confirmed on a CDI page.
- **Simple version:** The backup fire insurance may cost about 30% more.
- **Who it affects:** Homeowners on the FAIR Plan, often in wildfire areas
- **Source:** https://www.insurance.ca.gov/0400-news/0100-press-releases/
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** Single secondary source; do not publish without confirming on insurance.ca.gov.


### Property tax

#### Proposition 19 (2020): Inherited-home reassessment and base-year transfers for 55+

- **Status:** In effect; no 2026 change (repeal initiative did not make the Nov 2026 ballot)
- **Effective:** 2021-02-16
- **Impact:** MIXED (Frees up homes when seniors downsize, but makes it costlier for families to keep an inherited home as a rental or second home.)
- **What it does:** Owners 55+, severely disabled, or wildfire victims can move their low property-tax base anywhere in California up to three times. Children who inherit a parent's home keep the low tax base only if they move in as their primary home within one year, and only up to the old taxable value plus $1,044,586 (amount for Feb 16, 2025 to Feb 15, 2027); value above that is added. Inherited rentals and second homes are reassessed to market value.
- **Simple version:** Older people can take their low property tax to a new home, but kids who inherit a house pay more tax unless they live in it.
- **Who it affects:** Seniors downsizing; families inheriting homes
- **Source:** https://www.boe.ca.gov/news/2025/nr-25-02.htm
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** The Prop 19 repeal initiative (AG 25-0017) is not on the SoS list of Nov 3, 2026 qualified measures.

#### AB 672 (Caloza, 2026): Community land trust property tax exemption extended

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** HELPS (Keeps community land trust homes, a key low-income ownership path, affordable.)
- **What it does:** Extends the welfare (property tax) exemption for community land trust homes, which was set to expire January 1, 2027, to January 1, 2032. Community land trusts sell homes below market by keeping the land in trust.
- **Simple version:** Groups that sell homes cheaply by keeping the land don't have to pay as much property tax, which keeps those homes cheap.
- **Who it affects:** Buyers of community land trust homes (lower-income)
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** 2032 sunset date from BOE bill analysis and Assembly floor analysis.


### HOA rules

#### AB 2050 (Caloza, 2026): Minimum HOA reserve contributions

- **Status:** Signed September 29, 2026
- **Effective:** 2027-01-01
- **Impact:** MIXED (Higher monthly dues can hurt loan qualification, but better reserves cut the risk of big special assessments and help condos stay mortgage-eligible.)
- **What it does:** HOAs whose reserves are projected to run out must put at least 15% of their gross annual budget into reserves, starting January 1, 2032.
- **Simple version:** HOAs must save money for big repairs, so dues may go up but surprise bills are less likely.
- **Who it affects:** Condo and townhome owners and buyers in HOAs
- **Source:** https://www.gov.ca.gov/2026/09/29/governor-newsom-signs-housing-legislation-cementing-californias-record-progress-to-reduce-unsheltered-homelessness-and-build-more-homes/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** 15%/2032 details and chapter (796) from secondary source.

#### AB 2035 (Dixon, 2026): Easier CC&R amendments for a large senior community (Laguna Woods)

- **Status:** Signed (listed in Sept 30, 2026 legislative update)
- **Effective:** 2027-01-01
- **Impact:** MIXED (Lets the community update outdated rules, but fewer owners can change rules that bind everyone.)
- **What it does:** Lets a court approve CC&R amendments with 37% owner approval (instead of the usual 50%) for qualifying large senior housing developments; analyses name Third Mutual of Laguna Hills (Laguna Woods, Orange County).
- **Simple version:** In one big Orange County senior community, it's easier to change the HOA rules.
- **Who it affects:** Owners and buyers in Laguna Woods' Third Mutual
- **Source:** https://www.gov.ca.gov/2026/09/30/governor-newsom-issues-legislative-update-9-30-2026/
- **Checked:** 2026-11-07 | **Verified:** yes
- **Notes:** Laguna Woods detail from Senate Judiciary analysis.

#### SB 625 (Wahab, 2025): HOAs can't block rebuilding after a disaster

- **Status:** Chaptered (Chapter 548, Statutes of 2025)
- **Effective:** 2026-01-01
- **Impact:** HELPS (Protects owners' ability to rebuild and keep their home after a disaster.)
- **What it does:** Voids CC&R/HOA provisions that would stop an owner from rebuilding a disaster-damaged home that is substantially similar to the original, and sets rules for how HOAs process rebuild applications.
- **Simple version:** If your home burns down, your HOA can't stop you from building it back the same way.
- **Who it affects:** HOA homeowners in disaster areas
- **Source:** https://dre.ca.gov/Newsroom/DRE_Updates/2026_05_06_EOY_Bill_Summaries_2025.html
- **Checked:** 2026-11-07 | **Verified:** yes


### Orange County local rules

#### Local ordinances (Seal Beach, Fullerton, Dana Point): Orange County short-term rental limits

- **Status:** Local actions reported in 2025
- **Effective:** 2025
- **Impact:** RESTRICTS (Removes short-term rental income some buyers use to afford a mortgage (long-term rentals and ADUs are still allowed).)
- **What it does:** Seal Beach adopted an urgency ordinance temporarily banning short-term rentals (May 2025) and Fullerton adopted a temporary moratorium on new ones; Dana Point streamlined permits but caps them and cracks down on unpermitted rentals. Rules vary by city.
- **Simple version:** Some Orange County cities don't let you rent your home to vacation guests, so you can't count on that money to pay the mortgage.
- **Who it affects:** Buyers planning to house-hack with short-term rentals
- **Source:** https://voiceofoc.org/2025/06/another-wave-of-airbnb-regulations-may-soon-come-to-orange-county/
- **Checked:** 2026-11-07 | **Verified:** **NO**
- **Notes:** News reporting (Voice of OC) only; city codes not checked. Current status of the Seal Beach and Fullerton measures not confirmed.
