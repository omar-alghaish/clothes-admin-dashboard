"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/types";
import { UpdateUserDialog } from "./update-user-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function UserAvatarCell({ avatar }: { avatar: string }) {
  const [open, setOpen] = useState(false);

  if (!avatar) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
        <span className="text-xs font-medium">N/A</span>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative h-10 w-10 rounded-full overflow-hidden cursor-pointer border border-gray-200">
          <img
            src={avatar}
            alt="User avatar"
            className="object-cover h-full w-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
            }}
          />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-4 top-4 bg-background z-10" 
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-6">
          <div className="relative w-64 h-64 rounded-lg overflow-hidden">
            <img
              src={avatar}
              alt="User avatar"
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatar") as string;
      return <UserAvatarCell avatar={avatarUrl} />;
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "destructive" : role === "moderator" ? "outline" : "default"}>
          {role || "user"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("active") as boolean;
      console.log(status);
      return (
        <Badge 

          variant={status === true ? "default" : status === false ? "outline" : "destructive"}
          className={
            status === true ? "bg-green-100 text-green-800" : 
            status === false ? "bg-gray-100 text-gray-800" : 
            "bg-red-100 text-red-800"
          }
        >
          {status ? "active" : "inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      if (!address) return <div className="text-gray-500">N/A</div>;
      
      // Truncate long addresses
      const truncated = address.length > 30 ? address.substring(0, 30) + "..." : address;
      
      return (
        <div title={address}>
          {truncated}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
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
      const user = row.original;
      return (
        <div className="flex items-center justify-end space-x-2">
          <UpdateUserDialog user={user} />
          {/* <DeleteUserDialog user={user} /> */}
        </div>
      );
    },
  },
];