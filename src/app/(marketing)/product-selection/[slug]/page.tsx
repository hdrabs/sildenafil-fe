import { HydrationBoundary } from "@tanstack/react-query";
import { ProductLandingPage } from "@/features/landing/components/ProductLandingPage";
import { prefetchCatalog } from "@/features/landing/prefetchCatalog";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

// Drug-level product picker (/product-selection/sildenafil | tadalafil): the same hero
// layout + marketing sections + navbar as /new-user, but with the drug selector visible.
// A drug-name slug selects that drug with nothing else preselected; a full variant slug
// (+ ?qty) preselects strength + quantity.
const ProductSelectionPage = async ({ params, searchParams }: Props) => {
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
        theme={slug.includes("tadalafi") ? "tadalafil" : "sildenafil"}
        leftVariant="hero"
        allowDrugSwitch
        resumeFromActiveCart
      />
    </HydrationBoundary>
  );
};

export default ProductSelectionPage;
