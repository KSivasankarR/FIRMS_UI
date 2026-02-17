import { PopupAction, AadharPopupAction, LoadingAction } from "@/redux/commonSlice"
import { store } from "@/redux/store"
import { saveLoginDetails } from "@/redux/loginSlice"
import CryptoJS from "crypto-js"

export const ShowMessagePopup = (type: boolean, message: string, redirectOnSuccess?: string) => {
  store.dispatch(PopupAction({ enable: true, type: type, message: message, redirectOnSuccess }))
}

export const ShowAadharPopup = (compName = "", dynaminCom = 0) => {
  store.dispatch(
    AadharPopupAction({
      enable: true,
      status: false,
      response: false,
      compName: compName,
      dynaminCom: dynaminCom,
      data: {},
    })
  )
}

export const Loading = (value: boolean) => {
  store.dispatch(LoadingAction({ enable: value }))
}

export const CallingAxios = async (myFunction: any) => {
  Loading(true)
  let result = await myFunction
  Loading(false)
  return result
}

export let KeepLoggedIn = () => {
  let data: any = localStorage.getItem("FASPLoginDetails")
  if (data && data != "" && process.env.SECRET_KEY) {
    let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
    data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }
  if (data && data.token) {
    store.dispatch(saveLoginDetails(data))
    return data
  } else {
    localStorage.clear()
    return false
  }
}

export const DateFormator = (InputDate: any, format: string) => {
  if (!InputDate || InputDate == "") {
    return InputDate
  }
  let DateArray = InputDate.split("T")[0].split("-")
  if (DateArray.length == 3) {
    switch (format) {
      case "dd/mm/yyyy":
        return DateArray[2] + "/" + DateArray[1] + "/" + DateArray[0]
      case "yyyy/mm/dd":
        return DateArray[0] + "/" + DateArray[1] + "/" + DateArray[2]
      case "yyyy-mm-dd":
        return DateArray[0] + "-" + DateArray[1] + "-" + DateArray[2]
      case "dd-mm-yyyy":
        return DateArray[2] + "-" + DateArray[1] + "-" + DateArray[0]
      default:
        return InputDate
    }
  } else {
    return InputDate
  }
}

export const HandleLogout = () => {
  const resetLoginDetails = {
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
  }
  store.dispatch(saveLoginDetails(resetLoginDetails))
  store.dispatch(
    PopupAction({ enable: true, type: false, message: "Session timeout", redirectOnSuccess: "/" })
  )
  localStorage.clear()
}
