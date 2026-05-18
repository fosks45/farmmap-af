---
feature: 003-farmmap
phase: 4
document: food-safety-allergen-assessment
specialist: food-safety-specialist
produced_by: compliance-squad-lead
produced_at: 2026-05-16T00:00:00Z
authority: specs/003-farmmap/spec.md + specs/003-farmmap/market-pack/pestel-analysis.md
regimes:
  - Food Information (Amendment) (England) Regulations 2021 — "Natasha's Law" (UK)
  - Food Information Regulations 2014 (UK)
  - EU Regulation 1169/2011 (Food Information to Consumers) — ROI
  - Food Safety and Hygiene (England) Regulations 2013 + equivalents
  - Food Safety Authority of Ireland Act 1998 (ROI)
  - Food Standards Agency Guidance on Online Food Marketplaces 2022
status: conditions-required
human-co-sign-required: true
---

# Food Safety and Allergen Compliance Assessment — Farmmap

## 1. Scope

This assessment addresses:
1. Natasha's Law allergen labelling requirements for Farmmap's Silver/Gold marketplace
2. The platform liability question under food safety legislation
3. Food business registration verification obligations
4. ROI (EU Regulation 1169/2011) equivalence

---

## 2. Natasha's Law — The 14 Regulated Allergens

### 2.1 Legislative Basis

