"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  bodyClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
  bodyClassName,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full flex-col rounded-xl bg-bg-card shadow-xl",
          sizeClasses[size],
          className,
        )}
      >
        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-border-default px-6 py-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-text-primary"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full p-1.5 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon className="h-7 w-7" />
            </button>
          </div>
        )}
        <div className={cn("min-h-0 flex-1 overflow-y-auto p-6", bodyClassName)}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
