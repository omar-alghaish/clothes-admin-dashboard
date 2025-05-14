"use client";

import { useGetSellerOrdersQuery } from "@/redux/orders/orders.api";
import { DataTable } from "@/components/ui/data-table";
import { ordersColumns } from "./order-columns";
import { Separator } from "@/components/ui/separator";
import { OrderWithId } from "./order-columns";

export const MainContent = () => {
  const { data: orders, isLoading, refetch } = useGetSellerOrdersQuery();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>
      <Separator />
      <DataTable<OrderWithId>
        data={(orders?.data.orders ?? []).map(order => ({ ...order, id: order._id ?? '' }))}
        columns={ordersColumns}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found."
        onRefresh={refetch}
        isLoading={isLoading}
      />
    </div>
  );
};