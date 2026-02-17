import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import instance from "./api"
import { get } from "lodash"

interface TypeOfInitialState {
  paymentOp: any
  getPaymentData: any
  getPaymentLoading: boolean
  getPaymentMsg: string
  payStatusData: any
  payStatusMsg: string
  payStatusLoading: boolean
}

const initialState: TypeOfInitialState = {
  paymentOp: {
    showModal: false,
    type: "",
    reqBody: {},
    applicationDetails: {},
    callBack: null,
  },
  getPaymentData: {},
  getPaymentLoading: false,
  getPaymentMsg: "",
  payStatusData: {},
  payStatusMsg: "",
  payStatusLoading: false,
}

export const getPaymentAmount = createAsyncThunk(
  "payment/getPaymentAmount",
  async (obj: any, { rejectWithValue }) => {
    try {
      const rs = await instance.put("/ob/dutyCalculator", { ...obj })

      return rs.data
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const getPaymentStatus = createAsyncThunk(
  "payment/getPaymentStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const rs = await instance.get(`/payment/status/${id}`)
      return rs.data
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentOP: (state, action: PayloadAction<any>) => {
      state.paymentOp = { ...state.paymentOp, ...action.payload }
    },
    resetPaymentStatus: (state) => {
      state.payStatusData = {}
      state.payStatusLoading = false
      state.payStatusMsg = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentAmount.pending, (state) => {
      state.getPaymentData = {}
      state.getPaymentLoading = true
      state.getPaymentMsg = ""
    })
    builder.addCase(getPaymentAmount.fulfilled, (state, action: PayloadAction<any>) => {
      state.getPaymentData = get(action, "payload.data", {})
      state.getPaymentLoading = false
      state.getPaymentMsg = ""
    })
    builder.addCase(getPaymentAmount.rejected, (state, action: PayloadAction<any>) => {
      state.getPaymentData = {}
      state.getPaymentLoading = false
      state.getPaymentMsg = get(action, "payload.message", "something went wrong")
    })
    builder.addCase(getPaymentStatus.pending, (state) => {
      state.payStatusData = {}
      state.payStatusLoading = true
      state.payStatusMsg = ""
    })
    builder.addCase(getPaymentStatus.fulfilled, (state, action: PayloadAction<any>) => {
      state.payStatusData = get(action, "payload.data", {})
      state.payStatusLoading = false
      state.payStatusMsg = ""
    })
    builder.addCase(getPaymentStatus.rejected, (state, action: PayloadAction<any>) => {
      state.payStatusData = {}
      state.payStatusLoading = false
      state.payStatusMsg = get(action, "payload.message", "something went wrong")
    })
  },
})

export const { setPaymentOP, resetPaymentStatus } = paymentSlice.actions

export default paymentSlice.reducer
