export type DeliveryType = "grounded" | "standard" | "express" | "personal";

export interface EstimatedDate {
  day_name: string;
  month_day: string;
}

/**
 * Matches Api::V2::DeliveryOptionBlueprint. `price_value` is computed per-cart
 * by the v2 endpoint (0 = free). `estimated_delivery_date` is populated when a
 * destination zip is supplied.
 */
export interface DeliveryOption {
  id: number;
  delivery_type: DeliveryType;
  price_value: number | null;
  label: string;
  label_info: string;
  delivery_days_label: string;
  estimated_delivery_date: EstimatedDate | null;
  free_amount_level: number | null;
  discount_amount_label: string | null;
}

export interface DeliveryOptionsResponse {
  delivery_options: DeliveryOption[];
  cutoff_time_remaining: string | null;
}
