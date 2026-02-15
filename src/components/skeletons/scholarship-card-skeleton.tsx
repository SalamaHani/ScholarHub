import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ScholarshipCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />
            {/* Organization skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          {/* Bookmark button skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-3">
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Badges skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Location and deadline skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function ScholarshipCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ScholarshipCardSkeleton key={i} />
      ))}
    </div>
  );
}
