import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Popstyles from "../styles/components/EkycPopup.module.scss";
import { ImCross } from "react-icons/im";
import TableText from "./common/TableText";
import TableInputText from "./common/TableInputText";
import { UseGetAadharDetails, UseGetAadharDetailsEkyc, UseGetAadharOTP } from "@/axios";
import { AES } from "crypto-js"
import { CallingAxios, ShowMessagePopup } from "@/GenericFunctions";
import { AadharPopupAction } from "@/redux/commonSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";

interface AadharEKYCDialogProps {
  LoginDetails?: any;
  setShowEkycDialog?: any;
}

const AadharEKYCDialog = ({
  LoginDetails,
  setShowEkycDialog,
}: AadharEKYCDialogProps) => {
  const dispatch = useAppDispatch()
  let [aadharNumberDetails, setAadharNumberDetails] = useState({aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" }, KYCResponse: {} });
  const [seconds, setSeconds] = useState(10);
  const [TempMemory, setTempMemory] = useState({ AadharPresent: false })

  const handleClose = () => {
    setShowEkycDialog(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setAadharNumberDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function tick(timeSconds: any) {
    if (timeSconds > 0) {
      setSeconds(timeSconds - 1)
    } else {
      clearInterval(timeSconds);
    }
  }
  const CallGetOTP = async () => {
    let myAadhar = btoa(LoginDetails.aadharNumber);
    let result = await CallingAxios(UseGetAadharOTP(myAadhar));
    if (result && result.status != "Failure") {
      setTempMemory({ AadharPresent: true });
      setAadharNumberDetails({ ...LoginDetails, OTPResponse: result })
      ShowMessagePopup(true, "Aadhar OTP has been sent successfully on registered mobile", "")
      tick(20);
    }
    else {
      setTempMemory({ AadharPresent: false })
      setAadharNumberDetails({ ...LoginDetails, aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" }, KYCResponse: {} });
      ShowMessagePopup(false, "Aadhar OTP Request failed", "");
    }
  }

  const ReqDetails = async () => {
    let result = await CallingAxios(UseGetAadharDetailsEkyc({
      aadharNumber: btoa(aadharNumberDetails.aadharNumber),
      transactionNumber: aadharNumberDetails.OTPResponse.transactionNumber,
      otp: aadharNumberDetails.otp
    }));
    if (result.status && result.status === 'Success') {
      let details = { ...aadharNumberDetails, KYCResponse: result.userInfo}
      setAadharNumberDetails(details);
      setTempMemory({ AadharPresent: false });
      setAadharNumberDetails({aadharNumber: "", otp: "", OTPResponse: { transactionNumber: "" }, KYCResponse: {} });
      dispatch(AadharPopupAction({ enable: false, status: true, response: true, data: details }));
      setShowEkycDialog(false);
    }
    else {
      ShowMessagePopup(false, "Please Enter Valid OTP", "");
    }
  }

  return (
    <>
      <Container>
        <div className={Popstyles.reportPopup}>
          <div className={Popstyles.container}>
            <div className={Popstyles.Messagebox}>
              <div className={Popstyles.header}>
                <div className={Popstyles.letHeader}>
                  <p className={Popstyles.text}>Aadhar EKYC</p>
                </div>
                <div>
                  <ImCross
                    onClick={handleClose}
                    className={Popstyles.closeButton}
                  />
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "1rem",
                  paddingTop: "1rem",
                  paddingRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
                className={Popstyles.popupBox}
              >

                <Row className="mb-0">
                  <Col lg={12} md={12} xs={12} className="mb-2">
                    <TableText
                      label={"Aadhar Number"}
                      required={true}
                    />
                    <TableInputText
                      disabled={true}
                      type="text"
                      maxLength={12}
                      placeholder="Enter Aadhar Number"
                      required={true}
                      name="aadhar"
                      onChange={handleChange}
                      value={"xxx xxxx x" + LoginDetails.aadharNumber.substring(9, 12)}
                    />
                    {/* {seconds === 0 ? <Image alt='Image' onClick={CallGetOTP} width={40} height={40} className={`aadharRestImg ${Popstyles.sImage}`} src="/firmsHome/assets/reset.png" /> :
                      <div className="circle">{seconds}</div>
                    } */}
                  </Col>
                  {TempMemory.AadharPresent && <Col lg={12} md={12} xs={12} className="mb-2">
                    <TableText
                      label={"OTP"}
                      required={true}
                    />
                    <TableInputText
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP"
                      required={true}
                      name="otp"
                      onChange={handleChange}
                      value={aadharNumberDetails.otp}
                    />
                  </Col>}
                </Row>
                <div className="text-center d-flex">
                  {/* <button
                    className={Popstyles.yesBtn}
                    style={{ marginLeft: "0px" }}
                    onClick={CallGetOTP}
                  >
                    Submit
                  </button> */}
                </div>
                {!TempMemory.AadharPresent ?
                  <button className={Popstyles.yesBtn} style={{ marginLeft: "0px" }} type='submit' id="submitAadhar" onClick={CallGetOTP} >Send Otp</button>
                  :
                  <button className={Popstyles.yesBtn} style={{ marginLeft: "0px" }} id="submitOtp" onClick={ReqDetails}>Verify</button>
                }
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AadharEKYCDialog;
