"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  RiCheckLine,
  RiTruckLine,
  RiTimeLine,
} from "react-icons/ri";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { CatalogVariant } from "@/types/catalog";

// Modals only render once opened — keep their JS (incl. the strength-guide data
// tables) out of the configurator's initial bundle.
const DrugInfoModal = dynamic(() =>
  import("@/features/landing/components/DrugInfoModal").then((m) => m.DrugInfoModal),
);
const StrengthGuideModal = dynamic(() =>
  import("@/features/landing/components/StrengthGuideModal").then((m) => m.StrengthGuideModal),
);

const DRUG_DISPLAY_NAMES: Record<string, string> = {
  sildenafil: "Sildenafil(Generic Viagra)",
  tadalafil: "Tadalafil(Generic Cialis)",
};

const DRUG_DISPLAY_LINES: Record<string, { name: string; generic: string }> = {
  sildenafil: { name: "Sildenafil", generic: "(Generic Viagra)" },
  tadalafil: { name: "Tadalafil", generic: "(Generic Cialis)" },
};

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
  allowDrugSwitch?: boolean;
  /** Overrides the selected strength/qty border colour (best-value uses coral). */
  selectedColor?: string;
  className?: string;
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
  allowDrugSwitch = false,
  selectedColor,
  className,
}: Omit<ProductConfiguratorProps, "theme">) => {
  const [drugInfoOpen, setDrugInfoOpen] = useState(false);
  const [strengthGuideOpen, setStrengthGuideOpen] = useState(false);

  const packages = (activeVariant ?? contextVariant)?.packages ?? [];

  const selectedPkg = selectedQty > 0
    ? (packages.find((p) => p.quantity === selectedQty) ?? null)
    : null;
  const total = selectedPkg?.final_price ?? 0;

  // Base per-tablet price is the first (smallest) package — all savings are relative to it
  const basePerTablet = packages[0]?.per_tablet ?? 0;
  const selectedSavePct = selectedPkg && basePerTablet > selectedPkg.per_tablet
    ? Math.round((1 - selectedPkg.per_tablet / basePerTablet) * 100)
    : 0;
  const selectedOriginalTotal = selectedPkg ? basePerTablet * selectedPkg.quantity : 0;

  const currentDrug = contextVariant?.product.drug;
  const dosages = Array.from(
    new Set(
      allVariants
        .filter((v) => v.product.drug === currentDrug)
        .map((v) => v.product.dosage),
    ),
  );

  const uniqueDrugs = Array.from(new Set(allVariants.map((v) => v.product.drug)));

  // Best Value = the last (highest qty) non-popular package that has savings vs base
  const bestValuePkg =
    [...packages].reverse().find((pkg) => !pkg.is_popular && pkg.per_tablet < basePerTablet) ?? null;

  const drug = (activeVariant ?? contextVariant)?.product.drug;
  const dosage = activeVariant?.product.dosage ?? dosages[0];
  const tabletImgs = getTabletImages(drug, dosage);

  const isTadalafil = activeDrug === "tadalafil";
  const themeBorderColor = isTadalafil ? "#cd8f24" : "#204ad7";
  // best-value (selectedColor set) recolours only the strength/qty border to coral and keeps
  // the card's white bg; the drug selector always uses the theme border.
  const selectedBorderColor = selectedColor ?? themeBorderColor;
  const selectedBgColor = selectedColor ? "#ffffff" : isTadalafil ? "#f8e9d6" : "#d6e0f8";
  const selectorSelectedStyle = {
    borderColor: selectedBorderColor,
    backgroundColor: selectedBgColor,
  };
  const drugSelectedStyle = {
    borderColor: selectedColor ? "#cbd5e1" : themeBorderColor,
    backgroundColor: selectedBgColor,
  };
  const badgeColor = isTadalafil ? "#cd8f24" : "#0657dd";
  const badgeStyle = { backgroundColor: badgeColor, borderColor: badgeColor };

  // Add-to-cart button — best-value uses the brand primary; else aum .btn-aum.{drug}-free-tier.
  const ctaColor = selectedColor ? "#1b53af" : isTadalafil ? "#CD8F24" : "#204AD7";
  const ctaHover = selectedColor ? "#143d82" : isTadalafil ? "#956004" : "#08299A";
  const ctaDisabled = isSubmitting || !activeVariant || selectedQty === 0;

  const priceHeaderRef = useRef<HTMLDivElement>(null);
  const [priceHeaderHeight, setPriceHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const el = priceHeaderRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPriceHeaderHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let ro: ResizeObserver | null = null;
    let raf = 0;
    // The navbar may mount after this effect (e.g. it's behind a Suspense boundary),
    // so retry until the <header> exists rather than bailing permanently — otherwise
    // navbarHeight stays 0 and the sticky price header tucks under the navbar.
    const attach = () => {
      const navbar = document.querySelector("header");
      if (!navbar) {
        raf = requestAnimationFrame(attach);
        return;
      }
      ro = new ResizeObserver(() => {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      });
      ro.observe(navbar);
    };
    attach();
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  // Warm the browser cache with every tablet image in the catalog so switching
  // drug/strength is instant — no fetch flash. The displayed pills below are
  // `unoptimized`, so they request the raw /public path that this preload hits.
  const tabletImageSignature = allVariants
    .map((v) => `${v.product.drug}:${v.product.dosage}`)
    .join(",");
  useEffect(() => {
    const warm = (srcs: [string, string] | null) =>
      srcs?.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });

    // The two pills on screen now — warm immediately so a drug/strength swap never flashes.
    warm(getTabletImages(drug, dosage));

    // The rest are only needed if the user switches; warm them during idle time so
    // they don't compete with the initial page load (LCP/bandwidth).
    const warmRest = () => {
      tabletImageSignature
        .split(",")
        .filter(Boolean)
        .forEach((combo) => {
          const [d, dose] = combo.split(":");
          warm(getTabletImages(d, dose));
        });
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warmRest);
      return () => window.cancelIdleCallback(handle);
    }
    const handle = window.setTimeout(warmRest, 1500);
    return () => window.clearTimeout(handle);
  }, [tabletImageSignature, drug, dosage]);

  return (
    <div className={cn("mx-auto flex flex-col", className)}>
      {/* Sticky price header — sticks just below navbar on mobile, static on sm+ */}
      <div
        ref={priceHeaderRef}
        className="sticky z-20 bg-white px-6 sm:px-10"
        style={{ top: navbarHeight }}
      >
        <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-[36px] font-bold leading-[1.4] text-text-primary">
              ${total.toFixed(2)}
            </span>
            {selectedSavePct > 0 && (
              <span className="ml-2 text-[30px] font-medium not-italic leading-[140%] line-through opacity-[0.36] text-[rgb(38,42,50)]">
                ${selectedOriginalTotal.toFixed(2)}
              </span>
            )}
          </div>
          {selectedPkg && (
            <p className="mb-2 text-[14px] font-semibold leading-normal text-[#262a32]">
              (${selectedPkg.per_tablet.toFixed(2)}/tablet)
            </p>
          )}
          {activeVariant && selectedQty > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-save">
              <RiTruckLine className="h-4 w-4" />
              FREE 1 to 3 Day Priority Shipping
            </div>
          )}
        </div>
        {tabletImgs && (
          // Fixed footprint sized to the largest (tadalafil) pills, so switching
          // drug/strength never resizes the sticky price header — that resize, and
          // the ResizeObserver-driven sticky-offset recalc it triggered, was the "jerk".
          <div className="flex h-[168px] w-[112px] shrink-0 items-center justify-center sm:h-[112px] sm:w-[230px]">
            <div className={cn(
              "flex flex-col items-center sm:flex-row sm:[&>*+*]:mt-0",
              drug === "tadalafil" ? "[&>*+*]:-mt-6" : "[&>*+*]:-mt-1",
            )}>
              {tabletImgs.map((src, i) => {
                const isTada = drug === "tadalafil";
                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <Image
                      src={src}
                      alt="tablet"
                      width={isTada ? 110 : 81}
                      height={isTada ? 110 : 81}
                      unoptimized
                      className={cn(
                        "relative z-10 object-contain",
                        isTada ? "w-24 h-24 sm:w-[110px] sm:h-[110px]" : "w-[67px] h-[67px] sm:w-[81px] sm:h-[81px]",
                      )}
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 rounded-full bg-black/20 blur-md",
                        isTada ? "w-[67px] h-[14px] sm:w-[77px] sm:h-[17px]" : "w-[47px] h-[10px] sm:w-[57px] sm:h-[12px]",
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Drug selector */}
      <div className="mt-5 px-6 sm:px-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-step-badge text-xs font-bold text-white">
            1
          </span>
          <p className="font-semibold text-text-primary">Drug</p>
          <button
            type="button"
            onClick={() => setDrugInfoOpen(true)}
            className="cursor-pointer text-xs font-medium text-primary no-underline hover:underline"
          >
            View drug details
          </button>
        </div>
        {allowDrugSwitch ? (
          <div className="flex gap-3">
            {uniqueDrugs.map((d) => {
              const isActive = activeDrug === d;
              const lines = DRUG_DISPLAY_LINES[d];
              return (
                <button
                  key={d}
                  onClick={() => onDrugChange(d)}
                  style={
                    isActive
                      ? drugSelectedStyle
                      : { "--hover-border": d === "tadalafil" ? "#cd8f24" : "#204ad7" } as React.CSSProperties
                  }
                  className={cn(
                    "cursor-pointer flex-1 rounded px-[18px] py-[10px] text-center transition-colors",
                    isActive
                      ? "border-[2.5px]"
                      : "border-2 border-border-input bg-bg-card hover:border-(--hover-border)",
                  )}
                >
                  <span className="block not-italic font-medium text-text-primary sm:inline sm:text-[14px] sm:font-medium">
                    {lines?.name ?? d}
                  </span>
                  <span className="block text-xs not-italic font-medium text-text-muted sm:inline sm:text-[14px]">
                    {lines?.generic}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            style={drugSelectedStyle}
            className="rounded border-[2.5px] px-[18px] py-[14px] text-center text-sm font-medium text-text-primary"
          >
            {activeDrug ? (DRUG_DISPLAY_NAMES[activeDrug] ?? activeDrug) : "—"}
          </div>
        )}
      </div>

      {/* Strength title — not sticky, direct flex child */}
      <div className="mt-6 mb-3 flex items-center gap-2 px-6 sm:px-10">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-step-badge text-xs font-bold text-white">
          2
        </span>
        <p className="font-semibold text-text-primary">Strength</p>
        <button
          type="button"
          onClick={() => setStrengthGuideOpen(true)}
          className="cursor-pointer text-xs font-medium text-primary no-underline hover:underline"
        >
          Which strength is right for me?
        </button>
      </div>

      {/* Sticky dosage buttons — direct flex child so parent height spans full page */}
      <div
        className="sticky z-10 bg-white px-6 pb-3 sm:px-10"
        style={{ top: navbarHeight + priceHeaderHeight }}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${dosages.length}, 1fr)` }}>
          {dosages.map((d) => {
            const isActive = activeVariant?.product.dosage === d;
            return (
              <button
                key={d}
                onClick={() => onStrengthChange(d)}
                style={isActive ? selectorSelectedStyle : { "--hover-border": selectedBorderColor } as React.CSSProperties}
                className={cn(
                  "cursor-pointer rounded py-[10px] text-sm font-medium text-text-primary transition-colors",
                  isActive
                    ? "border-[2.5px]"
                    : "border-2 border-border-input bg-bg-card hover:border-(--hover-border)",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="mt-6 px-6 sm:px-10">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg-step-badge text-xs font-bold text-white">
            3
          </span>
          <p className="font-semibold text-text-primary">Quantity</p>
          <span className="text-xs text-text-muted">Buy more &amp; save</span>
        </div>
        <div className="flex flex-col gap-4">
          {packages.map((pkg, pkgIdx) => {
            const isSelected = pkg.quantity === selectedQty;
            const pkgSavePct = basePerTablet > pkg.per_tablet
              ? Math.round((1 - pkg.per_tablet / basePerTablet) * 100)
              : 0;
            const pkgOriginalPrice = basePerTablet * pkg.quantity;
            const isBestValue = bestValuePkg?.quantity === pkg.quantity;
            const label = pkg.extra_tablets > 0
              ? `${pkg.quantity} + ${pkg.extra_tablets} tablets`
              : `${pkg.quantity} tablets`;

            return (
              <button
                key={pkg.quantity}
                onClick={() => onQtyChange(pkg.quantity)}
                style={isSelected ? selectorSelectedStyle : { "--hover-border": selectedBorderColor } as React.CSSProperties}
                className={cn(
                  `cursor-pointer flex items-center justify-between rounded px-[30px] ${pkgIdx === 0 ? "py-[15px]" : "py-[10px]"} text-[14px] transition-colors`,
                  isSelected
                    ? "border-[2.5px]"
                    : "border-2 border-border-input bg-bg-card hover:border-(--hover-border)",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    style={isSelected ? { borderColor: selectedBorderColor } : undefined}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "" : "border-border-input",
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedBorderColor }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary capitalize">{label}</span>
                    {pkg.is_popular && (
                      <span
                        style={badgeStyle}
                        className="rounded border px-2 py-0.5 text-xs font-semibold text-white"
                      >
                        Popular
                      </span>
                    )}
                    {isBestValue && !pkg.is_popular && (
                      <span
                        style={badgeStyle}
                        className="rounded border px-2 py-0.5 text-xs font-semibold text-white"
                      >
                        Best Value
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    {pkgSavePct > 0 && (
                      <span className="text-text-muted line-through">
                        ${pkgOriginalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-semibold text-text-primary">
                      ${pkg.final_price.toFixed(2)}
                    </span>
                  </div>
                  {pkgSavePct > 0 && (
                    <div className="font-medium text-save">
                      save {pkgSavePct}%
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8 sm:px-10">
        <button
          onClick={() => onAddToCart?.(selectedQty)}
          disabled={ctaDisabled}
          style={ctaDisabled ? undefined : { backgroundColor: ctaColor, borderColor: ctaColor }}
          onMouseEnter={(e) => {
            if (!ctaDisabled) e.currentTarget.style.backgroundColor = ctaHover;
          }}
          onMouseLeave={(e) => {
            if (!ctaDisabled) e.currentTarget.style.backgroundColor = ctaColor;
          }}
          className={cn(
            "mt-12 flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border py-3 text-base uppercase text-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:border-border-input disabled:bg-border-input disabled:shadow-none",
            selectedColor ? "font-normal" : "font-bold",
          )}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Processing...
            </>
          ) : (
            <>
              <span>Total ${total.toFixed(2)} — Add to Cart</span>
              <Image src="/icons/arrow-right-chevron.svg" alt="" width={9} height={18} />
            </>
          )}
        </button>
        <p className="mt-[13px] text-center text-[12px] font-light italic leading-[140%] text-[#666] min-[420px]:flex min-[420px]:flex-col">
          <span>Free online doctor’s visit, no appointment or video call needed.</span>{" "}
          <span>We’ll just text a quick code to confirm it’s you.</span>
        </p>
      </div>

      <DrugInfoModal
        isOpen={drugInfoOpen}
        onClose={() => setDrugInfoOpen(false)}
        drugInfo={(activeVariant ?? contextVariant)?.drug_info ?? null}
        drugDisplayName={activeDrug ? DRUG_DISPLAY_NAMES[activeDrug] : undefined}
        activeDrug={activeDrug}
      />
      <StrengthGuideModal
        isOpen={strengthGuideOpen}
        onClose={() => setStrengthGuideOpen(false)}
        drug={activeDrug}
        currentDosage={activeVariant?.product.dosage}
        availableDosages={dosages}
      />
    </div>
  );
};
