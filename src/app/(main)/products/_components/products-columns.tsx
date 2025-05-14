"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/lib/types";
import { UpdateProductDialog } from "./update-product-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function ProductImagesCell({ images }: { images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [open, setOpen] = useState(false);

  // Handle cases where images might be undefined or not an array
  const imageArray = Array.isArray(images) ? images : [];
  
  // Max thumbnails to show in the cell
  const maxThumbnails = 3;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
  };

  if (imageArray.length === 0) {
    return <span className="text-gray-500 text-sm">No images</span>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer">
          {imageArray.slice(0, maxThumbnails).map((img, index) => (
            <div 
              key={index}
              className="relative h-8 w-8 rounded-md overflow-hidden border border-gray-200"
            >
              <img
                src={img}
                alt={`Product image ${index + 1}`}
                className="object-cover h-full w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
            </div>
          ))}
          {imageArray.length > maxThumbnails && (
            <span className="text-xs text-gray-500">
              +{imageArray.length - maxThumbnails} more
            </span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="min-w-[1000px] max-h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-4 top-4 bg-background z-10" 
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4 " />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 ">
            <img
              src={imageArray[currentImageIndex]}
              alt={`Product image ${currentImageIndex + 1}`}
              className="object-contain w-full h-full"

              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
          
          <div className="flex items-center justify-between w-full mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevImage}
              disabled={imageArray.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-gray-500">
              {currentImageIndex + 1} of {imageArray.length}
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextImage}
              disabled={imageArray.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {imageArray.map((img, index) => (
              <div 
                key={index}
                className={`relative h-12 w-12 rounded-md overflow-hidden border cursor-pointer ${
                  index === currentImageIndex ? "border-blue-500 border-2" : "border-gray-200"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const productsColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "img",
    header: "Image",
    cell: ({ row }) => {
      const imgUrl = row.getValue("img") as string;
      return (
        <div className="relative h-16 w-16 rounded-md overflow-hidden border border-gray-200">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={row.getValue("name")}
              className="object-cover h-full w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              No image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.getValue("images") as string[];
      return <ProductImagesCell images={images} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category:{name:string} = row.getValue("category")
      return(
      <div className="capitalize">{category?.name}</div>
    )},
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div className="font-medium">${price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => {
      const colors = row.getValue("colors") as string[];
      return (
        <div className="flex items-center gap-1">
          {colors && colors.length > 0 ? (
            colors.map((color, index) => (
              <div
                key={index}
                className="h-5 w-5 rounded-full border border-gray-300"
                title={color}
                style={{ backgroundColor: color }}
              />
            ))
          ) : (
            <span className="text-gray-500 text-sm">None</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => {
      const sizes = row.getValue("sizes") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {sizes && sizes.length > 0 ? (
            sizes.map((size, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
              >
                {size}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">None</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("material") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("gender") || "Unisex"}</div>
    ),
  },
  {
    accessorKey: "countryOfOrigin",
    header: "Origin",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("countryOfOrigin") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = parseFloat(row.getValue("rating"));
      return (
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">
            ({row.getValue("reviewCount") || 0})
          </span>
        </div>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const product = row.original;
  //     return (
  //       <div className="flex items-center justify-end space-x-2">
  //         <UpdateProductDialog product={product} />
  //       </div>
  //     );
  //   },
  // },
];