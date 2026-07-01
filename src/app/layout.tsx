import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins} from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { RetakeGate } from "@/features/retake/components/RetakeGate";
import { MessageCenter } from "@/features/chat/components/MessageCenter";
import { ChatGate } from "@/features/chat/components/ChatGate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Inter (numeric price rows) is loaded only where it's used — the upsell view —
// so its weights aren't preloaded on every route. See UpsellOfferView.

export const metadata: Metadata = {
  title: "Sildenafil — Generic Viagra Prescribed & Delivered",
  description: "Lab Tested. Doctor Approved. Guaranteed Lowest Price.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={poppins.variable}>
    {/* Browser extensions inject attributes (bis_register, __processed_*) onto <body>
        before hydration; suppress the resulting one-level attribute mismatch warning. */}
    <body suppressHydrationWarning>
      <QueryProvider>
        <ScrollToTop />
        <RetakeGate />
        <MessageCenter />
        <Suspense>
          <ChatGate />
        </Suspense>
        {children}
        <ToastContainer position="top-right" theme="light" />
      </QueryProvider>
    </body>
  </html>
);

export default RootLayout;
