import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome section */}
      <div className="mb-12">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-48" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-24" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-40" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-12 w-24" />
        </Card>
      </div>

      {/* Quick access */}
      <div className="mb-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <Skeleton className="h-10 w-10 mb-3" />
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-10 w-10 mb-3" />
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-10 w-10 mb-3" />
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-full" />
          </Card>
        </div>
      </div>

      {/* Recent calculations */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Card className="p-6">
            <Skeleton className="h-6 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-full" />
          </Card>
        </div>
      </div>
    </div>
  )
}
