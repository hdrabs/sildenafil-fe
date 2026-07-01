import { MainNav } from "@/components/Navbar/MainNav";
import { Footer } from "@/components/Footer/Footer";

// Chrome for the static legal pages: the full nav on top, the ported content in the
// middle, and the shared footer at the bottom.
const LegalLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <MainNav />
    <main className="flex-1">{children}</main>
    {/* aum legal pages use the no-drug footer variant (brand blue), matching home. */}
    <Footer bgColor="#1b53af" />
  </div>
);

export default LegalLayout;
