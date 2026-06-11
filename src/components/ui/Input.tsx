"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, startAdornment, endAdornment, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="pointer-events-none absolute left-3 flex items-center text-text-muted">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-12 w-full rounded-lg border border-border-input bg-bg-input text-sm text-text-primary placeholder:text-text-muted transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              error && "border-error focus:ring-error",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              !startAdornment && !endAdornment && "px-3",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-3 flex items-center">
              {endAdornment}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-text-error">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
