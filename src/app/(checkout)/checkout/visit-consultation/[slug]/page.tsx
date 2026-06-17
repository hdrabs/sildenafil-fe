import { VisitConsultationPage } from "@/features/checkout/components/VisitConsultationPage";

interface Props {
  params: Promise<{ slug: string }>;
}

const VisitConsultationStepRoute = async ({ params }: Props) => {
  const { slug } = await params;
  return <VisitConsultationPage slug={slug} />;
};

export default VisitConsultationStepRoute;
