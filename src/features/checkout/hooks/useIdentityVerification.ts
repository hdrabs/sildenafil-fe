"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useVerifyIdentitySsn, useUploadIdInstead } from "@/api/hooks/useCheckoutQueries";
import { ssnSchema, SsnFormValues } from "@/features/checkout/schemas/identityVerificationSchema";
import { APIError } from "@/api/baseAPI";

/**
 * Drives the identity_verification step. The user verifies with the last 4 SSN
 * digits (Plaid IDV, server-side) or chooses to upload their ID instead. The page
 * never decides the branch: it submits and follows the server's redirect_path.
 */
export const useIdentityVerification = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;

  const { back, steps } = useStepNavigation("identity_verification");
  const verifySsn = useVerifyIdentitySsn();
  const uploadInstead = useUploadIdInstead();

  const [limitExceeded, setLimitExceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SsnFormValues>({
    resolver: zodResolver(ssnSchema),
    mode: "onTouched",
    defaultValues: { ssn_code: "" },
  });

  const submitSsn = form.handleSubmit(async ({ ssn_code }) => {
    if (cartId <= 0) return;
    setError(null);
    try {
      const res = await verifySsn.mutateAsync({ cart_id: cartId, cart_token: cartToken, ssn_code });
      if (res.identity_verification.plaid_status) {
        router.push(res.redirect_path);
        return;
      }
      if (res.identity_verification.limit_exceeded) {
        setLimitExceeded(true);
      } else {
        setError("We couldn't verify that SSN. Please double-check the last 4 digits and try again.");
      }
    } catch (e) {
      setError(e instanceof APIError ? e.message : "Something went wrong. Please try again.");
    }
  });

  const uploadIdInstead = async () => {
    if (cartId <= 0) return;
    const { redirect_path } = await uploadInstead.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  return {
    form,
    submitSsn,
    uploadIdInstead,
    limitExceeded,
    error,
    isVerifying: verifySsn.isPending,
    isContinuing: uploadInstead.isPending,
    back,
    steps,
  };
};
