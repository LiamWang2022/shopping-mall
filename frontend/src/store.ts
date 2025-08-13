import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './services/productApi'
import { cartApi } from './services/cartApi'
import { authApi } from './services/authApi'
import { orderApi } from './services/orderApi' 
import { addressApi } from './services/addressApi'
import { userApi } from './services/userApi'
import authReducer from './features/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,     
    [addressApi.reducerPath]: addressApi.reducer,
    [userApi.reducerPath]: userApi.reducer,   
  },
  middleware: (gDM) =>
    gDM().concat(
      productApi.middleware,
      cartApi.middleware,
      authApi.middleware,
      orderApi.middleware,                     
      addressApi.middleware,
      userApi.middleware,                        
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
