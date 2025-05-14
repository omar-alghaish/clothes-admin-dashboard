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
import { ProductForm } from "./product-form";
import { Product, ProductFormValues } from "@/lib/types";
import { toast } from "sonner";
import { useUpdateProductMutation } from "@/redux/products/productsApi";

const transformFormDataToApiFormat = (formData: ProductFormValues) => {
  return {
    name: formData.name,
    price: formData.price,
    description: formData.description,
    colors: formData.colors || [],
    sizes: formData.sizes || [],
    category: formData.category,
    stock: formData.stock,
    gender: formData.gender || "male",
    material: formData.material || "Not specified",
    countryOfOrigin: formData.countryOfOrigin || "Not specified",
    img: formData.img,
    images: formData.images,
  };
};

const prepareProductForForm = (product: Product): Partial<ProductFormValues> => {

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    colors: Array.isArray(product.colors) ? product.colors : product.colors ? [product.colors] : undefined,
    sizes: Array.isArray(product.sizes) ? product.sizes : product.sizes ? [product.sizes] : undefined,
    gender: product.gender,
    material: product.material,
    countryOfOrigin: product.countryOfOrigin,
    images: product.images,
    img: product.img,
  };
};

interface UpdateProductDialogProps {
  product: Product;
}

export function UpdateProductDialog({ product }: UpdateProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();

  const initialData = prepareProductForForm(product);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const apiData = transformFormDataToApiFormat(values);

      await updateProduct({
        id: product._id || product.id,
        product: apiData
      }).unwrap();

      toast.success("Product updated");
      setOpen(false);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.data?.message || "An error occurred");
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
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product details below.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}