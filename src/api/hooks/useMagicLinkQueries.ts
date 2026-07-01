import { useMutation } from "@tanstack/react-query";
import { magicLinkService } from "@/api/services/magicLinkService";

export const useConsumeMagicLink = () =>
  useMutation({
    mutationFn: (token: string) => magicLinkService.consume(token),
  });
