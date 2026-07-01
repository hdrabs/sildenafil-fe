import { ReactNode } from "react";

/**
 * Shared wrapper for the static legal pages. Mirrors aum's global `.content`
 * container (max-width 1000, centred, 18px gutter) with the container's `mt-5 py-5`
 * spacing, plus aum typography: p 16px/28px, black text, bold `<strong>`,
 * decimal/disc lists (2rem indent), brand-blue links.
 */
export const LegalPage = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto mt-12 w-full max-w-[1000px] px-[18px] py-12 text-[16px] leading-[28px] text-black [&_a]:text-[#1b53af] [&_a]:underline [&_li]:mb-2 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-8 [&_p]:mb-4 [&_strong]:font-bold [&_table]:my-4 [&_table_td]:border [&_table_td]:border-[#ddd] [&_table_td]:p-2 [&_u]:underline [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-8">
    {children}
  </div>
);
