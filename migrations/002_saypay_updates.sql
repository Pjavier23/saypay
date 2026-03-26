-- ============================================================
-- SayPay Migration 002 — Photos, Tips, Donations
-- Run this in Supabase SQL Editor after 001_saypay_schema.sql
-- ============================================================

-- Add photos column to sp_reviews
alter table sp_reviews add column if not exists photos text[] default '{}';

-- Add business_id to sp_tips (for tip-the-establishment feature)
alter table sp_tips add column if not exists business_id uuid references sp_businesses(id) on delete set null;

-- Make to_user_id nullable (tips can go to a business without a user owner)
alter table sp_tips alter column to_user_id drop not null;

-- Add monthly donations table
create table if not exists sp_donations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references sp_businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents int not null,
  plan text not null,
  stripe_subscription_id text,
  stripe_session_id text,
  status text default 'pending' check (status in ('pending', 'active', 'canceled')),
  created_at timestamptz default now()
);

alter table sp_donations enable row level security;
create policy "sp_donations_public_read" on sp_donations for select using (true);
create policy "sp_donations_auth_insert" on sp_donations for insert with check (auth.uid() = user_id);
create policy "sp_donations_service_update" on sp_donations for update using (true);

-- Add google_place_id to sp_businesses for deduplication
alter table sp_businesses add column if not exists google_place_id text;

-- Create storage bucket for review photos (run this if bucket doesn't exist)
-- NOTE: Also create this in the Supabase dashboard under Storage
-- Bucket name: review-photos
-- Public: true

-- ============================================================
-- Storage RLS for review-photos bucket
-- Run this in Supabase SQL Editor:
-- ============================================================

-- Allow authenticated users to upload photos
insert into storage.buckets (id, name, public) 
values ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

create policy if not exists "review_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy if not exists "review_photos_auth_insert"
  on storage.objects for insert
  with check (bucket_id = 'review-photos' and auth.uid() is not null);

create policy if not exists "review_photos_own_delete"
  on storage.objects for delete
  using (bucket_id = 'review-photos' and auth.uid()::text = (storage.foldername(name))[1]);
