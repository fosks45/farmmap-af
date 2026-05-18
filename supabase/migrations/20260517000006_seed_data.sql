-- Migration 006: Seed Data
-- Feature: 003-farmmap
-- Authority: specs/003-farmmap/plan.md (T-008, T-011)
-- ADRs: ADR-0003

-- ============================================================
-- UP
-- ============================================================

-- ============================================================
-- Insert farmmap.co.uk directory record
-- ============================================================
INSERT INTO directories (
  id,
  name,
  slug,
  domain,
  listing_types,
  product_categories,
  brand_config,
  commission_config,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Farmmap',
  'farmmap',
  'farmmap.co.uk',
  '[
    {"key": "farm_shop", "label": "Farm Shop", "pin_style": "circle", "pin_colour": "#2D6A4F"},
    {"key": "honesty_box", "label": "Honesty Box", "pin_style": "square", "pin_colour": "#D4A017"},
    {"key": "farm_gate_stall", "label": "Farm Gate Stall", "pin_style": "diamond", "pin_colour": "#C0392B"},
    {"key": "roadside_stand", "label": "Roadside Stand", "pin_style": "triangle", "pin_colour": "#6C3483"}
  ]'::jsonb,
  '[
    {"key": "vegetables", "label": "Vegetables"},
    {"key": "fruit", "label": "Fruit"},
    {"key": "meat", "label": "Meat & Poultry"},
    {"key": "dairy", "label": "Dairy & Eggs"},
    {"key": "baked_goods", "label": "Baked Goods"},
    {"key": "honey_preserves", "label": "Honey & Preserves"},
    {"key": "flowers", "label": "Flowers & Plants"},
    {"key": "drinks", "label": "Drinks & Juices"},
    {"key": "general", "label": "General Produce"}
  ]'::jsonb,
  '{
    "primary_colour": "#2D6A4F",
    "logo_url": "/images/farmmap-logo.svg",
    "meta_title_suffix": "| Farmmap"
  }'::jsonb,
  '{
    "silver": {"rate": 0.03, "threshold_pence": 2000},
    "gold": {"rate": 0.05, "threshold_pence": 3000}
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Sample listings for development
-- CLEARLY LABELLED: is_seed_data = true, seed_source = 'manual'
-- One of each listing type for testing all UI paths
-- ============================================================

-- Sample 1: Farm Shop (England, Yorkshire)
INSERT INTO listings (
  id,
  directory_id,
  listing_type,
  name,
  slug,
  status,
  tier,
  town,
  county,
  country,
  location,
  geocoding_method,
  geocoding_approximate,
  description,
  opening_hours,
  temporarily_closed,
  is_seed_data,
  seed_source
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'farm_shop',
  '[SAMPLE] Hargreaves Farm Shop',
  'hargreaves-farm-shop',
  'active',
  'free',
  'Harrogate',
  'North Yorkshire',
  'england',
  ST_SetSRID(ST_MakePoint(-1.5413, 53.9915), 4326),
  'postcode',
  false,
  'A family-run farm shop selling fresh seasonal vegetables, free-range eggs, and locally sourced meat. We have been farming this land for four generations.',
  '{
    "monday": {"open": "09:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
    "thursday": {"open": "09:00", "close": "17:00", "closed": false},
    "friday": {"open": "09:00", "close": "18:00", "closed": false},
    "saturday": {"open": "09:00", "close": "16:00", "closed": false},
    "sunday": {"closed": true},
    "bank_holidays_closed": true
  }'::jsonb,
  false,
  true,
  'manual'
) ON CONFLICT (directory_id, slug) DO NOTHING;

-- Sample 2: Honesty Box (England, Suffolk)
INSERT INTO listings (
  id,
  directory_id,
  listing_type,
  name,
  slug,
  status,
  tier,
  town,
  county,
  country,
  location,
  geocoding_method,
  geocoding_approximate,
  description,
  listing_type_meta,
  temporarily_closed,
  is_seed_data,
  seed_source
) VALUES (
  '10000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'honesty_box',
  '[SAMPLE] Meadow Lane Honesty Box',
  'meadow-lane-honesty-box',
  'active',
  'free',
  'Lavenham',
  'Suffolk',
  'england',
  ST_SetSRID(ST_MakePoint(0.8016, 52.1092), 4326),
  'postcode',
  false,
  'Fresh eggs, seasonal vegetables, and homemade jams available at the gate. Help yourself and pop your payment in the box.',
  '{
    "payment_methods": ["cash", "bank_transfer"],
    "currently_stocked": true,
    "stocked_updated_at": "2026-05-17T08:00:00Z",
    "location_description": "Red post box at the entrance to Meadow Lane Farm, 200m past the church on the left"
  }'::jsonb,
  false,
  true,
  'manual'
) ON CONFLICT (directory_id, slug) DO NOTHING;

