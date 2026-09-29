-- Apply to the portal's Neon Postgres database before setting PORTAL_ENABLED=true.
-- Client-facing rows are never queried without an authenticated client id.
CREATE TABLE IF NOT EXISTS portal_clients (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client','studio')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portal_projects (
  id text PRIMARY KEY,
  client_id text NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'proposal' CHECK (stage IN ('proposal','agreement','invoice','in_progress','review','complete')),
  agreement_url text,
  stripe_invoice_id text,
  payment_instructions text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_projects_client_idx ON portal_projects(client_id);

CREATE TABLE IF NOT EXISTS portal_login_links (
  token_hash text PRIMARY KEY,
  client_id text NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);
CREATE INDEX IF NOT EXISTS portal_login_client_idx ON portal_login_links(client_id, created_at DESC);

CREATE TABLE IF NOT EXISTS portal_sessions (
  token_hash text PRIMARY KEY,
  client_id text NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_sessions_client_idx ON portal_sessions(client_id);

CREATE TABLE IF NOT EXISTS portal_deliverables (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version > 0),
  title text NOT NULL,
  file_name text NOT NULL,
  blob_url text NOT NULL,
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('review','changes_requested','approved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, version)
);

CREATE TABLE IF NOT EXISTS portal_feedback (
  id text PRIMARY KEY,
  deliverable_id text NOT NULL UNIQUE REFERENCES portal_deliverables(id) ON DELETE CASCADE,
  client_id text NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('changes_requested','approved')),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
