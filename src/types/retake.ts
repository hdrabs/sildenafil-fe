export type RetakeKind = "selfie" | "id_card";

// GET /v2/retake_status — user-scoped: is any visit photo flagged for re-take?
// Drives the post-login prompt.
export interface RetakePending {
  retake_pending: boolean;
}

// GET /v2/checkout/retake_photos — which photos the provider flagged for re-take.
export interface RetakeStatus {
  selfie_retake: boolean;
  id_retake: boolean;
}

// PUT /v2/checkout/retake_photos — the refreshed status after an upload;
// completed = nothing left to re-take (the visit went back to review).
export interface RetakeUploadResponse extends RetakeStatus {
  completed: boolean;
}