-- Sample 3: Farm Gate Stall (Wales)
INSERT INTO listings (
  id,
  directory_id,
  listing_type,
  name,
  slug,
  status,
  tier,
  town,
  county,
  country,
  location,
  geocoding_method,
  geocoding_approximate,
  description,
  opening_hours,
  temporarily_closed,
  is_seed_data,
  seed_source
) VALUES (
  '10000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000001',
  'farm_gate_stall',
  '[SAMPLE] Bryn Mawr Farm Gate',
  'bryn-mawr-farm-gate',
  'active',
  'free',
  'Brecon',
  'Powys',
  'wales',
  ST_SetSRID(ST_MakePoint(-3.3887, 51.9476), 4326),
  'address_text',
  true,
  'Seasonal fruit and vegetables straight from our Welsh hillside farm. Potatoes, carrots, and leeks in season.',
  '{
    "tuesday": {"open": "10:00", "close": "14:00", "closed": false},
    "friday": {"open": "10:00", "close": "16:00", "closed": false},
    "saturday": {"open": "09:00", "close": "15:00", "closed": false},
    "notes": "Tuesday and Friday mornings only, plus Saturday"
  }'::jsonb,
  false,
  true,
  'manual'
) ON CONFLICT (directory_id, slug) DO NOTHING;

-- Sample 4: Roadside Stand (Republic of Ireland)
INSERT INTO listings (
  id,
  directory_id,
  listing_type,
  name,
  slug,
  status,
  tier,
  town,
  county,
  country,
  location,
  geocoding_method,
  geocoding_approximate,
  description,
  listing_type_meta,
  temporarily_closed,
  is_seed_data,
  seed_source
) VALUES (
  '10000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000001',
  'roadside_stand',
  '[SAMPLE] Connolly''s Roadside Stand',
  'connollys-roadside-stand',
  'active',
  'free',
  'Killarney',
  'Kerry',
  'republic_of_ireland',
  ST_SetSRID(ST_MakePoint(-9.5083, 52.0599), 4326),
  'eircode',
  false,
  'Fresh organic vegetables and herbs grown on our family farm in the Kerry hills. Available most summer mornings.',
  '{
    "payment_methods": ["cash"],
    "currently_stocked": true,
    "stocked_updated_at": "2026-05-17T07:30:00Z",
    "location_description": "On the N71 heading south from Killarney, opposite the old mill"
  }'::jsonb,
  false,
  true,
  'manual'
) ON CONFLICT (directory_id, slug) DO NOTHING;

-- Sample 5: Farm Shop with Bronze tier (England, Kent) — for testing Bronze UI paths
INSERT INTO listings (
  id,
  directory_id,
  listing_type,
  name,
  slug,
  status,
  tier,
  town,
  county,
  country,
  location,
  geocoding_method,
  geocoding_approximate,
  description,
  opening_hours,
  temporarily_closed,
  is_seed_data,
  seed_source
) VALUES (
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'farm_shop',
  '[SAMPLE] Oast House Farm Shop',
  'oast-house-farm-shop',
  'active',
  'bronze',
  'Tonbridge',
  'Kent',
  'england',
  ST_SetSRID(ST_MakePoint(0.2735, 51.1954), 4326),
  'postcode',
  false,
  'Traditional Kentish farm shop with a wide range of locally grown fruit, vegetables, and artisan products. Our shop is open seven days a week.',
  '{
    "monday": {"open": "08:00", "close": "18:00", "closed": false},
    "tuesday": {"open": "08:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "08:00", "close": "18:00", "closed": false},
    "thursday": {"open": "08:00", "close": "18:00", "closed": false},
    "friday": {"open": "08:00", "close": "18:00", "closed": false},
    "saturday": {"open": "08:00", "close": "17:00", "closed": false},
    "sunday": {"open": "10:00", "close": "16:00", "closed": false},
    "bank_holidays_closed": false
  }'::jsonb,
  false,
  true,
  'manual'
) ON CONFLICT (directory_id, slug) DO NOTHING;

-- Sample subscription for the Bronze listing
INSERT INTO listing_subscriptions (
  listing_id,
  directory_id,
  tier,
  status,
  silver_months_count,
  completed_order_count
) VALUES (
  '10000000-0000-0000-0000-000000000005',
  '00000000-0000-0000-0000-000000000001',
  'bronze',
  'active',
  0,
  0
) ON CONFLICT (listing_id) DO NOTHING;

-- ============================================================
-- DOWN
-- ============================================================
-- DELETE FROM listing_subscriptions WHERE listing_id LIKE '10000000-0000-0000-0000-%';
-- DELETE FROM listings WHERE id LIKE '10000000-0000-0000-0000-%';
-- DELETE FROM directories WHERE id = '00000000-0000-0000-0000-000000000001';
