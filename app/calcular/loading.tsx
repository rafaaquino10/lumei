import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CalculatorLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-8 w-64 mb-8" />
      <Skeleton className="h-12 w-96 mb-12" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
        
        <Card className="p-12 bg-gray-50 flex items-center justify-center">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    </div>
  )
}
