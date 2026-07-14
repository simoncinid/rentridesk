CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), type text NOT NULL CHECK (type IN ('customer','partner','consultancy','internal')),
  legal_name text NOT NULL, trade_name text, tax_code text, vat_number text, rea_number text, ateco_code text,
  certified_email text, email text, phone text, website text, country_code char(2) NOT NULL DEFAULT 'IT',
  address_line_1 text, address_line_2 text, postal_code text, city text, province text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','suspended','closed')),
  subscription_status text NOT NULL DEFAULT 'trialing', onboarding_status text NOT NULL DEFAULT 'not_started',
  default_timezone text NOT NULL DEFAULT 'Europe/Rome', rentri_operator_reference text, is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0
);
COMMENT ON TABLE public.organizations IS 'Tenant root. Every business record must resolve unambiguously to an organization.';

CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, first_name text, last_name text, phone text, preferred_locale text NOT NULL DEFAULT 'it-IT', timezone text NOT NULL DEFAULT 'Europe/Rome',
  mfa_required boolean NOT NULL DEFAULT false, last_active_organization_id uuid REFERENCES public.organizations(id), accepted_terms_at timestamptz,
  accepted_privacy_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK(role IN ('owner','admin','environmental_manager','operator','consultant','viewer','billing_manager','partner_admin')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','revoked')), invited_email text, invited_by uuid, invited_at timestamptz,
  accepted_at timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(organization_id,user_id)
);
CREATE INDEX organization_memberships_user_idx ON public.organization_memberships(user_id,status);
CREATE TABLE public.partner_client_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), partner_organization_id uuid NOT NULL REFERENCES public.organizations(id), client_organization_id uuid NOT NULL REFERENCES public.organizations(id),
  relationship_type text NOT NULL DEFAULT 'consultancy', status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','revoked','expired')),
  permissions_json jsonb NOT NULL DEFAULT '{}', starts_at timestamptz, ends_at timestamptz, created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK(partner_organization_id <> client_organization_id), UNIQUE(partner_organization_id,client_organization_id)
);

CREATE TABLE public.local_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), name text NOT NULL, internal_code text NOT NULL,
  rentri_unit_reference text, activity_type text, address_line_1 text, address_line_2 text, postal_code text, city text, province text, country_code char(2) DEFAULT 'IT',
  latitude numeric(9,6), longitude numeric(9,6), phone text, email text, is_headquarters boolean NOT NULL DEFAULT false,
  rentri_registration_status text NOT NULL DEFAULT 'not_configured', rentri_registration_date date, active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0,
  UNIQUE(organization_id,internal_code)
);
CREATE INDEX local_units_org_idx ON public.local_units(organization_id,active);
CREATE TABLE public.rentri_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid REFERENCES public.local_units(id),
  environment text NOT NULL CHECK(environment IN ('mock','demo','production')), status text NOT NULL DEFAULT 'disconnected', authentication_mode text,
  rentri_operator_reference text, rentri_unit_reference text, credential_reference uuid, certificate_serial_number text, certificate_expires_at timestamptz,
  last_successful_connection_at timestamptz, last_failed_connection_at timestamptz, last_error_code text, last_error_message text,
  configuration_json jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(organization_id,local_unit_id,environment)
);
CREATE TABLE public.encrypted_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), credential_type text NOT NULL, provider text NOT NULL,
  encrypted_payload text NOT NULL, encryption_version integer NOT NULL, key_reference text NOT NULL, fingerprint text NOT NULL, expires_at timestamptz,
  status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','rotated','revoked','expired')), created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), rotated_at timestamptz, revoked_at timestamptz
);
COMMENT ON COLUMN public.encrypted_credentials.encrypted_payload IS 'Never exposed by Hasura. Envelope-encrypted and accessed only by Run Service.';

