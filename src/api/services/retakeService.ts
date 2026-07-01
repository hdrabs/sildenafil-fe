import api from "@/api/baseAPI";
import { RetakeKind, RetakePending, RetakeStatus, RetakeUploadResponse } from "@/types/retake";

export const retakeService = {
  // GET /v2/retake_status — user-scoped: does the patient have any retake pending?
  getPending: (): Promise<RetakePending> => api.get<RetakePending>("/v2/retake_status"),

  // GET /v2/retake_photos — the outstanding retake flags (the cart is resolved
  // server-side from the patient's visit under review).
  getStatus: (): Promise<RetakeStatus> => api.get<RetakeStatus>("/v2/retake_photos"),

  // PUT /v2/retake_photos — re-upload one flagged photo (multipart; baseAPI sends
  // FormData as-is, browser sets the multipart Content-Type).
  upload: ({ kind, photo }: { kind: RetakeKind; photo: File }): Promise<RetakeUploadResponse> => {
    const form = new FormData();
    form.append("kind", kind);
    form.append("photo", photo);
    return api.put<RetakeUploadResponse>("/v2/retake_photos", form);
  },
};
