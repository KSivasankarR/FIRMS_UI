import { useState, useEffect } from "react"
import Head from "next/head"
import Register from "./register"
import FirmDashboard from "./firms/dashboard"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import CryptoJS from "crypto-js"

export default function HomePage() {
  const dispatch = useAppDispatch()

  const [SelectedformTypekey, setSelectedformTypekey] = useState<number>(1)
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails)
  const [isAuthenticated, setIsAuthenticated] = useState<any>(null)
  const [savedLoginDetails, setSavedLoginDetails] = useState<any>(null)
  const [LoginDetails, setLoginDetails] = useState(initialLoginDetails)

  useEffect(() => {
    setLoginDetails(initialLoginDetails)
  }, [initialLoginDetails])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setSavedLoginDetails(data)
  }, [initialLoginDetails])

  return (
    <>
      <Head>
        <title>Firms</title>
      </Head>
      {savedLoginDetails && savedLoginDetails.registrationType == "firm" && <FirmDashboard />}
      {!savedLoginDetails && <Register />}
    </>
  )
}
