"use client";

import { LegalDrawer } from "@/components/legal/LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
};

// States we currently ship to (ported verbatim from the legacy ShippingPolicyModal).
const SHIPPING_STATES = [
  "Alaska",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Maine",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Montana",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Texas",
  "Utah",
  "Vermont",
  "Washington",
  "Wisconsin",
  "Wyoming",
];

// Numbered list with a divider under each row (matches the legacy
// shipping-policy list). Rendered as a <div> so it sidesteps LegalDrawer's
// [&_ol]/[&_li] prose styling and we get full control of the borders.
const PolicyList = ({ items }: { items: string[] }) => (
  <div className="mb-3">
    {items.map((item, index) => (
      <div
        key={item}
        className="flex gap-2 border-b border-border-default py-3 last:border-b-0 last:pb-0"
      >
        <span className="shrink-0">{index + 1}.</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const SHIPPING_CHARGES = [
  "Free Shipping: Orders over $100 qualify for free shipping.",
  "USPS Ground Free",
  "USPS Priority Mail $12.81",
  "USPS Priority Mail Express: $29.45",
];

const SHIPPING_METHODS = ["USPS Priority Mail", "USPS Priority Mail Express"];

export const ShippingPolicyDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="Shipping Policy" size="wide">
      <p>
        At Sildenafil.com, we strive to provide fast and reliable shipping to ensure you receive your
        products promptly. Please review our shipping policy below for details on where we ship, our
        shipping methods, and associated charges.
      </p>

      <p>
        <strong>Shipping Destinations</strong>
      </p>
      <p>We currently ship to the following states in the United States:</p>
      <PolicyList items={SHIPPING_STATES} />

      <p>
        <strong>Shipping Charges</strong>
      </p>
      <PolicyList items={SHIPPING_CHARGES} />

      <p>
        <strong>Shipping Methods</strong>
      </p>
      <p>
        We use the United States Postal Service (USPS) for all shipments. You can select your
        preferred shipping method during checkout:
      </p>
      <PolicyList items={SHIPPING_METHODS} />

      <p>
        <strong>Handling Time</strong>
      </p>
      <p>
        We aim to process and ship all orders within 24 hours of receiving them. Orders placed on
        weekends or holidays will be processed the next business day.
      </p>

      <p>
        <strong>Shipping Time</strong>
      </p>
      <p>
        USPS Priority - Packages are usually delivered within 3 to 7 business days after shipping.
        However, in rare cases, delays can occur due to weather, carrier issues, or other unforeseen
        circumstances. In these situations, your order may take up to 20 days to arrive. If your
        package does not arrive within this timeframe, we will gladly resend your order at no
        additional charge.
      </p>
      <p>
        USPS Express - Packages are delivered within 1 to 2 business days after it has been shipped.
        Please note that selecting express shipping does not expedite the prescription approval
        process.
      </p>

      <p>
        <strong>Shipping Notification</strong>
      </p>
      <p>
        An email containing a tracking link will be sent to you as soon as your package has been
        shipped. This allows you to monitor the delivery status of your order.
      </p>

      <p>
        <strong>Contact Us</strong>
      </p>
      <p>
        If you have any questions or concerns regarding our shipping policy, please feel free to
        contact us at <a href="tel:+18447453362">(844) 745-3362</a> or care@sildenafil.com.
      </p>
    </LegalDrawer>
  );
};
