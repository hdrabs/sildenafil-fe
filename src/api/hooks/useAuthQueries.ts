import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/api/services/authService";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthTokenResponse,
} from "@/api/services/authService";
import type { PatientInfoRequest } from "@/types/user";

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
  });

export const useBecome = () =>
  useMutation({
    mutationFn: (token: string) => authService.become(token),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => authService.logout(),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });

export const useGetMe = (enabled = true) =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => authService.me(),
    enabled,
  });

export const useUpdateMe = () =>
  useMutation({
    mutationFn: (data: PatientInfoRequest) => authService.updateMe(data),
  });

export const useGenerateOtp = () =>
  useMutation({
    mutationFn: () => authService.generateOtp(),
    // Never auto-retry an OTP send: each attempt dispatches another SMS and
    // counts against the per-window rate limit.
    retry: false,
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: (code: string) => authService.verifyOtp(code),
  });

export type { AuthTokenResponse };
