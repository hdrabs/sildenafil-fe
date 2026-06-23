import api from "@/api/baseAPI";
import {
  CheckoutNavigation,
  CheckoutNavigationParams,
  SsnVerifyResponse,
  ExistingPhotoResponse,
} from "@/types/checkout";
import { CartV2Response } from "@/types/cart";
import { CartSummaryResponse } from "@/types/orderSummary";

const cartQuery = ({ cart_id, cart_token }: CartScoped): string => {
  const qs = new URLSearchParams({ cart_id: String(cart_id) });
  if (cart_token) qs.set("cart_token", cart_token);
  return `?${qs.toString()}`;
};

const buildQuery = ({ step, cart_id, cart_token }: CheckoutNavigationParams): string => {
  const qs = new URLSearchParams({ step, cart_id: String(cart_id) });
  if (cart_token) qs.set("cart_token", cart_token);
  return `?${qs.toString()}`;
};

interface CartScoped {
  cart_id: number;
  cart_token?: string;
}

// Multipart body for the photo-upload endpoints. baseAPI sends FormData as-is
// (no JSON encoding, browser sets the multipart Content-Type/boundary).
const buildPhotoForm = ({ cart_id, cart_token, photo }: CartScoped & { photo: File }): FormData => {
  const form = new FormData();
  form.append("cart_id", String(cart_id));
  if (cart_token) form.append("cart_token", cart_token);
  form.append("photo", photo);
  return form;
};

export const checkoutService = {
  // GET /v2/checkout/navigation — backend-owned back/forward targets + progress steps.
  getNavigation: (params: CheckoutNavigationParams): Promise<CheckoutNavigation> =>
    api.get<CheckoutNavigation>(`/v2/checkout/navigation${buildQuery(params)}`),

  // PUT /v2/checkout/shipping_address — attach the chosen address to the cart.
  // Does NOT advance the step (cart stays at shipping_address_info → delivery view).
  attachShippingAddress: (
    params: CartScoped & { shipping_address_id: number },
  ): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/shipping_address", params),

  // PUT /v2/checkout/delivery — record delivery_type and advance out of the shipping step.
  continueDelivery: (
    params: CartScoped & { delivery_type: string },
  ): Promise<CartV2Response> => api.put<CartV2Response>("/v2/checkout/delivery", params),

  // POST /v2/checkout/identity_verification — submit last-4 SSN; runs Plaid IDV.
  // On a pass the cart advances; otherwise plaid_status/limit_exceeded say why.
  verifyIdentitySsn: (
    params: CartScoped & { ssn_code: string },
  ): Promise<SsnVerifyResponse> =>
    api.post<SsnVerifyResponse>("/v2/checkout/identity_verification", params),

  // PUT /v2/checkout/identity_verification — "upload ID instead": advance without SSN.
  uploadIdInstead: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/identity_verification", params),

  // PUT /v2/checkout/id_upload (multipart) — upload the government-ID photo, then advance.
  uploadIdPhoto: (params: CartScoped & { photo: File }): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/id_upload", buildPhotoForm(params)),

  // PUT /v2/checkout/selfie_upload (multipart) — upload the selfie, then advance.
  uploadSelfiePhoto: (params: CartScoped & { photo: File }): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/selfie_upload", buildPhotoForm(params)),

  // PUT /v2/checkout/id_upload — record the ID-photo skip and advance to the selfie step.
  skipIdUpload: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/id_upload", { ...params, skip_id: true }),

  // PUT /v2/checkout/selfie_upload — record the selfie skip and advance to confirmation.
  skipSelfieUpload: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/selfie_upload", { ...params, skip_selfie: true }),

  // GET /v2/checkout/id_upload — the already-uploaded ID photo URL (or null), so the
  // review step can show it instead of forcing a re-upload.
  getIdPhoto: (params: CartScoped): Promise<ExistingPhotoResponse> =>
    api.get<ExistingPhotoResponse>(`/v2/checkout/id_upload${cartQuery(params)}`),

  // GET /v2/checkout/selfie_upload — the already-uploaded selfie URL (or null).
  getSelfiePhoto: (params: CartScoped): Promise<ExistingPhotoResponse> =>
    api.get<ExistingPhotoResponse>(`/v2/checkout/selfie_upload${cartQuery(params)}`),

  // PUT /v2/checkout/id_upload — advance with the already-uploaded photo, no re-upload
  // (skip_id:false = "not skipped; a photo is already on file").
  continueIdUpload: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/id_upload", { ...params, skip_id: false }),

  // PUT /v2/checkout/selfie_upload — advance with the already-uploaded selfie, no re-upload.
  continueSelfieUpload: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/selfie_upload", { ...params, skip_selfie: false }),

  // PUT /v2/checkout/shipping_confirmation — confirmation "Continue"; advances to order verification.
  continueShippingConfirmation: (params: CartScoped): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/shipping_confirmation", params),

  // GET /v2/checkout/order_verification — the "Almost Done!" cart summary (pricing + variant + discounts).
  getOrderSummary: (params: CartScoped): Promise<CartSummaryResponse> =>
    api.get<CartSummaryResponse>(`/v2/checkout/order_verification${cartQuery(params)}`),

  // PUT /v2/checkout/order_verification — "Complete My Order": completes the PocketMed
  // visit + advances the cart out of order_verification. Does NOT charge (the
  // Authorize.net charge is a separate downstream step).
  completeOrderVerification: (params: CartScoped): Promise<{ redirect_path: string }> =>
    api.put<{ redirect_path: string }>("/v2/checkout/order_verification", params),
};
