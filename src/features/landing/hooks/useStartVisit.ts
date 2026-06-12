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
  cartToken?: string;
}

interface StartVisitParams {
  slug: string;
  quantity: number;
  variantLabel: string;
}

const MODAL_MESSAGES: Record<VisitEligibilityModal, { title: string; body: string }> = {
  retake: {
    title: "Questionnaire Required",
    body: "Please complete your health questionnaire before placing a new order.",
  },
  under_review: {
    title: "Order Under Review",
    body: "Your previous order is currently under review. Please wait for it to be processed.",
  },
  order_processing: {
    title: "Order In Progress",
    body: "You already have an order being processed. Please wait until it is complete before placing a new order.",
  },
};

export const useStartVisit = ({ landingContext, cartToken }: UseStartVisitOptions = {}) => {
  const router = useRouter();
  const setActiveCart = useSetActiveCart();
  const [blockingModal, setBlockingModal] = useState<VisitEligibilityModal | null>(null);

  const { mutateAsync: checkEligibility, isPending: isCheckingEligibility } = useCheckEligibility();
  const { mutateAsync: createCart, isPending: isCreatingCart } = useCreateCartV2();
  const { mutateAsync: updateCart, isPending: isUpdatingCart } = useUpdateCartV2();

  const isPending = isCheckingEligibility || isCreatingCart || isUpdatingCart;

  const startVisit = async ({ slug, quantity, variantLabel }: StartVisitParams) => {
    try {
      const eligibility = await checkEligibility(
        cartToken ? { cart_token: cartToken } : undefined,
      );

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
            ...(cartToken && { cart_token: cartToken }),
          },
        });
      } else {
        result = await createCart({
          slug,
          quantity,
          ...(cartToken && { cart_token: cartToken }),
          ...(landingContext && { landing_context: landingContext }),
        });
      }

      setActiveCart({
        cart: result.cart,
        variantLabel,
        redirectPath: result.redirect_path,
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
    blockingModalContent: blockingModal ? MODAL_MESSAGES[blockingModal] : null,
    dismissModal,
  };
};
