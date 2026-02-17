import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useRouter } from "next/router"
import styles from "@/styles/pages/Forms.module.scss"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import TableInputText from "@/components/common/TableInputText"
import { profileUpdate } from "@/axios"
import CryptoJS from "crypto-js"
import { IALoginCredentialsModel } from "@/models/appTypes"

const ProfilePage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loginDetails, setLoginDetails] = useState<IALoginCredentialsModel>({
    fullName: "",
    mobileNumber: "",
    signature: "",
  })
  const [FormErrors, setFormErrors] = useState<any>({})
  const [file, setFile] = useState<any>()
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
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
      setLoginDetails({ ...loginDetails, fullName: data.fullName, mobileNumber: data.mobileNumber })
    }
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  const loginDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setLoginDetails(newInput)
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return
    }
    if (e.target.files && e.target.files.length) {
      if (e.target.files[0].size > 1024000) {
        ShowMessagePopup(false, "File size 1MB size. please upload small size file.", "")
        e.target.value = ""
      } else if (
        e.target.files[0].type != "image/jpeg" &&
        e.target.files[0].type != "image/jpg" &&
        e.target.files[0].type != "image/png"
      ) {
        ShowMessagePopup(false, "Please upload jpg/jpeg/png type signature", "")
        e.target.value = ""
      }
      const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.files[0] })
      setFile(newInput)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (loginDetails.fullName == "" || loginDetails.fullName.trim() == "") {
      ShowMessagePopup(false, "Please enter full name", "")
    } else if (loginDetails.mobileNumber == "") {
      ShowMessagePopup(false, "Please enter mobile number", "")
    } else {
      const newData = new FormData()
      newData.append("fullName", loginDetails?.fullName)
      newData.append("mobileNumber", loginDetails?.mobileNumber)
      newData.append("selfSignedSignature", file?.signature)
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "" && process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      }
      if (data && data.token) {
        profileUpdate(newData, data.token)
          .then((res) => {
            if (res.success) {
              ShowMessagePopup(true, "Profile updated successfully", "")
              router.push("firms")
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
        <title>Profile - Firms & Societies</title>
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
                        <h3>Profile</h3>
                      </div>
                    </div>

                    <div className="firmRegFieldsList regofAppBg">
                      <Row>
                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <TableInputText
                              type="text"
                              placeholder="Enter Full Name"
                              name="fullName"
                              required
                              value={loginDetails.fullName}
                              onChange={loginDetailsChange}
                              maxLength={50}
                            />
                            <text className={styles.warningText} style={{ color: "red" }}>
                              {FormErrors.fullName}
                            </text>
                          </Form.Group>
                        </Col>

                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Mobile Number</Form.Label>
                            <TableInputText
                              type="text"
                              placeholder="Enter Mobile Name"
                              name="mobileNumber"
                              required
                              onChange={loginDetailsChange}
                              value={loginDetails.mobileNumber}
                              maxLength={10}
                            />
                            <text className={styles.warningText} style={{ color: "red" }}>
                              {FormErrors.mobileNumber}
                            </text>
                          </Form.Group>
                        </Col>

                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Signature</Form.Label>
                            <Form.Control
                              type="file"
                              name="signature"
                              ref={inputRef}
                              onChange={handleFileChange}
                              accept="application/jpg"
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

export default ProfilePage
