import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  creditCardSchema,
  CreditCardFormValues,
} from "@/features/payments/schemas/creditCardSchema";
import { useAddCreditCard, useAddCreditCardV2 } from "@/api/hooks/useCreditCardQueries";
import { AuthorizeNetOpaqueData } from "@/types/creditCard";

declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        data: {
          authData: { apiLoginID: string; clientKey: string };
          cardData: { cardNumber: string; month: string; year: string; cardCode: string };
        },
        callback: (response: {
          messages: { resultCode: string; message: { code: string; text: string }[] };
          opaqueData?: AuthorizeNetOpaqueData;
        }) => void
      ) => void;
    };
  }
}

// Accept.js validation codes → the field they belong to (mirrors AUM's
// CreditCardForm mapping). Anything not listed surfaces as a form-level banner.
const CODE_TO_FIELD: Partial<Record<string, keyof CreditCardFormValues>> = {
  E_WC_05: "card_number",
  E_WC_06: "expiration_date",
  E_WC_07: "expiration_date",
  E_WC_08: "expiration_date",
  E_WC_15: "card_code",
};

type TokenMessage = { code: string; text: string };
type TokenizeResult =
  | { ok: true; opaqueData: AuthorizeNetOpaqueData }
  | { ok: false; messages: TokenMessage[] };

// Wraps window.Accept.dispatchData in a Promise and never rejects — the caller
// decides whether each message is a field error or a banner.
const tokenizeCard = (cardData: {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
}): Promise<TokenizeResult> =>
  new Promise((resolve) => {
    if (!window.Accept) {
      resolve({
        ok: false,
        messages: [{ code: "E_LOAD", text: "Authorize.Net Accept.js not loaded. Please refresh and try again." }],
      });
      return;
    }

    const apiLoginID = process.env.NEXT_PUBLIC_ANET_API_LOGIN_ID ?? "";
    const clientKey  = process.env.NEXT_PUBLIC_ANET_CLIENT_KEY ?? "";

    if (!apiLoginID || !clientKey) {
      resolve({ ok: false, messages: [{ code: "E_CONFIG", text: "Payment gateway is not configured." }] });
      return;
    }

    window.Accept.dispatchData(
      { authData: { apiLoginID, clientKey }, cardData },
      (response) => {
        if (response.messages.resultCode === "Ok" && response.opaqueData) {
          resolve({ ok: true, opaqueData: response.opaqueData });
        } else {
          resolve({
            ok: false,
            messages: response.messages.message ?? [{ code: "E_UNKNOWN", text: "Card tokenization failed." }],
          });
        }
      }
    );
  });

interface UseAddCreditCardFormOptions {
  // May be async (e.g. checkout completes the order on success) — it's awaited so
  // the button stays in its processing state until the whole flow settles.
  onSuccess: () => void | Promise<void>;
  // The account page adds cards via v2 (matching its v2 card list/delete); the
  // legacy v1 path remains for callers that still need it.
  apiVersion?: "v1" | "v2";
}

export const useAddCreditCardForm = ({ onSuccess, apiVersion = "v1" }: UseAddCreditCardFormOptions) => {
  const addV1 = useAddCreditCard();
  const addV2 = useAddCreditCardV2();
  const addCard = apiVersion === "v2" ? addV2 : addV1;
  const [tokenError, setTokenError] = useState<string | null>(null);

  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      first_name:      "",
      last_name:       "",
      zip:             "",
      card_number:     "",
      expiration_date: "",
      card_code:       "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setTokenError(null);

    // Parse "MM/YY" — Accept.js expects 2-digit year (YY), not YYYY
    const [month, year] = values.expiration_date.split("/");

    const cardData = {
      cardNumber: values.card_number.replace(/\D/g, ""),
      month: month.trim(),
      year:  year.trim(),
      cardCode: values.card_code.trim(),
    };

    const result = await tokenizeCard(cardData);
    if (!result.ok) {
      // Route each message to its field; collect the rest into the banner.
      const banner: string[] = [];
      result.messages.forEach(({ code, text }) => {
        const field = CODE_TO_FIELD[code];
        if (field) form.setError(field, { type: "manual", message: text });
        else banner.push(text);
      });
      if (banner.length) setTokenError(banner.join(" "));
      return;
    }

    try {
      await addCard.mutateAsync({
        billing_address: {
          first_name: values.first_name,
          last_name:  values.last_name,
          zip:        values.zip,
        },
        opaque_data: result.opaqueData,
      });
    } catch {
      // Surfaced via the addCard.error banner below.
      return;
    }

    // Awaited so a slow/failed completion keeps the form in its processing state;
    // the completion path surfaces its own error (it doesn't throw here).
    await onSuccess();
  });

  return {
    form,
    submit,
    isLoading: addCard.isPending,
    error: tokenError ?? (addCard.error ? "Something went wrong. Please try again." : null),
  };
};
