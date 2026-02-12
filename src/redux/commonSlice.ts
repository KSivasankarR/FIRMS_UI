import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TypeOFinitialState {
  PopupMemory: any
  AadharPopupMemory: any
  AadharOTPMemory: any
  DeletePopupMemory: any
  ConfirmPopupMemory: any
  Loading: any
}

const initialState: TypeOFinitialState = {
  PopupMemory: {
    enable: false,
    message: "",
    type: "",
    redirectOnSuccess: "",
  },
  AadharOTPMemory: {
    enable: false,
    status: false,
    response: false,
    compName: "",
    aadharNumber: "",
    data: {},
    passParams: {},
  },
  AadharPopupMemory: {
    enable: false,
    status: false,
    response: false,
    compName: "",
    dynaminCom: 0,
    data: {},
  },
  DeletePopupMemory: {
    enable: false,
    response: false,
    message: "",
    redirectOnSuccess: "",
    deleteId: "",
    applicationId: "",
    type: "",
  },
  ConfirmPopupMemory: {
    enable: false,
    message: "",
    result: false,
    redirectOnSuccess: "",
  },
  Loading: {
    enable: false,
  },
}

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    PopupAction: (state, action: PayloadAction<any>) => {
      state.PopupMemory = action.payload
    },
    AadharPopupAction: (state, action: PayloadAction<any>) => {
      state.AadharPopupMemory = action.payload
    },
    AadharOTPAction: (state, action: PayloadAction<any>) => {
      state.AadharOTPMemory = action.payload
    },
    DeletePopupAction: (state, action: PayloadAction<any>) => {
      state.DeletePopupMemory = action.payload
    },
    ConfirmPopupAction: (state, action: PayloadAction<any>) => {
      state.DeletePopupMemory = action.payload
    },
    LoadingAction: (state, action: PayloadAction<any>) => {
      state.Loading = action.payload
    },
  },
})

export const { PopupAction, AadharPopupAction, AadharOTPAction, DeletePopupAction, LoadingAction } =
  commonSlice.actions

export default commonSlice.reducer
