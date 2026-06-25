import { MarketingChrome } from "@/components/Navbar/MarketingChrome";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <MarketingChrome />
    <main className="flex-1">{children}</main>
  </div>
);

export default MarketingLayout;
