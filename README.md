# FarmGuard 🌱

A Supabase-ready farmer crop-health website prototype.

## Included
- Responsive farmer website UI
- Supabase email/password authentication
- Crop image upload UI
- Crop analysis result flow (demo diagnosis layer)
- Pesticide/treatment catalogue
- Scan history
- Farmer profile
- Supabase Storage upload
- Supabase database + RLS schema

## Connect Supabase
1. Create a Supabase project.
2. Run `supabase_schema.sql` in Supabase SQL Editor.
3. Create/confirm the `crop-images` storage bucket (the SQL also attempts this).
4. Open `app.js` and replace:
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`
5. Serve the folder from a local web server (not `file://`), or deploy it to a static host.

## AI integration
The current website contains a safe demo assessment so the complete user flow works immediately.
For real image diagnosis, connect the `analyze` action to a trained crop-disease model/API. The model should return a disease name and confidence, then the frontend can map it to approved treatment records.

## Safety
Pesticide information must be verified against the product label and applicable agricultural authority guidance. The demo catalogue intentionally avoids prescribing a dose.
