"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCheckEligibility,
  useCreateCartV2,
  useUpdateCartV2,
} from "@/api/hooks/useCartQueries";
import { useSetActiveCart } from "@/store";
import { VisitEligibilityModal } from "@/types/visit";

interface UseStartVisitOptions {
  landingContext?: string;
  // The entry page id, persisted on the cart for "back" navigation out of the
  // questionnaire. Defaults to landingContext (the marketing pages already set it).
  landingUrl?: string;
  cartToken?: string;
  // URL ?discount= forwarded onto the cart so its price matches the catalog/banner.
  discountCode?: string;
}

interface StartVisitParams {
  slug: string;
  quantity: number;
  variantLabel: string;
}

export const useStartVisit = ({ landingContext, landingUrl, cartToken, discountCode }: UseStartVisitOptions = {}) => {
  const originId = landingUrl ?? landingContext;
  const router = useRouter();
  const setActiveCart = useSetActiveCart();
  const [blockingModal, setBlockingModal] = useState<VisitEligibilityModal | null>(null);

  const { mutateAsync: checkEligibility, isPending: isCheckingEligibility } = useCheckEligibility();
  const { mutateAsync: createCart, isPending: isCreatingCart } = useCreateCartV2();
  const { mutateAsync: updateCart, isPending: isUpdatingCart } = useUpdateCartV2();

  const isPending = isCheckingEligibility || isCreatingCart || isUpdatingCart;

  const startVisit = async ({ slug, quantity, variantLabel }: StartVisitParams) => {
    try {
      // slug lets the backend spot a refill intent (a covering Rx for this drug) and
      // return the refill-scoped decision (resume an editable refill / block a same-drug
      // collision) instead of the visit gates. quantity distinguishes a genuine refill
      // (within the Rx → independent) from one that would become a visit (over the Rx →
      // still gated).
      const eligibility = await checkEligibility({
        slug,
        quantity,
        ...(cartToken && { cart_token: cartToken }),
      });

      if (eligibility.action === "show_modal" && eligibility.modal) {
        setBlockingModal(eligibility.modal);
        return;
      }

      let result;

      if (eligibility.action === "update_cart" && eligibility.cart_id) {
        result = await updateCart({
          id: eligibility.cart_id,
          data: {
            slug,
            quantity,
            ...(landingContext && { landing_context: landingContext }),
            ...(originId && { landing_url: originId }),
            ...(cartToken && { cart_token: cartToken }),
            ...(discountCode && { discount: discountCode }),
          },
        });
      } else {
        result = await createCart({
          slug,
          quantity,
          ...(cartToken && { cart_token: cartToken }),
          ...(landingContext && { landing_context: landingContext }),
          ...(originId && { landing_url: originId }),
          ...(discountCode && { discount: discountCode }),
        });
      }

      setActiveCart({
        cart: result.cart,
        carts: [],
        orderId: null,
        variantLabel,
        redirectPath: result.redirect_path,
        originPath: result.origin_path,
      });

      router.push(result.redirect_path);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const dismissModal = () => setBlockingModal(null);

  return {
    startVisit,
    isPending,
    blockingModal,
    dismissModal,
  };
};
