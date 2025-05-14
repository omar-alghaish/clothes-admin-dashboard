import { ColumnDef } from "@tanstack/react-table";

/**
 * Size type for product sizes
 */
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | string;

/**
 * Gender type for product categorization
 */
export type Gender = "male" | "female" | "unisex";

/**
 * Base product information interface
 */
export interface ProductBase {
  name: string;
  price: number;
  description: string; // Called "description" in the API
  category: string;
  stock: number;
}

/**
 * Product form values interface - used in the form component
 * This matches the structure expected by the ProductForm component
 */
export interface ProductFormValues extends ProductBase {
  colors: string[]; // Changed from Color[] to string[]
  images: string[];
  img: string; // Cover image
  sizes?: Size[]; // Optional in form but required for API
  gender?: Gender; // Optional in form but required for API
  material?: string; // Optional in form but required for API
  countryOfOrigin?: string; // Optional in form but required for API
}

/**
 * API Request Data Interface - what gets sent to the server
 * This matches the API endpoint requirements
 */
export interface ProductApiRequest {
  name: string;
  price: number;
  description: string; // Note: "details" in the form becomes "description" in the API
  colors: string[]; // API expects JSON string of colors array
  sizes: string; // API expects JSON string of sizes array
  category: string;
  stock: number;
  gender: Gender;
  material: string;
  countryOfOrigin: string;
  img: string; // Cover image as data URL
  images: string[]; // Product images as data URLs
}

/**
 * Product interface - what gets returned from the API
 */
export interface Product {
  _id: string;
  id: string; // Some components use id, others use _id
  name: string;
  price: number;
  description: string;
  colors: string | string[]; // Could be JSON string or already parsed array
  sizes: string | Size[]; // Could be JSON string or already parsed array
  category: string;
  stock: number;
  gender: Gender;
  material: string;
  countryOfOrigin: string;
  img: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Generic table data interface
 */
export interface TableData {
  id: string;
  [key: string]: any;
}

/**
 * Reusable table props
 */
export interface DataTableProps<TData extends TableData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchField?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}