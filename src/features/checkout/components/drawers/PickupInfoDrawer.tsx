"use client";

import { LegalDrawer } from "@/components/legal/LegalDrawer";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { ClockIcon } from "@/components/icons/ClockIcon";

type Props = {
  show: boolean;
  onClose: () => void;
};

export const PickupInfoDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="AUM Pharmacy Information">
      <div className="rounded-lg border-2 border-[#BFD9E4] p-5">
        <div className="flex flex-col">
          <div className="mb-0 flex items-center gap-2">
            <LocationIcon className="shrink-0" />
            <span className="text-base font-semibold text-[#152E56]">Pharmacy Address:</span>
          </div>
          <div className="ml-[29px] flex flex-col">
            <span className="text-sm text-[#262A32]">410 Ocean Drive</span>
            <span className="text-sm text-[#262A32]">Miami, Florida</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="mb-0 flex items-center gap-2">
            <ClockIcon className="shrink-0" />
            <span className="text-base font-semibold text-[#152E56]">Pharmacy Hours:</span>
          </div>
          <span className="ml-[29px] text-sm text-[#262A32]">
            Open Monday to Friday, 9 am to 5:30 pm PST
          </span>
        </div>
      </div>
    </LegalDrawer>
  );
};