CREATE TABLE public.ref_codes (
  family text NOT NULL, code text NOT NULL, label_it text NOT NULL, description_it text, valid_from date, valid_to date, active boolean NOT NULL DEFAULT true,
  source_version text NOT NULL, source_hash text NOT NULL, synced_at timestamptz NOT NULL DEFAULT now(), raw_payload jsonb NOT NULL DEFAULT '{}', PRIMARY KEY(family,code,source_version)
);
CREATE INDEX ref_codes_active_idx ON public.ref_codes(family,active,code);
CREATE VIEW public.ref_eer_codes AS SELECT * FROM public.ref_codes WHERE family='eer';
CREATE VIEW public.ref_hazard_properties AS SELECT * FROM public.ref_codes WHERE family='hazard_property';
CREATE VIEW public.ref_physical_states AS SELECT * FROM public.ref_codes WHERE family='physical_state';
CREATE VIEW public.ref_quantity_units AS SELECT * FROM public.ref_codes WHERE family='quantity_unit';
CREATE VIEW public.ref_packaging_types AS SELECT * FROM public.ref_codes WHERE family='packaging_type';
CREATE VIEW public.ref_recovery_disposal_operations AS SELECT * FROM public.ref_codes WHERE family='recovery_disposal';
CREATE VIEW public.ref_transport_modes AS SELECT * FROM public.ref_codes WHERE family='transport_mode';
CREATE VIEW public.ref_countries AS SELECT * FROM public.ref_codes WHERE family='country';
CREATE VIEW public.ref_rentri_enums AS SELECT * FROM public.ref_codes WHERE family='rentri_enum';

CREATE TABLE public.parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), legal_name text NOT NULL, tax_code text, vat_number text,
  rentri_reference text, register_reference text, certified_email text, email text, phone text, address_line_1 text, postal_code text, city text, province text, country_code char(2) DEFAULT 'IT',
  notes text, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0
);
CREATE INDEX parties_org_name_idx ON public.parties(organization_id,legal_name);
CREATE TABLE public.party_roles (party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE, role text NOT NULL CHECK(role IN ('carrier','destination','intermediary','laboratory','consultant','supplier')), PRIMARY KEY(party_id,role));

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid REFERENCES public.local_units(id), storage_file_id uuid,
  bucket_id text NOT NULL, document_type text NOT NULL CHECK(document_type IN ('authorization','analysis','register','movement_export','fir','xfir','complete_fir_copy','conservation_receipt','invoice','contract','import_file','other')),
  file_name text NOT NULL, mime_type text NOT NULL, size_bytes bigint NOT NULL CHECK(size_bytes>=0), sha256 char(64) NOT NULL, source text NOT NULL,
  status text NOT NULL DEFAULT 'available', legal_lock boolean NOT NULL DEFAULT false, retention_until timestamptz, uploaded_by uuid, uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(organization_id,sha256,document_type)
);
COMMENT ON TABLE public.documents IS 'Application authorization record for private Storage files. File names are never authorization boundaries.';
CREATE TABLE public.document_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), document_id uuid NOT NULL REFERENCES public.documents(id), entity_type text NOT NULL, entity_id uuid NOT NULL, relationship_type text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(document_id,entity_type,entity_id,relationship_type));
CREATE TABLE public.party_authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), party_id uuid NOT NULL REFERENCES public.parties(id), authorization_type text NOT NULL,
  authorization_number text, issuing_authority text, valid_from date, expires_at date, status text NOT NULL DEFAULT 'unverified', covered_eer_codes jsonb NOT NULL DEFAULT '[]',
  document_id uuid REFERENCES public.documents(id), verification_source text, verified_at timestamptz, verified_by uuid, notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX party_authorizations_expiry_idx ON public.party_authorizations(organization_id,expires_at,status);

