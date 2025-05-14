"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Category } from "@/lib/types";
import { toast } from "sonner";
import { useDeleteCategoryMutation } from "@/redux/categorys/categoryApi";

interface DeleteCategoryDialogProps {
  category: Category;
}

export function DeleteCategoryDialog({ category }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
  
  const handleDelete = async () => {
    try {
      await deleteCategory({ id: category._id }).unwrap();
      toast.success(`Category "${category.name}" deleted successfully`);
      setOpen(false);
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.data?.message || "Failed to delete category");
    }
  };
  
  const hasProducts = (category.productCount || 0) > 0;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the "{category.name}" category?
            {hasProducts && (
              <div className="mt-2 text-red-500">
                Warning: This category has {category.productCount} products associated with it.
                Deleting this category may affect those products.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}