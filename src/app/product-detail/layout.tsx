import { SecondaryNav } from "@/components/Navbar/SecondaryNav";

const ProductDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-bg-main">
    <SecondaryNav />
    {children}
  </div>
);

export default ProductDetailLayout;
