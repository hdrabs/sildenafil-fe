import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProductsPage } from "@/features/products/components/ProductsPage";

const Page = () => (
  <ErrorBoundary>
    <ProductsPage />
  </ErrorBoundary>
);

export default Page;