CREATE TABLE public.waste_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid REFERENCES public.local_units(id), name text NOT NULL, internal_code text,
  eer_code text NOT NULL, description text, producer_description text, physical_state_code text, quantity_unit_code text NOT NULL, is_hazardous boolean NOT NULL,
  classification_status text NOT NULL DEFAULT 'draft' CHECK(classification_status IN ('draft','suggested','confirmed','needs_review','expired_review')),
  classification_confirmed_by uuid, classification_confirmed_at timestamptz, classification_notes text, default_packaging_type_code text,
  default_recovery_disposal_code text, default_carrier_party_id uuid REFERENCES public.parties(id), default_destination_party_id uuid REFERENCES public.parties(id), default_intermediary_party_id uuid REFERENCES public.parties(id),
  default_notes text, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0,
  UNIQUE(organization_id,local_unit_id,internal_code)
);
CREATE INDEX waste_profiles_org_idx ON public.waste_profiles(organization_id,local_unit_id,active,eer_code);
CREATE TABLE public.waste_profile_hazard_properties (waste_profile_id uuid NOT NULL REFERENCES public.waste_profiles(id) ON DELETE CASCADE,hazard_property_code text NOT NULL,PRIMARY KEY(waste_profile_id,hazard_property_code));
CREATE TABLE public.waste_profile_documents (waste_profile_id uuid NOT NULL REFERENCES public.waste_profiles(id) ON DELETE CASCADE,document_id uuid NOT NULL REFERENCES public.documents(id),document_role text NOT NULL,PRIMARY KEY(waste_profile_id,document_id,document_role));

CREATE TABLE public.registers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid NOT NULL REFERENCES public.local_units(id), name text NOT NULL,
  register_type text NOT NULL, rentri_register_reference text, official_number text, status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','opening_pending','open','suspended','closed','error')),
  opened_at timestamptz, closed_at timestamptz, last_local_sequence bigint NOT NULL DEFAULT 0, last_transmitted_sequence bigint NOT NULL DEFAULT 0, last_transmission_at timestamptz,
  configuration_json jsonb NOT NULL DEFAULT '{}', created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0
);
CREATE TABLE public.register_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid NOT NULL REFERENCES public.local_units(id), register_id uuid NOT NULL REFERENCES public.registers(id),
  entry_type text NOT NULL CHECK(entry_type IN ('load','unload','correction','cancellation')), local_sequence bigint NOT NULL, official_sequence text, operation_date date NOT NULL, registration_date date NOT NULL,
  waste_profile_id uuid REFERENCES public.waste_profiles(id), eer_code_snapshot text NOT NULL, waste_description_snapshot text NOT NULL, is_hazardous_snapshot boolean NOT NULL,
  physical_state_code_snapshot text, quantity numeric(18,6) NOT NULL CHECK(quantity>0), quantity_unit_code text NOT NULL, recovery_disposal_code text,
  source_type text, source_id uuid, status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','validated','locked','corrected','cancelled')),
  rentri_status text, rentri_reference text, transmission_status text NOT NULL DEFAULT 'not_applicable', transmitted_at timestamptz, notes text,
  previous_entry_id uuid REFERENCES public.register_entries(id), correction_of_entry_id uuid REFERENCES public.register_entries(id), created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0, UNIQUE(register_id,local_sequence)
);
COMMENT ON TABLE public.register_entries IS 'Locked entries are immutable; corrections and cancellations create linked entries.';
CREATE INDEX register_entries_stock_idx ON public.register_entries(organization_id,local_unit_id,register_id,waste_profile_id,quantity_unit_code,status);
CREATE INDEX register_entries_transmission_idx ON public.register_entries(organization_id,transmission_status,operation_date);
CREATE TABLE public.register_entry_links (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),from_entry_id uuid NOT NULL REFERENCES public.register_entries(id),to_entry_id uuid NOT NULL REFERENCES public.register_entries(id),quantity numeric(18,6) NOT NULL CHECK(quantity>0),link_type text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(from_entry_id,to_entry_id,link_type));
CREATE VIEW public.stock_balances AS
SELECT organization_id,local_unit_id,register_id,waste_profile_id,eer_code_snapshot AS eer_code,quantity_unit_code,
  COALESCE(sum(CASE WHEN entry_type='load' THEN quantity WHEN entry_type='unload' THEN -quantity ELSE 0 END),0)::numeric(18,6) AS available_quantity,
  max(operation_date) FILTER(WHERE entry_type='load') AS last_load_at,max(operation_date) FILTER(WHERE entry_type='unload') AS last_unload_at
