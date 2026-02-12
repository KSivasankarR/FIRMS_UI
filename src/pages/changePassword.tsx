import { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useRouter } from "next/router"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import { changePassword } from "@/axios"
import CryptoJS from "crypto-js"
import { IAChangePasswordDetailsModel } from "@/models/appTypes"

const ChangePasswordPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [loginDetails, setLoginDetails] = useState<IAChangePasswordDetailsModel>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [FormErrors, setFormErrors] = useState<any>({})
  const [locData, setLocData] = useState<any>({})

  const popupState = () => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (!data || data == null || data == "") {
      router.push("/")
    }
  }

  useEffect(() => {
    window.addEventListener("popstate", () => {
      popupState()
    })
    return () => {
      window.removeEventListener("popstate", () => {
        popupState()
      })
    }
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
    }
  }, [])

  const loginDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setLoginDetails(newInput)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const regex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&?@ "<<])[a-zA-Z0-9!#$%&?@<<]{8,20}$/
    if (loginDetails.currentPassword == "" || loginDetails.currentPassword.trim() == "") {
      ShowMessagePopup(false, "Please enter current password", "")
    } else if (loginDetails.newPassword == "" || loginDetails.newPassword.trim() == "") {
      ShowMessagePopup(false, "Please enter new password", "")
    } else if (loginDetails.confirmPassword == "" || loginDetails.confirmPassword.trim() == "") {
      ShowMessagePopup(false, "Please enter confirm password", "")
    } else if (loginDetails.newPassword != "" && !regex.test(loginDetails.newPassword.trim())) {
      ShowMessagePopup(
        false,
        "Please enter minimum 8  and maximum 20 characters for new password. Please include one capital letter, one lowercase letter, one digit and one special character",
        ""
      )
    } else if (
      loginDetails.currentPassword.trim() != "" &&
      loginDetails.newPassword.trim() != "" &&
      loginDetails.currentPassword == loginDetails.newPassword
    ) {
      ShowMessagePopup(
        false,
        "Old and new password are same. Please enter new password correctly",
        ""
      )
    } else if (
      loginDetails.confirmPassword.trim() != "" &&
      loginDetails.newPassword.trim() != "" &&
      loginDetails.confirmPassword != loginDetails.newPassword
    ) {
      ShowMessagePopup(
        false,
        "New and confirm password are not same. Please enter confirm password correctly",
        ""
      )
    } else {
      const request = {
        oldPassword: loginDetails.currentPassword,
        password: loginDetails.newPassword,
      }
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "" && process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      }
      if (data && data.token && process.env.SECRET_KEY) {
        changePassword(
          {
            password: CryptoJS.AES.encrypt(
              JSON.stringify(request),
              process.env.SECRET_KEY
            ).toString(),
          },
          data.token
        )
          .then((res) => {
            if (res.success) {
              ShowMessagePopup(true, "Password changed successfully", "")
              router.push("/departmentLogin")
            } else {
              ShowMessagePopup(false, res.message, "")
            }
          })
          .catch(() => {
            console.log("error")
          })
      }
    }
  }

  return (
    <>
      <Head>
        <title>Change Password - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {locData && locData?.userType && locData?.userType != "user" && (
        <div className="logiRegMainSec profilePage">
          <div className="societyRegSec">
            <Container>
              <div className="regContainerSec">
                <div className="regFieldsMain loginFieldsSec">
                  <Form className="formsec" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="formSectionTitle">
                        <h3>Change Password</h3>
                      </div>
                    </div>

                    <div className="firmRegFieldsList regofAppBg">
                      <Row>
                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Enter Current Password"
                              name="currentPassword"
                              required
                              onChange={loginDetailsChange}
                              value={loginDetails.currentPassword}
                              minLength={8}
                              maxLength={50}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Enter New Password"
                              name="newPassword"
                              required
                              onChange={loginDetailsChange}
                              value={loginDetails.newPassword}
                              minLength={8}
                              maxLength={50}
                            />
                          </Form.Group>
                        </Col>

                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Enter Confirm Password"
                              name="confirmPassword"
                              required
                              onChange={loginDetailsChange}
                              value={loginDetails.confirmPassword}
                              minLength={8}
                              maxLength={50}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="firmSubmitSec">
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <div className="d-flex justify-content-between text-center">
                            <button className="btn btn-primary">Submit</button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}
      {(!locData?.userType || locData?.userType == "user") && (
        <div className="societyRegSec">
          <Container>
            <Row>
              <Col lg={12} md={12} xs={12}>
                <div className="d-flex justify-content-between page-title mb-2">
                  <div className="pageTitleLeft">
                    <h1>Unauthorized page</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  )
}

export default ChangePasswordPage
