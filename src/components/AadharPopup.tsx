import { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import styles from "@/styles/Home.module.scss"
import { Col, Row } from "react-bootstrap"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { AadharPopupAction } from "@/redux/commonSlice"
import { useRouter } from "next/router"
import { CallingAxios, ShowMessagePopup } from "@/GenericFunctions"
import { UseGetAadharDetails, UseGetAadharOTP } from "@/axios"
import { AES } from "crypto-js"
import { IAadharNumberDetails } from "@/models/componentTypes"

const AadharPopup = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [TempMemory, setTempMemory] = useState({ AadharPresent: false })
  const [AadharNumberDerails, setAadharNumberDerails] = useState<IAadharNumberDetails>({
    aadharNumber: "",
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
  })
  const AadharPopupMemory = useAppSelector((state) => state.common.AadharPopupMemory)
  const [AadharNumberDetails, setAadharNumberDetails] = useState<IAadharNumberDetails>({
    type: "",
    aadharNumber: "",
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
  })

  useEffect(() => {
    let CurrentParty: any = localStorage.getItem("CurrentPartyDetails")
    CurrentParty = JSON.parse(CurrentParty)
  }, [AadharPopupMemory.enable])

  const ReqOTP = () => {
    if (AadharNumberDerails.aadharNumber.length == 12) {
      let ExistingAadhar: any[] = []
      let count = ExistingAadhar.find((x) => x == AadharNumberDerails.aadharNumber)
      if (!count) {
        CallGetOTP()
      } else {
        ShowMessagePopup(false, "Duplivate Aadhar card entry is not allowed", "")
      }
    } else {
      dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false }))
      ShowMessagePopup(false, "Kindly enter valid Aadhar number", "/PartiesDetailsPage")
    }
  }

  const ReqDetails = async () => {
    let result = await CallingAxios(
      UseGetAadharDetails({
        aadharNumber: btoa(AadharNumberDerails.aadharNumber),
        transactionNumber: AadharNumberDerails.OTPResponse.transactionNumber,
        otp: AadharNumberDerails.otp,
      })
    )
    if (
      result.status &&
      result.status === "Success" &&
      AadharNumberDerails.OTPResponse.transactionNumber == result.transactionNumber.split(":")[1]
    ) {
      let details = { ...AadharNumberDerails, KYCResponse: result.userInfo }
      // setAadharNumberDerails(details);
      setTempMemory({ AadharPresent: false })
      setAadharNumberDerails({
        aadharNumber: "",
        otp: "",
        OTPResponse: { transactionNumber: "" },
        KYCResponse: {},
      })
      dispatch(
        AadharPopupAction({
          ...AadharPopupMemory,
          enable: false,
          status: true,
          response: true,
          data: details,
        })
      )
    } else {
      ShowMessagePopup(false, "Aadhar card verification failed", "")
    }
  }

  const CallGetOTP = async () => {
    if (process.env.IGRS_SECRET_KEY) {
      const ciphertext = AES.encrypt(AadharNumberDerails.aadharNumber, process.env.IGRS_SECRET_KEY)
      let result = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
      if (result && result.status != "Failure") {
        setTempMemory({ AadharPresent: true })
        setAadharNumberDerails({ ...AadharNumberDerails, OTPResponse: result })
        ShowMessagePopup(
          true,
          "The OTP has been sent to your Aadhaar registered mobile number successfully.",
          ""
        )
      } else {
        dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false }))
        ShowMessagePopup(false, "Aadhar OTP request failed", "")
      }
    }
  }

  const onchange = (e: any) => {
    let addName = e.target.name
    let addValue = e.target.value
    if (addName == "aadharNumber") {
      if (addValue.length > 12) {
        addValue = AadharNumberDerails.aadharNumber
      }
    }
    setAadharNumberDerails({ ...AadharNumberDerails, [addName]: addValue })
  }

  return (
    <div className="home-main-sec">
      {AadharPopupMemory.enable && (
        <div className={styles.container}>
          <Modal.Dialog className={styles.modaldialog}>
            <div className={styles.modalHeaderInfo}>
              <Row className={styles.Modalheader}>
                <Col lg={10}>
                  <Modal.Title className={styles.ModalTitle}>Aadhaar Card Number</Modal.Title>
                </Col>
                <Col lg={2}>
                  <Modal.Header
                    closeButton
                    className={styles.Modalclose}
                    onClick={() => {
                      setAadharNumberDerails({
                        aadharNumber: "",
                        otp: "",
                        OTPResponse: { transactionNumber: "" },
                        KYCResponse: {},
                      })
                      setTempMemory({ AadharPresent: false })
                      dispatch(AadharPopupAction({ ...AadharPopupMemory, enable: false }))
                    }}
                  ></Modal.Header>
                </Col>
              </Row>
            </div>
            <Modal.Body className={styles.succesxsodalbody}>
              <div>
                <Image
                  alt="Image"
                  height={90}
                  width={90}
                  className="adhaarImage"
                  src="/firmsHome/assets/adhar-img.png"
                />
              </div>
              <div>
                <text className={styles.AdharText}>
                  {!TempMemory.AadharPresent ? "Enter " : null}Aadhaar Card Number
                </text>
                {TempMemory.AadharPresent ? (
                  <input
                    disabled={true}
                    type="text"
                    placeholder={"xxxx xxxx x"}
                    value={"xxx xxxx x" + AadharNumberDerails.aadharNumber.substring(9, 12)}
                  />
                ) : (
                  <input
                    disabled={false}
                    type="number"
                    name="aadharNumber"
                    placeholder="xxxx xxxx xxxx"
                    value={AadharNumberDerails.aadharNumber}
                    onChange={onchange}
                  />
                )}
              </div>
              {TempMemory.AadharPresent ? (
                <div>
                  <text className={`${styles.AdharText} ${styles.OtpText}`}>Enter OTP</text>
                  <input
                    type="number"
                    placeholder="xxxxxx"
                    name={"otp"}
                    value={AadharNumberDerails.otp}
                    onChange={onchange}
                  />
                </div>
              ) : null}
              {!TempMemory.AadharPresent ? (
                <div className="mt-3">
                  <button className={styles.AadharBtn} onClick={ReqOTP}>
                    Submit
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <button className={styles.AadharBtn} onClick={ReqDetails}>
                    Verify
                  </button>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}
    </div>
  )
}

export default AadharPopup
