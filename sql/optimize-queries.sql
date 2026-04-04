CREATE OR REPLACE FUNCTION get_lead_counts_by_status()
RETURNS TABLE(status text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER
AS $$
  SELECT status::text, count(*)
  FROM leads
  GROUP BY status;
$$;

CREATE OR REPLACE FUNCTION get_lead_counts_by_niche()
RETURNS TABLE(niche text, status text, count bigint)
LANGUAGE sql STABLE SECURITY INVOKER
AS $$
  SELECT niche, status::text, count(*)
  FROM leads
  GROUP BY niche, status;
$$;

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_niche_idx ON leads (niche);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

CREATE INDEX IF NOT EXISTS leads_status_niche_created_idx
  ON leads (status, niche, created_at DESC);

CREATE INDEX IF NOT EXISTS prospecting_runs_finished_at_idx
  ON prospecting_runs (finished_at DESC);

CREATE INDEX IF NOT EXISTS dispatch_runs_finished_at_idx
  ON dispatch_runs (finished_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS leads_company_name_trgm_idx
  ON leads USING gin (company_name gin_trgm_ops);
