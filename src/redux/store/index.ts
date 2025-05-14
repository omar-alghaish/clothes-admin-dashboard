import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from "../auth/authApi"
import authReducer from "../auth/authSlice"
import { settingsApi } from '../settings/settingsApi';
import { apiSlice } from '../api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, apiSlice.middleware, settingsApi.middleware),

});

// Enable listener behaviors for RTK Query
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;