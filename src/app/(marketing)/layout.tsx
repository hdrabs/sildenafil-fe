import { MainNav } from "@/components/Navbar/MainNav";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <MainNav showAnnouncement />
    <main className="flex-1">{children}</main>
  </div>
);

export default MarketingLayout;
