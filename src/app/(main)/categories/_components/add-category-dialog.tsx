"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CategoryForm } from "./category-form";
import { CategoryFormValues } from "@/lib/types";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/redux/categorys/categoryApi";

const transformFormDataToApiFormat = (formData: CategoryFormValues) => {
  return {
    name: formData.name,
    description: formData.description,
    gender: formData.gender,
    icon: formData.icon,
    isActive: formData.isActive,
    featured: formData.featured,
    parentCategory: formData.parentCategory || null,
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
  };
};

interface AddCategoryDialogProps {
  onSuccess?: () => void;
}

export function AddCategoryDialog({ onSuccess }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [createCategory, { isLoading: isSubmitting }] = useCreateCategoryMutation();
  
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const apiData = transformFormDataToApiFormat(values);
      
      const result = await createCategory(apiData).unwrap();
      
      toast.success(`Category "${values.name}" created successfully`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(error.data?.message || "Failed to create category");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50vw] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new category to your store.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={{
            gender: "neutral",
            isActive: true,
            featured: false
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}