FROM public.register_entries WHERE status IN ('validated','locked') GROUP BY organization_id,local_unit_id,register_id,waste_profile_id,eer_code_snapshot,quantity_unit_code;

CREATE TABLE public.firs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES public.organizations(id), local_unit_id uuid NOT NULL REFERENCES public.local_units(id), register_id uuid REFERENCES public.registers(id),
  internal_number text NOT NULL, rentri_fir_number text, rentri_reference text, environment text NOT NULL CHECK(environment IN ('mock','demo','production')),
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','validation_failed','ready_for_numbering','numbering_pending','numbered','ready_for_producer_signature','producer_signature_pending','producer_signed','shared_with_carrier','carrier_integration_pending','carrier_ready_to_sign','carrier_signed','in_transit','destination_integration_pending','destination_ready_to_sign','destination_signed','complete_copy_pending','complete_copy_received','data_transmission_pending','transmitted','conservation_pending','conserved','cancel_pending','cancelled','error')), producer_party_snapshot jsonb NOT NULL, carrier_party_snapshot jsonb, destination_party_snapshot jsonb, intermediary_party_snapshot jsonb,
  waste_profile_id uuid NOT NULL REFERENCES public.waste_profiles(id), departure_planned_at timestamptz, departure_at timestamptz, arrival_at timestamptz,
  quantity_at_departure numeric(18,6) CHECK(quantity_at_departure>0), quantity_unit_code text NOT NULL, quantity_at_destination numeric(18,6), destination_outcome text,
  recovery_disposal_code text, vehicle_registration text, trailer_registration text, driver_name text, route_notes text, general_notes text,
  current_version integer NOT NULL DEFAULT 1, validation_status text NOT NULL DEFAULT 'not_validated', signature_status text NOT NULL DEFAULT 'unsigned',
  copy_status text NOT NULL DEFAULT 'not_available', transmission_status text NOT NULL DEFAULT 'not_transmitted', conservation_status text NOT NULL DEFAULT 'not_submitted',
  created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 0, UNIQUE(organization_id,internal_number)
);
COMMENT ON TABLE public.firs IS 'Official FIR aggregate. Mutations after numbering are only permitted through the Run Service state machine.';
CREATE INDEX firs_filters_idx ON public.firs(organization_id,local_unit_id,status,departure_planned_at);
CREATE TABLE public.fir_versions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),fir_id uuid NOT NULL REFERENCES public.firs(id),version_number integer NOT NULL,source text NOT NULL,status text NOT NULL,json_payload jsonb NOT NULL,xml_document_id uuid REFERENCES public.documents(id),xfir_document_id uuid REFERENCES public.documents(id),schema_version text NOT NULL,payload_hash char(64) NOT NULL,created_by uuid,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(fir_id,version_number));
CREATE TABLE public.fir_signatures (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),fir_id uuid NOT NULL REFERENCES public.firs(id),fir_version_id uuid NOT NULL REFERENCES public.fir_versions(id),signer_role text NOT NULL CHECK(signer_role IN ('producer','carrier','destination','intermediary')),signer_party_reference text,signature_provider text NOT NULL,signature_type text NOT NULL,certificate_serial_number text,signature_timestamp timestamptz,signature_status text NOT NULL,signature_metadata jsonb NOT NULL DEFAULT '{}',signed_document_id uuid REFERENCES public.documents(id),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.fir_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),fir_id uuid NOT NULL REFERENCES public.firs(id),event_type text NOT NULL,actor_type text NOT NULL,actor_user_id uuid,actor_party_reference text,previous_status text,new_status text,event_timestamp timestamptz NOT NULL DEFAULT now(),source text NOT NULL,details jsonb NOT NULL DEFAULT '{}',correlation_id uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX fir_events_fir_time_idx ON public.fir_events(fir_id,event_timestamp DESC);
CREATE TABLE public.fir_submissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),fir_id uuid NOT NULL REFERENCES public.firs(id),submission_type text NOT NULL,environment text NOT NULL,idempotency_key text NOT NULL,request_reference text,status text NOT NULL,attempt_count integer NOT NULL DEFAULT 0,next_attempt_at timestamptz,last_attempt_at timestamptz,response_code text,response_reference text,error_code text,error_message text,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(organization_id,submission_type,idempotency_key));

