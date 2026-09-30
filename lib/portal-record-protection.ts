import "server-only";
import { portalDb } from "./portal";

export async function ensurePortalRecordProtection() {
  const sql = portalDb();
  await sql`CREATE OR REPLACE FUNCTION ahs_lock_project_record() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE project_id_to_lock text;
    BEGIN
      SELECT project_id INTO project_id_to_lock FROM portal_documents WHERE id = NEW.document_id;
      IF project_id_to_lock IS NULL THEN RAISE EXCEPTION 'Project record is no longer available'; END IF;
      PERFORM id FROM portal_projects WHERE id = project_id_to_lock FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'Project record is no longer available'; END IF;
      RETURN NEW;
    END $$`;
  await sql`CREATE OR REPLACE FUNCTION ahs_protect_project_delete() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS (SELECT 1 FROM portal_agreement_signatures s JOIN portal_documents d ON d.id = s.document_id WHERE d.project_id = OLD.id)
        OR EXISTS (SELECT 1 FROM portal_invoices i JOIN portal_documents d ON d.id = i.document_id WHERE d.project_id = OLD.id AND (i.status IN ('paid','issued') OR i.submitted_at IS NOT NULL))
      THEN RAISE EXCEPTION 'Archive this workspace; it contains a signature, payment, pending receipt, or issued invoice' USING ERRCODE = 'P0001'; END IF;
      RETURN OLD;
    END $$`;
  await sql`CREATE OR REPLACE FUNCTION ahs_protect_client_delete() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS (SELECT 1 FROM portal_projects WHERE client_id = OLD.id) THEN
        RAISE EXCEPTION 'Client still has a workspace' USING ERRCODE = 'P0001';
      END IF;
      RETURN OLD;
    END $$`;
  await sql`DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ahs_client_delete_guard' AND tgrelid = 'portal_clients'::regclass) THEN
      CREATE TRIGGER ahs_client_delete_guard BEFORE DELETE ON portal_clients FOR EACH ROW EXECUTE FUNCTION ahs_protect_client_delete();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ahs_signature_project_lock' AND tgrelid = 'portal_agreement_signatures'::regclass) THEN
      CREATE TRIGGER ahs_signature_project_lock BEFORE INSERT ON portal_agreement_signatures FOR EACH ROW EXECUTE FUNCTION ahs_lock_project_record();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ahs_invoice_project_lock' AND tgrelid = 'portal_invoices'::regclass) THEN
      CREATE TRIGGER ahs_invoice_project_lock BEFORE INSERT OR UPDATE ON portal_invoices FOR EACH ROW EXECUTE FUNCTION ahs_lock_project_record();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ahs_project_delete_guard' AND tgrelid = 'portal_projects'::regclass) THEN
      CREATE TRIGGER ahs_project_delete_guard BEFORE DELETE ON portal_projects FOR EACH ROW EXECUTE FUNCTION ahs_protect_project_delete();
    END IF;
  END $$`;
}
