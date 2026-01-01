import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-[280px] border-r border-border p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
