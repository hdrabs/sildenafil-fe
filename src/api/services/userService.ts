import api from "@/api/baseAPI";
import { UserMeResponse, UpdateProfileRequest } from "@/types/user";

export const userService = {
  getProfile: (): Promise<UserMeResponse> => api.get<UserMeResponse>("/v2/me"),

  updateProfile: (data: UpdateProfileRequest): Promise<UserMeResponse> =>
    api.patch<UserMeResponse>("/v2/me", data),
};
