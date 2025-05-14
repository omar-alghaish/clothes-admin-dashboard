"use client";

import { useState } from "react";
import { Order, useUpdateOrderStatusMutation } from "@/redux/orders/orders.api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Pencil } from "lucide-react";

interface UpdateOrderDialogProps {
    order: Order;
}

export const UpdateOrderDialog = ({ order }: UpdateOrderDialogProps) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<"pending" | "processing" | "shipped" | "delivered" | "cancelled">(order.status);
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

    const handleSubmit = async () => {
        try {
            if (!order._id) {
                throw new Error('Order ID is undefined');
            }
            await updateOrderStatus({
                orderId: order._id,
                status,
            }).unwrap();
            toast.success("Order status updated successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update order status");
            console.error("Error updating order:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Toaster />
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => setStatus(value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || status === order.status}
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};