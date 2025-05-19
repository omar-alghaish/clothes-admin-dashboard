import { apiSlice } from '../api';

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => 'Brands',
      // Add a tag to this query so we can invalidate it
      providesTags: ['Brands'],
    }),
    
    getBrandById: builder.query({
      query: (id) => `Brands/${id}`,
      // Add a tag with the Brand id
      providesTags: (result, error, id) => [{ type: 'Brands', id }],
    }),
    
    createBrand: builder.mutation({
      query: (brand) => ({
        url: 'Brands',
        method: 'POST',
        body: brand,
      }),
      // Invalidate the Brands tag to trigger a refetch
      invalidatesTags: ['Brands'],
    }),
    
    updateBrand: builder.mutation({
      query: ({ id, brand }) => ({
        url: `Brands/${id}`,
        method: 'PATCH',
        body: brand,
      }),
      // Invalidate both the list and the specific Brand
      invalidatesTags: (result, error, { id }) => [
        'Brands',
        { type: 'Brands', id }
      ],
    }),
    
    deleteBrand: builder.mutation({
      query: ({ id }) => ({
        url: `Brands/${id}`,
        method: 'DELETE',
      }),
      // Invalidate the Brands tag to trigger a refetch
      invalidatesTags: ['Brands'],
    }),
  })
});

export const {
  useUpdateBrandMutation,
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useDeleteBrandMutation
} = brandApi;