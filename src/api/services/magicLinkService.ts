import api from "@/api/baseAPI";
import { MagicLinkResolution } from "@/types/magicLink";

export const magicLinkService = {
  // POST /v2/magic_link — consume the SMS magic link (public; a Bearer, if the
  // caller is signed in, identifies them). Returns the 4-branch resolution.
  consume: (token: string): Promise<MagicLinkResolution> =>
    api.post<MagicLinkResolution>("/v2/magic_link", { token }),
};
