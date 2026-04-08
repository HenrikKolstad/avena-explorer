-- Sold properties (disappeared from feed = likely sold)
CREATE TABLE IF NOT EXISTS sold_properties (
  ref text PRIMARY KEY,
  property_name text,
  town text,
  region text,
  type text,
  last_price numeric,
  last_pm2 numeric,
  last_seen_date date,
  beds integer,
  built_m2 numeric,
  created_at timestamptz DEFAULT now()
);

-- Daily price snapshots
CREATE TABLE IF NOT EXISTS price_snapshots (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ref text NOT NULL,
  snapshot_date date NOT NULL,
  price numeric NOT NULL,
  pm2 numeric,
  mm2 numeric,
  region text,
  type text,
  town text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(ref, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_ref ON price_snapshots(ref);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON price_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_sold_date ON sold_properties(last_seen_date);
