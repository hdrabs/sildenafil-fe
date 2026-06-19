"use client";

import { LegalDrawer } from "@/components/legal/LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
};

const LocationIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" aria-hidden="true" className="shrink-0">
    <path
      d="M17.5 8.33268C17.5 12.4935 12.6534 16.8268 11.0259 18.1652C10.8743 18.2738 10.6897 18.3325 10.5 18.3325C10.3103 18.3325 10.1257 18.2738 9.97413 18.1652C8.34663 16.8268 3.5 12.4935 3.5 8.33268C3.5 6.56457 4.2375 4.86888 5.55025 3.61864C6.86301 2.36839 8.64348 1.66602 10.5 1.66602C12.3565 1.66602 14.137 2.36839 15.4497 3.61864C16.7625 4.86888 17.5 6.56457 17.5 8.33268Z"
      stroke="#BFD9E4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 10.8327C11.9497 10.8327 13.125 9.71339 13.125 8.33268C13.125 6.95197 11.9497 5.83268 10.5 5.83268C9.05025 5.83268 7.875 6.95197 7.875 8.33268C7.875 9.71339 9.05025 10.8327 10.5 10.8327Z"
      stroke="#BFD9E4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
    <path
      d="M10.0013 4.99935V9.99935L13.3346 11.666M18.3346 9.99935C18.3346 14.6017 14.6037 18.3327 10.0013 18.3327C5.39893 18.3327 1.66797 14.6017 1.66797 9.99935C1.66797 5.39698 5.39893 1.66602 10.0013 1.66602C14.6037 1.66602 18.3346 5.39698 18.3346 9.99935Z"
      stroke="#BFD9E4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PickupInfoDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="AUM Pharmacy Information">
      <div className="rounded-lg border-2 border-[#BFD9E4] p-5">
        <div className="flex flex-col">
          <div className="mb-0 flex items-center gap-2">
            <LocationIcon />
            <span className="text-base font-semibold text-[#152E56]">Pharmacy Address:</span>
          </div>
          <div className="ml-[29px] flex flex-col">
            <span className="text-sm text-[#262A32]">410 Ocean Drive</span>
            <span className="text-sm text-[#262A32]">Miami, Florida</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="mb-0 flex items-center gap-2">
            <ClockIcon />
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
