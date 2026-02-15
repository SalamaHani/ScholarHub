import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedScholarshipItemSkeleton() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            {/* Title */}
            <Skeleton className="h-5 w-3/4" />
            {/* Organization and badge */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Skeleton className="h-10 flex-1 sm:w-32" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SavedScholarshipListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SavedScholarshipItemSkeleton key={i} />
      ))}
    </div>
  );
}
