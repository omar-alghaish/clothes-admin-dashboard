import { Suspense } from "react";
import { ProductOperations } from "./_components/product-operations";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "sonner";

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductOperations />
      </Suspense>
    </div>
  );
}
console.log('this is test')
function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}