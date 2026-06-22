"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useVerifyIdentitySsn, useUploadIdInstead } from "@/api/hooks/useCheckoutQueries";
import { IdentityOption } from "@/types/checkout";
import { APIError } from "@/api/baseAPI";

/**
 * Drives the identity_verification step, matching the legacy aum flow: the user
 * picks how to verify — last-4 SSN (Plaid IDV, server-side) or a government ID +
 * selfie photo. Choosing ID review, or exhausting SSN attempts, advances to the
 * photo-upload path. The page never decides the branch: it submits and follows
 * the server's redirect_path.
 */
export const useIdentityVerification = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;

  const { back, steps } = useStepNavigation("identity_verification");
  const verifySsn = useVerifyIdentitySsn();
  const uploadInstead = useUploadIdInstead();

  const [selectedOption, setSelectedOption] = useState<IdentityOption>("");
  const [ssnModalOpen, setSsnModalOpen] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [ssnError, setSsnError] = useState<string | null>(null);

  // "Upload ID instead": advance without SSN — the server falls through
  // identity_verification → visit_id_upload and returns the next path.
  const advanceToIdReview = async () => {
    if (cartId <= 0) return;
    const { redirect_path } = await uploadInstead.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  // Choice screen "Continue": SSN opens the modal; ID review advances directly.
  const onContinue = async () => {
    if (selectedOption === "last_4_ssn") {
      setSsnError(null);
      setSsnModalOpen(true);
    } else if (selectedOption === "id_review") {
      await advanceToIdReview();
    }
  };

  // Submit last-4 SSN. On a pass the cart advances; otherwise the response says
  // whether to retry or (once attempts are spent) steer to the ID-upload path.
  const submitSsn = async (ssnCode: string) => {
    if (cartId <= 0) return;
    setSsnError(null);
    try {
      const res = await verifySsn.mutateAsync({ cart_id: cartId, cart_token: cartToken, ssn_code: ssnCode });
      if (res.identity_verification.plaid_status) {
        router.push(res.redirect_path);
        return;
      }
      if (res.identity_verification.limit_exceeded) {
        setLimitExceeded(true);
        setSelectedOption("id_review");
      } else {
        setSsnError("The SSN number you entered is invalid.");
      }
    } catch (e) {
      setSsnError(e instanceof APIError ? e.message : "Something went wrong. Please try again.");
    }
  };

  const closeSsnModal = () => {
    if (verifySsn.isPending) return; // don't close mid-verification
    setSsnModalOpen(false);
    setSsnError(null);
  };

  return {
    // choice screen
    selectedOption,
    setSelectedOption,
    onContinue,
    limitExceeded,
    // ssn modal
    ssnModalOpen,
    closeSsnModal,
    submitSsn,
    ssnError,
    isVerifying: verifySsn.isPending,
    continueWithVisit: advanceToIdReview,
    isContinuing: uploadInstead.isPending,
    // shell
    back,
    steps,
  };
};
