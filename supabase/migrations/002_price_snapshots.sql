-- Price snapshots: timestamped record of every property price on every sync
CREATE TABLE IF NOT EXISTS price_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_ref text NOT NULL,
  price_from integer NOT NULL,
  price_to integer,
  pm2 integer,
  mm2 integer,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_snapshots_ref ON price_snapshots(property_ref);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON price_snapshots(snapshot_date);
-- Unique: one snapshot per property per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_snapshots_ref_date ON price_snapshots(property_ref, snapshot_date);

-- Sold properties: when a ref disappears from the feed
CREATE TABLE IF NOT EXISTS sold_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_ref text NOT NULL UNIQUE,
  last_price integer,
  last_pm2 integer,
  last_seen_date date,
  town text,
  property_type text,
  beds integer,
  built_m2 integer,
  sold_detected_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sold_ref ON sold_properties(property_ref);

-- Active refs table: tracks which refs were in the last feed sync
CREATE TABLE IF NOT EXISTS feed_active_refs (
  property_ref text PRIMARY KEY,
  last_seen_date date NOT NULL,
  updated_at timestamptz DEFAULT now()
);
