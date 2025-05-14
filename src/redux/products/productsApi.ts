import { Product, ProductFormValues } from './types';
import { apiSlice } from '../api';

interface GetProductResponse {
  data: {
    items: Product[]; 
  };
  message?: string;
}


export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<GetProductResponse, void>({
      query: () => '/items',
      providesTags: ['Products'],
    }),
    
    getProduct: builder.query<Product, string>({
      query: (id) => `/items/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    
    createProduct: builder.mutation<Product, ProductFormValues>({
      query: (newProduct) => ({
        url: '/items',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Products'], 
    }),
    
    updateProduct: builder.mutation<Product, { id: string; product: ProductFormValues }>({
      query: ({ id, product }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Products', id },
        'Products'
      ], 
    }),
    
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;