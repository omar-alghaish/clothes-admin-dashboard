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
import { Pencil } from "lucide-react";
import { CategoryForm } from "./category-form";
import { Category, CategoryFormValues } from "@/lib/types";
import { toast } from "sonner";
import { useUpdateCategoryMutation } from "@/redux/categorys/categoryApi";

const transformFormDataToApiFormat = (formData: CategoryFormValues) => {
  return {
    name: formData.name,
    slug: formData.slug,
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

const prepareCategoryForForm = (category: Category): Partial<CategoryFormValues> => {
  return {
    _id: category._id,
    name: category.name,
    description: category.description,
    gender: category.gender || "neutral",
    isActive: category.isActive !== undefined ? category.isActive : true,
  };
};

interface UpdateCategoryDialogProps {
  category: Category;
  onSuccess?: () => void;
}

export function UpdateCategoryDialog({ category, onSuccess }: UpdateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateCategory, { isLoading: isSubmitting, error }] = useUpdateCategoryMutation();
  
  const initialData = prepareCategoryForForm(category);
   console.log(error)
  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const apiData = transformFormDataToApiFormat(values);
      
      await updateCategory({
        id: category._id,
        category: apiData
      }).unwrap();
      
      toast.success(`Category "${values.name}" updated successfully`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.data?.message || "Failed to update category");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50vw] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category details below.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}