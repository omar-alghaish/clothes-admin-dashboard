"use client";

import { DataTable } from "@/components/ui/data-table";
import { categoriesColumns } from "./category-columns";
import { AddCategoryDialog } from "./add-category-dialog";
import { useGetCategoriesQuery } from "@/redux/categorys/categoryApi";

export function CategoryOperations() {
  const {
    data,
    isLoading,
    refetch,
    error
  } = useGetCategoriesQuery({});

  const categories = data?.data?.categories || [];
  const totalCategories = categories.length;
  console.log(categories)
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Loading..." : `Total: ${totalCategories} categories`}
          </p>
        </div>
        <AddCategoryDialog onSuccess={refetch} />
      </div>

      <DataTable
        data={categories}
        columns={categoriesColumns}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        onRefresh={refetch}
        isLoading={isLoading}
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error loading categories. Please try again.
        </div>
      )}
    </div>
  );
}