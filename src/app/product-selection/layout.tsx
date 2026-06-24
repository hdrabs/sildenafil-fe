import { SecondaryNav } from "@/components/Navbar/SecondaryNav";

const ProductSelectionLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <SecondaryNav />
    {children}
  </div>
);

export default ProductSelectionLayout;
