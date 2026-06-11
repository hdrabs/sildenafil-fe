import { Spinner } from "@/components/ui/Spinner";

export const PageLoader = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <Spinner size="lg" />
  </div>
);
