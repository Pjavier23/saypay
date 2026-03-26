-- Migration 004: Per-category star ratings + paid boost count + paid_upvote reaction type

-- Category ratings on reviews
ALTER TABLE sp_reviews ADD COLUMN IF NOT EXISTS rating_food int CHECK (rating_food BETWEEN 1 AND 5);
ALTER TABLE sp_reviews ADD COLUMN IF NOT EXISTS rating_service int CHECK (rating_service BETWEEN 1 AND 5);
ALTER TABLE sp_reviews ADD COLUMN IF NOT EXISTS rating_cleanliness int CHECK (rating_cleanliness BETWEEN 1 AND 5);
ALTER TABLE sp_reviews ADD COLUMN IF NOT EXISTS rating_atmosphere int CHECK (rating_atmosphere BETWEEN 1 AND 5);

-- Paid boost count (separate from helpful_count so we can display them differently)
ALTER TABLE sp_reviews ADD COLUMN IF NOT EXISTS paid_boost_count int DEFAULT 0;

-- Expand reactions type to include paid_upvote
ALTER TABLE sp_reactions DROP CONSTRAINT IF EXISTS sp_reactions_type_check;
ALTER TABLE sp_reactions ADD CONSTRAINT sp_reactions_type_check CHECK (type IN ('helpful', 'love', 'paid_upvote'));
