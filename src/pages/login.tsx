import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { get } from "lodash"
import styles from "@/styles/pages/Forms.module.scss"
import { UseGetAadharOTP, useUserLoginData } from "@/axios"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { resetLoginDetails, saveLoginDetails, userLogin, verifyUser } from "@/redux/loginSlice"
import { CallingAxios, ShowMessagePopup } from "@/GenericFunctions"
import Button from "@/components/Button"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import TableText from "@/components/common/TableText"
import CryptoJS, { AES } from "crypto-js"
import { IALoginDetailsSMModel } from "@/models/appTypes"

const initialLoginDetails: IALoginDetailsSMModel = {
  aadharNumber: "",
  registrationType: "firm",
  maskedAadhar: "",
}

const LoginPage = (props: any) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [LoginDetails, setLoginDetails] = useState<IALoginDetailsSMModel>(initialLoginDetails)
  const [FormError, setFormError] = useState<string>("")
  const [sentOTP, setSentOTP] = useState<boolean>(false)
  const [otp, setOTP] = useState<string>("")
  const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [refId, setRefId] = useState<string>("")
  const [isFieldAdded, setIsFieldAdded] = useState<boolean>(false)

  const verifyUserData = useAppSelector((state: any) => state.login.verifyUserData)
  const verifyUserLoading = useAppSelector((state: any) => state.login.verifyUserLoading)
  const verifyUserMsg = useAppSelector((state: any) => state.login.verifyUserMsg)

  const loginData = useAppSelector((state: any) => state.login.loginData)
  const loginLoading = useAppSelector((state: any) => state.login.loginLoading)
  const loginMsg = useAppSelector((state: any) => state.login.loginMsg)

  const onNumberOnlyChange = (event: any) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const isValid = new RegExp("[0-9]").test(keyValue)
    if (!isValid) {
      event.preventDefault()
      return
    }
  }

  const onChange = (e: any) => {
    let newNo = ""
    let newVal = ""
    let aadharNo = ""
    if (e.target.value.length > 0 && e.target.value.length > LoginDetails.aadharNumber.length) {
      newNo = e.target.value[e.target.value.length - 1]
    } else if (e.target.value.length == 0) {
      newNo = "del"
    }
    for (let i = 0; i <= e.target.value.length - 1; i++) {
      if (i < 8) {
        newVal = newVal + "X"
      } else {
        newVal = newVal + e.target.value[i]
      }
    }
    if (newNo == "") {
      let startpos = parseInt(e.target.selectionStart)
      aadharNo =
        LoginDetails.aadharNumber.substring(0, startpos) +
        LoginDetails.aadharNumber.substring(startpos + 1, LoginDetails.aadharNumber.length)
    }
    setLoginDetails({
      ...LoginDetails,
      aadharNumber:
        newNo == "del" ? "" : newNo != "" ? LoginDetails.aadharNumber + newNo : aadharNo,
      [e.target.name]: newVal,
    })
    if (e.target.value && e.target.value.length == 12) {
      setIsFieldAdded(true)
    } else {
      setIsFieldAdded(false)
    }
    if (FormError) {
      setFormError("")
    }
  }

  const backToLogin = () => {
    setLoginDetails({ ...initialLoginDetails })
    setOTP("")
    setSentOTP(false)
  }

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data) {
      if (data.userType == "user") {
        router.push("/firms/dashboard")
      } else {
        router.push("/reports")
      }
    } else {
      localStorage.clear()
      const resetLoginDetails: any = {
        firstName: "",
        lastName: "",
        email: "",
        alternateEmail: "",
        mobileNumber: "",
        token: "",
        aadharNumber: "",
        registrationType: "",
        status: "",
        applicationId: "",
        applicationNumber: "",
        userType: "",
      }
      dispatch(saveLoginDetails(resetLoginDetails))
    }
  }, [])

  const onSubmit = (e: any) => {
    e.preventDefault()

    let myError: any = validate(LoginDetails)
    if (!myError) {
      let obj: any = {
        registrationType: LoginDetails.registrationType,
        aadharNumber: LoginDetails.aadharNumber,
      }
      dispatch(verifyUser(obj))
    }
  }

  useEffect(() => {
    if (Object.keys(verifyUserData).length && verifyUserData.success == true) {
      ; (async () => {
        if (process.env.IGRS_SECRET_KEY) {
          setLoading(true)
          setRefId(verifyUserData.data.refId)
          const ciphertext = AES.encrypt(LoginDetails.aadharNumber, process.env.IGRS_SECRET_KEY)
          let result = await UseGetAadharOTP(ciphertext.toString())
          if (result && result.status === "Success") {
            ShowMessagePopup(true, "The OTP has been sent to your Aadhaar registered mobile number successfully.")
            setSentOTP(true)
            setAadhaarOTPResponse(result)
          } else {
            ShowMessagePopup(false, get(result, "message", "Aadhaar API failed"))
            setAadhaarOTPResponse({})
          }
          setLoading(false)
        }
      })()
    } else if (verifyUserData.success == false) {
      ShowMessagePopup(false, verifyUserData.message, "")
    }
  }, [verifyUserData])

  useEffect(() => {
    if (verifyUserMsg) {
      ShowMessagePopup(false, verifyUserMsg)
    }
  }, [verifyUserMsg])

  const validate = (values: any) => {
    let error = ""
    if (values.aadharNumber && values.aadharNumber.length < 12) {
      error = "*Please enter a valid aadhaar number."
    }
    setFormError(error)
    return error
  }

  const UserLoginAction = async () => {
    try {
      let data = {
        aadharNumber: LoginDetails.aadharNumber,
        registrationType: LoginDetails.registrationType,
      }
      await CallLogin2(data)
    } catch (error) {
      ShowMessagePopup(false, "Error:" + error)
    }
  }

  const CallLogin2 = async (value: any) => {
    let result: any = await CallingAxios(useUserLoginData(value))

    if (result && result.success == true) {
      let query = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        alternateEmail: result.data.alternateEmail,
        mobileNumber: result.data.mobileNumber,
        aadharNumber: result.data.aadharNumber,
        registrationType: result.data.registrationType,
        status: result.data.status,
        applicationId: result.data.applicationId,
        applicationNumber: result.data.applicationNumber,
        userType: result.data.userType,
        token: result.data.token,
      }
      localStorage.setItem("FASPLoginDetails", JSON.stringify(query))
      dispatch(saveLoginDetails(query))
      if (result.data.registrationType == "firm") {
        router.push("/firms/dashboard")
      }
      if (result.data.registrationType == "society") {
        router.push("/societies/dashboard")
      }
    } else {
      ShowMessagePopup(false, result.message)
    }
  }

  const callLoginAPI = (result: any) => {
    if (process.env.SECRET_KEY) {
      let ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(result),
        process.env.SECRET_KEY
      ).toString()
      let obj: any = {
        otp: ciphertext,
      }
      dispatch(userLogin({ ...obj }))
    }
  }

  const onLogin = async (e: any) => {
    e.preventDefault()
    {
      if (LoginDetails.aadharNumber) {
        setLoading(true)
        let result = {
          aadharNumber: btoa(LoginDetails.aadharNumber),
          transactionNumber: get(aadhaarOTPResponse, "transactionNumber", ""),
          otp: otp,
          refId: refId,
        }
        callLoginAPI(result)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (Object.keys(loginData).length && loginData.data && process.env.SECRET_KEY) {
    try {
      let bytes = CryptoJS.AES.decrypt(loginData.data, process.env.SECRET_KEY)
      const parsed = bytes.toString(CryptoJS.enc.Utf8)
      let data = JSON.parse(parsed)
      if (LoginDetails.aadharNumber.toString() == data.aadharNumber.toString()) {
        let query = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          alternateEmail: data.alternateEmail,
          mobileNumber: data.mobileNumber,
          aadharNumber: data.aadharNumber,
          registrationType: data.registrationType,
          status: data.status,
          applicationId: data.applicationId,
          applicationNumber: data.applicationNumber,
          userType: data.userType,
          token: data.token,
          lastLogin: data.lastLogin,
        }
        const userDetailsEnc = CryptoJS.AES.encrypt(
          JSON.stringify(query),
          process.env.SECRET_KEY
        ).toString()
        localStorage.setItem("FASPLoginDetails", userDetailsEnc)
        dispatch(saveLoginDetails(query))
        router.push("/firms/dashboard")
      } else {
        setOTP("")
          setSentOTP(true)
          setLoading(false)
          ShowMessagePopup(false, "Invalid Authentication", "")
      }
    }catch (err) {
        console.error("Failed to decrypt/parse loginData:", err)
        setOTP("")
        setSentOTP(true)
        setLoading(false)
        ShowMessagePopup(false, "Invalid OTP", "")
      }
    }
    else if (Object.keys(loginData).length && !Object.keys(loginData?.data)?.length) {
      setOTP("")
      setSentOTP(true)
      setLoading(false)
      ShowMessagePopup(false, "Error occurred while login")
    }
  }, [loginData])

  useEffect(() => {
    if (loginMsg) {
      ShowMessagePopup(false, loginMsg)
    }
  }, [loginMsg])

  useEffect(() => {
    return () => {
      dispatch(resetLoginDetails())
    }
  }, [])

  return (
    <>
      <Head>
        <title>Login - Firms</title>
        <link rel="icon" href="/firmsHome/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className="logiRegMainSec">
        <div className="societyRegSec">
          <Container>
             <div className="regMainFitSec">
                <div className="regContainerSec regContainerloginSec">
                  <div className="regSecCon regloginSecCon">
                <Row className="d-flex align-items-center">
                  <Col lg={12} md={12} xs={12}>
                    <div className={` ${styles.RegistrationInput} ${styles.LoginPageInput}`}>
                      {sentOTP ? (
                        <form
                          onSubmit={onLogin}
                          className={loading || loginLoading ? styles.disableForm : ""}
                        >
                          <div className="d-flex justify-content-between mb-3">
                            <div className="formSectionTitle">
                              <h3 className="p-0 d-flex align-items-center">
                                <button
                                  className={styles.rightButton}
                                  onClick={backToLogin}
                                  type="button"
                                >
                                  <img className="enterBackImg" src="/firmsHome/assets/back-icon.svg" />
                                </button>{" "}
                                <span className={styles.enterOTPText}>Enter OTP</span>
                              </h3>
                            </div>
                          </div>

                          <div className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Enter OTP"
                              required={true}
                              name="otp"
                              value={otp}
                              maxLength={6}
                              onChange={(e: any) => {
                                setOTP(e.target.value)
                              }}
                              onKeyPress={onNumberOnlyChange}
                            />
                          </div>
                          <Row className="p">
                            <Col lg={4} md={6} xs={6}>
                              <div className={styles.pdesingleColumn}>
                                <Button
                                  status={loading || loginLoading}
                                  type="submit"
                                  btnName="Login"
                                  disabled={verifyUserLoading || loading}
                                ></Button>
                              </div>
                            </Col>
                            <Col lg={8} md={6} xs={6} className={styles.flexColumn}>
                              <div className={styles.flexColumn}>
                                <span className={`${styles.checkText} ${styles.scheckText}`}>
                                  Did not receive OTP?
                                </span>
                                <button
                                  type="button"
                                  onClick={onSubmit}
                                  className={styles.rightButton}
                                  disabled={verifyUserLoading || loading}
                                >
                                  Resend OTP
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </form>
                      ) : (
                        <form
                          className={verifyUserLoading || loading ? styles.disableForm : ""}
                          onSubmit={onSubmit}
                        >
                          <div className="d-flex justify-content-between mb-3">
                            <div className="formSectionTitle">
                              <h3>User Login</h3>
                            </div>
                          </div>

                          <div className="mb-3">
                            <TableText label={"Aadhaar Number"} required={true} />
                            <Form.Control
                              type="text"
                              placeholder="Enter Aadhaar Number"
                              required={true}
                              name="maskedAadhar"
                              value={LoginDetails.maskedAadhar}
                              onChange={onChange}
                              maxLength={12}
                              autoComplete="off"
                              onKeyPress={onNumberOnlyChange}
                              onPaste={(e: any) => e.preventDefault()}
                            />
                            {FormError && <span className={styles.warningText}>{FormError}</span>}

                            <Form.Control
                              type="hidden"
                              placeholder="Registration Type"
                              name="registrationType"
                              value={LoginDetails.registrationType}
                            />
                          </div>

                          <Row className="p">
                            <Col lg={6} md={6} xs={6}>
                              <div className={styles.pdesingleColumn} style={{ cursor: "pointer" }}>
                                {!isFieldAdded && (
                                  <div className="btn btn-secondary disabled">Get OTP</div>
                                )}
                                {isFieldAdded && (
                                  <Button
                                    type="submit"
                                    status={verifyUserLoading || loading}
                                    btnName="Get OTP"
                                  ></Button>
                                )}
                              </div>
                            </Col>
                            <Col lg={6} md={6} xs={6} className={styles.flexColumn}>
                              <div className={styles.flexColumn}>
                                <span className={`${styles.checkText} ${styles.scheckText}`}>
                                  Don’t have an account?
                                </span>

                                <a href="/firmsHome/firmRegistration" className={styles.rightButton}>
                                  New Registration!
                                </a>
                              </div>
                            </Col>
                          </Row>
                        </form>
                      )}
                    </div>
                  </Col>
                </Row>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}
export default LoginPage
