"use client";

import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Upload, ImageIcon, Check } from "lucide-react";
import { 
  ProductFormValues, 
  Size, 
  Gender 
} from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Validation schema
const productSchema = Yup.object().shape({
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  description: Yup.string().min(10, "Details must be at least 10 characters").required("Details are required"),
  price: Yup.number().positive("Price must be positive").required("Price is required"),
  category: Yup.string().min(2, "Category must be at least 2 characters").required("Category is required"),
  stock: Yup.number().integer("Stock must be a whole number").min(0, "Stock must be non-negative").required("Stock is required"),
  colors: Yup.array().of(
    Yup.string().required("Color value is required")
  ).min(1, "At least one color is required"),
  images: Yup.array().min(1, "At least one image is required"),
  img: Yup.string().required("Cover image is required"),
  gender: Yup.string().oneOf(["male", "female", "unisex"], "Invalid gender").required("Gender is required"),
  sizes: Yup.array().min(1, "At least one size is required"),
  material: Yup.string().required("Material is required"),
  countryOfOrigin: Yup.string().required("Country of origin is required")
});

// Default sizes
const availableSizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// Props for the ProductForm component
interface ProductFormProps {
  initialData?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void | Promise<any>;
  isSubmitting: boolean;
}

// Props for the FormField component
interface FormFieldProps {
  label: string;
  name: string;
  as?: React.ComponentType<any> | string;
  type?: string;
  placeholder?: string;
  step?: string;
  className?: string;
  children?: React.ReactNode;
}

// Form Field component to reduce repetition
const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  as = Input, 
  type, 
  placeholder, 
  step, 
  children, 
  ...props 
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Field
      as={as}
      id={name}
      name={name}
      type={type}
      step={step}
      placeholder={placeholder}
      {...props}
    />
    <ErrorMessage name={name} component="div" className="text-sm text-red-500" />
    {children}
  </div>
);

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [previewImages, setPreviewImages] = useState<string[]>(initialData?.images || []);
  const [coverImage, setCoverImage] = useState<string>(initialData?.img || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  
  // Ensure colors are processed correctly - handle both string[] and object[] formats
  const normalizeInitialColors = () => {
    if (!initialData?.colors) return [""];
    
    // If colors is an array of strings, use it directly
    if (typeof initialData.colors[0] === 'string') {
      return initialData.colors as string[];
    }
    
    // If colors is an object with name property, extract the names
    return [""];
  };
  
  const initialColors = normalizeInitialColors();

  const initialValues: ProductFormValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    stock: initialData?.stock || 0,
    colors: initialColors,
    images: initialData?.images || [],
    img: initialData?.img || "",
    gender: initialData?.gender || "unisex",
    sizes: initialData?.sizes || [],
    material: initialData?.material || "",
    countryOfOrigin: initialData?.countryOfOrigin || "",
  };

  // Image handling functions
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: string, 
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void, 
    currentValues: string[] | null, 
    preview: string | string[], 
    setPreview: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const files = e.target.files;
    if (!files?.length) return;
    
    const fileReader = new FileReader();
    if (field === "img") {
      // Single file for cover image
      fileReader.onload = () => {
        const dataUrl = fileReader.result as string;
        setPreview(dataUrl);
        setFieldValue(field, dataUrl);
      };
      fileReader.readAsDataURL(files[0]);
    } else {
      // Multiple files for product images
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const newValues = [...(currentValues || []), dataUrl];
          const newPreview = [...(Array.isArray(preview) ? preview : []), dataUrl];
          setFieldValue(field, newValues);
          setPreview(newPreview);
        };
        reader.readAsDataURL(file);
      });
    }
    // Clear input
    e.target.value = "";
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form className="space-y-6">
          <FormField 
            label="Product name" 
            name="name" 
            placeholder="Enter product name" 
            className={errors.name && touched.name ? "border-red-500" : ""}
          />

<FormField 
  label="Details" 
  name="description" // Changed from "details" to "description"
  as={Textarea}
  placeholder="Enter product details"
  className={`resize-none ${errors.description && touched.description ? "border-red-500" : ""}`}
