import React, { useState, useEffect } from "react"
import { Col, Container, Row, Form } from "react-bootstrap"
import { get } from "lodash"
import styles from "@/styles/pages/Forms.module.scss"
import { useRouter } from "next/router"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import instance from "@/redux/api"
import { resetLoginDetails, signUp, verifyUserReg } from "@/redux/loginSlice"
import { UseGetAadharDetails, UseGetAadharOTP } from "@/axios"
import { NameValidation, FirmNameValidation } from "@/utils"
import Button from "@/components/Button"
import Head from "next/head"
import { ShowMessagePopup } from "@/GenericFunctions"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import CryptoJS, { AES } from "crypto-js"
import { IALoginDetailsModel } from "@/models/appTypes"
import AadharEKYCDialog from "@/components/AadharEKYCDialog"

const initialLoginDetails: IALoginDetailsModel = {
  registrationType: "firm",
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  aadharNumber: "",
  firmName: "",
  alternateEmail: "",
  district: "",
  maskedAadhar: "",
}

const FirmRegistration = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [LoginDetails, setLoginDetails] = useState<IALoginDetailsModel>(initialLoginDetails)
  const [FormErrors, setFormErrors] = useState<any>({})
  const [sentOTP, setSentOTP] = useState<boolean>(false)
  const [otp, setOTP] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [districts, setDistricts] = useState<any>([])
  const [isCheckFirm, setIsCheckFirm] = useState<boolean>(false)
  const [isCheckFirmBtn, setIsCheckFirmBtn] = useState<boolean>(true)
  const [isCheckNation, setIsCheckNation] = useState<boolean>(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(false)

  const verifyUserRegData = useAppSelector((state) => state.login.verifyUserRegData)
  const verifyUserRegLoading = useAppSelector((state) => state.login.verifyUserRegLoading)
  const verifyUserRegMsg = useAppSelector((state) => state.login.verifyUserRegMsg)

  const signUpData = useAppSelector((state) => state.login.signUpData)
  const signUpLoading = useAppSelector((state) => state.login.signUpLoading)
  const signUpMsg = useAppSelector((state) => state.login.signUpMsg)
  const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState<any>({})
  const [checkFirmSec, setCheckFirmSec] = useState<string>("enableFields")
  const [showEkycDialog, setShowEkycDialog] = useState<boolean>(false)

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  const onNumberOnlyChange = (event: any) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const isValid = new RegExp("[0-9]").test(keyValue)
    if (!isValid) {
      event.preventDefault()
      return
    }
  }

  React.useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")

    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data) {
      if (data.userType == "user") {
        router.push("/firms/dashboard")
      } else {
        router.push("/firms")
      }
    }
    instance.get("/getDistricts").then((response) => {
      setDistricts(response.data)
    })
  }, [])

  const onChange = (e: any) => {
    let addName = e.target.name
    let addValue = e.target.value
    if (addName == "firstName") {
      addValue = NameValidation(addValue)
    } else if (addName == "lastName") {
      addValue = NameValidation(addValue)
    } else if (addName == "firmName") {
      addValue = FirmNameValidation(addValue)
    }
    if (addName == "maskedAadhar") {
      let newNo = ""
      let newVal = ""
      let aadharNo = ""
      if (
        e.target.value &&
        e.target.value.length > 0 &&
        e.target.value.length > LoginDetails.aadharNumber.length
      ) {
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
    } else {
      setLoginDetails({ ...LoginDetails, [addName]: addValue })
    }
    if (
      LoginDetails.firstName != "" &&
      LoginDetails.firmName != "" &&
      LoginDetails.aadharNumber != "" &&
      LoginDetails.mobileNumber != ""
    ) {
      setIsBtnDisabled(true)
    } else {
      setIsBtnDisabled(false)
    }
  }

  const validate = () => {
    const errors: any = {}
    const logDetails: any = { ...LoginDetails }
    if (
      !logDetails.firstName ||
      logDetails.firstName.length < 2 ||
      logDetails.firstName.length > 30
    ) {
      errors["firstName"] = "*First Name should contain 2 - 30 characters."
    }
    if (!logDetails.lastName || logDetails.lastName.length < 2 || logDetails.lastName.length > 30) {
      errors["lastName"] = "*Last Name should contain 2 - 30 characters."
    }
    if (
      !logDetails.firmName ||
      logDetails.firmName.length < 4 ||
      logDetails.firmName.length > 200
    ) {
      errors["firmName"] = "*Firm Name should contain 4 - 200 characters."
    }
    const re = /^[6-9]{1}[0-9]{9}$/;
    if (!re.test(LoginDetails.mobileNumber)) {
      errors["mobileNumber"] = "*Please enter a valid mobile number"
    }

    if (LoginDetails.aadharNumber && LoginDetails.aadharNumber.length < 12) {
      errors["aadharNumber"] = "*Please enter a valid 12 digit aadhaar number"
    }
    if (
      LoginDetails.email &&
      LoginDetails.email.length > 0 &&
      LoginDetails.alternateEmail &&
      LoginDetails.alternateEmail.length > 0 &&
      LoginDetails.email.toLowerCase() == logDetails.alternateEmail.toLowerCase()
    ) {
      errors["alternateEmail"] = "*Please enter a valid alternate email"
    }
    setFormErrors({ ...errors })
    return errors
  }

  const checkFields = () => {
    if (!LoginDetails.email && !LoginDetails.mobileNumber && !LoginDetails.aadharNumber) {
      ShowMessagePopup(
        false,
        "Please provide details for atleast on these fields (Mobile No, Aadhaar No)",
        ""
      )
      return false
    }
    return true
  }

  const checkFirmDB = (e: any) => {
    e.preventDefault()
    const errors: any = {}
    const logDetails: IALoginDetailsModel = { ...LoginDetails }
    setLoading(true)
    let ob: any = {
      firmName: LoginDetails.firmName.trim(),
      district: LoginDetails.district,
    }
    if (
      !logDetails.firmName ||
      logDetails.firmName.trim().length < 4 ||
      logDetails.firmName.trim().length > 200
    ) {
      errors["firmName"] = "*Firm Name should contain 4 - 200 characters."
    } else if (
      !logDetails.district ||
      logDetails.district == "select" ||
      logDetails.district == "--Select--"
    ) {
      errors["district"] = "*Please select district."
    } else {
      let obj: any = {
        registrationName: LoginDetails.firmName.trim(),
      }
      instance
        .post("checkAvailability", obj)
        .then((response: any) => {
          if (response.data.success == false) {
            ShowMessagePopup(false, response.data.message, "")
            setIsCheckNation(false)
          }
          if (response.data.success == true) {
            instance
              .post("firm/check", ob)
              .then((response: any) => {
                if (
                  response.data.message == "Firm already exists!" &&
                  response.data.success == false
                ) {
                  ShowMessagePopup(false, "Firm name already exists!", "")
                }
                if (
                  response.data.message == "The Name is available to register" &&
                  response.data.success == true
                ) {
                  ShowMessagePopup(true, "The Name is available to register", "")
                  setIsCheckFirm(true)
                  setIsCheckFirmBtn(false)
                } else {
                  setIsCheckFirm(false)
                  setIsCheckFirmBtn(true)
                }
              })
              .catch((error) => {
                if (error.message == "Request failed with status code 400") {
                  ShowMessagePopup(false, "Firm Name & District is Mandatory", "")
                }
              })
          } else {
            setIsCheckNation(false)
          }
          setLoading(false)
        })
        .catch((error) => {
          if (error.message == "Request failed with status code 400") {
            ShowMessagePopup(false, "Firm Name & District is Mandatory", "")
          }
        })
    }
    setFormErrors({ ...errors })
  }

  const backStepHandle = (e: any) => {
    setIsCheckFirm(false)
    setIsCheckFirmBtn(true)
  }

  useEffect(() => {
    if (isCheckFirmBtn == false) {
      setCheckFirmSec("disableFields")
    } else {
      setCheckFirmSec("enableFields")
    }
  }, [isCheckFirmBtn])

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (checkFields() && !Object.keys(validate()).length) {
      let ob: any = {
        firstName: LoginDetails.firstName?.toUpperCase(),
        lastName: LoginDetails.lastName?.toUpperCase(),
        firmName: LoginDetails.firmName,
        alternateEmail: LoginDetails.alternateEmail,
        registrationType: LoginDetails.registrationType,
        district: LoginDetails.district,
      }
      if (LoginDetails.email) {
        ob["email"] = LoginDetails.email
      }
      if (LoginDetails.mobileNumber) {
        ob["mobileNumber"] = LoginDetails.mobileNumber
      }
      if (LoginDetails.aadharNumber) {
        ob["aadharNumber"] = LoginDetails.aadharNumber
      }
      const response = await dispatch(verifyUserReg({ ...ob }))
      console.log("Response:", response.payload.success)
      setShowEkycDialog(!response.payload.success)
    }
  }

  useEffect(() => {
    if (Object.keys(verifyUserRegData).length && verifyUserRegData.success == true) {
      ;(async () => {
        if (LoginDetails.mobileNumber && LoginDetails.aadharNumber && process.env.IGRS_SECRET_KEY) {
          setLoading(true)
          const ciphertext = AES.encrypt(LoginDetails.aadharNumber, process.env.IGRS_SECRET_KEY)
          let result = await UseGetAadharOTP(ciphertext.toString())
          if (result && result.status === "Success") {
            ShowMessagePopup(true, "OTP Sent to Mobile Number Linked with Aadhaar", "")
            setSentOTP(true)
            setAadhaarOTPResponse(result)
          } else {
            ShowMessagePopup(false, get(result, "message", "Aadhaar API Failed"), "")
            setAadhaarOTPResponse({})
          }
          setLoading(false)
        }
      })()
    } else if (verifyUserRegData.success == false) {
      ShowMessagePopup(false, verifyUserRegData.message, "")
    }
  }, [verifyUserRegData])

  useEffect(() => {
    if (verifyUserRegMsg) {
      ShowMessagePopup(false, verifyUserRegMsg, "")
    }
  }, [verifyUserRegMsg])

  useEffect(() => {
    return () => {
      dispatch(resetLoginDetails())
    }
  }, [])

  const onRegister = async (e: any) => {
    e.preventDefault()
    if (LoginDetails.mobileNumber && LoginDetails.aadharNumber) {
      setLoading(true)
      let result: any = await UseGetAadharDetails({
        aadharNumber: btoa(LoginDetails.aadharNumber),
        transactionNumber: get(aadhaarOTPResponse, "transactionNumber", ""),
        otp: otp,
      })
      if (
        result.status &&
        result.status === "Success" &&
        aadhaarOTPResponse?.transactionNumber == result.transactionNumber.split(":")[1]
      ) {
        callSignUp(true)
      } else {
        ShowMessagePopup(false, result.message, "")
      }
      setLoading(false)
    }
  }

  const callSignUp = (flag: any) => {
    let ob: any = {
      firstName: LoginDetails.firstName,
      lastName: LoginDetails.lastName,
      firmName: LoginDetails.firmName.trim(),
      alternateEmail: LoginDetails.alternateEmail,
      registrationType: LoginDetails.registrationType,
      district: LoginDetails.district,
    }
    if (LoginDetails.email) {
      ob["email"] = LoginDetails.email
    }
    if (LoginDetails.mobileNumber) {
      ob["mobileNumber"] = LoginDetails.mobileNumber
    }
    if (LoginDetails.aadharNumber) {
      ob["aadharNumber"] = btoa(LoginDetails.aadharNumber)
    }
    dispatch(
      signUp({
        ...ob,
        loginOtp: flag ? parseInt(otp) : "",
      })
    )
  }

  useEffect(() => {
    if (Object.keys(signUpData).length && signUpData.success) {
      ShowMessagePopup(true, "Account Register Successfully!", "/login")
    }
  }, [signUpData])

  useEffect(() => {
    if (signUpMsg) {
      ShowMessagePopup(false, signUpMsg, "")
    }
  }, [signUpMsg])

  return (
    <div className="regMainWarp">
      <Head>
        <title>Firm Registration - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      <div className={styles.RegistrationMain}>
        <div className="logiRegMainSec">
          <div className="societyRegSec">
            <Container>
              <div className="regMainFitSec">
               <div className="regContainerSec regContainerloginSec">
                <div className="formsec regSecCon regloginSecCon">
                  {sentOTP ? (
                    <form
                      className={`${styles.RegistrationInput} ${
                        loading || signUpLoading ? styles.disableForm : ""
                      }`}
                      onSubmit={onRegister}
                    >
                      <div className="enterOTPForm">
                        <div className="formSectionTitle mb-3">
                          <h3 className="p-0 d-flex align-items-center">
                            <button
                              className={styles.rightButton}
                              onClick={() => setSentOTP(false)}
                              type="button"
                            >
                              <img className="enterBackImg" src="/firmsHome/assets/back-icon.svg" />
                            </button>{" "}
                            <span className={styles.enterOTPText}>Enter OTP</span>
                          </h3>
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
                          <Col lg={5} md={6} xs={6}>
                            <div className={styles.pdesingleColumn}>
                              <Button
                                type="submit"
                                btnName="Register"
                                status={loading || signUpLoading}
                                disabled={verifyUserRegLoading || loading}
                              ></Button>
                            </div>
                          </Col>
                          <Col lg={7} md={6} xs={6} className={styles.flexColumn}>
                            <div className={styles.flexColumn}>
                              <span className={`${styles.checkText} ${styles.scheckText}`}>
                                Did not receive OTP?
                              </span>
                              <button
                                type="button"
                                className={styles.rightButton}
                                onClick={onSubmit}
                              >
                                Resend OTP
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </form>
                  ) : (
                    <form
                      onSubmit={onSubmit}
                      autoComplete="off"
                      className={`formsec ${styles.RegistrationInput} ${
                        loading || verifyUserRegLoading ? styles.disableForm : ""
                      }`}
                    >
                      <div className="regNewStarSec">
                        <div className="d-flex justify-content-between mb-3">
                          <div className="formSectionTitle">
                            <h3>New Registration!</h3>
                          </div>
                        </div>

                        <div className="firmRegList formsec">
                          <div className="defaultDisable">
                            <Form.Check
                              inline
                              label="Registration of Firm"
                              name="registrationType"
                              type="radio"
                              id="firm"
                              value="firm"
                              checked={LoginDetails.registrationType == "firm"}
                              onChange={onChange}
                            />
                          </div>
                        </div>

                        <div className="firmRegFieldsList">
                          <div className="note requiredData mb-3">
                            <p>All fields are mandatory</p>
                          </div>
                          <div className="TopFieldsSec">
                            <Row>
                              <Col lg={6} md={6} xs={12} className="mb-3">
                                <div className="d-flex justify-content-between">
                                  <TableText label={"Firm Name"} required={true} />
                                  {isCheckFirm && (
                                    <div className="firmAvailablebtns">
                                      {LoginDetails.firmName &&
                                        LoginDetails.firmName.trim().length > 0 &&
                                        LoginDetails.district &&
                                        LoginDetails.district !== "select" &&
                                        LoginDetails.district !== "--Select--" && (
                                          <div onClick={backStepHandle} className="availability">
                                            Change Name
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                                {!isCheckFirm && (
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Firm Name"
                                    required={true}
                                    name="firmName"
                                    value={LoginDetails.firmName}
                                    onChange={onChange}
                                    minLength={4}
                                    maxLength={200}
                                  />
                                )}

                                {isCheckFirm && (
                                  <TableInputText
                                    type="text"
                                    placeholder="Enter Firm Name"
                                    required={true}
                                    name="firmName"
                                    value={LoginDetails.firmName}
                                    onChange={() => {}}
                                    disabled={true}
                                  />
                                )}

                                <text className={styles.warningText} style={{ color: "red" }}>
                                  {FormErrors.firmName}
                                </text>
                              </Col>

                              <Col lg={6} md={6} xs={12} className="mb-3">
                                <TableText label={"District"} required={true} />

                                {!isCheckFirm && (
                                  <select
                                    className="form-control"
                                    name="district"
                                    required
                                    value={LoginDetails.district}
                                    onChange={onChange}
                                  >
                                    <option value="select">Select</option>
                                    {districts &&
                                      districts.map((item: any, i: number) => {
                                        return (
                                          <option key={i} value={item.name}>
                                            {item.name}
                                          </option>
                                        )
                                      })}
                                  </select>
                                )}
                                <text className={styles.warningText} style={{ color: "red" }}>
                                  {FormErrors.district}
                                </text>
                                {isCheckFirm && (
                                  <select
                                    className="form-control"
                                    name="district"
                                    required
                                    value={LoginDetails.district}
                                    onChange={() => {}}
                                    disabled
                                  >
                                    <option value="select">Select</option>
                                    {districts &&
                                      districts.map((item: any, i: number) => {
                                        return (
                                          <option key={i} value={item.name}>
                                            {item.name}
                                          </option>
                                        )
                                      })}
                                  </select>
                                )}
                              </Col>

                              {!isCheckFirm && (
                                <div className="firmAvailablebtns">
                                  {((LoginDetails.firmName && LoginDetails.firmName.trim() == "") ||
                                    LoginDetails.firmName.trim().length < 4 ||
                                    !LoginDetails.district ||
                                    LoginDetails.district == "select" ||
                                    LoginDetails.district == "--Select--") && (
                                    <Col lg={12} md={12} xs={12} className="disable">
                                      <div className="btn btn-secondary checkFirm disabled">
                                        Check Availability
                                      </div>
                                    </Col>
                                  )}

                                  {LoginDetails.firmName &&
                                    LoginDetails.firmName.trim().length > 3 &&
                                    LoginDetails.district &&
                                    LoginDetails.district !== "select" &&
                                    LoginDetails.district !== "--Select--" && (
                                      <Col lg={12} md={12} xs={12} className="firmAvail">
                                        <Button
                                          type="button"
                                          onClick={checkFirmDB}
                                          status={verifyUserRegLoading || loading}
                                          btnName="Check Availability"
                                        ></Button>
                                      </Col>
                                    )}
                                </div>
                              )}
                            </Row>
                          </div>

                          {isCheckFirm && (
                            <div className="availableForm">
                              <Row>
                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText label={"First Name"} required={true} />
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter First Name"
                                    required={true}
                                    style={{ textTransform: "uppercase" }}
                                    name="firstName"
                                    value={LoginDetails.firstName}
                                    onChange={onChange}
                                    minLength={2}
                                    maxLength={30}
                                  />
                                  <text className={styles.warningText} style={{ color: "red" }}>
                                    {FormErrors.firstName}
                                  </text>
                                </Col>

                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText label={"Last Name"} required={true} />
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Last Name"
                                    required={true}
                                    style={{ textTransform: "uppercase" }}
                                    name="lastName"
                                    value={LoginDetails.lastName}
                                    onChange={onChange}
                                    minLength={2}
                                    maxLength={30}
                                  />
                                  <text className={styles.warningText} style={{ color: "red" }}>
                                    {FormErrors.lastName}
                                  </text>
                                </Col>

                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText
                                    label={"Email ID (Official Address)"}
                                    required={true}
                                  />
                                  <Form.Control
                                    type="email"
                                    placeholder="Enter Email ID"
                                    required={true}
                                    name="email"
                                    value={LoginDetails.email}
                                    onChange={onChange}
                                    minLength={10}
                                    maxLength={40}
                                  />
                                </Col>

                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText label={"Alternate Email Address"} required={true} />
                                  <Form.Control
                                    type="email"
                                    placeholder="Enter Alternate Email Address"
                                    required={true}
                                    name="alternateEmail"
                                    value={LoginDetails.alternateEmail}
                                    onChange={onChange}
                                    minLength={10}
                                    maxLength={40}
                                  />
                                  <text className={styles.warningText} style={{ color: "red" }}>
                                    {FormErrors.alternateEmail}
                                  </text>
                                </Col>

                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText label={"Mobile Number"} required={true} />
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    required={true}
                                    name="mobileNumber"
                                    value={LoginDetails.mobileNumber}
                                    onChange={onChange}
                                    onKeyPress={onNumberOnlyChange}
                                    maxLength={10}
                                  />
                                  <text className={styles.warningText} style={{ color: "red" }}>
                                    {FormErrors.mobileNumber}
                                  </text>
                                </Col>

                                <Col lg={6} md={6} xs={12} className="mb-3">
                                  <TableText label={"Aadhaar Number"} required={true} />
                                  <Form.Control
                                    type="text"
                                    placeholder="Enter Aadhaar Number"
                                    required={true}
                                    name="maskedAadhar"
                                    value={LoginDetails.maskedAadhar}
                                    onChange={onChange}
                                    onKeyPress={onNumberOnlyChange}
                                    maxLength={12}
                                    onPaste={(e: any) => e.preventDefault()}
                                    autoComplete="off"
                                  />
                                  <text className={styles.warningText} style={{ color: "red" }}>
                                    {FormErrors.aadharNumber}
                                  </text>
                                </Col>
                              </Row>

                              <div className="d-flex justify-content-between text-center">
                                <div className={styles.pdesingleColumn}>
                                  {!isBtnDisabled && (
                                    <Button
                                      type="submit"
                                      btnName="Send OTP"
                                      disabled={true}
                                      status={loading || verifyUserRegLoading}
                                    ></Button>
                                  )}

                                  {isBtnDisabled && (
                                    <Button
                                      type="submit"
                                      btnName="Send OTP"
                                      status={loading || verifyUserRegLoading}
                                    ></Button>
                                  )}
                                </div>

                                <div className={styles.flexColumn}>
                                  <span className={`${styles.checkText} ${styles.scheckText}`}>
                                    Already have an account?
                                  </span>
                                  <button
                                    className={styles.rightButton}
                                    onClick={() => {
                                      redirectToPage("/login")
                                    }}
                                    type="button"
                                  >
                                    Login
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              </div>
              {showEkycDialog && (
                <AadharEKYCDialog
                  LoginDetails={LoginDetails}
                  setShowEkycDialog={setShowEkycDialog}
                />
              )}
            </Container>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirmRegistration
