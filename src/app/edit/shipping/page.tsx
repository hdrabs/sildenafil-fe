import { OrderShippingEditPage } from "@/features/orders/components/OrderShippingEditPage";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) => {
  const { view } = await searchParams;
  return <OrderShippingEditPage initialView={view === "delivery" ? "delivery" : "address"} />;
};

export default Page;
