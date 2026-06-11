import api from "@/api/baseAPI";
import { ActivePrescription } from "@/types/prescription";

/**
 * Prescriptions are managed through the order_refill account resource.
 * GET /api/v1/account/order_refill — returns active and needs-action prescriptions
 * Matches account/order_refill/index.json.jbuilder
 */
export const prescriptionService = {
  list: (): Promise<ActivePrescription[]> =>
    api.get<ActivePrescription[]>("/v1/account/order_refill"),
};
