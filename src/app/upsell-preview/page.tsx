"use client";

// TEMPORARY preview route for visual QA of the upsell design — delete after review.
import { UpsellOfferView } from "@/features/upsell/components/UpsellOfferView";
import { UpsellOffer } from "@/types/upsell";

const offer: UpsellOffer = {
  product_name: "Sildenafil 20 mg",
  upsell_quantity: 32,
  extra_tablets: 0,
  base_price: 48.0,
  upsell_price: 45.6,
  discount_amount: 0,
  final_price: 45.6,
  price_difference: 2.4,
  discount_percent: 5,
  total_savings: 2.4,
  tablet_display: "32 Tablets",
  discount_display: "-0.00",
  show_new_patient_discount: false,
  with_free_shipping: true,
  shipping_label: "(FREE Priority 1 to 3 day delivery)",
  bonus_emphasis: "$48.00 to $45.60 and this higher supply comes at a lower cost per tablet",
  bonus_tail: "— making it the smartest way to maximize your treatment and savings today.",
  video_name: "sildenafil",
  current_quantity: 24,
};

const noop = () => {};

const UpsellPreview = () => (
  <UpsellOfferView
    offer={offer}
    firstName="sdfsd"
    secondsLeft={510}
    videoSrc="https://d3959x8cuku1ma.cloudfront.net/upsell/sildenafil_d.mp4"
    purchase={noop}
    decline={noop}
    isSubmitting={false}
  />
);

export default UpsellPreview;
