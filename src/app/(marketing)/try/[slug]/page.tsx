import { HydrationBoundary } from "@tanstack/react-query";
import { MarketingLandingPage } from "@/features/landing/components/MarketingLandingPage";
import { prefetchCatalog } from "@/features/landing/prefetchCatalog";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; discount?: string; landing_context?: string; ml?: string }>;
}

// Page 1 (aum FreeTierPage, free-tier mode): the "Try" marketing landing — same
// storytelling sections as lowest-price, but the hero shows the $0 sample-pack
// offer. Hero/CTAs hand off to /try/product_selection/[slug].
const TryPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { qty, discount, landing_context, ml } = await searchParams;

  const initialQty = qty ? parseInt(qty, 10) : undefined;
  const landingContext = landing_context ?? "try";
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
        configPrefix="try"
        regular={false}
        initialVariants={variants}
      />
    </HydrationBoundary>
  );
};

export default TryPage;
