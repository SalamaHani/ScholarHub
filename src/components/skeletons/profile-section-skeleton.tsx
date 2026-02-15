import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileHeaderSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4">
            {/* Name */}
            <Skeleton className="h-8 w-48" />
            {/* Email */}
            <Skeleton className="h-4 w-64" />
            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfileFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
