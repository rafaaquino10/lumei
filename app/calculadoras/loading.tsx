import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CalculadorasLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <Skeleton className="h-9 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>

      {/* Calculator navigation grid */}
      <div className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-3 h-full flex flex-col items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <div className="space-y-1 w-full">
                <Skeleton className="h-3 w-16 mx-auto" />
                <Skeleton className="h-2 w-20 mx-auto hidden sm:block" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Calculator content area */}
      <div className="mt-8">
        <Card className="p-4 max-w-3xl mx-auto">
          {/* Title */}
          <Skeleton className="h-7 w-64 mb-3" />

          {/* Input grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Additional inputs row */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-32 mb-4" />

          {/* Result area */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </Card>
      </div>
    </div>
  )
}
