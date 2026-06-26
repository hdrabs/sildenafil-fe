import api from "@/api/baseAPI";
import { UserMeResponse, UpdateProfileRequest, ChangePasswordRequest } from "@/types/user";

export const userService = {
  getProfile: (): Promise<UserMeResponse> => api.get<UserMeResponse>("/v2/me"),

  updateProfile: (data: UpdateProfileRequest): Promise<UserMeResponse> =>
    api.patch<UserMeResponse>("/v2/me", data),

  // PUT /v2/profile/password — authenticated change (requires current_password).
  changePassword: (data: ChangePasswordRequest): Promise<{ message: string }> =>
    api.put<{ message: string }>("/v2/profile/password", data),
};
