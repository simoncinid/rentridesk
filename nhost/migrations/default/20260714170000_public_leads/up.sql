CREATE TABLE public.marketing_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  business_type text NOT NULL CHECK (char_length(business_type) <= 80),
  current_process text CHECK (current_process IS NULL OR char_length(current_process) <= 120),
  message text CHECK (message IS NULL OR char_length(message) <= 1000),
  source text NOT NULL DEFAULT 'landing-page' CHECK (char_length(source) <= 80),
  utm_source text CHECK (utm_source IS NULL OR char_length(utm_source) <= 120),
  utm_medium text CHECK (utm_medium IS NULL OR char_length(utm_medium) <= 120),
  utm_campaign text CHECK (utm_campaign IS NULL OR char_length(utm_campaign) <= 120),
  privacy_version text NOT NULL,
  privacy_accepted_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'discarded')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX marketing_leads_created_at_idx ON public.marketing_leads (created_at DESC);
CREATE INDEX marketing_leads_status_idx ON public.marketing_leads (status, created_at DESC);

COMMENT ON TABLE public.marketing_leads IS
  'Contatti raccolti dalla landing pubblica. Accesso esclusivamente server-side; non esporre via ruolo public Hasura.';
