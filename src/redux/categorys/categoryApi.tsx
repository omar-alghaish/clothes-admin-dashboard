import { apiSlice } from '../api';

// Define a tag type for cache invalidation
export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => 'categories',
      // Add a tag to this query so we can invalidate it
      providesTags: ['Categories'],
    }),
    
    getCategoryById: builder.query({
      query: (id) => `categories/${id}`,
      // Add a tag with the category id
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),
    
    createCategory: builder.mutation({
      query: (category) => ({
        url: 'categories',
        method: 'POST',
        body: category,
      }),
      // Invalidate the Categories tag to trigger a refetch
      invalidatesTags: ['Categories'],
    }),
    
    updateCategory: builder.mutation({
      query: ({ id, category }) => ({
        url: `categories/${id}`,
        method: 'PATCH',
        body: category,
      }),
      // Invalidate both the list and the specific category
      invalidatesTags: (result, error, { id }) => [
        'Categories',
        { type: 'Categories', id }
      ],
    }),
    
    deleteCategory: builder.mutation({
      query: ({ id }) => ({
        url: `categories/${id}`,
        method: 'DELETE',
      }),
      // Invalidate the Categories tag to trigger a refetch
      invalidatesTags: ['Categories'],
    }),
  })
});

export const {
  useUpdateCategoryMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useDeleteCategoryMutation
} = categoriesApi;