/>

          <div className="grid grid-cols-2 gap-4">
            <FormField 
              label="Price ($)" 
              name="price" 
              type="number" 
              step="0.01"
              className={errors.price && touched.price ? "border-red-500" : ""}
            />

            <FormField 
              label="Stock" 
              name="stock" 
              type="number"
              className={errors.stock && touched.stock ? "border-red-500" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField 
              label="Category" 
              name="category" 
              placeholder="Enter product category"
              className={errors.category && touched.category ? "border-red-500" : ""}
            />
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Field name="gender">
                {({ field, form }: any) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => form.setFieldValue("gender", value)}
                  >
                    <SelectTrigger className={errors.gender && touched.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <ErrorMessage name="gender" component="div" className="text-sm text-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField 
              label="Material" 
              name="material" 
              placeholder="Enter product material"
              className={errors.material && touched.material ? "border-red-500" : ""}
            />
            
            <FormField 
              label="Country of Origin" 
              name="countryOfOrigin" 
              placeholder="Enter country of origin"
              className={errors.countryOfOrigin && touched.countryOfOrigin ? "border-red-500" : ""}
            />
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <Label>Product Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <div key={size} className="flex items-center">
                  <Field type="checkbox" id={`size-${size}`} name="sizes" value={size} className="mr-2" />
                  <Label htmlFor={`size-${size}`} className="cursor-pointer">{size}</Label>
                </div>
              ))}
            </div>
            {typeof errors.sizes === 'string' && touched.sizes && (
              <div className="text-sm text-red-500">{errors.sizes}</div>
            )}
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-3">
            <Label>Cover Image</Label>
            <div className="flex items-start gap-4">
              <div 
                className="border-2 border-dashed border-gray-300 p-4 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer w-32 h-32"
                onClick={() => coverImageInputRef.current?.click()}
              >
                {coverImage ? (
                  <div className="relative w-full h-full">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage("");
                        setFieldValue("img", "");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Cover Image</span>
                  </>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={coverImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "img", setFieldValue, null, coverImage, setCoverImage)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => coverImageInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Cover Image
                </Button>
                <div className="text-xs text-gray-500 mb-2">
                  Upload a main image that will be displayed as the product cover.
                </div>
                {!coverImage && touched.img && errors.img && (
                  <div className="text-sm text-red-500">{errors.img as string}</div>
                )}
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-3">
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-2">
              {previewImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="border rounded-md overflow-hidden h-24">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      type="button"
                      className="p-1 bg-blue-500 rounded-full text-white"
                      onClick={() => {
                        setCoverImage(img);
                        setFieldValue("img", img);
                      }}
                      title="Set as cover image"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className="p-1 bg-red-500 rounded-full text-white"
                      onClick={() => {
                        const newImages = values.images.filter((_, i) => i !== index);
                        const newPreview = previewImages.filter((_, i) => i !== index);
                        setFieldValue("images", newImages);
                        setPreviewImages(newPreview);
                        
                        if (values.img === img) {
                          setCoverImage("");
                          setFieldValue("img", "");
                        }
                      }}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              <div 
                className="border-2 border-dashed border-gray-300 p-4 rounded-md flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-24"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add Image</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, "images", setFieldValue, values.images, previewImages, setPreviewImages)}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
            {previewImages.length === 0 && touched.images && errors.images && (
              <div className="text-sm text-red-500">
                {typeof errors.images === 'string' ? errors.images : "At least one product image is required"}
              </div>
            )}
          </div>

          {/* Colors - Using simple string array */}
          <div className="space-y-3">
            <Label>Product Colors</Label>
            <FieldArray name="colors">
              {({ remove, push }) => (
                <div className="space-y-2">
                  {values.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Field
                        as={Input}
                        name={`colors.${index}`}
                        placeholder="Color name (e.g., Ruby Red, Navy Blue)"
                        className={(
                          errors.colors?.[index] && 
                          Array.isArray(touched.colors) && touched.colors[index]
                        ) ? "border-red-500 flex-1" : "flex-1"}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => push("")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                  {typeof errors.colors === 'string' && touched.colors && (
                    <div className="text-sm text-red-500">{errors.colors}</div>
                  )}
                </div>
              )}
            </FieldArray>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData && initialData.name ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}