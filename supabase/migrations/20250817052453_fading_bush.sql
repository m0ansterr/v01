/*
  # Create Episodes Table

  1. New Tables
    - `episodes`
      - `id` (uuid, primary key)
      - `episode_id` (text, unique identifier)
      - `title` (text, episode title)
      - `description` (text, optional description)
      - `cover_image` (text, URL to cover image)
      - `pages` (integer, number of pages)
      - `mpd_url` (text, URL to MPD manifest file)
      - `published` (boolean, publication status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `episodes` table
    - Add policy for public read access to published episodes
    - Add policy for authenticated users to manage episodes (admin access)

  3. Indexes
    - Index on episode_id for fast lookups
    - Index on published status for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  cover_image text,
  pages integer DEFAULT 0,
  mpd_url text NOT NULL,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published episodes
CREATE POLICY "Public can read published episodes"
  ON episodes
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Policy for authenticated users to manage all episodes (admin access)
CREATE POLICY "Authenticated users can manage episodes"
  ON episodes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS episodes_episode_id_idx ON episodes(episode_id);
CREATE INDEX IF NOT EXISTS episodes_published_idx ON episodes(published);
CREATE INDEX IF NOT EXISTS episodes_created_at_idx ON episodes(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_episodes_updated_at ON episodes;
CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON episodes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();