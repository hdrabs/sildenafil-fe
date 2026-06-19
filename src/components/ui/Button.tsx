"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "coral" | "dark" | "outline-dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-primary text-white hover:bg-primary-hover disabled:opacity-60",
  secondary:
    "bg-bg-input text-text-primary border border-border-default hover:bg-border-default disabled:opacity-60",
  ghost:
    "bg-transparent text-primary hover:bg-bg-input disabled:opacity-60",
  danger:
    "bg-error text-white hover:opacity-90 disabled:opacity-60",
  coral:
    "bg-coral text-white hover:bg-coral-hover disabled:opacity-60 rounded-full uppercase tracking-wide font-bold whitespace-nowrap",
  dark:
    "bg-primary text-white hover:opacity-90 disabled:opacity-60 rounded-full uppercase tracking-wide",
  "outline-dark":
    "bg-transparent text-primary border border-[#bfd9e4] hover:bg-primary hover:text-white disabled:opacity-60 rounded-full font-bold",
};

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className,
    )}
    {...props}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);
