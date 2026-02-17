import axios from "axios"
import instance from "@/redux/api"
import { get } from "lodash"
import CryptoJS from "crypto-js"

let baseURL: any = process.env.BACKEND_URL

export const UseGetAadharDetailsEkyc = async (data: any) => {
  return await axios
    .post(process.env.AADHAR_URL + "/aadharEKYCWithOTP", data)
    .then((res) => {
      return res.data
    })
    .catch((e) => {
      return {
        status: false,
        message: get(e, "response.data.message", "Aadhaar OTP validation failed"),
      }
    })
}

export const UseGetAadharOTP = async (data: any) => {
  return await axios
    .post(process.env.AADHAR_URL + "/generateOTPByAadharNumber", { aadharNumber: data })
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return { status: "Failure" }
    })
}

export const UseGetAadharDetails = async (data: any) => {
  if (process.env.SECRET_KEY) {
    const enc = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString()
    return await instance
      .post("/verifyOTP", { otp: enc })
      .then((res: any) => {
        if (process.env.SECRET_KEY) {
          let bytes = CryptoJS.AES.decrypt(res.data.userInfo, process.env.SECRET_KEY)
          let re = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          return re
        }
      })
      .catch((e: any) => {
        return {
          status: false,
          message: get(e, "response.data.message", "Aadhaar OTP validation failed"),
        }
      })
  }
}

export const VerifyTransactionDetails = async (data: any) => {
  return await axios
    .post(process.env.PAYMENT_VERIFY_URL + "/verifyCfmsTransactionByDepartmentID", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: get(e, "response.data.message", "Transaction details verification failed"),
      }
    })
}

export const DefaceTransactionDetails = async (data: any) => {
  return await axios
    .post(process.env.PAYMENT_VERIFY_URL + "/defaceCfmsTransactionByDepartmentID", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: get(e, "response.data.message", "Transaction details verification failed"),
      }
    })
}

export const UseGetDistrictList = async (token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("getDistricts", mytoken)
    .then((res: any) => {
      return {
        success: true,
        data: res.data,
      }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e?.response?.data,
      }
    })
}

