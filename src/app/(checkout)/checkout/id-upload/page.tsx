import { PhotoUploadStep } from "@/features/checkout/components/PhotoUploadStep";

const IdUploadRoute = () => (
  <PhotoUploadStep
    kind="id"
    title="Upload your ID"
    description="We use this to verify your identity before your prescription is reviewed."
  />
);

export default IdUploadRoute;
