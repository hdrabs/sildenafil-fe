import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

const variantClasses = {
  default: "bg-bg-input text-text-muted",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  info: "bg-primary/10 text-primary",
};

export const Badge = ({ label, variant = "default", className }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className,
    )}
  >
    {label}
  </span>
);
