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
ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS client_business text NOT NULL DEFAULT '';
ALTER TABLE portal_projects ADD COLUMN IF NOT EXISTS investment_cents integer CHECK (investment_cents > 0);

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

-- Apply these tables to existing portal databases as well as new installations.
CREATE TABLE IF NOT EXISTS portal_documents (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('agreement','invoice')),
  title text NOT NULL,
  file_name text NOT NULL,
  blob_url text NOT NULL,
  sha256 text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_documents_project_idx ON portal_documents(project_id, kind, created_at DESC);

CREATE TABLE IF NOT EXISTS portal_invoices (
  document_id text PRIMARY KEY REFERENCES portal_documents(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  due_on date,
  payment_url text,
  zelle_id text NOT NULL DEFAULT '',
  check_address text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued','paid','void')),
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS portal_agreement_signatures (
  id text PRIMARY KEY,
  document_id text NOT NULL REFERENCES portal_documents(id) ON DELETE CASCADE,
  signer_role text NOT NULL CHECK (signer_role IN ('studio','client')),
  signer_id text NOT NULL REFERENCES portal_clients(id),
  signer_email text NOT NULL,
  typed_name text NOT NULL,
  business_name text NOT NULL DEFAULT '',
  consent_text text NOT NULL,
  signed_at timestamptz NOT NULL,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  source_sha256 text NOT NULL,
  signed_pdf_url text NOT NULL,
  signed_pdf_sha256 text NOT NULL,
  UNIQUE(document_id, signer_role)
);

CREATE TABLE IF NOT EXISTS portal_materials (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  client_id text NOT NULL REFERENCES portal_clients(id),
  category text NOT NULL CHECK (category IN ('aerial','site_plan','floor_plan','photos','branding','references')),
  note text NOT NULL DEFAULT '',
  file_name text NOT NULL,
  blob_url text NOT NULL UNIQUE,
  content_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portal_materials_project_idx ON portal_materials(project_id, created_at DESC);
