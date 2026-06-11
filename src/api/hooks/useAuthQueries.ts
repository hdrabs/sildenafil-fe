import { useMutation } from "@tanstack/react-query";
import { authService } from "@/api/services/authService";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthTokenResponse,
} from "@/api/services/authService";

export const useRegister = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
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

export type { AuthTokenResponse };
