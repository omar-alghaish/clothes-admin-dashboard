import { apiSlice } from '../api';

export interface User {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
    }),
    updateMe: builder.mutation({
      query: (user) => ({
        url: 'users/updateMe',
        method: 'PATCH',
        body: user,
      }),
      // Optimistically update the cache
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          // Get the patch result
          const { data: updatedUser } = await queryFulfilled;
          
          // Update the getMe cache with the new data
          dispatch(
            authApi.util.updateQueryData('getMe', undefined, (draft) => {
              Object.assign(draft, updatedUser);
            })
          );
        } catch {
          // If the update fails, the cache will automatically revert
        }
      },
    }),
    getMe: builder.query({
      query: () => 'users/getMe',
      providesTags: ['CurrentUser'],
    }),
    updatePassword: builder.mutation({
      query: (payload: UpdatePasswordPayload) => ({
        url: 'users/updatePassword',
        method: 'PATCH',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateMeMutation,
  useGetMeQuery,
  useUpdatePasswordMutation,
} = authApi;