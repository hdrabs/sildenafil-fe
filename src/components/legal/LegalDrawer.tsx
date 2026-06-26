"use client";

import { Drawer } from "@/components/ui/Drawer";

type LegalDrawerProps = {
  show: boolean;
  onClose: () => void;
  title: string;
  size?: "default" | "wide";
  children: React.ReactNode;
};

export const LegalDrawer = ({ show, onClose, title, size, children }: LegalDrawerProps) => (
  <Drawer
    open={show}
    onClose={onClose}
    title={title}
    size={size}
    bodyClassName="px-6 py-6 text-sm leading-relaxed text-text-primary [&_a]:text-text-link [&_a]:underline [&_li]:mb-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc min-[1040px]:px-10"
  >
    {children}
  </Drawer>
);
