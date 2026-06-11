import { MainNav } from "@/components/Navbar/MainNav";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <MainNav showAnnouncement />
    <main className="flex-1">{children}</main>
    <footer className="border-t border-border-default bg-bg-sidebar-dark py-10 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="mb-3 text-sm font-semibold">Sildenafil.com</p>
            <ul className="flex flex-col gap-2 text-xs text-white/70">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/#process" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="/#help" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Account</p>
            <ul className="flex flex-col gap-2 text-xs text-white/70">
              <li><a href="/login" className="hover:text-white transition-colors">Member Login</a></li>
              <li><a href="/contact_us" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Legal</p>
            <ul className="flex flex-col gap-2 text-xs text-white/70">
              <li><a href="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/hipaa" className="hover:text-white transition-colors">HIPAA</a></li>
              <li><a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Contact</p>
            <ul className="flex flex-col gap-2 text-xs text-white/70">
              <li>
                <a href="tel:(844) 745-3362" className="hover:text-white transition-colors">
                  (844) 745-3362
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Sildenafil.com. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
);

export default MarketingLayout;
