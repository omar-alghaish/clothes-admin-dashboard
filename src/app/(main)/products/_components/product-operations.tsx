"use client";
import { DataTable } from "@/components/ui/data-table";
import { productsColumns } from "./products-columns";
import { useGetProductsQuery } from "@/redux/products/productsApi";

export function ProductOperations() {
  const {
    data,
    isLoading,
    refetch,
    error
  } = useGetProductsQuery();

  const products = data?.data.items || [];

  const totalProducts = products.length

console.log(products)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Loading..." : `Total: ${totalProducts} products`}
          </p>
        </div>
      </div>
      
      <DataTable
        data={products}
        columns={productsColumns}
        searchPlaceholder="Search products..."
        emptyMessage="No products found."
        onRefresh={refetch}
        isLoading={isLoading}
      />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error loading products. Please try again.
        </div>
      )}
    </div>
  );
}