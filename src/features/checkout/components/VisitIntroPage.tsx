"use client";

import { useVisitIntro } from "../hooks/useVisitIntro";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
<<<<<<< Updated upstream

const DoctorIllustration = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-28 w-28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle background */}
    <circle cx="60" cy="60" r="60" fill="#ddeef5" />
    {/* Lab coat body */}
    <rect x="30" y="72" width="60" height="40" rx="8" fill="white" />
    {/* Coat lapels */}
    <path d="M60 72 L45 85 L50 72Z" fill="#e0e7ef" />
    <path d="M60 72 L75 85 L70 72Z" fill="#e0e7ef" />
    {/* Stethoscope */}
    <path
      d="M48 82 Q44 90 48 96 Q52 102 58 100"
      stroke="#4a90a4"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="58" cy="100" r="3" fill="#4a90a4" />
    {/* Head */}
    <circle cx="60" cy="52" r="18" fill="#f5c5a3" />
    {/* Hair */}
    <ellipse cx="60" cy="36" rx="14" ry="8" fill="#3d2b1f" />
    <rect x="46" y="36" width="28" height="8" rx="2" fill="#3d2b1f" />
    {/* Eyes */}
    <circle cx="54" cy="52" r="2" fill="#3d2b1f" />
    <circle cx="66" cy="52" r="2" fill="#3d2b1f" />
    {/* Smile */}
    <path
      d="M54 58 Q60 63 66 58"
      stroke="#c0845a"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Arms crossed */}
    <path
      d="M30 85 Q38 80 50 84 Q55 86 60 85 Q65 84 70 86 Q82 80 90 85"
      stroke="#e0e7ef"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);
=======
import { DoctorIllustration } from "@/components/illustrations/DoctorIllustration";
>>>>>>> Stashed changes

export const VisitIntroPage = () => {
  const { back, steps } = useStepNavigation("visit_intro");
  const { onContinue, isPending } = useVisitIntro();

  return (
    <>
      <SecondaryNav onBack={back} />
      <CheckoutProgressBar steps={steps} />
      <main className="flex min-h-screen flex-col items-center justify-start bg-bg-main px-4 pt-16">
      <div className="w-full max-w-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Let&apos;s talk about your health
        </h1>

        {/* Card */}
<<<<<<< Updated upstream
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 shadow-sm">
          <DoctorIllustration />
=======
        <div className="mb-[31px] flex flex-col items-center gap-5 rounded-2xl border-0 bg-white p-[42px] text-sm text-[#5b5b5b] shadow-[0_0_45px_#1529471a]">
          <DoctorIllustration className="h-[130px] w-[130px]" />
>>>>>>> Stashed changes

          <p className="text-center text-sm leading-relaxed text-gray-600">
            Your doctor needs to know about your symptoms and overall health to
            determine the most appropriate treatment for you. It&apos;s
            important that you provide accurate information.
          </p>
        </div>

        <button
          onClick={onContinue}
          disabled={isPending}
          className="mt-8 w-full rounded-full bg-[#e85f5f] py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#d45555] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Please wait…
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </main>
    </>
  );
};
