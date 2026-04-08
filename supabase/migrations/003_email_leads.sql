CREATE TABLE IF NOT EXISTS email_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text DEFAULT 'popup',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed boolean DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_email_leads_email ON email_leads(email);
