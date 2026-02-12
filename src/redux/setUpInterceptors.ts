import instance from "./api"
import { get } from "lodash"
import CryptoJS from "crypto-js"
import { HandleLogout } from "@/GenericFunctions"

const SetUp = () => {
  instance.interceptors.request.use(
    function (config: any) {
      const data = localStorage.getItem("FASPLoginDetails")
      let parsedData: any
      try {
        if (data && data != "" && process.env.SECRET_KEY) {
          let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
          parsedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        }
        if (parsedData && parsedData.token) {
          config.headers["Authorization"] = "Bearer " + parsedData.token
        }
      } catch {
        parsedData = false
      }
      return config
    },
    function (error: any) {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    async (response: any) => {
      return response
    },
    async (error: any) => {
      const originalConfig = error.config
      if (
        error &&
        error.response &&
        error.response.status === 401 &&
        !originalConfig._retry &&
        get(error.response, "data.message", "") !== "Session Expired"
      ) {
        originalConfig._retry = true
        try {
          const g = localStorage.getItem("FASPLoginDetails")
          let parsedData: any
          try {
            if (g && g != "" && process.env.SECRET_KEY) {
              let bytes = CryptoJS.AES.decrypt(g, process.env.SECRET_KEY)
              parsedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
            }
            if (parsedData && parsedData.token) {
              const rs = await instance.get("/getRefreshToken")
              if (get(rs, "data.data.token", "") && process.env.SECRET_KEY) {
                parsedData.token = rs.data.data.token
                const userDetailsEnc = CryptoJS.AES.encrypt(
                  JSON.stringify(parsedData),
                  process.env.SECRET_KEY
                ).toString()
                localStorage.setItem("FASPLoginDetails", userDetailsEnc)
                return instance(originalConfig)
              } else {
                setTimeout(() => {
                  HandleLogout()
                }, 0)
              }
            } else {
              setTimeout(() => {
                HandleLogout()
              }, 0)
            }
          } catch (_error1: any) {
            setTimeout(() => {
              HandleLogout()
            }, 0)
            return Promise.reject(_error1)
          }
        } catch (_error: any) {
          setTimeout(() => {
            HandleLogout()
          }, 0)
          return Promise.reject(_error)
        }
      } else if (error && error.response && error.response.status === 401) {
        setTimeout(() => {
          HandleLogout()
        }, 0)
      }
      return Promise.reject(error)
    }
  )
}

export default SetUp
