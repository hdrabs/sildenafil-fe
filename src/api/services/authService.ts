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
  cart?: CartV2;
  redirect_path?: string;
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

  verifyPhoneOtp: (phone: string, otp_code: string): Promise<AuthTokenResponse> =>
    api.post<AuthTokenResponse>("/v2/session", { identifier: phone, otp_code }),

  me: (): Promise<UserMeResponse> =>
    api.get<UserMeResponse>("/v2/me"),

  updateMe: (data: PatientInfoRequest): Promise<UserMeResponse> =>
    api.put<UserMeResponse>("/v2/me", data),

  resendEmailVerification: (): Promise<{ sent: boolean }> =>
    api.post<{ sent: boolean }>("/v2/email_verifications", {}),
};
