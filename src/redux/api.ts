import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const API_URL = 'https://clothes-server-production.up.railway.app/api/v1';

export const apiSlice = createApi({
 reducerPath: 'Api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the request headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Products','Orders', 'Categories', 'Brands', 'Users', 'CurrentUser'],
  endpoints: (builder) => ({

  }),
});

export const {

} = apiSlice;