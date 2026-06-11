import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "@/api/services/userService";
import { UserMeResponse, UpdateProfileRequest } from "@/types/user";
import { userKeys } from "@/constants/queryKeys";

export const useCurrentUser = (enabled = true) =>
  useQuery<UserMeResponse>({
    queryKey: userKeys.current(),
    queryFn: () => userService.getProfile(),
    enabled,
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
  });
