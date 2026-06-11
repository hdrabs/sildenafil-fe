import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  creditCardSchema,
  CreditCardFormValues,
} from "@/features/payments/schemas/creditCardSchema";
import { useAddCreditCard } from "@/api/hooks/useCreditCardQueries";
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

/**
 * Wraps window.Accept.dispatchData in a Promise.
 * Returns the opaque token or throws with a human-readable message.
 */
const tokenizeCard = (cardData: {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
}): Promise<AuthorizeNetOpaqueData> =>
  new Promise((resolve, reject) => {
    if (!window.Accept) {
      reject(new Error("Authorize.Net Accept.js not loaded. Please refresh and try again."));
      return;
    }

    const apiLoginID = process.env.NEXT_PUBLIC_ANET_API_LOGIN_ID ?? "";
    const clientKey  = process.env.NEXT_PUBLIC_ANET_CLIENT_KEY ?? "";

    if (!apiLoginID || !clientKey) {
      reject(new Error("Payment gateway is not configured."));
      return;
    }

    window.Accept.dispatchData(
      { authData: { apiLoginID, clientKey }, cardData },
      (response) => {
        if (response.messages.resultCode === "Ok" && response.opaqueData) {
          resolve(response.opaqueData);
        } else {
          const firstMsg = response.messages.message?.[0];
          const msg = firstMsg
            ? `[${firstMsg.code}] ${firstMsg.text}`
            : "Card tokenization failed.";
          reject(new Error(msg));
        }
      }
    );
  });

interface UseAddCreditCardFormOptions {
  onSuccess: () => void;
}

export const useAddCreditCardForm = ({ onSuccess }: UseAddCreditCardFormOptions) => {
  const addCard = useAddCreditCard();
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

    let opaqueData: AuthorizeNetOpaqueData;
    try {
      opaqueData = await tokenizeCard(cardData);
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : "Card tokenization failed.");
      return;
    }

    await addCard.mutateAsync({
      billing_address: {
        first_name: values.first_name,
        last_name:  values.last_name,
        zip:        values.zip,
      },
      opaque_data: opaqueData,
    });

    onSuccess();
  });

  return {
    form,
    submit,
    isLoading: addCard.isPending,
    error: tokenError ?? (addCard.error ? "Something went wrong. Please try again." : null),
  };
};
