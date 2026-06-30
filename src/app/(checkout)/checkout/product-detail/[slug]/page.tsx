import { HydrationBoundary } from "@tanstack/react-query";
import { ProductLandingPage } from "@/features/landing/components/ProductLandingPage";
import { prefetchCatalog } from "@/features/landing/prefetchCatalog";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

const CheckoutProductDetailPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { qty, discount, landing_context } = await searchParams;

  const initialQty = qty ? parseInt(qty, 10) : undefined;
  const landingContext = landing_context ?? "product-selection";
  const dehydratedState = await prefetchCatalog({
    slug,
    discountCode: discount,
    initialQty,
    landingContext,
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductLandingPage
        slug={slug}
        initialQty={initialQty}
        discountCode={discount}
        landingContext={landingContext}
        theme="tadalafil"
        leftVariant="bottle"
        showMarketingSections={false}
        autoSelectDosage={false}
        autoSelectPopular={false}
        resumeFromActiveCart
      />
    </HydrationBoundary>
  );
};

export default CheckoutProductDetailPage;
