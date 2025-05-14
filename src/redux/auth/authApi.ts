// src/lib/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

interface GetMeResponse {
  data:{
user:User
  },
  message:string
}

// Define our base query with the API URL
export const authApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://clothes-server-production.up.railway.app/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state if available
      const token = (getState() as RootState).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMe: builder.query<GetMeResponse, void>({
      query: () => '/users/getMe',
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
        query: (credentials) => {
            console.log('Register Credentials:', credentials); 
            return {
              url: '/users/register',
              method: 'POST',
              body: { ...credentials, role: 'admin'},
            };
          },
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;

// Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string; 
  brandName: string;
  brandDescription: string;
  brandStyle: string;
  primaryColor: string;
  businessAddress: {
    street: string,
        city: string,
        state: string,
        postalCode: string,
        country: string
  };
  phoneNumber: string;
  website?: string;
  taxId: string;
  brandLogo?: File;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  brandName: string;
}

