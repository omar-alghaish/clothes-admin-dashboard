"use client";

import { DataTable } from "@/components/ui/data-table";
import { useGetBrandsQuery } from "@/redux/brands/brandsApi";
import { brandsColumns } from "./brand-columns";

export function BrandOperations() {
  const {
    data,
    isLoading,
    refetch,
    error
  } = useGetBrandsQuery({});

  const brands = data?.data?.brands || [];
  const totalBrands = brands.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Loading..." : `Total: ${totalBrands} brands`}
          </p>
        </div>
      </div>

      <DataTable
        data={brands}
        columns={brandsColumns}
        searchPlaceholder="Search brands..."
        emptyMessage="No brands found."
        onRefresh={refetch}
        isLoading={isLoading}
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error loading brands. Please try again.
        </div>
      )}
    </div>
  );
}