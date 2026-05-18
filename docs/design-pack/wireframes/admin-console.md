---
feature: 003-farmmap
phase: 6
document: wireframes-admin-console
squad: ux-design
produced_by: ux-design-lead
produced_at: 2026-05-17T00:00:00Z
---

# Wireframes — Admin Console

Desktop layouts (1280px+ CSS width). The admin console is a productivity tool;
speed and batch operations are the primary design goals.

---

## Admin Home — Queue Counts and System Status

```
┌────────────────────────────────────────────────────────────────────┐
│  🌿 FARMMAP ADMIN                       [Alex Kim ▼]  [← Log out] │
├──────────────┬─────────────────────────────────────────────────────┤
│              │                                                       │
│  📋 Listings │  Good morning, Alex.  Today: Mon 17 May 2026        │
│  📸 Photos   │                                                       │
│  ★ Reviews   │  ── Action required ─────────────────────────────   │
│  ⚑ Reports  │                                                       │
│  👥 Users    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  💳 Subs     │  │    3     │ │    12    │ │    5     │ │   2   │ │
│  📋 Audit    │  │ Listings │ │  Photos  │ │ Reviews  │ │Reports│ │
│              │  │  queue   │ │  queue   │ │  queue   │ │       │ │
│  ──────────  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│  🔵 Farmmap  │                                                       │
│  ○ TractorMap│  ── Platform health ──────────────────────────────  │
│    (future)  │                                                       │
│              │  Active listings:       953  ✓                       │
│              │  Claimed listings:       47  ✓                       │
│              │  Bronze subscribers:      9  ✓                       │
│              │  Silver subscribers:      0  (Silver not live)       │
│              │  Last sitemap generated: 2h ago  ✓                   │
│              │                                                       │
└──────────────┴─────────────────────────────────────────────────────┘
```

---

## Listing Moderation Queue

```
┌──────────────┬─────────────────────────────────────────────────────┐
│  [nav]       │  Listing queue (3 pending)                          │
│              │  [Search listings...]                 [Filters ▼]  │
│              │                                                       │
│              │  ┌──┬──────────────────────┬─────────┬────┬────────┐│
│              │  │  │ Name                 │ County  │Age │Actions ││
│              │  ├──┼──────────────────────┼─────────┼────┼────────┤│
│              │  │☐ │ Croft Farm Shop      │ Cheshire│ 2d │[Quick] ││
│              │  │  │ Farm Shop            │ England │    │        ││
│              │  ├──┼──────────────────────┼─────────┼────┼────────┤│
│              │  │☐ │ Burren HB (C. Clare) │ Co.Clare│ 1d │[Quick] ││
│              │  │  │ Honesty Box          │ Ireland │    │        ││
│              │  ├──┼──────────────────────┼─────────┼────┼────────┤│
│              │  │☐ │ Pembrey Roadside     │Carmarthn│ 4h │[Quick] ││
│              │  │  │ Roadside Stand       │ Wales   │    │        ││
│              │  └──┴──────────────────────┴─────────┴────┴────────┘│
│              │                                                       │
│              │  [Select all]  [Bulk approve selected]               │
└──────────────┴─────────────────────────────────────────────────────┘
```

### Listing Detail — Admin Review

