"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/lib/types";
import { UpdateCategoryDialog } from "./update-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { Badge } from "@/components/ui/badge";



export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      if (!description) return <div className="text-gray-500">No description</div>;
      
      // Truncate long descriptions
      const truncated = description.length > 50 ? description.substring(0, 50) + "..." : description;
      
      return (
        <div title={description} className="max-w-xs">
          {truncated}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <div className="capitalize">
          {gender || <span className="text-gray-500">N/A</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge 
          className={
            isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }
        >
          {isActive ? "active" : "inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      if (!createdAt) return <div className="text-gray-500">N/A</div>;
      
      const date = new Date(createdAt);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      if (!updatedAt) return <div className="text-gray-500">N/A</div>;
      
      const date = new Date(updatedAt);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center justify-end space-x-2">
          <UpdateCategoryDialog category={category} />
          <DeleteCategoryDialog category={category} />
        </div>
      );
    },
  },
];