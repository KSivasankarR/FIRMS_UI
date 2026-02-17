import { UpdateFirmStatus } from "@/axios"
import api from "@/pages/api/api"
import CryptoJS from "crypto-js"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { Button, Col, Container, Row, Table } from "react-bootstrap"
import Pdf from "react-to-pdf"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"

const PaymentSuccess = () => {
  const router = useRouter()

  let ref = useRef<HTMLDivElement | null>(null)
  let btnref = useRef<HTMLButtonElement | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isFailure, setIsFailure] = useState<boolean>(false)
  const [paymentDetails, setPaymentDetails] = useState<any>({})
  const [paymentDone, setPaymentDone] = useState<boolean>(false)
  const [locData, setLocData] = useState<any>({})

  const RedirectToSearch = () => {
    router.push("/firms")
  }

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    let PaymentDone: any = localStorage.getItem("PaymentDone")
    if (PaymentDone == "true") {
      setPaymentDone(true)
    } else {
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "" && process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      }
      if (data && data.token) {
        setLocData(data)

        api
          .get("/getPaymentDetails/" + data.applicationNumber, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((response: any) => {
            if (!response || !response.data || !response.data.success) {
              // let data={
              //     applicationNumber:'765432345678',
              //     departmentTransID:'sdghyt8765434567',
              //     totalAmount:200,
              //     paymentMode:'Online'
              // }
              // setPaymentDetails(data)
              setIsFailure(true)
            } else {
              if (
                response.data.data.paymentDetails.transactionStatus == "Success" &&
                !response.data.data.paymentDetails.isUtilized
              ) {
                let data: any = localStorage.getItem("FASPLoginDetails")
                if (data && data != "" && process.env.SECRET_KEY) {
                  let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
                  data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                }

                let AmendmentData: any = localStorage.getItem("AmendmentData")
                if (AmendmentData) {
                  AmendmentData = JSON.parse(AmendmentData)
                  const formData = new FormData()
                  Object.keys(AmendmentData).forEach((key) => {
                    if (
                      key == "selfSignedDeclaration" ||
                      key == "affidavit" ||
                      key == "partnershipDeed" ||
                      key == "leaseAgreement"
                    ) {
                      let pos = AmendmentData[key].indexOf(";base64,")
                      let type = AmendmentData[key].substring(5, pos)
                      let b64 = AmendmentData[key].substr(pos + 8)

                      // decode base64
                      let imageContent = atob(b64)

                      // create an ArrayBuffer and a view (as unsigned 8-bit)
                      let buffer = new ArrayBuffer(imageContent.length)
                      let view = new Uint8Array(buffer)

                      // fill the view, using the decoded base64
                      for (let n = 0; n < imageContent.length; n++) {
                        view[n] = imageContent.charCodeAt(n)
                      }

                      // convert ArrayBuffer to Blob
                      formData.append(key, new Blob([buffer], { type: type }))
                    } else {
                      formData.append(key, AmendmentData[key])
                    }
                  })
                  let myHeader = {
                    headers: {
                      Authorization: `Bearer ${data.token}`,
                    },
                  }
                  api
                    .post("/firm/update", formData, myHeader)
                    .then((res) => {
                      let data: any = localStorage.getItem("FASPLoginDetails")
                      if (data && data != "" && process.env.SECRET_KEY) {
                        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
                        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                      }
                      const formData1 = new FormData()

                      formData1.append("formType", "payment")

                      formData1.append("id", data.applicationId)

                      api

                        .post("/firm/update", formData1, myHeader)

                        .then((res) => {})

                        .catch((e) => {
                          console.log("Error while saving")
                        })

                      UpdateFirmStatus(
                        data.applicationId,
                        response.data.data.paymentDetails,
                        data.token
                      )

                      localStorage.removeItem("AmendmentData")
                      localStorage.removeItem("applicantDetails")
                      localStorage.removeItem("otherPlace")
                      localStorage.removeItem("PrincipalPlace")
                      localStorage.removeItem("PartnerDetails")
                    })
                    .catch((e) => {
                      console.log("Error while saving")
                    })
                } else {
                  let data: any = localStorage.getItem("FASPLoginDetails")
                  if (data && data != "" && process.env.SECRET_KEY) {
                    let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
                    data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
                  }
                  const formData1 = new FormData()
                  formData1.append("formType", "payment")

                  formData1.append("id", data.applicationId)
                  let myHeader = {
                    headers: {
                      Authorization: `Bearer ${data.token}`,
                    },
                  }
                  api

                    .post("/firm/update", formData1, myHeader)

                    .then((res) => {})

                    .catch((e) => {
                      console.log("Error while saving")
                    })
                  UpdateFirmStatus(
                    data.applicationId,
                    response.data.data.paymentDetails,
                    data.token
                  )
                }
                setPaymentDetails(response.data.data.paymentDetails)
                setIsSuccess(true)
                localStorage.setItem("PaymentDone", "true")
              } else {
                localStorage.removeItem("AmendmentData")
                setIsFailure(true)
              }
            }
          })
          .catch((error) => {
            // let data={
            //     applicationNumber:'765432345678',
            //     departmentTransID:'sdghyt8765434567',
            //     totalAmount:200,
            //     paymentMode:'Online'
            // }
            // setPaymentDetails(data)
            setIsFailure(true)
          })
      }
    }
  }, [])

  const options = {
    orientation: "p",
    unit: "mm",
    scale: 1,
    format: [400, 253],
  }

  useEffect(() => {
    document.body.classList.add("paymentSuccessPage")
    return () => {
      document.body.classList.remove(
        "paymentPage",
        "previewForm",
        "bg-salmon",
        "viewCerticate",
        "viewCerticatePage"
      )
    }
  }, [])

  return (
    <>
      <Head>
        <title>Successfully Completed Registration! - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {locData && locData?.userType && locData?.userType == "user" && (
        <div className="paymentpageSec">
          <div className="societyRegSec">
            <Container>
              <div className="regFieldsMain text-center">
                {paymentDone && (
                  <div className="formSectionTitle">
                    <h4>Something went wrong</h4>
                    <a className="btn btn-primary mt-1" href="/firmsHome/firms/dashboard">
                      Go to Dashboard
                    </a>
                  </div>
                )}
                {isSuccess && (
                  <div className="paymentSuccess" ref={ref}>
                    <div className="paymentPageHeader">
                      <Col lg={12} md={12} xs={12} style={{ margin: "0 auto" }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <div style={{ textAlign: "center" }}>
                            <img
                              src="/firmsHome/assets/header-logo.svg"
                              title="REGISTRATION & STAMPS DEPARTMENT"
                              alt="REGISTRATION & STAMPS DEPARTMENT"
                              style={{ width: "400px" }}
                            />
                          </div>
                        </div>
                      </Col>
                    </div>

                    <div className="formSectionTitle">
                      <h2>Firms Registration</h2>
                      <h6>* * * * * * * *</h6>
                      <h4>* * * * * * Acknowledgement Receipt * * * * * *</h4>
                    </div>
                    <Table bordered className="paymentTable">
                      <tbody className="tableBody">
                        <tr>
                          <td>
                            <b>ApplicationNumber</b>
                          </td>
                          <td>:</td>
                          <td>{paymentDetails.applicationNumber}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Department Transaction ID</b>
                          </td>
                          <td>:</td>
                          <td>{paymentDetails.departmentTransID}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Amount</b>
                          </td>
                          <td>:</td>
                          <td>{paymentDetails.totalAmount}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Payment Mode</b>
                          </td>
                          <td>:</td>
                          <td>{paymentDetails.paymentMode}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )}
                {isFailure && (
                  <div className="paymentFailed">
                    <div className="paymentPageHeader">
                      <Col lg={12} md={12} xs={12} style={{ margin: "0 auto" }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <div style={{ textAlign: "center" }}>
                            <img
                              src="/firmsHome/assets/header-logo.svg"
                              title="REGISTRATION & STAMPS DEPARTMENT"
                              alt="REGISTRATION & STAMPS DEPARTMENT"
                              style={{ width: "400px" }}
                            />
                          </div>
                        </div>
                      </Col>
                    </div>
                    <div className="formSectionTitle">
                      <h3>Your Payment is failed!</h3>
                    </div>
                  </div>
                )}
                {(isSuccess || isFailure) && (
                  <div className="d-flex justify-content-center paymentpagebtns">
                    <a className="btn btn-primary new-user mt-3" href="/firmsHome/firms">
                      Ok
                    </a>
                    {isSuccess && (
                      <div className="">
                        <Pdf targetRef={ref} filename={`PaymentSuccess.pdf`} options={options}>
                          {({ toPdf }: any) => (
                            <div className="text-center">
                              <Button
                                className="btn btn-primary new-user ms-3 mt-3"
                                id="downloadClick"
                                ref={btnref}
                                variant="primary"
                                onClick={() => {
                                  toPdf()
                                }}
                              >
                                Print
                              </Button>
                            </div>
                          )}
                        </Pdf>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Container>
          </div>
        </div>
      )}
      {(!locData?.userType || locData?.userType != "user") && (
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
export default PaymentSuccess
