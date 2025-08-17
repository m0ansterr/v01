/*
  # Enhanced Manhwa Reader Schema

  1. New Tables
    - `categories` - Episode categories (Action, Romance, etc.)
    - `reading_progress` - User reading progress tracking
    - Enhanced `episodes` table with categories and tags

  2. Security
    - Enable RLS on all tables
    - Public read access for published content
    - User-specific reading progress

  3. Features
    - Categories and tags for organization
    - Reading progress tracking
    - User authentication integration
    - Search and filtering capabilities
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#6366f1',
  created_at timestamptz DEFAULT now()
);

-- Enhanced episodes table (add new columns)
DO $$
BEGIN
  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'category'
  ) THEN
    ALTER TABLE episodes ADD COLUMN category text DEFAULT 'general';
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'tags'
  ) THEN
    ALTER TABLE episodes ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add reading_time column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'reading_time'
  ) THEN
    ALTER TABLE episodes ADD COLUMN reading_time integer DEFAULT 5;
  END IF;

  -- Add rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'rating'
  ) THEN
    ALTER TABLE episodes ADD COLUMN rating decimal(2,1) DEFAULT 0.0;
  END IF;
END $$;

-- Reading progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  episode_id text NOT NULL,
  current_page integer DEFAULT 0,
  total_pages integer DEFAULT 0,
  completed boolean DEFAULT false,
  last_read_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Public can read categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reading progress policies
CREATE POLICY "Users can read own progress"
  ON reading_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress"
  ON reading_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Action', 'action', 'High-energy adventures and battles', '#ef4444'),
  ('Romance', 'romance', 'Love stories and relationships', '#ec4899'),
  ('Fantasy', 'fantasy', 'Magical worlds and supernatural elements', '#8b5cf6'),
  ('Drama', 'drama', 'Emotional and character-driven stories', '#f59e0b'),
  ('Comedy', 'comedy', 'Humorous and light-hearted content', '#10b981'),
  ('Thriller', 'thriller', 'Suspenseful and mysterious plots', '#6b7280'),
  ('Slice of Life', 'slice-of-life', 'Everyday life and realistic scenarios', '#06b6d4'),
  ('Horror', 'horror', 'Scary and supernatural content', '#1f2937')
ON CONFLICT (slug) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS episodes_category_idx ON episodes(category);
CREATE INDEX IF NOT EXISTS episodes_tags_idx ON episodes USING GIN(tags);
CREATE INDEX IF NOT EXISTS episodes_rating_idx ON episodes(rating DESC);
CREATE INDEX IF NOT EXISTS reading_progress_user_idx ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS reading_progress_episode_idx ON reading_progress(episode_id);

-- Full text search index
CREATE INDEX IF NOT EXISTS episodes_search_idx ON episodes USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);