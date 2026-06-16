import { ProductLandingPage } from "@/features/landing/components/ProductLandingPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

const ProductSelectionPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { qty, discount, landing_context } = await searchParams;

  return (
    <ProductLandingPage
      slug={slug}
      initialQty={qty ? parseInt(qty, 10) : undefined}
      discountCode={discount}
      landingContext={landing_context ?? "product-selection"}
      theme="tadalafil"
    />
  );
};

export default ProductSelectionPage;
