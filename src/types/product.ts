export interface PriceThreshold {
  id: number;
  minQuantity: number;
  price: number;
}

/**
 * Rich variant shape — embedded inside cart, order, and prescription responses.
 * Matches shared/_product_variant.json.jbuilder
 */
export interface ProductVariantRich {
  id: number;
  productName: string;
  fullname: string;
  dosage: string;
  dosageValue: number;
  unit: "tablet" | "capsule" | "liquid";
  slug: string;
  productId: number;
  minOrderQuantity: number;
  priceThresholds: PriceThreshold[];
  packages: number[];
  popularQty: number | null;
  refillAvailable?: boolean;
}
