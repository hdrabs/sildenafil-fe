import { cn } from "@/lib/utils";

interface Props {
  /** The saved address failed USPS/Smarty verification (verified === false). */
  verified?: boolean | null;
  /**
   * Delivery types in play (e.g. the cart/order delivery_type and the selected
   * delivery option). A "personal" hand-off doesn't ship, so it suppresses the
   * warning — mirrors AUM, which gates on every delivery_type being non-personal.
   */
  deliveryTypes?: Array<string | null | undefined>;
  className?: string;
}

/**
 * AUM `patient-info-card__address-warning`: shown when a saved shipping address
 * didn't pass verification and the order will actually ship.
 */
export const AddressIssueWarning = ({ verified, deliveryTypes = [], className }: Props) => {
  if (verified !== false || deliveryTypes.some((t) => t === "personal")) return null;

  return (
    <p className={cn("text-xs font-medium leading-[1.6] text-coral", className)}>
      Our system shows an issue with your address, shipping delays may occur. Contact us at{" "}
      <a href="tel:7142762040" className="underline">
        (714) 276-2040
      </a>{" "}
      for more information.
    </p>
  );
};
