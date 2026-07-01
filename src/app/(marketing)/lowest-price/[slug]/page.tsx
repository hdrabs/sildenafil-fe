import { HydrationBoundary } from "@tanstack/react-query";
import { MarketingLandingPage } from "@/features/landing/components/MarketingLandingPage";
import { prefetchCatalog } from "@/features/landing/prefetchCatalog";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

// Page 1 (aum FreeTierPage): the marketing landing — hero band + storytelling
// sections. The hero/CTAs hand off to the configurator at
// /lowest-price/product_selection/[slug].
const LowestPricePage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { qty, discount, landing_context, ml } = await searchParams;

  const initialQty = qty ? parseInt(qty, 10) : undefined;
  const landingContext = landing_context ?? "lowest-price";
  const { dehydratedState, variants } = await prefetchCatalog({
    slug,
    discountCode: discount,
    initialQty,
    landingContext,
  });

  // Forward the incoming query (discount/qty/ml/landing_context) to the configurator CTA.
  const forwarded = new URLSearchParams();
  if (discount) forwarded.set("discount", discount);
  if (qty) forwarded.set("qty", qty);
  if (landing_context) forwarded.set("landing_context", landing_context);
  if (ml) forwarded.set("ml", ml);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MarketingLandingPage
        slug={slug}
        initialQty={initialQty}
        discountCode={discount}
        landingContext={landingContext}
        query={forwarded.toString()}
        regular
        initialVariants={variants}
      />
    </HydrationBoundary>
  );
};

export default LowestPricePage;
