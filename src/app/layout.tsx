import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Sildenafil — Generic Viagra Prescribed & Delivered",
  description: "Lab Tested. Doctor Approved. Guaranteed Lowest Price.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <QueryProvider>
          {children}
          <ToastContainer position="bottom-right" theme="light" />
        </QueryProvider>
      </body>
    </html>
  );
}
