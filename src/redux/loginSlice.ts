import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import instance from "./api"
import { get } from "lodash"
import CryptoJS from "crypto-js"

interface TypeOFinitialState {
  loginDetails: any
  verifyUserData: any
  verifyUserLoading: boolean
  verifyUserMsg: string
  verifyUserRegData: any
  verifyUserRegLoading: boolean
  verifyUserRegMsg: string
  signUpData: any
  signUpLoading: boolean
  signUpMsg: string
  loginData: any
  loginLoading: boolean
  loginMsg: string
}

const initialState: TypeOFinitialState = {
  loginDetails: {
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail: "",
    mobileNumber: "",
    aadharNumber: "",
    registrationType: "",
    status: "",
    applicationId: "",
    applicationNumber: "",
    userType: "",
    token: "",
  },
  verifyUserData: {},
  verifyUserLoading: false,
  verifyUserMsg: "",
  verifyUserRegData: {},
  verifyUserRegLoading: false,
  verifyUserRegMsg: "",
  signUpData: {},
  signUpLoading: false,
  signUpMsg: "",
  loginData: {},
  loginLoading: false,
  loginMsg: "",
}

export const verifyUser = createAsyncThunk(
  "login/verifyUser",
  async (obj: any, { rejectWithValue }) => {
    try {
      if (process.env.SECRET_KEY) {
        let ciphertext = CryptoJS.AES.encrypt(obj.aadharNumber, process.env.SECRET_KEY).toString()
        obj.aadharNumber = ciphertext
        const resp = await instance.post(`checkUserAadhar`, obj)
        return resp.data
      }
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (obj: any, { rejectWithValue }) => {
    try {
      const resp = await instance.post(`login`, obj)
      return resp.data
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const verifyUserReg = createAsyncThunk(
  "login/verifyUserReg",
  async (obj: any, { rejectWithValue }) => {
    try {
      if (process.env.SECRET_KEY) {
        let ciphertext = CryptoJS.AES.encrypt(obj.aadharNumber, process.env.SECRET_KEY).toString()
        obj.aadharNumber = ciphertext
        const resp = await instance.post(`checkUser`, obj)
        return resp.data
      }
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

export const signUp = createAsyncThunk("login/signUp", async (obj: any, { rejectWithValue }) => {
  try {
    let url = ""
    if (obj.registrationType == "firm") {
      url = "users/createFirm"
    } else if (obj.registrationType == "society") {
      url = "users/createSociety"
    }

    const resp = await instance.post(url, obj)
    return resp.data
  } catch (err: any) {
    return rejectWithValue(err.response.data)
  }
})

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    saveLoginDetails: (state, action: PayloadAction<any>) => {
      state.loginDetails = action.payload
    },
    resetLoginDetails: (state) => {
      state.verifyUserData = {}
      state.verifyUserLoading = false
      state.verifyUserMsg = ""
      state.verifyUserRegData = {}
      state.verifyUserRegLoading = false
      state.verifyUserRegMsg = ""
      state.signUpData = {}
      state.signUpLoading = false
      state.signUpMsg = ""
      state.loginData = {}
      state.loginLoading = false
      state.loginMsg = ""
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyUser.pending, (state) => {
      state.verifyUserData = {}
      state.verifyUserLoading = true
      state.verifyUserMsg = ""
    })
    builder.addCase(verifyUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.verifyUserData = get(action, "payload", {})
      state.verifyUserLoading = false
      state.verifyUserMsg = ""
    })
    builder.addCase(verifyUser.rejected, (state, action: PayloadAction<any>) => {
      state.verifyUserData = {}
      state.verifyUserLoading = false
      state.verifyUserMsg = get(action, "payload.message", "something went wrong")
    })
    builder.addCase(verifyUserReg.pending, (state) => {
      state.verifyUserRegData = {}
      state.verifyUserRegLoading = true
      state.verifyUserRegMsg = ""
    })
    builder.addCase(verifyUserReg.fulfilled, (state, action: PayloadAction<any>) => {
      state.verifyUserRegData = get(action, "payload", {})
      state.verifyUserRegLoading = false
      state.verifyUserRegMsg = ""
    })
    builder.addCase(verifyUserReg.rejected, (state, action: PayloadAction<any>) => {
      state.verifyUserRegData = {}
      state.verifyUserRegLoading = false
      state.verifyUserRegMsg = get(action, "payload.message", "something went wrong")
    })
    builder.addCase(signUp.pending, (state) => {
      state.signUpData = {}
      state.signUpLoading = true
      state.signUpMsg = ""
    })
    builder.addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
      state.signUpData = get(action, "payload", {})
      state.signUpLoading = false
      state.signUpMsg = ""
    })
    builder.addCase(signUp.rejected, (state, action: PayloadAction<any>) => {
      state.signUpData = {}
      state.signUpLoading = false
      state.signUpMsg = get(action, "payload.message", "something went wrong")
    })
    builder.addCase(userLogin.pending, (state) => {
      state.loginData = {}
      state.loginLoading = true
      state.loginMsg = ""
    })
    builder.addCase(userLogin.fulfilled, (state, action: PayloadAction<any>) => {
      state.loginData = get(action, "payload", {})
      state.loginLoading = false
      state.loginMsg = ""
    })
    builder.addCase(userLogin.rejected, (state, action: PayloadAction<any>) => {
      state.loginData = {}
      state.loginLoading = false
      state.loginMsg = get(action, "payload.message", "something went wrong")
    })
  },
})

export const { saveLoginDetails, resetLoginDetails } = loginSlice.actions

export default loginSlice.reducer
