// src/lib/api/settingsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

const API_URL = 'https://clothes-server-production.up.railway.app/api/v1';

// Define types for our settings
export interface BrandSettings {
  brandName: string;
  brandDescription: string;
  brandStyle: string;
  _id?: string;
}

export interface BusinessSettings {
  country: string;
  postalCode: string;
  state: string;
  city: string;
  street: string;
  businessAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
    state: string
  };
  phoneNumber: string;
  website: string;
  taxId: string;
}

export interface IdentitySettings {
  primaryColor: string;
  brandLogo?: File;
}

export interface PersonalSettings {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface CompleteSettings {
  data: {
    brand: {
      _id: string;
      brandName: string;
      brandDescription: string;
      brandStyle: string;
      primaryColor: string;
      brandLogo?: File;
      phoneNumber: string;
      website: string;
      taxId: string;
      businessAddress: BusinessSettings;
    }
  }

}

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
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
  tagTypes: ['Settings', 'Brand', 'Business', 'Identity', 'Personal'],
  endpoints: (builder) => ({
    // Get all settings
    getSettings: builder.query<CompleteSettings, void>({
      query: () => '/brands/my-brand',
      providesTags: ['Settings', 'Brand', 'Business', 'Identity', 'Personal'],
    }),

    // Update brand settings
    updateBrandSettings: builder.mutation<BrandSettings, { brandSettings: Partial<BrandSettings>; brandId: string }>({
      query: ({ brandSettings, brandId }) => ({
        url: `/brands/${brandId}`,
        method: 'PATCH',
        body: brandSettings,
      }),
      invalidatesTags: ['Settings', 'Brand'],
    }),

    // Update business settings
    updateBusinessSettings: builder.mutation<BusinessSettings, { businessSettings: Partial<BusinessSettings>; brandId: string }>({
      query: ({ businessSettings, brandId }) => ({
        url: `/brands/${brandId}`,
        method: 'PATCH',
        body: businessSettings,
      }),
      invalidatesTags: ['Settings', 'Business'],
    }),

    // Update identity settings (with multipart form for logo)
    updateIdentitySettings: builder.mutation<IdentitySettings, { identitySettings: Partial<IdentitySettings>; brandId: string }>({
      query: ({ identitySettings, brandId }) => {
        // Create a FormData object if there's a logo file
        if (identitySettings.brandLogo) {
          const formData = new FormData();
          formData.append('brandLogo', identitySettings.brandLogo);
          console.log(identitySettings.brandLogo)
          if (identitySettings.primaryColor) {
            formData.append('primaryColor', identitySettings.primaryColor);
          }

          return {
            url: `/brands/${brandId}`,
            method: 'PATCH',
            body: formData,
          };
        }

        // Otherwise, just send the regular JSON
        return {
          url: `/brands/${brandId}`,
          method: 'PATCH',
          body: identitySettings,
        };
      },
      invalidatesTags: ['Settings', 'Identity'],
    }),

    // Update personal info
    updatePersonalInfo: builder.mutation<PersonalSettings, Partial<PersonalSettings>>({
      query: (personalSettings) => ({
        url: '/users/updateMe',
        method: 'PATCH',
        body: personalSettings,
      }),
      invalidatesTags: ['Settings', 'Personal'],
    }),

    // Update password
    updatePassword: builder.mutation<void, PasswordUpdate>({
      query: (passwordData) => ({
        url: '/users/changePassword',
        method: 'PATCH',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateBrandSettingsMutation,
  useUpdateBusinessSettingsMutation,
  useUpdateIdentitySettingsMutation,
  useUpdatePersonalInfoMutation,
  useUpdatePasswordMutation,
} = settingsApi;