import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Col, Row, Button, Table } from "react-bootstrap"
import instance from "@/redux/api"
// import JsBarcode from "jsbarcode"
import {
  downloadcertificate,
  downloadCertificateByData,
  downloadFirmCertificate,
  getDeptSignature,
  getFirmDetails,
} from "@/axios"
import api from "@/pages/api/api"
import { PopupAction } from "@/redux/commonSlice"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { DateFormator, Loading, ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import styles from "@/styles/pages/Forms.module.scss"
import { useRouter } from "next/router"
import CryptoJS from "crypto-js"
import Pdf from "react-to-pdf"

const DownloadCertificate = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>({})
  const [districts, setDistricts] = useState<any>([])
  const [locData, setLocData] = useState<any>({})
  const [firmData, setfirmData] = useState<any>({})
  const [loggedInAadhar, setLoggedInAadhar] = useState<any>("")
  const [isView, setIsView] = useState<boolean>(false)
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState<boolean>(false)
  const [ispaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false)
  const [signature, setSignature] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [date, setDate] = useState<any>()

  let ref = React.useRef<HTMLDivElement | null>(null)
  let btnref = React.useRef<HTMLButtonElement | null>(null)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const ShowAlert = (type: boolean, message: string) => {
    dispatch(PopupAction({ enable: true, type: type, message: message }))
  }

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
      Loading(true)
      setLocData(data)
      setLoggedInAadhar(data.aadharNumber)
      instance
        .get("/getDistricts")
        .then((response) => {
          setDistricts(response.data)
        })
        .catch(() => {
          console.log("error")
        })
      getFirmDetails(data.applicationId, data.token).then((response) => {
        Loading(false)
        if (response?.success) {
          setfirmData(response.data.firm)
          const date = response.data.firm.processingHistory?.find(
            (x) => x.status == "Approved" || x.status == "Rejected"
          )
          if (date) {
            setDate(DateFormator(date.applicationProcessedDate, "dd/mm/yyyy"))
          }
          if (
            response.data.firm &&
            response.data.firm.status &&
            (response.data.firm.status == "Approved" || response.data.firm.status == "Rejected")
          ) {
            setSelectedRequest(response.data.firm)
          } else if (
            response.data.firm &&
            response.data.firm.historyDetails &&
            response.data.firm.historyDetails?.some(
              (x) => x.status == "Approved" || x.status == "Rejected"
            )
          ) {
            setSelectedRequest(
              response.data.firm.historyDetails?.find(
                (x) => x.status == "Approved" || x.status == "Rejected"
              )
            )
          }

          // if (response.data.firm.approvedRejectedById) {
          //   getDeptSignature(response.data.firm.approvedRejectedById, data.token)
          //     .then((res) => {
          //       if (res.success && res.data) {
          //         setSignature("data:image/jpg;base64, " + res.data.signature)
          //         setFullName(res.data.fullName)
          //         if(response.data.firm.status == "Approved"||response.data.firm.status == "Rejected"){
          //         setSelectedRequest(response.data.firm)
          //         }
          //         else if(response.data.firm.historyDetails?.some((x) => (x.status == "Approved"||x.status == "Rejected"))){
          //           setSelectedRequest(response.data.firm.historyDetails?.find((x) =>(x.status == "Approved"||x.status == "Rejected")))
          //         }
          //       }
          //     })
          //     .catch(() => {
          //       Loading(false)
          //       console.log("error")
          //     })

          // }

          if (
            (response.data.firm.status == "Approved" || response.data.firm.status == "Rejected") &&
            response.data.firm.isdownload
          ) {
            setIsAlreadyDownloaded(true)
          } else {
            setIsAlreadyDownloaded(false)
          }
        }
      })
    }
  }, [])
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const fetchFile = (data) => {
    console.log("data::", data)
    const linkSource = "data:application/pdf;base64," + data.base64file
    let downloadLink = document.createElement("a")

    downloadLink.href = linkSource
    downloadLink.target = "_blank"
    downloadLink.download = locData.applicationNumber + "-" + selectedRequest.status + ".pdf"
    downloadLink.click()
    sleep(1000)
    downloadLink.remove()
  }
  const fetchFileByFileName = (data, filename) => {
    console.log("data::", data)
    const linkSource = "data:application/pdf;base64," + data.base64file
    let downloadLink = document.createElement("a")

    downloadLink.href = linkSource
    downloadLink.target = "_blank"
    downloadLink.download = filename
    downloadLink.click()
    sleep(1000)
    downloadLink.remove()
  }
  const certificatedownload = async () => {
    let resp: any = await downloadcertificate(locData.applicationNumber, locData.token)
    if (resp.success == true) {
      setTimeout(() => {
        fetchFile(resp.data)
        ShowAlert(true, "Your certificate is downloaded successfully")
      }, 1000)
    }
    let UploadedSocietyDocs = firmData.documentAttached
    for (let uploaddoc of UploadedSocietyDocs) {
      downloadCertificateByData(
        locData.applicationNumber,
        uploaddoc.originalname,
        locData.token
      ).then((res: any) => {
        console.log("res.data:::::::::", res)
        if (res.success == true) {
          setTimeout(() => {
            fetchFileByFileName(res.data, uploaddoc.originalname)
          }, 1000)
        } else {
          ShowAlert(true, res.message)
        }
      })
    }
  }

  useEffect(() => {
    if (selectedRequest?.status == "Approved") {
      let data1: any = localStorage.getItem("isdownload")
      if (data1) {
        let data: any = localStorage.getItem("FASPLoginDetails")
        if (data && data != "" && process.env.SECRET_KEY) {
          let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
          data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        }
        api
          .get("/getPaymentDetails/" + data.applicationNumber, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((response: any) => {
            if (!response || !response.data || !response.data.success) {
              localStorage.removeItem("isdownload")
              setIsPaymentSuccess(false)
            } else {
              if (
                response.data.data.paymentDetails.transactionStatus == "Success" &&
                !response.data.data.paymentDetails.isUtilized &&
                btnref.current
              ) {
                localStorage.setItem("download", "true")
                btnref.current.click()
                localStorage.removeItem("isdownload")
              } else {
                localStorage.removeItem("isdownload")
                setIsPaymentSuccess(false)
              }
            }
          })
          .catch((error) => {
            localStorage.removeItem("isdownload")
            setIsPaymentSuccess(false)
          })
      }
    }
  }, [selectedRequest])

  const PaymentLink = () => {
    let code = 0
    const dis: any = districts?.find((x: any) => x.name == selectedRequest.district)
    if (dis) {
      code = dis.code
    }
    localStorage.setItem("isdownload", "true")

    const paymentsData = {
      type: "firmsFee",
      source: "Firms",
      deptId: selectedRequest.applicationNumber,
      rmName: selectedRequest.applicantDetails.name,
      rmId: loggedInAadhar,
      mobile: selectedRequest.contactDetails.mobileNumber,
      email: selectedRequest.contactDetails.email,
      drNumber: code,
      rf: 300,
      uc: 0,
      oc: 0,
      returnURL: process.env.BACKEND_URL + "/firms/redirectcertificate",
    }
    let paymentRedirectUrl = process.env.PAYMENT_REDIRECT_URL
    let encodedData = Buffer.from(JSON.stringify(paymentsData), "utf8").toString("base64")
    console.log("ENCODED VALUE IS ", encodedData)
    let paymentLink = document.createElement("a")
    paymentLink.href = paymentRedirectUrl + encodedData
    paymentLink.click()
    setTimeout(function () {
      paymentLink.remove()
    }, 1000)
  }

  const options = {
    orientation: "p",
    unit: "mm",
    format: [400, 270],
  }

  return (
    <>
      <Head>
        <title>Acknowledgement of Registration of Firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      {locData && locData?.userType && locData?.userType == "user" && (
        <div className={`societyRegSec ${styles.RegistrationMain}`}>
          <div className="formsec">
          <div className="regofAppBg">
            <Container>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <div className="d-flex justify-content-between align-items-center page-title mb-2">
                    <div className="pageTitleLeft">
                      <h1>Firm Certificate</h1>
                    </div>

                    <div className="pageTitleRight">
                      {/* <div className="page-header-btns">
                        <a
                          className="btn btn-primary new-user"
                          onClick={() => router.push("dashboard")}
                        >
                          Go Back
                        </a>
                      </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
            {(selectedRequest?.status == "Approved" || selectedRequest?.status == "Rejected") &&
            selectedRequest.applicationNumber ? (
              <div className="text-center">
                <Button
                  id="downloadClick"
                  ref={btnref}
                  className="ms-3"
                  variant="primary"
                  onClick={() => {
                    const data = localStorage.getItem("download")
                    if (data == "true") {
                      downloadFirmCertificate(
                        { amount: 300, appId: locData.applicationNumber },
                        locData.applicationId,
                        locData.token
                      )
                      certificatedownload()
                      localStorage.removeItem("download")
                    } else if (!isAlreadyDownloaded) {
                      downloadFirmCertificate({ amount: 0 }, locData.applicationId, locData.token)
                      certificatedownload()

                      setIsAlreadyDownloaded(true)
                    } else {
                      PaymentLink()
                    }
                  }}
                >
                  Download Certificate
                </Button>
              </div>
            ) : (
              <div className="regofAppBg">
                <Container>
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <div className="d-flex justify-content-center page-title mb-2">
                        <div className="pageTitleLeft">
                          <h1>Application is not yet approved</h1>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}

            {selectedRequest?.status == "Incomplete" && (
              <div className="applicationPendingSec">
                <Row className="d-flex justify-content-between align-items-center">
                  <Col lg={12} md={12} xs={12}>
                    <div className="certificateHeader text-center">
                      <h3>Your application is not yet submitted </h3>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {selectedRequest?.status &&
              selectedRequest?.status != "" &&
              selectedRequest?.status != "Approved" &&
              selectedRequest?.status != "Rejected" &&
              selectedRequest?.status != "Incomplete" && (
                <div className="applicationPendingSec">
                  <Container>
                    <Row className="d-flex justify-content-between align-items-center">
                      <Col lg={12} md={12} xs={12}>
                        <div className="certificateHeader text-center">
                          <h3>Your application is pending </h3>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              )}
          </div>
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

export default DownloadCertificate
