"use client";

import { DataTable } from "@/components/ui/data-table";
import { usersColumns } from "./user-columns";
import { AddUserDialog } from "./add-user-dialog";
import { useGetUsersQuery } from "@/redux/users/userApi";

export function UserOperations() {
  const {
    data: users ,
    isLoading,
    refetch,
    error
  } = useGetUsersQuery({});

  const usersData = users?.data?.users || [];

  const totalUsers = usersData?.length || 0;
console.log(users)
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-500 mt-1">
            {isLoading ? "Loading..." : `Total: ${totalUsers} users`}
          </p>
        </div>
        <AddUserDialog onSuccess={refetch} />
      </div>
      
      <DataTable
        data={usersData}
        columns={usersColumns}
        searchPlaceholder="Search users..."
        emptyMessage="No users found."
        onRefresh={refetch}
        isLoading={isLoading}
      />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error loading users. Please try again.
        </div>
      )}
    </div>
  );
}