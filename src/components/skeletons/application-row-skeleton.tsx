import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationRowSkeleton() {
  return (
    <Card className="bg-white shadow-none border">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Icon container */}
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            {/* Title */}
            <Skeleton className="h-4 w-48" />
            {/* Metadata */}
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Badge */}
          <Skeleton className="h-6 w-20 rounded-full" />
          {/* Action button */}
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationRowSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ApplicationRowSkeleton key={i} />
      ))}
    </div>
  );
}