export const UseGetMandalList = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("getDistrictsMandals", data, mytoken)
    .then((res: any) => {
      return {
        success: true,
        data: res.data,
      }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseGetFirmDetailsById = async (applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/firms/" + btoa(applicationId), mytoken)
    .then((res: any) => {
      if (process.env.SECRET_KEY) {
        const bytes = CryptoJS.AES.decrypt(res.data, process.env.SECRET_KEY)
        const otpData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return otpData
      }
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e?.response?.data?.message ? e.response.data.message : e.response?.data?.error,
      }
    })
}

export const UseGetVillagelList = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("getDistrictsMandalVillages", data, mytoken)
    .then((res: any) => {
      return {
        success: true,
        data: res.data,
      }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseFirmNameCheck = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("firm/check", data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseFirmNameCheckAvailability = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("checkAvailability", data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseSaveFirmDetails = async (data: any, token: string) => {
  let myHeader = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  }
  return await instance
    .post("/firm/update", data, myHeader)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      // console.log(e.response.data);
      return {
        status: false,
        message: e.response.data,
      }
    })
}

export const UpdateFirmStatus = async (id: any, data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/paymentResponseDetails/" + id, data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const GetReports = async (token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/firms/reports", mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useEmailVerify = async (data: any) => {
  return await instance
    .post("/emailVerification", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseSignUp = async (data: any) => {
  return await instance
    .post("/signup", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useUserLoginData = async (data: any) => {
  console.log(instance)
  return await instance
    .post("/login", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseGetWenlandSearch = async (data: any) => {
  return await instance
    .get("/villages/CurrentPahaniDetailsSRO?vgcode=" + data.vgcode + "&sryno=" + data.sryno)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useSROOfficeList = async (id: any) => {
  return await instance
    .get("/villages?districtId=" + id)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const getSroDetails = async (id: any) => {
  return await instance
    .get(`/villages/sroDetails/${id}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseCreateApplication = async (data: any) => {
  return await instance
    .post("/documents", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useGetApplicationDetails = async (data: any) => {
  if (data?.status == undefined) {
    return await instance
      .get("/documents/" + data)
      .then((res: any) => {
        return res.data
      })
      .catch((e: any) => {
        console.log(e.response)
        return {
          status: false,
          message: e.message,
        }
      })
  } else {
    return await instance
      .get(`/documents?status=${data.status}`)
      .then((res: any) => {
        return res.data
      })
      .catch((e: any) => {
        return {
          status: false,
          message: e.response.data.error,
        }
      })
  }
}

export const useSavePartyDetails = async (data: any) => {
  console.log(data)
  return await instance
    .post("/parties", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const useSaveRepresentDetails = async (data: any) => {
  console.log(data)
  return await instance
    .post("/parties/representative", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const useUpdatePartyDetails = async (data: any) => {
  return await instance
    .put("/parties", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const useDeleteParty = async (data: any) => {
  return await instance
    .delete("/parties/" + data.applicationId + "/" + data.id)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const UseSlotBooking = async (data: any) => {
  await instance
    .post("/slots/appointment", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const UseSlotBookingDetails = async (data: any) => {
  return await instance
    .get("/slots/slotBooking/" + `${data.sroOfcNum}?dateForSlot=${data.dateForSlot}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseAddProperty = async (data: any) => {
  return await instance
    .post("/properties", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseAddCovenant = async (data: any) => {
  return await instance
    .post("/covanants", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseSetPresenter = async (data: any) => {
  return await instance
    .put("/parties/updatePresenter", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseDeleteApplication = async (applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .delete("/documents/" + applicationId, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useDeleterepresentative = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .delete("/parties/representative/" + data.partyId + "/" + data.parentPartyId, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const useDeleteProperty = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .delete("/properties/" + data.applicationId + "/" + data.propertyId, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseChangeStatus = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .put("/documents", data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data,
      }
    })
}

export const UseReportDownload = async (info: any) => {
  return await instance
    .get(`/reports/${info.type}/${info.applicationId}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const LinkedDocumentApi = async (info: any) => {
  return await instance
    .get(
      `/ob/partyOrProperty?sroCode=${info.sroCode}&documentId=${info.documentId}&regYear=${info.regYear}`
    )
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetVillageCode = async (sroCode: any) => {
  return await instance
    .get(`/ob/villagesbyODb/${sroCode}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetHabitation = async (VillageCode: any, type: string) => {
  return await instance
    .get(`/ob/habitation/${type}/${VillageCode}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetSurveynoList = async (villagecode: any) => {
  return await instance
    .get(`/ob/marketValue/classicWiseDetails?villageCode=${villagecode}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetMarketValue = async (type: string, villagecode: any) => {
  return await instance
    .get(`/ob/marketValue/${type}/${villagecode}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetMarketClassicValue = async (survayno: string, villagecode: any) => {
  return await instance
    .get(`/ob/marketValue/classicWiseDetails?villageCode=${villagecode}&serveyNo=${survayno}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetDoorWiseValue = async (WARD_NO: any, BLOCK_NO: any, habitation: any) => {
  return await instance
    .get(
      `/ob/marketValue/DoorWiseDetails?wardNo=${WARD_NO}&blockNo=${BLOCK_NO}&habitation=${habitation}`
    )
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetLinkDocDetails = async (sroCode: any, linkDocNo: any, regYear: any) => {
  return await instance
    .get(`/ob/partyOrProperty?sroCode=${sroCode}&documentId=${linkDocNo}&regYear=${regYear}`)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const useUserLogin = async (LogiDetails: any) => {}

export const getSocietyDetails = async (applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/societies/" + applicationId, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const downloadFirmCertificate = async (data: any, applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/firms/downloads/" + applicationId, data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const changePassword = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/department/changePassword", data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}
export const profileUpdate = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/department/update", data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}
export const getDeptSignature = async (id: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/certificateDetails/" + id, mytoken)
    .then((res: any) => {
      if (process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(res.data, process.env.SECRET_KEY)
        let re = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return re
      }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}
export const UseCreateCertificate = async (data: any, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/firms/actionOnCertificate", data, mytoken)
    .then((res: any) => {
      console.log(":::::::::::::::::::::::::::::::::::", res.data)
      // if (process.env.SECRET_KEY) {
      // let bytes = CryptoJS.AES.decrypt(res.data, process.env.SECRET_KEY)
      // let re = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      // console.log(":LLLLLLLLLLLLLLLLLLLLLLLLLLreLLLLLL",re)
      return res.data
      // }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const getESignStatus = async (data) => {
  // let query = '';
  // let kes = Object.keys(data);
  // kes.forEach((val, index) => {
  //     query = query + (val + '=' + data[val] + (index !== kes.length - 1 ? '&' : ''))
  // })
  return await instance
    .post(`/firms/esignStatus`, data)
    .then((res) => {
      return { data: res.data, status: true }
    })
    .catch((e) => {
      return {
        data: null,
        status: false,
        message: get(e, "response.data.message", get(e, "message", "SOMETHING_WENT_WRONG")),
      }
    })
}

export const UseUpdateRemarks = async (data: any) => {
  // let query = '';
  // let kes = Object.keys(data);
  // kes.forEach((val, index) => {
  //     query = query + (val + '=' + data[val] + (index !== kes.length - 1 ? '&' : ''))
  // })
  return await instance
    .post(`/firms/remarks`, data)
    .then((res) => {
      return { data: res.data, status: true }
    })
    .catch((e) => {
      return {
        data: null,
        status: false,
        message: get(e, "response.data.message", get(e, "message", "SOMETHING_WENT_WRONG")),
      }
    })
}

export const downloadByeLawCertificate = async (
  data: any,
  applicationId: string,
  token: string
) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/firms/byeLawdownloads/" + applicationId, data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const updateSocietyDetails = async (applicationId: string, token: string, data: any) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .post("/societies/update/" + applicationId, data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

// google translate api

export const googleAPI = async (value: string) => {
  return await axios
    .get(
      `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBVlw_vinovo_c3ahlPb7atXlN99I-wu9Q&source=en&target=te&q=${value}`
    )
    .then((res: any) => {
      return res.data
    })
    .catch((err: any) => {
      return {}
    })
}

export const UseSaveMortagageDetails = async (data: any) => {
  return await instance
    .post("payments/MORTAGAGE/create", data)
    .then((res: any) => {
      console.log(res.data)
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseSaveRelationDetails = async (data: any) => {
  return await instance
    .post("payments/GIFT/create", data)
    .then((res: any) => {
      console.log(res.data)
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.message,
      }
    })
}
export const UseSaveSaleDetails = async (data: any) => {
  return await instance
    .post("payments/SALE/create", data)
    .then((res: any) => {
      console.log(res.data)
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseUpdatePaymentDetails = async (data: any) => {
  return await instance
    .put("/payments/update/" + data._id, data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseDeletePaymentDetails = async (id: any) => {
  return await instance
    .delete("/payments/delete" + id)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const GetCDMAData = async (data: any) => {
  return await instance
    .post("/villages/CDMAPropertyAssessmentDetails", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseGetPPCheck = async (data: any, type: string) => {
  return await instance
    .put(`/ob/pp_check/${type}`, data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseSaveCovinant = async (data: any) => {
  return await instance
    .post("/covanants", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseDelCovenant = async (data: any) => {
  return await instance
    .delete("/covanants/" + data.documentId + "/" + data.covId, data.covanants)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const UseUpdateCovinant = async (data: any) => {
  return await instance
    .put("/covanants/" + data.documentId + "/" + data.covId, data.covanants)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const UseMVCalculator = async (data: any, type: string) => {
  return await instance
    .put("/ob/" + type + "/mvCalculator", data)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e)
      return {
        status: false,
        message: e.message,
      }
    })
}

export const updateFirmDetails = async (applicationId: string, token: string, data: any) => {
  for (var pair of data.entries()) {
    console.log(pair[0] + ", " + pair[1])
  }
  let mytoken = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  }
  return await instance
    .put("/firm/update/" + applicationId, data, mytoken)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.response.data.error,
      }
    })
}

export const getFirmDetails = async (applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/firms/" + btoa(applicationId), mytoken)
    .then((res: any) => {
      if (process.env.SECRET_KEY) {
        const bytes = CryptoJS.AES.decrypt(res.data, process.env.SECRET_KEY)
        const otpData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        console.log("otpData::::", otpData)
        return otpData
      }
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const downloadFileByData = async (
  applicationId: string,
  filename: string,
  token: string
) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/firms/downloadFileByData/" + btoa(applicationId) + "/" + filename, mytoken)
    .then((res: any) => {
      console.log("res", res)
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const downloadCertificateByData = async (
  applicationId: string,
  filename: string,
  token: string
) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  const downloadApplication = Buffer.from(applicationId, "utf-8").toString("base64")
  const downloadFiles = Buffer.from(filename, "utf-8").toString("base64")
  return await instance
    .get(`/firms/downloadcertificateByData/${downloadApplication}/${downloadFiles}`, mytoken)
    .then((res: any) => {
      console.log("res", res)
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}

// export const downloadCertificateByData = async (applicationId: string,filename:string, token: string) => {
//   let mytoken = { headers: { Authorization: `Bearer ${token}` } }
//   return await instance
//     .get("/firms/downloadcertificateByData/" + btoa(applicationId)+"/"+btoa(filename), mytoken)
//     .then((res: any) => {
//       console.log("res",res)
//        return res.data

//     })
//     .catch((e: any) => {
//       console.log(e.message)
//       return {
//         status: false,
//         message: e.message,
//       }
//     })
// }
export const downloadcertificate = async (applicationId: string, token: string) => {
  let mytoken = { headers: { Authorization: `Bearer ${token}` } }
  return await instance
    .get("/firms/downloadcertificate/" + btoa(applicationId), mytoken)
    .then((res: any) => {
      console.log("res", res)
      return res.data
    })
    .catch((e: any) => {
      console.log(e.message)
      return {
        status: false,
        message: e.message,
      }
    })
}
export const UseSaveDataEntryFirmDetails = async (data: any, token: string) => {
  let myHeader = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  }
  return await instance
    .post("/department/dataEntry", data, myHeader)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.response.data,
      }
    })
}
export const UseSaveDataEntryFirmLegacy = async (data: any, token: string) => {
  let myHeader = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  }
  return await instance
    .post("/department/dataEntryLegacy", data, myHeader)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.response.data,
      }
    })
}

export const getDLFdata = async (identifier: string, id: string, data: any) => {
  const encodedID = btoa(id)
  if (process.env.SECRET_KEY) {
    const enc = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString()
    try {
      const response = await instance.get(`/list/${identifier}/getLegacydata/${encodedID}`)
      if (response.data) {
        const Data = response.data
        if (Data) {
          let bytes = CryptoJS.AES.decrypt(Data, process.env.SECRET_KEY)
          let decryptedData = bytes.toString(CryptoJS.enc.Utf8)
        }
        return { status: true, data: Data }
      } else {
        return { status: false, message: "No userInfo found in response." }
      }
    } catch (error) {
      // console.log("status,",status);
      return {
        status: false,
        // message: error?.response?.data?.message || "Error occurred while fetching data.",
      }
    }
  } else {
    return { status: false, message: "Secret key not found." }
  }
}

export const UseGetFraDetails = async (registrationNumber: string, registrationYear: string,district: string) => {
  return await instance
    .get("list/firmData", { params: {registrationNumber,registrationYear,district}})
    .then((response: any) => {      
      return response.data;
    })
    .catch((e: any) => {      
      return {
        status: false,
        message: e.response.data.message,
      };
    });
};
 
export const UseSaveDataUserLegacySociety = async (data: any) => {
  let myHeader = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      // Authorization: `Bearer ${token}`,
    },
  }
  return await instance
    .post("/department/dataEntryUser", data, myHeader)
    .then((res: any) => {
      return res.data
    })
    .catch((e: any) => {
      return {
        status: false,
        message: e.response.data,
      }
    })
};
 
export const getFirmName = async ( firmName: string, data: any, token: string) => {
  const encodedID = btoa(firmName);
  if (process.env.SECRET_KEY) {
    const enc = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const response = await instance.get(`/list/fraName/${encodedID}`, headers);
      if (response.data) {
        const Data = response.data;
        if (Data) {
          let bytes = CryptoJS.AES.decrypt(Data, process.env.SECRET_KEY);
          let decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        }
        return { status: true, data: Data };
      } else {
        return { status: false, message: "No userInfo found in response." };
      }
    } catch (error: any) {
      return {
        status: false,
      };
    }
  } else {
    return { status: false, message: "Secret key not found." };
  }
 
};