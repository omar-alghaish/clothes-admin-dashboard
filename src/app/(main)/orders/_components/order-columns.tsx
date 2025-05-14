import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { UpdateOrderDialog } from "./update-order-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order, OrderItem, ShippingAddress } from "@/redux/orders/orders.api";

// Define the OrderWithId type that includes both Order properties and id
export type OrderWithId = Order & { id: string };

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (error) {
    return "Invalid date";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Order Items Dialog Component
const OrderItemsDialog = ({ items }: { items: OrderItem[] }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Items</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Order Items</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.product.name}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    {item.color}
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

// Truncated address with tooltip component
const TruncatedAddress = ({ address }: { address: ShippingAddress }) => {
  const fullAddress = `${address.streetAddress}, ${address.city}, ${address.state}, ${address.country} ${address.zipCode}`;
  const truncatedAddress = fullAddress.length > 30 ? `${fullAddress.substring(0, 30)}...` : fullAddress;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm cursor-help">{truncatedAddress}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{fullAddress}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ordersColumns: ColumnDef<OrderWithId>[] = [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string;
      return id ? <span className="font-medium">{id.substring(id.length - 8)}</span> : "N/A";
    },
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      return <span>{user.firstName} {user.lastName}</span>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number;
      return <span>{formatCurrency(totalPrice)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      const variants: Record<Order["status"], { variant: "default" | "outline" | "secondary" | "destructive" | "success"; label: string }> = {
        pending: { variant: "secondary", label: "Pending" },
        processing: { variant: "outline", label: "Processing" },
        shipped: { variant: "default", label: "Shipped" },
        delivered: { variant: "success", label: "Delivered" },
        cancelled: { variant: "destructive", label: "Cancelled" },
      };
      const { variant, label } = variants[status];
      return <Badge variant={variant as any}>{label}</Badge>;
    },
  },
  {
    accessorKey: "isPaid",
    header: "Payment",
    cell: ({ row }) => {
      const isPaid = row.getValue("isPaid") as boolean;
      return <Badge variant={isPaid ? "success" : "outline" as any}>{isPaid ? "Paid" : "Unpaid"}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <span>{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as OrderItem[];
      return (
        <div className="flex items-center gap-2">
          <span>{items.length} item(s)</span>
          <OrderItemsDialog items={items} />
        </div>
      );
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.shippingAddress;
      return <TruncatedAddress address={address} />;
    },
  },
  {
    accessorKey: "shippingAddress.phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phoneNumber = row.original.shippingAddress.phoneNumber;
      return <span>{phoneNumber}</span>;
    },
  },
  {
    accessorKey: "estimatedDate",
    header: "Est. Delivery",
    cell: ({ row }) => {
      const date = row.getValue("estimatedDate") as string;
      return <span>{formatDate(date)}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center justify-end space-x-2">
          <UpdateOrderDialog order={order} />
        </div>
      );
    },
  },
];