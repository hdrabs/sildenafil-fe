import { useMutation, useQuery } from "@tanstack/react-query";
import { chatService } from "@/api/services/chatService";
import { chatKeys } from "@/constants/queryKeys";

export const useChatData = (enabled: boolean) =>
  useQuery({
    queryKey: chatKeys.detail(),
    queryFn: () => chatService.getChat(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

export const useMarkChatRead = () => useMutation({ mutationFn: () => chatService.markRead() });
