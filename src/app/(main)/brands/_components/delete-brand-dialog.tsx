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
} from "@/components/ui/dialog";
import { useDeleteBrandMutation } from "@/redux/brands/brandsApi";
import { Brand } from "./brand-columns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteBrandDialogProps {
  brand: Brand;
}

export function DeleteBrandDialog({ brand }: DeleteBrandDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteBrand, { isLoading }] = useDeleteBrandMutation();

  const handleDelete = async () => {
    try {
      await deleteBrand(brand._id).unwrap();
      toast.success("Brand deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete brand");
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete brand</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the brand "{brand.brandName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
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
    </>
  );
}