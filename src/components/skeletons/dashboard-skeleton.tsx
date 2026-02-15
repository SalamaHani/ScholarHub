import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCardSkeletonGrid } from "./stats-card-skeleton";
import { ApplicationRowSkeletonList } from "./application-row-skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Stats cards */}
        <div className="mb-8">
          <StatsCardSkeletonGrid count={4} />
        </div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Tabs content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                {/* Tab triggers */}
                <div className="flex gap-4 mb-6">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>

                {/* Tab content */}
                <ApplicationRowSkeletonList count={3} />
              </CardContent>
            </Card>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
