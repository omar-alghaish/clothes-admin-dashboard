import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { apiSlice } from '../api';


export type OrderItem = {
    brand: string;
    color: string;
    price: number;
    product: {
      _id: string;
      name: string;
      rating: number;
      price: number;
      description: string;
    };
    quantity: number;
    size: string;
    _id: string;
  };
  
 export type ShippingAddress = {
    city: string;
    country: string;
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    streetAddress: string;
    updatedAt: string;
    user: string;
    zipCode: string;
    _id: string;
  };
  
export  type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  
 export type Order = {
    _id?: string;
    createdAt: string;
    estimatedDate: string;
    items: OrderItem[];
    paymentMethod: string;
    shipping: number;
    shippingAddress: ShippingAddress;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    subTotal: number;
    tax: number;
    totalPrice: number;
    updatedAt: string;
    user: User;
    isPaid?: boolean;
  };

interface OrderResponse {
    data: {
        orders:Order[]
    } 
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerOrders: builder.query<OrderResponse, void>({
      query: () => 'orders/seller-orders',
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: string }>({
      query: (body) => ({
        url: 'orders/seller-orders',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const { 
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation
} = ordersApi;