"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

type LegalDrawerProps = {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const LegalDrawer = ({ show, onClose, title, children }: LegalDrawerProps) => {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-default px-6 py-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-input hover:text-text-primary"
            aria-label="Close"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-text-primary [&_a]:text-text-link [&_a]:underline [&_li]:mb-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc">
          {children}
        </div>
      </div>
    </>
  );
};
