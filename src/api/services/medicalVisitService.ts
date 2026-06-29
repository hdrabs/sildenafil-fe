import api from "@/api/baseAPI";
import { MedicalVisitsResponse } from "@/types/medicalVisit";

export const medicalVisitService = {
  // GET /v2/medical_visits — the patient's curated Medical Visits feed.
  getMedicalVisits: (): Promise<MedicalVisitsResponse> =>
    api.get<MedicalVisitsResponse>("/v2/medical_visits"),
};
