import { ProductVariantRich } from "@/types/product";

/**
 * Matches shared/_prescription.json.jbuilder
 * Note: expiration_date is NOT in this partial (it appears in account/order_refill partials only).
 */
export interface Prescription {
  id: number;
  rxId: string;
  rxTotalQuantityRemaining: number;
  transactionDate: string | null;
  quantityDispensed: number | null;
  lastChangedOn: string | null;
  status: "active" | "inactive";
  productVariantId: number;
  productVariant: ProductVariantRich;
  hasAnActiveCart: boolean;
  isValidForOrdering: boolean;
}

/**
 * Richer shape returned by GET /v1/account/order_refill (active_prescription partial)
 * Adds expiration_date and cart-related flags.
 */
export interface ActivePrescription extends Prescription {
  expirationDate: string | null;
  cartStage: string | null;
  openTelemedicineCartId: number | null;
}