```
┌──────────────┬─────────────────────────────────────────────────────┐
│  [nav]       │  ← Back to queue                                    │
│              │  Croft Farm Shop — Review submission                 │
│              │                                                       │
│              │  ┌────────────────────┐  ┌──────────────────────┐  │
│              │  │  Submitted data    │  │  Seeded / existing   │  │
│              │  ├────────────────────┤  ├──────────────────────┤  │
│              │  │ Name: Croft Farm   │  │ Name: Croft Farm     │  │
│              │  │       Shop         │  │       Shop           │  │
│              │  │ Type: Farm shop    │  │ Type: Farm shop      │  │
│              │  │ Addr: Mill Lane,   │  │ Addr: Mill Ln,       │  │ ← Diff highlighted
│              │  │       Knutsford    │  │       Knutsford      │  │
│              │  │ PCode: WA16 0AA    │  │ PCode: WA16 0AA      │  │
│              │  │ Phone: 01565 ...   │  │ Phone: —             │  │ ← New info
│              │  └────────────────────┘  └──────────────────────┘  │
│              │                                                       │
│              │  Map preview:                                        │
│              │  ┌──────────────────────────────┐                   │
│              │  │  [mini map showing pin loc.]  │                   │
│              │  └──────────────────────────────┘                   │
│              │                                                       │
│              │  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │
│              │  │  ✓ Approve │ │ ✗ Reject   │ │ ? Request info │  │
│              │  └────────────┘ └────────────┘ └────────────────┘  │
│              │                                                       │
│              │  Reject reason: (required if rejecting)             │
│              │  ┌──────────────────────────────┐                   │
│              │  │                              │                   │
│              │  └──────────────────────────────┘                   │
└──────────────┴─────────────────────────────────────────────────────┘
```

---

## Photo Moderation Queue — Bulk Review

```
┌──────────────┬─────────────────────────────────────────────────────┐
│  [nav]       │  Photo queue (12 pending)                            │
│              │  [Approve selected (0)]  [Reject selected]           │
│              │                                                       │
│              │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│              │  │  ☐   │ │  ☐   │ │  ☑   │ │  ☐   │ │  ☐   │    │
│              │  │[img] │ │[img] │ │[img] │ │[img] │ │[img] │    │
│              │  │Croft │ │Croft │ │Burren│ │Glen  │ │Glen  │    │
│              │  │FS   │ │FS   │ │HB   │ │HB   │ │HB   │    │
│              │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│              │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│              │  │  ☐   │ │  ☐   │ │  ☐   │ │  ☐   │ │  ☐   │    │
│              │  │[img] │ │[img] │ │[img] │ │[img] │ │[img] │    │
│              │  │Pemb  │ │Pemb  │ │Hgrvs │ │Hgrvs │ │Hgrvs │    │
│              │  │RS   │ │RS   │ │FS   │ │FS   │ │FS   │    │
│              │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘    │
│              │                                                       │
│              │  [Select all]  [Approve selected (1)]               │
│              │                                                       │
│              │  Reject reason (required for reject action):        │
│              │  ┌──────────────────────────────────────────────┐  │
│              │  │ ▼ Not relevant to listing                    │  │
│              │  └──────────────────────────────────────────────┘  │
└──────────────┴─────────────────────────────────────────────────────┘
```

**Single photo review (hover/click to expand from grid):**
```
┌──────────────────────────────────────────────────────┐
│  Photo from: Burren HB, Co. Clare                    │
│  Submitted by: brigid@burrencooperative.ie           │
│  Date: 3 hours ago                                   │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │   [FULL SIZE PHOTO PREVIEW]                   │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                       │
│  [✓ Approve]  [✗ Reject with reason]  [← Back]     │
└──────────────────────────────────────────────────────┘
```

---

## Reported Content Triage Queue

```
┌──────────────┬─────────────────────────────────────────────────────┐
│  [nav]       │  Reported content (2 pending)                        │
│              │                                                       │
│              │  ┌──┬──────────────────────┬────────┬──────────────┐│
│              │  │  │ Content              │ Severity│Actions       ││
│              │  ├──┼──────────────────────┼────────┼──────────────┤│
│              │  │  │ Review on Croft FS  │ 🔴 SPAM │[View][Dismiss]││
│              │  │  │ "Visit this link..." │        │[Remove]       ││
│              │  ├──┼──────────────────────┼────────┼──────────────┤│
│              │  │  │ Photo on Glen HB     │ 🟡 INCRT│[View][Dismiss]││
│              │  │  │ "Wrong photo"        │        │[Edit][Remove] ││
│              │  └──┴──────────────────────┴────────┴──────────────┘│
│              │                                                       │
│              │  Severity: 🔴 Illegal/Spam · 🟡 Incorrect · 🟢 Minor│
└──────────────┴─────────────────────────────────────────────────────┘
```

---

*Produced by: ux-design-lead | squad: ux-design*
*Phase: 6*
