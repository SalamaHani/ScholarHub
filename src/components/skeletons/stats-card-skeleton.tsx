import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            {/* Label skeleton */}
            <Skeleton className="h-4 w-24" />
            {/* Value skeleton */}
            <Skeleton className="h-9 w-16" />
          </div>
          {/* Icon container skeleton */}
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
