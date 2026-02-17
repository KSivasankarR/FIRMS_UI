import { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useRouter } from "next/router"
import styles from "@/styles/pages/Forms.module.scss"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { PopupAction } from "@/redux/commonSlice"
import CryptoJS from "crypto-js"
import { KeepLoggedIn } from "@/GenericFunctions"

const ForgotPasswordPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [loginDetails, setLoginDetails] = useState<any>({
    userNameOrEmail: "",
  })
  const [FormErrors, setFormErrors] = useState<any>({})
  const [locData, setLocData] = useState<any>({})

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
  }

  const validate = () => {
    const errors: any = {}
    const logDetails: any = { ...loginDetails }
    logDetails.userNameOrEmail = logDetails.userNameOrEmail.trim()
    logDetails.password = logDetails.password.trim()
    if (!logDetails.userNameOrEmail || logDetails.userNameOrEmail.length < 4) {
      errors["userNameOrEmail"] = "*User Name should contain minimum 4 characters."
    }
    setFormErrors({ ...errors })
    return errors
  }

  const ShowMessagePopup = (type: boolean, message: string, redirectOnSuccess: string) => {
    dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess }))
  }

  const checkFields = () => {
    if (!loginDetails.userNameOrEmail) {
      ShowMessagePopup(false, "Please provide details for these fields (User Name)", "")
      return false
    }
    return true
  }

  return (
    <>
      <Head>
        <title>Forgot Password - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {locData?.userType != "user" && (
        <div className="logiRegMainSec">
          <div className="societyRegSec">
            <Container>
              <div className="regContainerSec">
                <div className="regFieldsMain loginFieldsSec">
                  <Form className="formsec" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="formSectionTitle">
                        <h3>Forgot Password</h3>
                      </div>
                    </div>

                    <div className="firmRegFieldsList regofAppBg">
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
                            />
                            <text className={styles.warningText} style={{ color: "red" }}>
                              {FormErrors.userNameOrEmail}
                            </text>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>

                    <div className="firmSubmitSec">
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <div className="d-flex justify-content-between text-center">
                            <button className="btn btn-primary getOTp">Send</button>
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
      {locData?.userType == "user" && (
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

export default ForgotPasswordPage
