import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/api/services/userService";
import { UserMeResponse, UpdateProfileRequest, ChangePasswordRequest } from "@/types/user";
import { userKeys } from "@/constants/queryKeys";

export const useCurrentUser = (enabled = true) =>
  useQuery<UserMeResponse>({
    queryKey: userKeys.current(),
    queryFn: () => userService.getProfile(),
    enabled,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateProfile(data),
    // Re-seed the cached profile so verification flags + edits show immediately.
    onSuccess: (user: UserMeResponse) => {
      queryClient.setQueryData(userKeys.current(), user);
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordRequest) => userService.changePassword(data),
  });
