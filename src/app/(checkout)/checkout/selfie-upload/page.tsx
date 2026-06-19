import { PhotoUploadStep } from "@/features/checkout/components/PhotoUploadStep";

const SelfieUploadRoute = () => (
  <PhotoUploadStep
    kind="selfie"
    title="Take a selfie"
    description="A quick selfie helps us confirm the ID matches you."
  />
);

export default SelfieUploadRoute;
