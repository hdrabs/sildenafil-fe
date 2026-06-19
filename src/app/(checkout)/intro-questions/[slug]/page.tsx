import { IntroQuestionsPage } from "@/features/checkout/components/IntroQuestionsPage";

interface Props {
  params: Promise<{ slug: string }>;
}

const IntroQuestionsRoute = async ({ params }: Props) => {
  const { slug } = await params;
  return <IntroQuestionsPage slug={slug} />;
};

export default IntroQuestionsRoute;
