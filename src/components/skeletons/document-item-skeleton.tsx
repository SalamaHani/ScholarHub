import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DocumentCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* File icon */}
          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title */}
            <Skeleton className="h-4 w-3/4" />
            {/* File size */}
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Description */}
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Upload date */}
        <Skeleton className="h-3 w-28" />

        {/* Download button */}
        <Skeleton className="h-10 w-full rounded-md mt-auto" />
      </CardContent>
    </Card>
  );
}

export function DocumentCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DocumentListItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}
