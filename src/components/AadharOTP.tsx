import { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import styles from "@/styles/Home.module.scss"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { AadharOTPAction } from "@/redux/commonSlice"
import { CallingAxios, ShowMessagePopup } from "@/GenericFunctions"
import { UseGetAadharDetails, UseGetAadharOTP } from "@/axios"
import TableInputText from "./common/TableInputText"
import TableText from "./common/TableText"
import { Col, Row } from "react-bootstrap"
import { AES } from "crypto-js"
import { IAadharNumberDetails } from "@/models/componentTypes"

const AadharOTP = () => {
  const dispatch = useAppDispatch()
  const AadharOTPMemory = useAppSelector((state) => state.common.AadharOTPMemory)
  const [AadharNumberDetails, setAadharNumberDetails] = useState<IAadharNumberDetails>({
    type: "",
    aadharNumber: AadharOTPMemory.aadharNumber,
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
  })
  const [IsOTPSent, setIsOTPSent] = useState<boolean>(false)

  useEffect(() => {
    if (AadharOTPMemory.aadharNumber && AadharOTPMemory.aadharNumber != "" && IsOTPSent == false) {
      setAadharNumberDetails({ ...AadharOTPMemory, aadharNumber: AadharOTPMemory.aadharNumber })
      setIsOTPSent(true)
      CallGetOTP()
    }
  })

  const ReqDetails = async () => {
    let result = await CallingAxios(
      UseGetAadharDetails({
        aadharNumber: btoa(AadharOTPMemory.aadharNumber),
        transactionNumber: AadharNumberDetails.OTPResponse.transactionNumber,
        otp: AadharNumberDetails.otp,
      })
    )
    if (
      result.status &&
      result.status === "Success" &&
      AadharNumberDetails.OTPResponse.transactionNumber == result.transactionNumber.split(":")[1]
    ) {
      let details = { ...AadharNumberDetails, KYCResponse: result.userInfo }
      setAadharNumberDetails({
        ...AadharNumberDetails,
        aadharNumber: "",
        otp: "",
        OTPResponse: { transactionNumber: "" },
        KYCResponse: {},
      })
      dispatch(
        AadharOTPAction({
          ...AadharOTPMemory,
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
      const ciphertext = AES.encrypt(
        AadharOTPMemory.aadharNumber.toString(),
        process.env.IGRS_SECRET_KEY
      )
      let result = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
      if (result && result.status != "Failure") {
        setAadharNumberDetails({ ...AadharNumberDetails, OTPResponse: result })
      } else {
        dispatch(AadharOTPAction({ ...AadharOTPMemory, enable: false }))
        ShowMessagePopup(false, "Aadhar OTP request failed", "")
      }
    }
  }

  const onchange = (e: any) => {
    let addName = e.target.name
    let addValue = e.target.value
    setAadharNumberDetails({ ...AadharNumberDetails, [addName]: addValue })
  }

  return (
    <div className="home-main-sec">
      {AadharOTPMemory.enable && (
        <Modal className={styles.container} show={true}>
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
                      setAadharNumberDetails({
                        ...AadharNumberDetails,
                        aadharNumber: "",
                        otp: "",
                        OTPResponse: { transactionNumber: "" },
                        KYCResponse: {},
                      })
                      setIsOTPSent(false)
                      dispatch(
                        AadharOTPAction({ ...AadharOTPMemory, enable: false, aadharNumber: "" })
                      )
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
                {IsOTPSent ? (
                  <TableText
                    label="The OTP has been sent to your Aadhaar registered mobile number successfully."
                    required={false}
                  />
                ) : null}
                <text className={styles.AdharText}>Aadhaar Card Number</text>
                <input
                  disabled={true}
                  type="text"
                  placeholder={"xxxx xxxx x"}
                  value={
                    AadharOTPMemory?.aadharNumber
                      ? "xxx xxxx x" + String(AadharOTPMemory?.aadharNumber).substring(9, 12)
                      : "----------"
                  }
                />
              </div>
              {IsOTPSent ? (
                <div>
                  <text className={`${styles.AdharText} ${styles.OtpText}`}>Enter OTP</text>
                  <TableInputText
                    required={true}
                    type="number"
                    placeholder=""
                    maxLength={6}
                    name={"otp"}
                    value={AadharNumberDetails.otp}
                    onChange={onchange}
                  />
                </div>
              ) : null}
              {IsOTPSent ? (
                <div className="mt-3">
                  <button className={styles.AadharBtn} onClick={ReqDetails}>
                    Verify
                  </button>
                </div>
              ) : null}
            </Modal.Body>
          </Modal.Dialog>
        </Modal>
      )}
    </div>
  )
}

export default AadharOTP
