import api from "@/api/baseAPI";
import { UserMeResponse, PatientInfoRequest } from "@/types/user";
import { CartV2 } from "@/types/cart";

export interface RegisterRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms_of_service: boolean;
    time_zone?: string;
    cart_token?: string;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
  // Guest cart token from cartStore, forwarded so the backend can reconcile it on login.
  cart_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokenResponse {
  token: string;
  cart?: CartV2 | null;
  redirect_path?: string | null;
  // Login reconcile (S1–S4): true when the backend dropped the guest token cart.
  cart_token_cleared?: boolean;
  // Set on S4 (ineligible) — one of 'retake' | 'under_review' | 'order_processing'.
  ineligible_reason?: string | null;
}

export interface CheckEmailResponse {
  available: boolean;
}

export const authService = {
  checkEmail: (email: string): Promise<CheckEmailResponse> =>
    api.post<CheckEmailResponse>("/v2/email_checks", { email }),

  register: (data: RegisterRequest): Promise<AuthTokenResponse> =>
    api.post<AuthTokenResponse>("/v2/registration", data),

  login: (data: LoginRequest): Promise<AuthTokenResponse> =>
    api.post<AuthTokenResponse>("/v2/session", data),

  // Exchange an admin-issued SignInToken (the /users/become/:token deep link) for a
  // patient JWT, logging the patient into this app.
  become: (token: string): Promise<AuthTokenResponse> =>
    api.post<AuthTokenResponse>("/v2/become", { token }),

  logout: (): Promise<Record<string, never>> =>
    api.delete<Record<string, never>>("/v2/session"),

  forgotPassword: (data: ForgotPasswordRequest): Promise<Record<string, never>> =>
    api.post<Record<string, never>>("/v2/password", data),

  resetPassword: (data: ResetPasswordRequest): Promise<AuthTokenResponse> =>
    api.put<AuthTokenResponse>("/v2/password", data),

  getLoginHints: (identifier: string): Promise<{ email: string; phone: string | null }> =>
    api.get<{ email: string; phone: string | null }>(`/v2/login_hints?identifier=${encodeURIComponent(identifier)}`),

  // Accepts a phone number OR an email. When an email is passed, the backend
  // looks up the user's registered phone and sends the SMS there.
  sendPhoneOtp: (phoneOrEmail: string): Promise<{ sent: boolean }> => {
    const isEmail = phoneOrEmail.includes("@");
    return api.post<{ sent: boolean }>(
      "/v2/phone_logins",
      isEmail ? { email: phoneOrEmail } : { phone: phoneOrEmail },
    );
  },

  sendEmailOtp: (email: string): Promise<{ sent: boolean }> =>
    api.post<{ sent: boolean }>("/v2/email_logins", { email }),

  verifyPhoneOtp: (phone: string, otp_code: string, cart_token?: string): Promise<AuthTokenResponse> =>
    api.post<AuthTokenResponse>("/v2/session", { identifier: phone, otp_code, ...(cart_token && { cart_token }) }),

  me: (): Promise<UserMeResponse> =>
    api.get<UserMeResponse>("/v2/me"),

  updateMe: (data: PatientInfoRequest): Promise<UserMeResponse> =>
    api.put<UserMeResponse>("/v2/me", data),

  resendEmailVerification: (): Promise<{ sent: boolean }> =>
    api.post<{ sent: boolean }>("/v2/email_verifications", {}),

  // Confirm the email via the token from the emailed link; returns a Bearer so
  // the /confirmation page can auto-log-in (public endpoint).
  confirmEmail: (token: string): Promise<AuthTokenResponse> =>
    api.put<AuthTokenResponse>(`/v2/email_verifications/${encodeURIComponent(token)}`, {}),

  generateOtp: (): Promise<void> =>
    api.post<void>("/v2/otp", {}),

  verifyOtp: (code: string): Promise<{ message: string }> =>
    api.put<{ message: string }>("/v2/otp/verify", { code }),
};
