import Image from "next/image";
import Link from "next/link";
import { RiPhoneLine, RiTimeLine } from "react-icons/ri";

export const CancelOrderPage = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-bg-patient-welcome">
      <Image src="/illustrations/cancel-order.svg" alt="Cancel Order" width={90} height={90} className="object-contain p-2" />
    </div>

    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-text-primary">Cancel Order Process</h2>
      <p className="max-w-sm text-sm text-text-muted">
        For order cancellations, please call us directly. Our support team is available
        during business hours to assist you.
      </p>
    </div>

    <div className="w-full max-w-sm rounded-xl border border-border-default bg-bg-main p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-patient-welcome">
          <RiPhoneLine className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <p className="text-xs text-text-muted">Phone number</p>
          <Link href="tel:8447453362" className="text-sm font-semibold text-primary hover:underline">
            (844) 745-3362
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-patient-welcome">
          <RiTimeLine className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left">
          <p className="text-xs text-text-muted">Hours</p>
          <p className="text-sm font-semibold text-text-primary">Mon – Fri, 9 am – 6 pm PT</p>
        </div>
      </div>
    </div>
  </div>
);
