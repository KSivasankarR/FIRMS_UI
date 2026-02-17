import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import api from "@/pages/api/api"
import { useRouter } from "next/router"
import styles from "@/styles/pages/Forms.module.scss"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { PopupAction } from "@/redux/commonSlice"
import { saveLoginDetails } from "@/redux/loginSlice"
import Button from "@/components/Button"
import CryptoJS from "crypto-js"
import { IADepartmentLoginCredentialsModel } from "@/models/appTypes"
import { store } from "@/redux/store"


const DepartmentLoginPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState<boolean>(false)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [loginDetails, setLoginDetails] = useState<IADepartmentLoginCredentialsModel>({
    userNameOrEmail: "",
    password: "",
  })
  const [FormErrors, setFormErrors] = useState<any>({})
  const [passwordToggleClass, setPasswordToggleClass] = useState<string>("")

  const loginDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setLoginDetails(newInput)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
  }

  const validate = () => {
    const errors: any = {}
    const logDetails: IADepartmentLoginCredentialsModel = { ...loginDetails }
    logDetails.userNameOrEmail = logDetails.userNameOrEmail.trim()
    logDetails.password = logDetails.password.trim()
    if (!logDetails.userNameOrEmail || logDetails.userNameOrEmail.length < 4) {
      errors["userNameOrEmail"] = "*User Name should contain minimum 4 characters."
    }
    if (!logDetails.password || logDetails.password.length < 8) {
      errors["password"] = "*Password should contain minimum 8 characters."
    }
    setFormErrors({ ...errors })
    return errors
  }

  //commented by bhuvan for change password issue
  // const ShowMessagePopup = (type: any, message: any, redirectOnSuccess: any) => {
  //   dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess }))
  // }

  const ShowAlert = (type: boolean, message: string, redirectOnSuccess: string) => {
    dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess }))
  }

  const checkFields = () => {
    if (!loginDetails.userNameOrEmail && !loginDetails.password) {
      ShowAlert(false, "Please provide details for these fields (User Name, Password)", "")
      return false
    }
    return true
  }

  const departmentLogin = () => {
    if (checkFields() && !Object.keys(validate()).length) {
      setLoading(true)
      api
        .post("/departmentLogin", loginDetails)
        .then((response: any) => {
          if (response.data.success == false) {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "Unauthorized",
              showConfirmButton: false,
              timer: 1500,
            })
          } else if (response.data.success == true && process.env.SECRET_KEY) {
            let query = {
              userName: response.data.data.userName,
              fullName: response.data.data.fullName,
              mobileNumber: response.data.data.mobileNumber,
              role: response.data.data.role,
              email: response.data.data.email,
              district: response.data.data.district,
              userType: response.data.data.userType,
              token: response.data.data.token,
              deptUserId: response.data.data.deptUserId,
              lastLogin: response.data.data.lastLogin,
              isPasswordChanged: response.data.data.isPasswordChanged,
            }
            const userDetailsEnc = CryptoJS.AES.encrypt(
              JSON.stringify(query),
              process.env.SECRET_KEY
            ).toString()
            localStorage.setItem("FASPLoginDetails", userDetailsEnc)
            dispatch(saveLoginDetails(userDetailsEnc)) //changed from query to userDetailsEnc
            if (query.isPasswordChanged === false) {
              router.push("/changePassword")
            } else {
              ShowAlert(true, "Login Successfully", "")
              router.push("/reports")
            }
            if (response.data.data.role == "DLS") {
              router.push("/societies")
            } else if (response.data.data.role == "DLF") {
              router.push("/reports")
            } else if (response.data.data.role == "DR") {
              //router.push("drDashboard")
              router.push("/reports")
            }
          }
          setLoading(false)
        })
        .catch((error: any) => {
          console.log("error-", error)
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.response?.data?.message,
            showConfirmButton: false,
            timer: 1500,
          })
          setLoading(false)
        })
    }
  }

  //commented by bhuvan for change password issue
  // useEffect(() => {
  //   let data: any = localStorage.getItem("FASPLoginDetails")
  //   if (data && data != "" && process.env.SECRET_KEY) {
  //     let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
  //     data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  //   }
  //   if (data && data.userType == "dept") {
  //     router.push("/reports")
  //   }
  // }, [])

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  useEffect(() => {
    
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
    localStorage.clear();
}, [])

  useEffect(() => {
    if (passwordShown == true) {
      setPasswordToggleClass("visible")
    }
    if (passwordShown == false) {
      setPasswordToggleClass("notVisible")
    }
  }, [passwordShown])

  return (
    <>
      <Head>
        <title>Department Login - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className="logiRegMainSec">
        <div className="societyRegSec">
          <Container>
             <div className="regMainFitSec">
            <div className="regContainerSec regContainerloginSec">
              <div className="regFieldsMain loginFieldsSec departmentSec regSecCon regloginSecCon">
                <Form
                  className={`formsec ${styles.RegistrationInput} ${
                    loading ? styles.disableForm : ""
                  }`}
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="d-flex justify-content-between mb-3">
                    <div className="formSectionTitle">
                      <h3>Department Login</h3>
                    </div>
                  </div>

                  <div className="firmRegFieldsList">
                    <Row>
                      <Col lg={12} md={12} xs={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>User Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter User Name"
                            name="userNameOrEmail"
                            required
                            onChange={loginDetailsChange}
                            value={loginDetails.userNameOrEmail}
                            autoComplete="off"
                          />
                          <text className={styles.warningText} style={{ color: "red" }}>
                            {FormErrors.userNameOrEmail}
                          </text>
                        </Form.Group>
                      </Col>

                      <Col lg={12} md={12} xs={12} className="mb-3">
                        <Form.Group className="departmentPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            placeholder="Enter Password"
                            name="password"
                            required
                            onChange={loginDetailsChange}
                            value={loginDetails.password}
                            autoComplete="off"
                          />
                          <div
                            className={`passwordToggle ${passwordToggleClass}`}
                            onClick={togglePassword}
                          >
                            {passwordShown == true && <span>Hide</span>}
                            {passwordShown == false && <span>Show</span>}
                          </div>
                          <text className={styles.warningText} style={{ color: "red" }}>
                            {FormErrors.password}
                          </text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div className="firmSubmitSec">
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-between align-items-center text-center">
                          <Button
                            type="button"
                            onClick={departmentLogin}
                            status={loading}
                            btnName="Login"
                          ></Button>
                          {/* <div className="forgot-info">
                            <a href="/forgotPassword">Forgot Password</a>
                          </div> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default DepartmentLoginPage
