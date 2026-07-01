import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { RetakeGate } from "@/features/retake/components/RetakeGate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Inter is used for the numeric price rows on the upsell offer page.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-google",
});

export const metadata: Metadata = {
  title: "Sildenafil — Generic Viagra Prescribed & Delivered",
  description: "Lab Tested. Doctor Approved. Guaranteed Lowest Price.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
    {/* Browser extensions inject attributes (bis_register, __processed_*) onto <body>
        before hydration; suppress the resulting one-level attribute mismatch warning. */}
    <body suppressHydrationWarning>
      <QueryProvider>
        <ScrollToTop />
        <RetakeGate />
        {children}
        <ToastContainer position="top-right" theme="light" />
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;
