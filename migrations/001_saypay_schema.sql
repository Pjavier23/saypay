-- ============================================================
-- SayPay Schema
-- Uses sp_ prefix to coexist with timeclok tables on same project
-- Run this in Supabase SQL Editor
-- ============================================================

-- Profiles (extends Supabase auth.users)
create table if not exists sp_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  total_reviews int default 0,
  total_helpful int default 0,
  is_elite boolean default false,
  created_at timestamptz default now()
);

-- Businesses
create table if not exists sp_businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  location text not null,
  cover_image text,
  emoji text default '🏪',
  avg_rating numeric(3,2) default 0,
  total_reviews int default 0,
  is_boosted boolean default false,
  boost_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews
create table if not exists sp_reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references sp_businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text not null,
  status text default 'pending' check (status in ('pending', 'published', 'rejected')),
  stripe_session_id text,
  helpful_count int default 0,
  love_count int default 0,
  created_at timestamptz default now()
);

-- Reactions (helpful / love)
create table if not exists sp_reactions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references sp_reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('helpful', 'love')),
  created_at timestamptz default now(),
  unique(review_id, user_id, type)
);

-- Campaigns (business boost subscriptions)
create table if not exists sp_campaigns (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  owner_email text not null,
  plan text default 'boost' check (plan in ('boost', 'pro')),
  stripe_subscription_id text,
  stripe_customer_id text,
  status text default 'pending' check (status in ('pending', 'active', 'canceled', 'past_due')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Tips (reader tips for great reviews)
create table if not exists sp_tips (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references sp_reviews(id) on delete cascade,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents int not null,
  stripe_session_id text,
  status text default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table sp_profiles enable row level security;
alter table sp_businesses enable row level security;
alter table sp_reviews enable row level security;
alter table sp_reactions enable row level security;
alter table sp_campaigns enable row level security;
alter table sp_tips enable row level security;

-- Profiles: public read, own write
create policy "sp_profiles_public_read" on sp_profiles for select using (true);
create policy "sp_profiles_own_insert" on sp_profiles for insert with check (auth.uid() = id);
create policy "sp_profiles_own_update" on sp_profiles for update using (auth.uid() = id);

-- Businesses: public read, auth insert
create policy "sp_businesses_public_read" on sp_businesses for select using (true);
create policy "sp_businesses_auth_insert" on sp_businesses for insert with check (auth.uid() is not null);
create policy "sp_businesses_service_update" on sp_businesses for update using (true);

-- Reviews: public read (published only), auth insert, service update
create policy "sp_reviews_public_read" on sp_reviews for select using (status = 'published' or auth.uid() = user_id);
create policy "sp_reviews_auth_insert" on sp_reviews for insert with check (auth.uid() = user_id);
create policy "sp_reviews_service_update" on sp_reviews for update using (true);

-- Reactions: public read, own write
create policy "sp_reactions_public_read" on sp_reactions for select using (true);
create policy "sp_reactions_auth_insert" on sp_reactions for insert with check (auth.uid() = user_id);
create policy "sp_reactions_own_delete" on sp_reactions for delete using (auth.uid() = user_id);

-- Campaigns: public read
create policy "sp_campaigns_public_read" on sp_campaigns for select using (true);
create policy "sp_campaigns_service_write" on sp_campaigns for insert using (true);
create policy "sp_campaigns_service_update" on sp_campaigns for update using (true);

-- Tips
create policy "sp_tips_public_read" on sp_tips for select using (true);
create policy "sp_tips_auth_insert" on sp_tips for insert with check (auth.uid() = from_user_id);
create policy "sp_tips_service_update" on sp_tips for update using (true);

-- ============================================================
-- Seed Data - Businesses
-- ============================================================

insert into sp_businesses (name, category, description, location, cover_image, emoji, avg_rating, total_reviews) values
('Chipotle', 'Mexican', 'Fast-casual Mexican with fresh ingredients. Build your perfect burrito or bowl.', 'Dupont Circle, DC', 'https://images.unsplash.com/photo-1585238341710-4abb9fd3f2eb?w=800&h=400&fit=crop', '🌯', 4.2, 12),
('Sweetgreen', 'Salads', 'Farm-to-table salads and grain bowls made with seasonal, local ingredients.', 'Downtown DC', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop', '🥗', 4.5, 28),
('Shake Shack', 'Burgers', 'Premium smash burgers, crinkle-cut fries, and thick shakes. Comfort food elevated.', 'Navy Yard, DC', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop', '🍔', 4.1, 19),
('Chick-fil-A', 'Chicken', 'Legendary chicken sandwiches. Closed Sundays, open in your heart always.', 'Gallery Place, DC', 'https://images.unsplash.com/photo-1562547256-ee0e0e7ff5a6?w=800&h=400&fit=crop', '🍗', 4.3, 45),
('Thai Orchid', 'Thai', 'Authentic Thai flavors in the heart of Georgetown. The pad krapow is legendary.', 'Georgetown, DC', 'https://images.unsplash.com/photo-1562126f-d41efdfb9d1d?w=800&h=400&fit=crop', '🍜', 4.4, 34),
('Le Diplomate', 'French', 'Classic French brasserie with the best croissants in DC. Reserve ahead.', 'Logan Circle, DC', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop', '🥐', 4.8, 89),
('Founding Farmers', 'American', 'Farm-to-fork American cuisine. Sustainable, delicious, and always packed for brunch.', 'Penn Quarter, DC', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop', '🌾', 4.3, 56),
('Bad Saint', 'Filipino', 'Tiny but mighty. Arguably the best Filipino food you will ever eat. No reservations.', 'Columbia Heights, DC', 'https://images.unsplash.com/photo-1562126f-d41efdfb9d1d?w=800&h=400&fit=crop', '🍱', 4.9, 103),
('Compass Rose', 'International', 'World cuisine inspired by travel. Incredible cocktails and globally-inspired small plates.', '14th Street, DC', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop', '🌍', 4.7, 67),
('Joe & The Juice', 'Juice Bar', 'Fresh juices, open-faced sandwiches, and strong coffee. Scandinavian minimalism meets DC.', 'Georgetown, DC', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=400&fit=crop', '🥤', 4.0, 23)
on conflict do nothing;
