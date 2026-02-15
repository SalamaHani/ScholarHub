import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationTableRowSkeleton() {
  return (
    <tr className="hover:bg-muted/50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-20" />
        </div>
      </td>
    </tr>
  );
}

export function ApplicationTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Student</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Scholarship</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Applied</th>
              <th className="text-right px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: count }).map((_, i) => (
              <ApplicationTableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
