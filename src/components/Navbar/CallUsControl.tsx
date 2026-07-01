import Image from "next/image";

/**
 * Responsive call-us control shared by the white marketing navbars: full pill
 * (≥992) → compact stacked text (648–991) → phone icon (<648).
 */
export const CallUsControl = () => (
  <div className="flex items-center">
    {/* Desktop pill (≥992) */}
    <a
      href="tel:8447453362"
      className="hidden items-center gap-[10px] rounded-full border border-[#d1d1d1] bg-white px-6 py-[10px] transition-colors hover:bg-[#f5f5f5] min-[992px]:flex"
    >
      <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
      <span className="flex items-center gap-1 whitespace-nowrap">
        <span className="text-[12px] font-medium text-[#262a32]">Need help? Call us:</span>
        <span className="text-[12px] font-semibold text-[#1b53af]">(844) 745-3362</span>
      </span>
    </a>

    {/* Tablet compact (648–991) */}
    <a href="tel:8447453362" className="hidden items-center gap-2 min-[648px]:flex min-[992px]:hidden">
      <span className="flex flex-col items-end leading-[1.2]">
        <span className="text-[11px] font-medium text-[#262a32]">Need help?</span>
        <span className="text-[11px] font-semibold text-[#1b53af]">Call us</span>
      </span>
      <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
    </a>

    {/* Mobile icon (<648) */}
    <a href="tel:8447453362" aria-label="Call us" className="flex min-[648px]:hidden">
      <Image src="/icons/navbar/phone-blue.svg" alt="" width={20} height={20} className="h-[20px] w-[20px]" />
    </a>
  </div>
);
