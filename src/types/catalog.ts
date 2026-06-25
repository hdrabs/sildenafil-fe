export interface CatalogProductInfo {
  drug: string;
  dosage: string;
  display_name: string;
  slug: string;
}

export interface CatalogDrugInfo {
  name: string;
  subtitle: string | null;
  overview: string | null;
  description: string | null;
  usage: string | null;
  side_effects: string | null;
  precautions: string | null;
  drug_interactions: string | null;
  storage: string | null;
  other_info: string | null;
}

export interface CatalogPackage {
  quantity: number;
  original_price: number;
  final_price: number;
  per_tablet: number;
  discount_percentage: number;
  is_popular: boolean;
  extra_tablets: number;
}

export interface CatalogDiscount {
  code: string | null;
  amount: number | null;
  shipping_cost: string | null;
  type: string;
  banner_text: string | null;
  valid: boolean;
}

export interface CatalogDefaultPackage {
  quantity: number;
  original_price: number;
  final_price: number;
  per_tablet: number;
  discount_percentage: number;
  shipping_cost: string;
}

export interface CatalogPrescription {
  rx_id: string;
  rx_total_quantity_remaining: number;
  quantity_dispensed: number;
  prescription_id: number;
}

export interface CatalogVariant {
  product: CatalogProductInfo;
  drug_info: CatalogDrugInfo;
  min_order_quantity: number;
  packages: CatalogPackage[];
  discount: CatalogDiscount | null;
  default_package: CatalogDefaultPackage | null;
  prescription: CatalogPrescription | null;
  page_type: string;
  price_tier: string;
}

export interface CatalogListResponse {
  products: CatalogVariant[];
}

export interface CatalogParams {
  slug?: string;
  discount?: string;
  custom_quantity?: number[];
  landing_context?: string;
}
