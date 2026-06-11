import { ProductDetailPage } from "@/features/landing/components/ProductDetailPage";

interface Props {
  searchParams: Promise<{
    slug?: string;
    qty?: string;
    discount?: string;
    landing_context?: string;
    ml?: string;
  }>;
}

const ProductDetailRoute = async ({ searchParams }: Props) => {
  const { slug, qty, discount, landing_context } = await searchParams;

  return (
    <ProductDetailPage
      slug={slug}
      initialQty={qty ? parseInt(qty, 10) : undefined}
      discountCode={discount}
      landingContext={landing_context}
    />
  );
};

export default ProductDetailRoute;
