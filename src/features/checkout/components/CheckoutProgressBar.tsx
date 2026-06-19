"use client";

import { cn } from "@/lib/utils";
import { CheckoutNavStep } from "@/types/checkout";

/**
 * Presentational progress bar fed by the backend-owned step list
 * (navigation.steps). Holds no flow topology of its own.
 */
export const CheckoutProgressBar = ({ steps }: { steps: CheckoutNavStep[] }) => {
  if (!steps.length) return null;

  const current = steps.find((s) => s.status === "current");
  const reached = steps.filter((s) => s.status !== "upcoming").length;

  return (
    <div className="mx-auto w-full max-w-xl px-4 pt-3">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-text-muted">
        <span>{current?.label ?? ""}</span>
        <span>
          {reached} of {steps.length}
        </span>
      </div>
      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuenow={reached}
        aria-valuemin={0}
        aria-valuemax={steps.length}
      >
        {steps.map((s) => (
          <div
            key={s.step}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s.status === "upcoming" ? "bg-border-default" : "bg-primary",
            )}
          />
        ))}
      </div>
    </div>
  );
};
