import { HydrationBoundary } from "@tanstack/react-query";
import { ProductSelectionLandingPage } from "@/features/landing/components/ProductSelectionLandingPage";
import { prefetchCatalog } from "@/features/landing/prefetchCatalog";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

// Page 2 (aum FreeTierProductSelection): the configurator. Reached from the
// page-1 hero/CTAs. Mirrors aum's /lowest-price/product_selection/:product URL.
const LowestPriceProductSelectionPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { qty, discount, landing_context } = await searchParams;

  const initialQty = qty ? parseInt(qty, 10) : undefined;
  const landingContext = landing_context ?? "lowest-price";
  const { dehydratedState, variants } = await prefetchCatalog({
    slug,
    discountCode: discount,
    initialQty,
    landingContext,
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductSelectionLandingPage
        slug={slug}
        initialQty={initialQty}
        discountCode={discount}
        landingContext={landingContext}
        theme="tadalafil"
        initialVariants={variants}
      />
    </HydrationBoundary>
  );
};

export default LowestPriceProductSelectionPage;
