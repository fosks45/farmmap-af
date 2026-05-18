---
feature: 003-farmmap
phase: 4
document: ip-copyright-assessment
specialist: ip-copyright-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/intake.md + specs/003-farmmap/market-pack/market-decision.md
regimes:
  - Copyright, Designs and Patents Act 1988 (UK)
  - Copyright and Rights in Databases Regulations 1997 (UK)
  - EU Database Directive 96/9/EC (ROI)
  - OpenStreetMap / ODbL licence
  - Mapbox Vector Tiles / MapLibre licence terms
status: conditions-required
---

# IP and Copyright Assessment — Farmmap

## 1. Issues to Assess

Three distinct IP issues arise for Farmmap:

1. yourhonestybox.com data: 336 listings obtained with explicit consent — confirm what written confirmation is needed
2. Farm Retail Association data: source for UK farm shop listings
3. OpenStreetMap tiles: ODbL licence obligations

---

## 2. yourhonestybox.com — 336 Irish/NI Listings

### 2.1 What the Evidence Says

**Intake.md (founder's statement):** "The yourhonestybox.com data was obtained with explicit consent from yourhonestybox.com — this is a permitted data share, not a scrape. The database rights concern raised in the discovery pack conditions is therefore resolved."

**Market-decision.md (amended 2026-05-16):** "RESOLVED — the 336 Irish listings were obtained with explicit consent from yourhonestybox.com. The database rights condition from Phase 1 is closed. Compliance squad to record consent basis in writing before V1 launch."

**PESTEL analysis (L5):** Originally classified as CRITICAL headwind. The market decision has amended its status to resolved, but noted: "Partnership formalisation with yourhonestybox.com (data licence or co-branding agreement) is strongly recommended before V1 launch."

### 2.2 Legal Framework

**Database rights (UK):** Copyright and Rights in Databases Regulations 1997 (SI 1997/3032), implementing EU Database Directive 96/9/EC into UK law. Provides a sui generis database right for databases representing substantial investment in obtaining, verifying, or presenting content. Duration: 15 years from completion or substantial update.

**Database rights (Ireland):** EU Database Directive 96/9/EC, operative in Ireland post-Brexit. Same sui generis protection.

**yourhonestybox.com's database:** The yourhonestybox.com database of honesty box listings represents substantial effort in collection, curation, and verification of location data across Ireland and Northern Ireland. It almost certainly qualifies for sui generis database right protection under both UK and Irish law.

### 2.3 The Consent — What It Does and Does Not Authorise

The "explicit consent" from yourhonestybox.com is the consent of the **organisation** (the database rights holder) to share the data with Farmmap. This is the critical consent for database rights purposes: a rights holder can authorise extraction of a substantial part of their database if they choose to do so.

**However, consent must be confirmed in writing before these listings are served publicly.** The following questions remain unanswered:

**Question 1: Is the consent recorded in writing?**

Verbal consent, or consent given via informal channel (email, text message), is legally valid in principle but:
- Is difficult to evidence if yourhonestybox.com later disputes it
- May not specify the scope or terms of the permitted use
- Does not protect against a change of mind if yourhonestybox.com decides to assert database rights

An email exchange is sufficient written evidence if it clearly records: (a) who consented, (b) what they consented to, (c) on what date, and (d) on what terms (if any).

**Question 2: What are the terms of the consent?**

"Explicit consent" to share data does not automatically mean:
- Commercial use is permitted (serving listings as part of a monetised subscription platform)
- The data can be used indefinitely without review
- Attribution requirements are waived
- The consent cannot be withdrawn

If the consent was given informally without specifying commercial terms, Farmmap may be operating on a consent that could be challenged if yourhonestybox.com seeks to commercialise their own data or objects to Farmmap's paid tiers.

**Question 3: Does yourhonestybox.com hold database rights over all 336 listings?**

If individual listing subjects submitted their own data directly to yourhonestybox.com, those individuals contributed the underlying facts. The database right belongs to the database maker (yourhonestybox.com) not to the individual contributors. yourhonestybox.com can therefore consent to the data use without needing to obtain consent from each of the 336 listing operators individually.

However, if the listings include personal data of those farm operators (names, contact details, precise locations), the GDPR assessment applies in parallel (see GDPR assessment C3).

### 2.4 Required Actions Before V1 Launch

**The compliance squad's determination:**

The consent is acknowledged as having occurred. However, to protect Farmmap from a future database rights dispute, and to meet the market-decision.md condition, the following written confirmation is required before the 336 yourhonestybox.com listings are served publicly:

**Minimum requirement (BLOCKER — written confirmation):**

Obtain written confirmation (email is acceptable) from yourhonestybox.com confirming:
1. That yourhonestybox.com consents to Farmmap using the 336 listings in Farmmap's directory
2. That this consent includes use in the commercial directory (free tier and paid tiers)
3. The date of consent
4. Whether attribution to yourhonestybox.com is required (and if so, in what form)
5. Whether the consent is indefinite or subject to review

**Recommended (strong recommendation — not blocker):**

Execute a formal data licence agreement covering:
- The scope of data licensed (the 336 listings as at [date])
- The permitted uses (display in Farmmap directory, commercial tiers)
- Attribution requirements
- Exclusivity terms (or non-exclusivity confirmation)
- Process for adding future yourhonestybox.com listings to Farmmap
- Process for updating or correcting listings
- Termination provisions

The market-decision.md recommendation that yourhonestybox.com be treated as a **partner** rather than a threat is the correct strategic frame. A formal licence agreement converts a verbal consent into a structural commercial relationship. It also creates the foundation for the co-branding and partnership approach recommended in the market-decision.md conditions.

### 2.5 If Written Confirmation Cannot Be Obtained

If yourhonestybox.com cannot or will not confirm the consent in writing before V1 launch, the options are:
1. **Do not serve the 336 listings publicly** until written confirmation is obtained
2. **Independently re-verify each listing** from public sources (removing any database right claim by replacing the yourhonestybox.com data with independently sourced data)
3. **Launch V1 without the Irish seed data** and rebuild the Irish listings independently

Option 1 is the safest interim position if written confirmation is merely delayed. Option 2 or 3 are necessary if confirmation cannot be obtained at all.

---

## 3. Farm Retail Association Data

### 3.1 Nature of the FRA Data

The intake confirms "Farm Retail Association (farm shops)" as a seed data source for UK farm shop listings. The FRA is a trade association with a membership directory.

### 3.2 FRA Database Rights

The FRA's membership directory is a database representing substantial investment in collecting and maintaining member data. The FRA holds database rights to this compiled directory.

### 3.3 Assessment

The same database rights analysis applies as for yourhonestybox.com. However, the PESTEL analysis and market-decision.md identify FRA partnership as "the single highest-leverage action for Bronze acquisition." The FRA relationship should be structured as a formal partnership agreement that includes data licensing terms.

**Key difference from yourhonestybox.com:** The FRA is a trade association that exists to promote farm retail. A directory that increases visibility for its members serves the FRA's mission. FRA is more likely to provide formal consent / partnership than a commercial operator.

**Required action (BLOCKER — written confirmation):**

Written confirmation (email or formal agreement) from the FRA that:
1. FRA consents to use of member listing data in Farmmap's directory
2. The nature of attribution required (FRA partner badge on FRA-member listings?)
3. Update process (FRA provides updated member data at regular intervals?)

**Recommended:** The FRA partnership agreement described in market-decision.md should include explicit data licensing provisions. This is a partnership document, not just a compliance document.

---

## 4. OpenStreetMap Tiles and ODbL Licence

### 4.1 OpenStreetMap and ODbL

OpenStreetMap data is licenced under the **Open Database Licence (ODbL) v1.0**. MapLibre GL JS (the confirmed map technology) renders map tiles that may use OpenStreetMap-derived data.

The ODbL requires:
1. **Attribution:** "© OpenStreetMap contributors" must be displayed on any map using OSM data
2. **Share-alike:** Any database derived from OSM data must be released under the same ODbL licence (this applies to the underlying map data, not to Farmmap's own listing data)
3. **No additional restrictions:** Farmmap cannot add restrictions on top of OSM data that would prevent others from using it

### 4.2 Farmmap's Listing Data vs. OSM Base Map

Farmmap's listing data (farm shop locations, names, descriptions) is Farmmap's own database. Placing listing pins on an OSM base map does not cause the listing data to be subject to ODbL share-alike. The ODbL share-alike applies only to derivations of the OSM map data itself.

### 4.3 Implementation Requirements

**Attribution requirement (MANDATORY):**
- The map interface must display "© OpenStreetMap contributors" and a link to the OpenStreetMap copyright page
- This attribution must be visible on all rendered map views
- MapLibre GL JS includes a built-in attribution control — this must not be disabled or hidden

**Tile provider attribution:**
If using a tile provider (e.g., Stadia Maps, OpenMapTiles, Carto) that builds on OSM, that provider's additional attribution requirements must also be observed. The tile provider's terms of service must be reviewed during the architecture phase.

### 4.4 MapLibre GL JS Licence

MapLibre GL JS is licenced under the BSD 2-Clause licence, which requires:
- Copyright notice retention
- No use of project name for endorsement without permission

BSD 2-Clause is a permissive licence — no share-alike requirement. Farmmap's use of MapLibre GL JS creates no licence obligations beyond displaying the copyright notice in the source code.

---

## 5. User-Uploaded Content — IP Ownership

Farm shop owners upload photos (F4, F13) to Farmmap. The IP position:

**Ownership:** The farm shop owner retains copyright in photos they take and upload. Farmmap does not own the copyright.

**Required licence from owner:** Farmmap needs a licence from the owner to:
- Display the photos on the platform
- Process the photos (resize, format-convert for web optimisation)
- Retain photos after the owner cancels (or the licence terminates on cancellation)

**Condition:** The Terms of Service must include a licence clause: the owner grants Farmmap a non-exclusive, royalty-free licence to display, process, and retain uploaded photos for the purpose of operating the Farmmap service. On account cancellation, photos are deleted within a specified period (30 days recommended).

---

## 6. Consumer Review Content — IP Ownership

Consumer reviews are creative works and may attract copyright (for original, creative reviews of sufficient length). The IP position:

- The consumer reviewer retains copyright in their review text
- Farmmap needs a licence to display and moderate reviews
- The Terms of Service must grant Farmmap a licence to display, moderate, and retain reviews

**Recommended terms:** Farmmap's ToS should include: reviewer grants Farmmap a perpetual (for platform continuity), non-exclusive, royalty-free, worldwide licence to display and moderate their review. The reviewer retains copyright.

---

## 7. Conditions

### C1 — Written Confirmation from yourhonestybox.com (BLOCKER for serving the 336 listings publicly)

Obtain written confirmation from yourhonestybox.com confirming: consent to use the 336 listings in Farmmap's directory, scope of permitted commercial use, attribution requirements, and date of consent. A formal data licence agreement is strongly recommended.

### C2 — Written Confirmation from FRA (BLOCKER for serving FRA-sourced listings)

Obtain written confirmation from the FRA confirming consent to use member listing data, attribution requirements, and update process. Include data licensing provisions in the FRA partnership agreement.

### C3 — OSM Attribution Visible on All Map Views (BLOCKER for V1 launch — map)

MapLibre GL JS attribution control must be enabled and visible on all rendered map views. Must display "© OpenStreetMap contributors" with link to copyright page.

### C4 — Photo and Review Licence Clauses in Terms of Service (BLOCKER for V1 launch)

ToS must include: (a) licence from listing owners for uploaded photos; (b) licence from consumers for review content; (c) photo deletion policy on cancellation.

---

## 8. Overall Assessment

**Status: CONDITIONS REQUIRED**

The yourhonestybox.com written consent condition is the most significant outstanding item. The consent has occurred; it has not been documented. This must be resolved before V1 launch. The FRA partnership should include data licensing terms. The OSM attribution requirement is a minor but mandatory implementation detail. ToS licence clauses for user-uploaded content are standard and can be drafted as part of the overall Terms of Service preparation.

**Human co-sign required:** The yourhonestybox.com written consent confirmation must be confirmed by a human (founder/DPO) before the 336 listings go live. This is a gate — no agent may approve these listings without human sign-off.

---

*Produced by: compliance-squad-lead (invoking ip-copyright-specialist)*
*Authority: specs/003-farmmap/spec.md + intake.md + market-decision.md*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
