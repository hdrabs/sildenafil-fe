/**
 * GET /v2/medical_visits — curated Medical Visits feed. The backend owns the
 * status matrix (badge, detail heading/message/tone, buttons); the FE renders it.
 */

export type VisitActionType = "start_new_visit" | "resume_visit" | "view_visit";

export interface VisitAction {
  type: VisitActionType;
  label: string;
  href?: string;
  external?: boolean;
}

export interface VisitDetailBlock {
  heading: string;
  message: string;
  tone: "info" | "success" | "warning" | "error" | "pending";
  actions: VisitAction[];
}

export interface VisitPresentation {
  badge: string;
  badge_tone: "neutral" | "info" | "completed" | "ended";
  resume_href: string | null; // draft → "Resume visit"; null → "View details"
  detail: VisitDetailBlock | null;
}

export interface VisitPharmacy {
  name: string;
  phone: string;
}

export interface MedicalVisit {
  uuid: string;
  visit_number: string;
  created_at: string;
  visit_type_title: string; // list card title
  visit_type_label: string; // detail "Visit Type"
  cost: string;
  drug: string; // bottle image
  medication_name: string; // "Sildenafil 20 mg"
  medication_quantity: string | null; // "150 tablets, 3 refills"
  pharmacy: VisitPharmacy | null;
  show_photos: boolean;
  id_card_url: string | null;
  selfie_url: string | null;
  presentation: VisitPresentation;
}

export interface MedicalVisitsResponse {
  visits: MedicalVisit[];
}
