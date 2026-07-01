import { OrderPayPage } from "@/features/orders/components/OrderPayPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <OrderPayPage id={Number(id)} />;
};

export default Page;