CREATE TABLE public.integration_jobs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid REFERENCES public.organizations(id),job_type text NOT NULL,entity_type text,entity_id uuid,status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','running','retry_wait','completed','failed','dead_letter','cancelled')),priority integer NOT NULL DEFAULT 100,payload jsonb NOT NULL DEFAULT '{}',idempotency_key text NOT NULL,attempt_count integer NOT NULL DEFAULT 0,max_attempts integer NOT NULL DEFAULT 5,next_attempt_at timestamptz NOT NULL DEFAULT now(),locked_at timestamptz,locked_by text,last_error_code text,last_error_message text,correlation_id uuid NOT NULL DEFAULT gen_random_uuid(),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz,UNIQUE(job_type,idempotency_key));
CREATE INDEX integration_jobs_claim_idx ON public.integration_jobs(status,next_attempt_at,priority,created_at) WHERE status IN ('pending','retry_wait');
CREATE TABLE public.idempotency_records (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),scope text NOT NULL,idempotency_key text NOT NULL,request_hash char(64) NOT NULL,status text NOT NULL,response_code integer,response_body jsonb,entity_type text,entity_id uuid,expires_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(organization_id,scope,idempotency_key));
CREATE TABLE public.audit_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid REFERENCES public.organizations(id),actor_user_id uuid,actor_type text NOT NULL,actor_reference text,action text NOT NULL,entity_type text NOT NULL,entity_id uuid,event_timestamp timestamptz NOT NULL DEFAULT now(),ip_address inet,user_agent text,correlation_id uuid,request_id text,before_data jsonb,after_data jsonb,metadata jsonb NOT NULL DEFAULT '{}',previous_hash char(64),event_hash char(64) NOT NULL);
COMMENT ON TABLE public.audit_events IS 'Append-only tamper-evident audit chain. Direct update/delete is forbidden.';
CREATE INDEX audit_events_org_time_idx ON public.audit_events(organization_id,event_timestamp DESC);

