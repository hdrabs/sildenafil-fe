"use client";

import Image from "next/image";
import {
  RiCheckLine,
  RiArrowRightLine,
  RiTruckLine,
  RiTimeLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { CatalogVariant } from "@/types/catalog";

// Normalises a dosage string (e.g. "20 mg", "2.5 mg") into the image-file prefix
// used under public/images/tablets/{drug}/
const normaliseDosage = (dosage: string): string => {
  if (dosage.includes("2.5")) return "2-5m";
  return dosage.replace(/\D/g, "") + "m";
};

const getTabletImages = (
  drug: string | undefined,
  dosage: string | undefined,
): [string, string] | null => {
  if (!drug || !dosage) return null;
  const folder = drug === "sildenafil" ? "sildenafil" : "tadalafil";
  const prefix = normaliseDosage(dosage);
  return [
    `/images/tablets/${folder}/${prefix}1.png`,
    `/images/tablets/${folder}/${prefix}2.png`,
  ];
};

export type LandingTheme = "sildenafil" | "tadalafil";

interface ProductSidebarProps {
  theme: LandingTheme;
  productName: string;
  dosage: string;
}

const themeConfig = {
  sildenafil: {
    bg: "bg-primary",
    pill: "bg-blue-400",
    accent: "text-blue-300",
    badge: "bg-blue-800/60 text-blue-200",
  },
  tadalafil: {
    bg: "bg-bg-tadalafil",
    pill: "bg-amber-400",
    accent: "text-amber-300",
    badge: "bg-amber-900/60 text-amber-200",
  },
};

const features = [
  "No Monthly Subscriptions",
  "FDA Approved",
  "Free Online Doctor Visit",
  "Expert Pharmacist Guidance",
  "Low Price Guarantee",
];

const testimonials = [
  {
    text: "I had a few doubts that it would help me—but the only other alternative was to purchase the brand name expensive VIAGRA—and if I could get the expected results with this Sildenafil, then I would benefit two-fold.",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "I've issues with ED due to blood flow issues. I had a previous Sildenafil prescription at $50.00 a dose. After paying too high of prices, I was doing some research to find a cheaper price.",
    location: "Sildenafil Patient, NY",
  },
];

export const ProductSidebar = ({
  theme,
  productName,
  dosage,
}: ProductSidebarProps) => {
  const tc = themeConfig[theme];

  return (
    <div className={cn("flex flex-col px-8 py-10 text-white", tc.bg)}>
      <p className={cn("mb-3 flex items-center gap-2 text-sm font-semibold", tc.accent)}>
        🇺🇸 US Lab Tested &amp; Official Source
      </p>
      <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
        {dosage} {productName}
        <br />
        Prescribed &amp; Delivered
      </h1>

      <ul className="mt-6 flex flex-col gap-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
            <RiCheckLine className="h-4 w-4 shrink-0 text-white" />
            {f}
          </li>
        ))}
      </ul>

      {/* Pill image placeholder */}
      <div className="my-8 flex items-center justify-center">
        <div className={cn("flex h-32 w-32 items-center justify-center rounded-full opacity-80", tc.pill)}>
          <span className="text-4xl">💊</span>
        </div>
      </div>

      {/* Start time badge */}
      <div className={cn("inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-xs font-semibold", tc.badge)}>
        <RiTimeLine className="h-4 w-4" />
        Starts working in 15-60 min*
      </div>

      {/* Testimonials */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Patient Testimonials</h3>
        <div className="flex flex-col gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl bg-white/10 p-4">
              <p className="text-xs text-white/80 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-yellow-400 text-xs">★★★★★</div>
                <span className="text-xs text-white/60">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProductConfiguratorProps {
  theme: LandingTheme;
  contextVariant: CatalogVariant | null;
  activeVariant: CatalogVariant | null;
  allVariants: CatalogVariant[];
  activeDrug: string | null;
  selectedQty: number;
  onQtyChange: (qty: number) => void;
  onStrengthChange: (dosage: string) => void;
  onDrugChange: (drug: string) => void;
  onAddToCart?: (qty: number) => void;
  isSubmitting?: boolean;
}

export const ProductConfigurator = ({
  contextVariant,
  activeVariant,
  allVariants,
  activeDrug,
  selectedQty,
  onQtyChange,
  onStrengthChange,
  onDrugChange,
  onAddToCart,
  isSubmitting = false,
}: Omit<ProductConfiguratorProps, "theme">) => {
  const packages = contextVariant?.packages ?? [];

  // Only highlight a package when qty is explicitly selected (> 0)
  const selectedPkg = selectedQty > 0
    ? (packages.find((p) => p.quantity === selectedQty) ?? null)
    : null;
  const total = selectedPkg?.final_price ?? 0;
  const originalTotal = selectedPkg?.original_price ?? 0;
  const pricePerTablet = selectedPkg?.per_tablet ?? 0;
  const discountPct =
    originalTotal > total && originalTotal > 0
      ? Math.round((1 - total / originalTotal) * 100)
      : 0;

  const currentDrug = contextVariant?.product.drug;
  const dosages = Array.from(
    new Set(
      allVariants
        .filter((v) => v.product.drug === currentDrug)
        .map((v) => v.product.dosage),
    ),
  );

  return (
    <div className="flex flex-col px-6 py-10 sm:px-10">
      {/* Price */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-text-primary">
              ${total.toFixed(2)}
            </span>
            {discountPct > 0 && (
              <span className="text-lg text-text-muted line-through">
                ${originalTotal.toFixed(2)}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-text-muted">
            (${pricePerTablet.toFixed(2)}/tablet)
            {discountPct > 0 && (
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {discountPct}% discount applied
              </span>
            )}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600">
            <RiTruckLine className="h-4 w-4" />
            FREE 1 to 3 Day Priority Shipping
          </div>
        </div>
        {(() => {
          const drug = (activeVariant ?? contextVariant)?.product.drug;
          const dosage = activeVariant?.product.dosage ?? dosages[0];
          const imgs = getTabletImages(drug, dosage);
          if (!imgs) return null;
          return (
            <div className="flex items-center">
              <Image
                src={imgs[0]}
                alt="tablet 1"
                width={56}
                height={56}
                className="object-contain drop-shadow-sm"
              />
              <Image
                src={imgs[1]}
                alt="tablet 2"
                width={56}
                height={56}
                className="object-contain drop-shadow-sm"
              />
            </div>
          );
        })()}
      </div>

      {/* Drug selector */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            1
          </span>
          <p className="font-semibold text-text-primary">Drug</p>
        </div>
        <div className="mt-3 flex gap-3">
          {Array.from(new Set(allVariants.map((v) => v.product.drug))).map((drug) => {
            const isActive = activeDrug === drug;
            return (
              <button
                key={drug}
                onClick={() => onDrugChange(drug)}
                className={cn(
                  "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-semibold capitalize transition-colors",
                  isActive
                    ? "border-primary bg-bg-patient-welcome text-primary"
                    : "border-border-input bg-bg-card text-text-primary hover:border-primary",
                )}
              >
                {drug}
              </button>
            );
          })}
        </div>
      </div>

      {/* Strength selector */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            2
          </span>
          <p className="font-semibold text-text-primary">Strength</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {dosages.map((d) => (
            <button
              key={d}
              onClick={() => onStrengthChange(d)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                activeVariant?.product.dosage === d
                  ? "border-primary bg-primary text-white"
                  : "border-border-input bg-bg-card text-text-primary hover:border-primary",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            3
          </span>
          <p className="font-semibold text-text-primary">Quantity</p>
          <span className="text-xs text-text-muted">Buy more &amp; save</span>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {packages.map((pkg) => {
            const isSelected = pkg.quantity === selectedQty;

            return (
              <button
                key={pkg.quantity}
                onClick={() => onQtyChange(pkg.quantity)}
                className={cn(
                  "flex items-center justify-between rounded-lg border-2 px-4 py-3 text-sm transition-colors",
                  isSelected
                    ? "border-primary bg-bg-patient-welcome"
                    : "border-border-input bg-bg-card hover:border-primary",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border-2",
                      isSelected ? "border-primary bg-primary" : "border-border-input",
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-text-primary">
                    {pkg.extra_tablets > 0
                      ? `${pkg.quantity} + ${pkg.extra_tablets} Tablets`
                      : `${pkg.quantity} Tablets`}
                  </span>
                  {pkg.is_popular && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      Popular
                    </span>
                  )}
                </div>
                <span className="font-semibold text-text-primary">
                  ${pkg.final_price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onAddToCart?.(selectedQty)}
        disabled={isSubmitting || selectedQty === 0}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-bold uppercase tracking-wide text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>
            Start My Free Visit
            <RiArrowRightLine className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  );
};
