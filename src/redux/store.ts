import { configureStore } from "@reduxjs/toolkit"
import commonReducer from "./commonSlice"
import formSlice from "./formSlice"
import loginSlice from "./loginSlice"
import paymentSlice from "./paymentSlice"

export const store = configureStore({
  reducer: {
    common: commonReducer,
    login: loginSlice,
    form: formSlice,
    payment: paymentSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