CREATE TABLE public.notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),user_id uuid,type text NOT NULL,severity text NOT NULL CHECK(severity IN ('info','warning','error','critical')),title text NOT NULL,message text NOT NULL,entity_type text,entity_id uuid,read_at timestamptz,dismissed_at timestamptz,created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX notifications_user_idx ON public.notifications(organization_id,user_id,read_at,created_at DESC);
CREATE TABLE public.notification_preferences (user_id uuid NOT NULL,organization_id uuid NOT NULL REFERENCES public.organizations(id),channel text NOT NULL CHECK(channel IN ('in_app','email')),event_type text NOT NULL,enabled boolean NOT NULL DEFAULT true,digest_mode text NOT NULL DEFAULT 'immediate',PRIMARY KEY(user_id,organization_id,channel,event_type));
CREATE TABLE public.onboarding_steps (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),step_code text NOT NULL,status text NOT NULL DEFAULT 'not_started',data jsonb NOT NULL DEFAULT '{}',completed_by uuid,completed_at timestamptz,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(organization_id,step_code));
CREATE TABLE public.feature_flags (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code text NOT NULL UNIQUE,description text NOT NULL,enabled_globally boolean NOT NULL DEFAULT false,configuration jsonb NOT NULL DEFAULT '{}',created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.organization_feature_flags (organization_id uuid NOT NULL REFERENCES public.organizations(id),feature_flag_id uuid NOT NULL REFERENCES public.feature_flags(id),enabled boolean NOT NULL,configuration jsonb NOT NULL DEFAULT '{}',PRIMARY KEY(organization_id,feature_flag_id));
CREATE TABLE public.plans (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code text NOT NULL UNIQUE,name text NOT NULL,monthly_price numeric(12,2) NOT NULL,annual_price numeric(12,2) NOT NULL,included_local_units integer NOT NULL,included_users integer NOT NULL,included_movements integer NOT NULL,included_firs integer NOT NULL,included_storage_bytes bigint NOT NULL,features jsonb NOT NULL DEFAULT '{}',active boolean NOT NULL DEFAULT true);
CREATE TABLE public.subscriptions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),plan_id uuid NOT NULL REFERENCES public.plans(id),provider text NOT NULL,provider_customer_id text,provider_subscription_id text,status text NOT NULL,billing_interval text NOT NULL,current_period_start timestamptz,current_period_end timestamptz,cancel_at_period_end boolean NOT NULL DEFAULT false,trial_ends_at timestamptz,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.usage_counters (organization_id uuid NOT NULL REFERENCES public.organizations(id),period_start date NOT NULL,period_end date NOT NULL,movement_count bigint NOT NULL DEFAULT 0,fir_count bigint NOT NULL DEFAULT 0,storage_bytes bigint NOT NULL DEFAULT 0,active_users integer NOT NULL DEFAULT 0,last_calculated_at timestamptz,PRIMARY KEY(organization_id,period_start));
CREATE TABLE public.conservation_batches (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),provider text NOT NULL,status text NOT NULL,period_start date NOT NULL,period_end date NOT NULL,document_count integer NOT NULL DEFAULT 0,package_document_id uuid REFERENCES public.documents(id),receipt_document_id uuid REFERENCES public.documents(id),provider_reference text,submitted_at timestamptz,completed_at timestamptz,error_message text,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.vertical_templates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid REFERENCES public.organizations(id),code text NOT NULL,name text NOT NULL,activity_type text NOT NULL,configuration jsonb NOT NULL,active boolean NOT NULL DEFAULT true,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(organization_id,code));
CREATE TABLE public.import_jobs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL REFERENCES public.organizations(id),document_id uuid NOT NULL REFERENCES public.documents(id),import_type text NOT NULL,mapping jsonb NOT NULL DEFAULT '{}',strategy text NOT NULL CHECK(strategy IN ('valid_rows','all_or_nothing')),status text NOT NULL DEFAULT 'analyzing',row_count integer,valid_count integer,error_count integer,report_document_id uuid REFERENCES public.documents(id),created_by uuid,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());

DO $$ DECLARE tab text; BEGIN
  FOREACH tab IN ARRAY ARRAY['organizations','user_profiles','organization_memberships','partner_client_relationships','local_units','rentri_connections','parties','party_authorizations','documents','waste_profiles','registers','register_entries','firs','fir_submissions','integration_jobs','idempotency_records','onboarding_steps','feature_flags','subscriptions','conservation_batches','vertical_templates','import_jobs'] LOOP
    EXECUTE format('CREATE TRIGGER %I_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()',tab,tab);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.prevent_legal_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF OLD.legal_lock THEN RAISE EXCEPTION 'Legal document is locked'; END IF; IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW; END $$;
CREATE TRIGGER documents_legal_lock BEFORE UPDATE OR DELETE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.prevent_legal_mutation();
CREATE OR REPLACE FUNCTION public.prevent_locked_entry_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN IF OLD.status='locked' THEN RAISE EXCEPTION 'Locked register entry requires correction'; END IF; IF TG_OP='DELETE' THEN RETURN OLD; END IF; RETURN NEW; END $$;
CREATE TRIGGER register_entries_locked BEFORE UPDATE OR DELETE ON public.register_entries FOR EACH ROW EXECUTE FUNCTION public.prevent_locked_entry_mutation();
CREATE OR REPLACE FUNCTION public.prevent_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Audit events are append-only'; END $$;
CREATE TRIGGER audit_events_append_only BEFORE UPDATE OR DELETE ON public.audit_events FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_mutation();
