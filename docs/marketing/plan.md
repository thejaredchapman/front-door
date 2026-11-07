# Front Door: marketing plan

## The one-liner
**Front Door is free, plain-language help for working families buying a home in California, starting with Orange County.**
Answer a few questions and see the loans and down payment help that fit you, in six languages (English, Español, Tiếng Việt, 中文, Français, العربية), with no sign-up.

## Who it's for (and what each group needs to hear)

| Audience | Their worry | What to tell them |
| --- | --- | --- |
| Working families earning under ~$150K | "People like us don't buy here." | "It's not just you, and help exists. In OC, $125K for a family of four counts as low income." |
| Teachers & school staff | "I serve this community but can't live in it." | "School staff have some of the best help: a $7,500 grant, no-PMI loans, and student-loan relief." |
| Nurses, CNAs, health workers | "I work nights. I don't have time to research." | "3 minutes on your phone gives you a plan and the emails to send." |
| Firefighters, police, public workers | "There's no hero program here." | "True, there isn't one in California, but there are options you can stack. We show you which." |
| Spanish, Vietnamese, Chinese, French, Arabic speakers | "These sites aren't for me." | "Front Door speaks your language, and explains every step simply." |
| Housing counselors & nonprofits | "Clients come in unprepared." | "Clients arrive with a printed readiness packet." |
| Employers, donors, Habitat supporters | "How can I help?" | "Fund a neighbor's down payment through a community fund." |

## Taglines (pick one)
1. **Your way home starts here.**
2. **It's not just you. And there's help.**
3. **Find the help that fits your family.**
4. **Homeownership, in plain words.**

## Channels (free or low-cost first)

**Partners (highest trust, lowest cost)**
- Habitat for Humanity OC: orientations (907 attendees last year), ReStores, newsletter. Ask to link Front Door from the "Review qualifications" page.
- NeighborWorks OC and other HUD-approved counselors: offer the readiness packet as homework before the first appointment.
- School districts, SchoolsFirst FCU, hospital HR (Kaiser, Providence, Hoag, UCI Health, CHOC), fire and police associations, city HR: a one-page flyer plus a QR code for benefits fairs and break rooms.
- Libraries, churches, community colleges, VITA tax sites (people deciding what to do with a refund).

**Community media**
- Spanish: Univision/Telemundo local segments, Excélsior, community radio.
- **Vietnamese:** Orange County has one of the largest Vietnamese communities in the U.S. (Little Saigon). Front Door now speaks Tiếng Việt; pitch Người Việt, Viễn Đông, SBTN, and Little Saigon Radio, and partner with Vietnamese-speaking HUD counselors.
- Korean and Chinese community papers in Irvine, Fullerton, and Buena Park.

**Social**
- Short videos (Instagram Reels, TikTok, YouTube Shorts): "Five buyers, one market" is a ready-made series of five videos, one family each.
- Facebook groups for OC renters, school employees, and nurses.
- Nextdoor posts in Santa Ana, Anaheim, Garden Grove, and Westminster.

**Moments to plan around**
- **Jan 1, 2027:** new starter-home, townhome, and insurance laws take effect ("What's new for buyers in 2027").
- **Tax season (Feb–Apr):** "Put part of your refund toward a home" (EITC/CalEITC + IRS Form 8888).
- **Dream For All's next round:** be the place people learn it opened.
- **Rate drops:** the daily check already writes the news item.

## Ready-to-post copy

**English (social)**
> A typical Orange County home costs over $1.3 million. A teacher and a nurse together can afford about $700K. It's not just you.
> Front Door shows you the loans and down payment help that fit your family. Free, no sign-up, 3 minutes. 🏠 [link]

**Español**
> ¿Crees que comprar casa en Orange County es imposible? No eres el único, y hay ayuda.
> Front Door te muestra los préstamos y la ayuda para el pago inicial que te corresponden. Gratis, sin registrarte, en 3 minutos. 🏠 [link]

**Flyer headline**
> **Hi! Let's find your way home.**
> Free help for nurses, teachers, firefighters, public workers, and every working family.
> Scan to start → [QR]

## Hackathon pitch (60 seconds)
1. **Problem:** In OC, homes cost 10× income. Three of five households, including a teacher and a nurse earning $210K, can't afford the typical home.
2. **What we built:** a 3-minute quiz that turns a family's situation into a plan: matched programs (status-labeled), the cheapest lenders that accept their help, a calendar, ready-to-send emails, and a printable readiness packet, in 6 languages.
3. **Lane 3, Fund it:** the gap calculator balances a Habitat home to $0, plus a community down payment fund that turns neighbors and employers into funders.
4. **Trust:** every fact is cited; `verify:docs` checks the app against the source PDFs; a daily Haiku check flags program changes for human review.
5. **Cost:** $0 per visitor.

## How to measure (privacy-first)
- Count visits, quiz starts and finishes, packet prints, and email clicks with a cookieless tool (e.g., Plausible or Vercel Web Analytics). Never send quiz answers anywhere.
- Partner metric: how many clients arrive at counseling with a packet.
- Outcome metric (with partners): applications to Habitat, city loans, and CalHFA programs.

## Before launch
- [ ] Trademark and domain check for "Front Door" (common phrase; consider frontdoor**ca**.org or similar).
- [ ] Run `npm run translate` (now includes Vietnamese) and have native speakers review Spanish and Vietnamese.
- [ ] Turn on the daily check (GitHub secret) and review the first pull request.
- [ ] Get Habitat OC's sign-off on how their program is described.
- [ ] Add a clear "not financial advice" footer (already present) and a contact for corrections.
