import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Col, Row, Button } from "react-bootstrap"
import instance from "@/redux/api"
import { downloadByeLawCertificate, getFirmDetails } from "@/axios"
import api from "@/pages/api/api"
import { PopupAction } from "@/redux/commonSlice"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import CryptoJS from "crypto-js"

const DownloadByLawCertificate = () => {
  const dispatch = useAppDispatch()

  const [selectedRequest, setSelectedRequest] = useState<any>({})
  const [districts, setDistricts] = useState<any>([])
  const [locData, setLocData] = useState<any>({})
  const [loggedInAadhar, setLoggedInAadhar] = useState<string>("")
  const [isView, setIsView] = useState<boolean>(false)
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState<boolean>(false)
  const [ispaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false)

  let ref = React.useRef<HTMLDivElement | null>(null)
  let btnref = React.useRef<HTMLButtonElement | null>(null)

  const ShowAlert = (type: any, message: any) => {
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
        if (response?.success) {
          setSelectedRequest(response.data.firm)
          if (response.data.firm.status != "Incomplete" && response.data.firm.isdownload) {
            setIsAlreadyDownloaded(true)
          } else {
            setIsAlreadyDownloaded(false)
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    let data1: any = localStorage.getItem("isdownloadByeLaw")
    if (data1) {
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "" && process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        api
          .get("/getPaymentDetails/" + data.applicationNumber, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then((response: any) => {
            if (!response || !response.data || !response.data.success) {
              localStorage.removeItem("isdownloadByeLaw")
              setIsPaymentSuccess(false)
            } else {
              if (response.data.data.paymentDetails.transactionStatus == "Success") {
                localStorage.setItem("downloadByeLaw", "true")
                if (btnref && btnref.current) {
                  btnref.current.click()
                  localStorage.removeItem("isdownloadByeLaw")
                }
              } else {
                localStorage.removeItem("isdownloadByeLaw")
                setIsPaymentSuccess(false)
              }
            }
          })
          .catch((error) => {
            localStorage.removeItem("isdownloadByeLaw")
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
    localStorage.setItem("isdownloadByeLaw", "true")

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
      returnURL: process.env.BASE_URL + "/firmsHome/firms/downloadByLawCertificate",
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

  const fetchFile = () => {
    const url = "/firmsHome/assets/downloads/Societies-Self-Signed-Certificate.pdf"
    fetch(url)
      .then((res) => res.blob())
      .then((file) => {
        let tempUrl = URL.createObjectURL(file)
        const aTag = document.createElement("a")
        aTag.href = tempUrl
        aTag.download = url.replace(/^.*[\\\/]/, "")
        document.body.appendChild(aTag)
        aTag.click()
        URL.revokeObjectURL(tempUrl)
        aTag.remove()
      })
      .catch(() => {
        alert("Failed to download file!")
      })
  }

  return (
    <>
      <Head>
        <title>Acknowledgement of Registration of Firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      {selectedRequest.status != "Incomplete" && (
        <div className="text-center mt-5 pt-5">
          <Button
            id="downloadClick"
            ref={btnref}
            className="ms-3"
            variant="primary"
            onClick={() => {
              const data: any = localStorage.getItem("downloadByeLaw")
              if (data == "true") {
                fetchFile()
                downloadByeLawCertificate({ amount: 300 }, locData.applicationId, locData.token)
                ShowAlert(true, "Your certificate is downloaded successfully")
                localStorage.removeItem("downloadByeLaw")
              } else {
                PaymentLink()
              }
            }}
          >
            Download Copy of Bye-Laws
          </Button>
        </div>
      )}

      {selectedRequest.status == "Incomplete" && (
        <div className="certifyLogoSec">
          <Row className="d-flex justify-content-between align-items-center">
            <Col lg={12} md={12} xs={12}>
              <div className="certifyLogoInfo text-center">
                <h3>Your application is not yet submitted </h3>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default DownloadByLawCertificate
