"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UpdateBrandDialog } from "./update-brand-dialog";

// Define the Brand interface based on the provided data structure
export interface Brand {
  _id: string;
  id:string;
  brandName: string;
  brandDescription: string;
  brandLogo: string;
  brandStyle: string;
  active: boolean;
  primaryColor: string;
  website: string;
  phoneNumber: string;
  taxId: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const brandsColumns: ColumnDef<Brand>[] = [
  {
    accessorKey: "brandName",
    header: "Brand Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("brandName")}</div>,
  },
  {
    accessorKey: "brandDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("brandDescription") as string;
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
    accessorKey: "brandStyle",
    header: "Style",
    cell: ({ row }) => {
      const style = row.getValue("brandStyle") as string;
      return (
        <div className="capitalize">
          {style || <span className="text-gray-500">N/A</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
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
    accessorKey: "user",
    header: "Owner",
    cell: ({ row }) => {
      const user = row.getValue("user") as Brand["user"];
      if (!user) return <div className="text-gray-500">Unknown</div>;
      
      return <div>{`${user.firstName} ${user.lastName}`}</div>;
    },
  },
  {
    accessorKey: "businessAddress",
    header: "Location",
    cell: ({ row }) => {
      const address = row.getValue("businessAddress") as Brand["businessAddress"];
      if (!address) return <div className="text-gray-500">No address</div>;
      
      return <div>{`${address.city}, ${address.country}`}</div>;
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="flex items-center justify-end space-x-2">
          <UpdateBrandDialog brand={brand} />
        </div>
      );
    },
  },
];