**UK:** Food Information (Amendment) (England) Regulations 2021 (Natasha's Law), amending the Food Information Regulations 2014. Equivalent Scottish, Welsh, and Northern Irish regulations are in force. Applies to pre-packed for direct sale (PPDS) food.

**ROI:** EU Regulation 1169/2011 on the provision of food information to consumers, as transposed into Irish law. The 14 allergens are identical under both UK and EU regimes. ROI-specific guidance is provided by the Food Safety Authority of Ireland (FSAI).

### 2.2 The 14 Regulated Allergens

The spec (F8, F13) correctly lists all 14. Confirmed for compliance purposes:

| # | Allergen | Notes |
|---|---|---|
| 1 | Celery | Including celery stalks, leaves, seeds, root |
| 2 | Cereals containing gluten | Wheat, rye, barley, oats, spelt, kamut; includes flour, flakes, groats |
| 3 | Crustaceans | Including prawns, crab, lobster, crayfish |
| 4 | Eggs | Including egg products |
| 5 | Fish | Including fish products, fish sauce |
| 6 | Lupin | Including lupin flour and seeds |
| 7 | Milk | Including lactose, whey, casein, dairy products |
| 8 | Molluscs | Including mussels, clams, oysters, squid, snails |
| 9 | Mustard | Including the plant, seeds, powder |
| 10 | Peanuts | Including peanut oil, groundnut |
| 11 | Sesame | Including sesame oil, tahini |
| 12 | Soybeans | Including soy, tofu, tempeh, edamame |
| 13 | Sulphur dioxide and sulphites | At concentrations above 10mg/kg or 10mg/litre |
| 14 | Tree nuts | Almonds, hazelnuts, walnuts, cashews, pecans, pistachios, macadamia nuts, Brazil nuts — each subtype should be specified |

The spec is correct. All 14 must be present as structured fields in the Silver/Gold product catalogue.

### 2.3 Display Format Requirements

For online food sales (distance selling), EU Regulation 1169/2011 Article 14 and UK Food Information Regulations 2014 (as amended) require that allergen information for non-prepacked foods sold at a distance:
- Must be available before the purchase is concluded (before checkout)
- Must be provided in writing (displayed on the listing/product page)
- Must be the same information as would be provided if the food were sold in-person

**For Farmmap's Silver/Gold product pages, this means:**
- Allergen information must be displayed on the product detail page before the consumer adds to basket
- The display must be prominent — not hidden behind a "more info" link that requires an additional click to access
- "Contains: [allergen list]" format is acceptable
- "May contain" (cross-contamination risk) must be shown separately from "contains"

The spec (F8/F13) requires allergen field completion as a gate for the purchasable toggle. This satisfies the legislative requirement.

---

## 3. Platform Liability Question — REQUIRES HUMAN LEGAL REVIEW

### 3.1 The Question

Who bears legal responsibility if a consumer suffers an allergic reaction due to incorrect allergen information on a Farmmap product listing?

### 3.2 The Legal Framework

**UK position:**

The Food Business Operator (FBO) — the farm shop — bears primary legal responsibility for food safety and allergen accuracy. Under the Food Safety Act 1990 (s.14), it is an offence to sell food not of the nature, substance, or quality demanded by the consumer. Under the Food Information Regulations 2014, the FBO is responsible for the accuracy of allergen information.

Farmmap, as a platform operator, is not the FBO. The shop is the merchant of record. Farmmap does not prepare, handle, or supply the food.

**However:** Farmmap provides the technical mechanism by which allergen information is presented to the consumer. If Farmmap's platform design:
- Makes it technically possible to serve allergen-incomplete product listings to consumers
- Displays allergen information in a format that is misleading
- Allows an FBO to bypass the allergen-gating mechanism

...then Farmmap could face civil liability in negligence for facilitating the harm, even if criminal liability rests with the FBO.

**FSA Guidance (Online Food Marketplaces, 2022):** The FSA guidance does not impose statutory liability on platforms for allergen errors. However, it states that platforms "should ensure that food businesses they host are clearly aware of their allergen information obligations" and "should not make it difficult for businesses to display allergen information accurately." Non-compliance with FSA guidance does not create criminal liability but is evidence of failing to take reasonable steps.

**ROI position (FSAI):**

The Food Safety Authority of Ireland Act 1998 and EU Regulation 1169/2011 place the legal obligation on the FBO. The FSAI has not (as of 2026) taken enforcement action against a platform operator for an FBO's allergen failure. However, the legal framework allows civil liability in tort.

### 3.3 Assessment: Three Key Liability Reducers

The spec's design already incorporates the most important liability reducers:

1. **Allergen gating (F8/F13):** Products cannot be set to purchasable without completing all 14 allergen fields. This prevents the most obvious failure mode (selling food with no allergen information at all).

2. **Shop is merchant of record:** Consumer's contract is with the shop, not Farmmap. Farmmap's ToS should reinforce this and make clear that the shop operator warrants the accuracy of allergen information.

3. **Platform disclaimer on product pages:** Product pages should display a clear notice: "Allergen information is provided by [Shop Name]. Please contact the shop directly if you have severe allergies or require confirmation of allergen status before purchase."

### 3.4 HUMAN LEGAL REVIEW REQUIRED

The allergen liability question — specifically whether Farmmap has any civil liability in negligence for facilitating a food sale where the shop's allergen information is inaccurate — requires human legal review before the Silver/Gold marketplace launches. This cannot be resolved by the compliance squad alone. The scenarios requiring legal opinion:

- A consumer suffers a severe allergic reaction to a product where the shop's Farmmap listing incorrectly stated the allergen was not present
- The shop has declared allergens in good faith but incorrectly (not an omission — an error)
- The shop's listing complied with the 14-field requirement but used the wrong subcategory (e.g., listed "nuts" without specifying tree nut subtype)

The legal opinion should address: platform liability in negligence, whether the ToS allergen warranty clause adequately protects Farmmap, and whether any insurance product is appropriate (product liability insurance for platform operators).

---

## 4. Food Business Registration Verification

### 4.1 The Requirement

Under UK and Irish food hygiene legislation, all food businesses selling food to the public (including online) must be registered with their local authority (or relevant competent authority). There is no national public database of food business registrations.

### 4.2 Farmmap's Obligation

**For V1/V2 (directory and display only):** No obligation to verify food business registration. The directory is informational.

**For V3 Silver/Gold (online food sales):** The FSA guidance ("Online Food Marketplaces," 2022) states platforms should take reasonable steps to ensure hosted vendors are registered and compliant food businesses.

Farmmap cannot independently verify food business registrations (no national database exists). What Farmmap can and must do:
- Require Silver/Gold applicants to provide their food business registration number (or equivalent) as part of the Stripe Connect onboarding
- Include a ToS declaration that the operator warrants they are a registered food business
- Make misrepresentation of registration status grounds for immediate account suspension

This is the PESTEL analysis (L2) recommendation, and it is the proportionate response to the FSA guidance.

### 4.3 Northern Ireland Specifics

Northern Ireland food businesses must register with their local council under EU Regulation 852/2004 (retained in NI law under the Windsor Framework). The same self-declaration approach applies.

---

## 5. Perishable Food and Consumer Returns

As established in the consumer rights assessment, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 provides an explicit exemption from the 14-day withdrawal right for goods that are liable to deteriorate or expire rapidly. This covers fresh farm produce.

**Farmmap's return policy for food orders (required in ToS):**
- Perishable food items: no return or refund right once dispatched, except in cases of food safety failure (wrong item, contaminated product)
- Non-perishable food (preserves, honey, bottled goods, packaged meats): 14-day return right applies
- Food safety failure: full refund to consumer; shop operator responsible; Farmmap's role is to facilitate the refund via Stripe

**Product tagging requirement:** The product catalogue must require shop operators to tag each product as perishable or non-perishable to determine the applicable returns policy.

---

## 6. Conditions

### C1 — All 14 Allergen Fields Mandatory Before Purchasable Toggle (CONFIRMED IN SPEC — verify in build)

The spec confirms this requirement. The build phase must verify it is implemented correctly and that partial allergen completion (completing some but not all 14 fields) blocks the purchasable toggle.

### C2 — Allergen Display on Product Pages (BLOCKER for V3 launch)

Allergen information must be displayed prominently on Silver/Gold product pages before the consumer adds to basket. The architecture and design pack must specify the allergen display format and placement.

### C3 — Allergen Liability Legal Opinion (HUMAN CO-SIGN — BLOCKER for V3 launch)

A human legal review of Farmmap's allergen liability position is required before Silver/Gold marketplace launches. The review should address: platform liability in negligence, ToS allergen warranty clause adequacy, and insurance requirements.

### C4 — Food Business Registration Declaration in Silver/Gold Onboarding (BLOCKER for V3 launch)

Silver/Gold onboarding must include a mandatory food business registration number field and a ToS declaration that the operator warrants they are a registered and compliant food business.

### C5 — Perishable/Non-Perishable Product Tagging (BLOCKER for V3 launch)

The product catalogue must require perishable/non-perishable tagging to determine the applicable consumer returns policy.

### C6 — Platform Disclaimer on Product Pages (BLOCKER for V3 launch)

Product pages must display: "Allergen information is provided by [Shop Name]. If you have severe allergies, please contact the shop directly to confirm allergen status before placing an order."

### C7 — FSA and FSAI Compliance Statement

Farmmap's Terms of Service and Food Safety Policy must reference compliance with FSA guidance on online food marketplaces (2022) and FSAI equivalent guidance for ROI.

---

## 7. Overall Assessment

**Status: CONDITIONS REQUIRED — HUMAN CO-SIGN REQUIRED FOR ALLERGEN LIABILITY QUESTION**

The spec has correctly identified Natasha's Law compliance as a requirement and has built the 14-allergen mandatory field system into the product design. The conditions are primarily about display format, ToS drafting, food business registration verification, and the human legal review.

The allergen liability question is the one issue in this assessment that requires human legal input before V3 launch. The platform liability question in food safety has not been litigated in the UK in a marketplace context at scale, and legal opinion is necessary before Farmmap accepts this exposure.

---

*Produced by: compliance-squad-lead (invoking food-safety-specialist)*
*Authority: specs/003-farmmap/spec.md + pestel-analysis.md + FSA guidance*
*Feeds: specs/003-farmmap/compliance-pack/compliance-decision.md*
