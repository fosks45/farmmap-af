---
adr: ADR-0010
title: File Storage — Supabase Storage + Sharp Image Processing
status: accepted
date: 2026-05-17
feature: 003-farmmap
authority: specs/003-farmmap/spec.md (F4 — photos, F13 — product photos) + specs/003-farmmap/compliance-pack/compliance-decision.md
deciders:
  - architecture-squad-lead
---

# ADR-0010: File Storage — Supabase Storage with Sharp Image Processing + Photo Moderation

## Context

The spec requires photo upload for:
- Listing photos (F4): up to 10 photos per listing; JPEG and PNG only; max 5MB per file.
- Product photos (F13): Bronze/Silver/Gold product catalogue photos; same format/size constraints.

All photos enter a moderation queue before display (F11). Admin approves or rejects with a reason. Rejected photos trigger a notification to the listing owner.

Compliance and product requirements:
- Photos must not be publicly displayed until approved by admin.
- Listing photos: stored in Supabase Storage; CDN delivery for approved photos.
- Photo moderation status: `pending|approved|rejected` on the `listing_photos` record.
- Original files should not be stored indefinitely after processing to reduce storage costs.

## Decision

**Supabase Storage for all user-uploaded photos. Server-side Sharp image processing on upload (resize to max 1200×900, convert to WebP, generate 400×300 thumbnail). Original file deleted after processing. CDN delivery via Supabase Storage's built-in CDN (backed by Cloudflare). Two storage buckets: `listing-photos` (public read for approved photos) and `product-photos` (public read for approved product photos).**

Architecture:

1. **Upload endpoint** (`POST /listings/{slug}/photos`):
   - Receives `multipart/form-data` with the image file.
   - Validates: JPEG or PNG MIME type, file size ≤ 5MB.
   - Server-side processing with Sharp:
     - Resize to max 1200×900 (preserving aspect ratio).
     - Convert to WebP (50–70% smaller than JPEG at equivalent quality).
     - Generate a 400×300 thumbnail WebP for the photo grid view.
   - Upload processed file and thumbnail to Supabase Storage.
   - Delete the original upload from temporary storage.
   - Insert a `listing_photos` row with `moderation_status: pending`.

2. **Storage buckets**:
   - `listing-photos`: public read. Path: `{directory_id}/{listing_id}/{photo_id}.webp` and `{photo_id}_thumb.webp`.
   - `product-photos`: public read. Path: `{directory_id}/{listing_id}/products/{product_id}/{photo_id}.webp`.
   - Both buckets have RLS policies that allow any user to read files but only authenticated owners/managers to insert.
   - Approved photos: public CDN URL served directly.
   - Pending/rejected photos: CDN URL is readable only by the listing owner/manager and admin (implemented via signed URLs for non-public access).

3. **Moderation status enforcement**:
   - The listing detail page (RSC) queries `listing_photos WHERE moderation_status = 'approved'` — pending and rejected photos are never returned to consumers.
   - Admin photo moderation queue queries `listing_photos WHERE moderation_status = 'pending'`.

4. **Photo deletion on cancellation**:
   - When a listing subscription cancels or a photo is deleted by the owner, the Supabase Storage objects are deleted and the `listing_photos` row is soft-deleted (`deleted_at` timestamp). Permanent deletion after 30 days.
   - This satisfies the compliance pack ToS requirement [V1-C7] on photo licence and deletion on cancellation.

## Consequences

**Positive:**
- Supabase Storage is bundled with the existing Supabase subscription — no additional infrastructure.
- WebP conversion reduces average photo file size by ~50–70% over JPEG, improving CDN delivery speed and storage cost.
- Thumbnail generation server-side eliminates client-side resizing and ensures consistent dimensions across the listing grid view.
- The pending state enforcement in the RSC query ensures photos are never accidentally served before moderation.

**Negative / Risks:**
- Sharp requires a native binary (compiled for the deployment target). Vercel serverless functions include Sharp natively. Supabase Edge Functions use Deno and may require a different processing approach — photo upload should route through a Next.js API Route, not a Supabase Edge Function.
- Photo processing (resize + WebP encode) for a 5MB input takes ~2–5 seconds. The spec requires processing within 30 seconds (NFR). Well within budget.
- Supabase Storage CDN is Cloudflare-backed. Cloudflare's edge network provides sub-100ms delivery to UK and Ireland users.

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| AWS S3 + CloudFront | Satisfies all requirements but adds AWS to the infrastructure stack alongside Supabase. Additional IAM, bucket policy, and billing. Not justified at v1 given Supabase Storage is bundled. |
| Cloudinary | Excellent image processing and CDN. Cost at scale (~$89+/month for meaningful storage/bandwidth). Processing-on-demand adds latency per request vs pre-processed storage. |
| Uploadthing | Third-party upload service; adds dependency. No meaningful advantage over Supabase Storage for this use case. |
| Store originals permanently | Unnecessary storage cost; compliance risk (data minimisation principle under GDPR). Originals are not needed once the processed version is stored. |
