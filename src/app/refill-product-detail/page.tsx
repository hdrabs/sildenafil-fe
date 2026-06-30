import { ProductDetailPage } from "@/features/landing/components/ProductDetailPage";

// Mirror of /product-detail for the account refill/reorder flows. Same configurator
// (variant + quantity preselected from slug + qty); a distinct URL so refill entry
// points are tracked and the BranchResolver still decides instant-refill vs visit.
interface Props {
  searchParams: Promise<{
    slug?: string;
    qty?: string;
    discount?: string;
    landing_context?: string;
    ml?: string;
  }>;
}

const RefillProductDetailRoute = async ({ searchParams }: Props) => {
  const { slug, qty, discount, landing_context } = await searchParams;

  return (
    <ProductDetailPage
      slug={slug}
      initialQty={qty ? parseInt(qty, 10) : undefined}
      discountCode={discount}
      landingContext={landing_context}
      landingUrl="refill-product-detail"
      autoSelectDosage
      autoSelectPopular
    />
  );
};

export default RefillProductDetailRoute;
