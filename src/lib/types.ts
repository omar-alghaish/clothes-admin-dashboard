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
  colors: string[]; // Simplified to just string array
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
  colors: string; // API expects JSON string of colors array
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

// Add this to your lib/types.ts file

export interface User {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  active?: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormValues {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
  phone?: string;
  address?: string;
  avatar?: string;
  id?: string;
}


export interface Category {
  _id: string;
  id:string
  name: string;
  description?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // slug?: string;
  // icon?: string;
  // featured?: boolean;
  // parentCategory?: string | { _id: string; name: string };
  // metaTitle?: string;
  // metaDescription?: string;
  // productCount?: number;
}

export interface CategoryFormValues {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  gender?: string;
  featured?: boolean;
  parentCategory?: string;
  metaTitle?: string;
  metaDescription?: string;
}


