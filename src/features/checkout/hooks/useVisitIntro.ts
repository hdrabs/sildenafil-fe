"use client";

import { useRouter } from "next/navigation";
import { useAdvanceVisitIntro } from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart } from "@/store";

export const useVisitIntro = () => {
  const router = useRouter();
  const activeCart = useActiveCart();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { mutateAsync: advanceVisitIntro, isPending } = useAdvanceVisitIntro();

  const onContinue = async () => {
    try {
      const { redirect_path } = await advanceVisitIntro({
        cart_id: cartId,
        cart_token: cartToken,
      });
      router.push(redirect_path);
    } catch {
      // stay on page
    }
  };

  return { onContinue, isPending };
};
