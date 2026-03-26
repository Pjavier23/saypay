-- Migration 003: Add sp_comments table for review replies
create table if not exists sp_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references sp_reviews(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null check (char_length(content) <= 280),
  created_at timestamptz default now()
);

alter table sp_comments enable row level security;

create policy "Anyone can read comments" on sp_comments for select using (true);
create policy "Authenticated users can insert" on sp_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on sp_comments for delete using (auth.uid() = user_id);
