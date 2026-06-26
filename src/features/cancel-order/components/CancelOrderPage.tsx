import Image from "next/image";
import Link from "next/link";

export const CancelOrderPage = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="flex h-48 w-48 items-center justify-center rounded-full bg-bg-patient-welcome">
      <Image
        src="/illustrations/cancel-order.svg"
        alt=""
        width={150}
        height={150}
        className="object-contain"
      />
    </div>

    <h2 className="mt-8 text-2xl font-bold text-text-primary">Cancel Order Process</h2>

    <p className="mt-3 max-w-md text-base text-text-primary">
      For order cancellations, call{" "}
      <Link href="tel:7142762040" className="text-primary-blue hover:underline">
        (714) 276-2040
      </Link>
      , Mon - Fri - 9 am - 6pm PT
    </p>
  </div>
);
