import { cn } from "@/lib/utils";

interface SkeletonProps {
  count?: number;
  className?: string;
  height?: string;
}

const SkeletonItem = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-lg bg-border-default",
      className,
    )}
  />
);

export const Skeleton = ({ count = 1, className, height = "h-12" }: SkeletonProps) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonItem key={i} className={cn(height, className)} />
    ))}
  </div>
);
