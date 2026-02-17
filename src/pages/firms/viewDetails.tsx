import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Container, Col, Row, Table, Button, Form, Card } from "react-bootstrap"
import api from "@/pages/api/api"
import Swal from "sweetalert2"
import {
  DefaceTransactionDetails,
  VerifyTransactionDetails,
  UseGetFirmDetailsById,
  getDeptSignature,
  UseCreateCertificate,
  downloadFileByData,
  getFirmName,
} from "@/axios"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { PopupAction } from "@/redux/commonSlice"
import { get } from "lodash"
import ViewHistory from "./viewHistory"
import { DateFormator, Loading, ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import PreviewFirm from "./previewFirm"
import CryptoJS from "crypto-js"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import FirmDialog from "@/components/dataListPopUp"

interface ViewDetailsProps {
  reqsearchdata: any
  selectedRequest: any
  setReqSearchData: any
  setIsView: any
  setIsError: any
  setErrorMessage: any
}

const ViewDetails = ({
  reqsearchdata,
  selectedRequest,
  setReqSearchData,
  setIsView,
  setIsError,
  setErrorMessage,
}: ViewDetailsProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [deviceTpye, setdeviceTpye] = useState<any>({ type: "" })
  const [firmPartners, setFirmPartners] = useState<any>([])
  const [firmProcessing, setFirmProcessing] = useState<any>([])
  const [isTransVerified, SetIsTransVerified] = useState<boolean>(false)
  const [isTransDefaced, setIsTransDefaced] = useState<boolean>(false)
  const [transactionDetails, setTransactionDetails] = useState<any>({})
  const [userType, setUserType] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const [isViewCertificate, setIsViewCertificate] = useState<boolean>(false)
  const [isViewOldCertificate, setIsViewOldCertificate] = useState<boolean>(false)
  const [isViewHistory, setViewHistory] = useState<boolean>(false)
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [formType, setFormType] = useState<string>()
  const [esignData, setEsignData] = useState<any>({})
  const [esignUrl, setEsignUrl] = useState("")
  const [xmlValue, setXMLValue] = useState("")
  const [certData, setCertData] = useState<any>({})
  const [oldcerData, setOldCertData] = useState<any>({})
   const [firmDetails, setFirmDetails] = useState({firmName: ""})
  const [dlfFirmdata, setDlfFirmdata] = useState<any>({})
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [firmData, setFirmData] = useState<any[]>([]);

  useEffect(() => {
    if (!isPreview) {
      // loadDocs()
      document.body.classList.remove(
        "viewCertificate",
        "viewCertificatePage",
        "previewForm",
        "bg-salmon",
        "viewCerticate",
        "viewCerticatePage",
        "previewFormPage"
      )
    }
  }, [isPreview])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    if (xmlValue) {
      // if (igrsEsign) {
      //     let ID: any = document.getElementById('igrs_input');
      //     ID.click();
      // } else {
      let ID: any = document.getElementById("xmlInput")

      ID.click()
      // }
    }
  }, [xmlValue])
  const DeviceOptionChange = (e: any) => {
    let TempDetails: any = { ...deviceTpye }
    let AddName = e.target.name
    let AddValue = e.target.value
    setdeviceTpye({ ...TempDetails, [AddName]: AddValue })
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const fetchFileByFileName = (data, filename) => {
    console.log("data::", data)
    const byteCharacters = atob(data.base64file)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    // const linkSource = 'data:application/pdf;base64,' + data.base64file;
    // var pdf = linkSource;
    const urls = window.URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }))
    var link: any = document.createElement("a")
    if (link) {
      link.href = urls
    }
    // var doc = document.createElement("a");
    // doc.href = 'data:application/octet-stream;base64,' + pdf;
    link.target = "blank"
    link.click()
    // window.open('data:application/pdf;base64,' + pdf);
    sleep(1000)
  }
  // const loadDocs = async () => {
  //   if (selectedRequest?.documentAttached?.length > 0) {
  //     selectedRequest?.documentAttached.forEach(async (document: any, index: number) => {
  //       await docLink(document?.originalname, index, document?.path)
  //     })
  //   }
  // }
  const filedownload = async (filename: string) => {
    let UploadedSocietyDocs = selectedRequest.documentAttached
    downloadFileByData(selectedRequest.applicantFields.applicantNumber, filename, token).then(
      (res: any) => {
        console.log("res.data:::::::::", res)
        if (res.success == true) {
          setTimeout(() => {
            fetchFileByFileName(res.data, filename)
          }, 1000)
        } else {
          ShowAlert(true, res.message)
        }
      }
    )
  }

  useEffect(() => {
    // loadDocs()
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data.userType != "user") {
      api
        .get("/getPaymentDetails/" + selectedRequest.applicantFields.applicantNumber, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        })
        .then((response: any) => {
          if (!response || !response.data || !response.data.success) {
            console.log("error-", response.data.message)
            console.log(response.data.message)
            setIsError(true)
            setErrorMessage(response.data.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            setTransactionDetails(response.data.data.paymentDetails)
            if (response.data.data.paymentDetails?.isUtilized) {
              SetIsTransVerified(true)
              setIsTransDefaced(true)
            }
          }
        })
        .catch((error: any) => {
          console.log("error-", error)
          console.log(error.message)
          setIsError(true)
          setErrorMessage(error.message)
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          })
        })
    }
  }, [])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setUserType(data.userType)
    setRole(data.role)
    setToken(data.token)
    UseGetFirmDetailsById(selectedRequest.applicantFields.id, data.token).then((response) => {
      if (
        response.data?.firm?.isPartnerReplaced ||
        response.data?.firm?.isNewPartnerAdded ||
        response.data?.firm?.isPartnerDeleted ||
        response.data?.firm?.firmDissolved
      ) {
        setFormType("form-3")
      } else if (
        response.data?.firm?.isOtherAddressChange ||
        response.data?.firm?.isPartnerPermanentAddressChange ||
        response.data?.firm?.isPrincipaladdressChange ||
        response.data?.firm?.isFirmNameChange
      ) {
        setFormType("form-2")
      }
      let Objcert: any = {
        id: response.data?.firm?.applicationNumber,
        txnId: response.data?.firm?.esignTxnId,
      }
      setCertData({ ...Objcert })
      console.log(response, "dhjsga")
    })
  }, [])

  useEffect(() => {
    if (selectedRequest) {
      let OldObjcert: any = {
        district: selectedRequest?.firmFields?.district,
        registrationYear: selectedRequest?.firmFields?.registrationYear,
        registrationNumber: selectedRequest.firmFields.registrationNumber,
      }
      setOldCertData(OldObjcert)
    }
  }, [selectedRequest])
  console.log(oldcerData, "oldcerData")

  const ShowAlert = (type: boolean, message: string) => {
    dispatch(PopupAction({ enable: true, type: type, message: message }))
  }

  const verifyTransacDetails = async () => {
    let result: any = await VerifyTransactionDetails({
      deptTransactionID: btoa(transactionDetails.departmentTransID),
    })
    if (result.status && result.status === "Success") {
      ShowAlert(true, "Transaction details are verified Successfully")
      SetIsTransVerified(true)
    } else {
      ShowAlert(false, get(result, "message", "Transaction details verification Failed"))
    }
  }

  const defaceTransacDetails = async () => {
    let result: any = await DefaceTransactionDetails({
      deptTransactionID: btoa(transactionDetails.departmentTransID),
    })
    if (result.status && result.status === "Success") {
      api
        .post("/confirmDephaseTransaction/" + transactionDetails.departmentTransID, null, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: any) => {
          if (!response || !response.data || !response.data.success) {
            console.log("error-", response.data.message)
            console.log(response.data.message)
            setIsError(true)
            setErrorMessage(response.data.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            setIsTransDefaced(true)
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Successfully Defaced",
              showConfirmButton: false,
              timer: 1500,
            })
          }
        })
        .catch((error: any) => {
          console.log("error-", error)
          console.log(error.message)
          setIsError(true)
          setErrorMessage(error.message)
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          })
        })
    } else {
      ShowAlert(false, get(result, "message", "Transaction deface Failed"))
    }
  }

  const docLink = async (name: any, index: number, path: any) => {
    let url = ""
    url = `/downloads/${selectedRequest.firmFields.firmId}/${name}`
    // if (path.split("/")[2] == 0) {
    //   url = `/downloads/${path.split("/")[2]}/${name}`
    // }

    const res = await api.get(url, { responseType: "arraybuffer" })
    console.log("res.data&&&&$$$$$$$$$$$$", res.data)
    const urls = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
    var link: any = document.getElementById(`docFile${index}`)
    if (link) {
      link.href = urls
    }
  }
  const handleForwardClick = (e) => {
    if (!isChecked) {
      e.preventDefault();
      Loading(false);
      ShowMessagePopup(false, "Firm Name Check Is Required", "");
      return;
    }
  };
  const onApprovedOrRejected = async (type: String) => {
    Loading(true)
    const remarks: any = document.getElementById("remarks")
    let remarksData: any = {
      id: selectedRequest.firmFields.firmId,
      remarks: remarks.value,
    }
    if (remarksData.remarks == "") {
      ShowMessagePopup(false, "Please add the Remarks", "")
      Loading(false)
      return
    }
    if (!isChecked) {
        ShowMessagePopup(false, "Firm Name Check Is Required", "")
        Loading(false)
        return
      }
    if (deviceTpye.type == "") {
      ShowMessagePopup(false, "Please select device type", "")
      Loading(false)
      return
    }
    if (role == "DR" && process.env.SECRET_KEY) {
      remarksData.status = type
      const enc = CryptoJS.AES.encrypt(
        JSON.stringify(remarksData),
        process.env.SECRET_KEY
      ).toString()
      // if(type === "Approved"){
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "") {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        let certObj: any = {
          id: selectedRequest[`applicantFields`].applicantNumber,
          action: type,
          token: data.token,
          // "authmode":1,
          authmode: parseInt(deviceTpye.type),
          location: data.district,
          name: data.fullName,
          remarks: remarks.value,
        }
        localStorage.setItem("remarksData", enc)
        await CreatecertiOrEsign(certObj)
      }
      // }
    }
  }

  const handleSearch = async () => {
    try {
      const result = await getFirmName(firmDetails.firmName, "", token)
      if (result.status) {
        const firmArray = Array.isArray(result.data) ? result.data : [result.data];
        setDlfFirmdata(firmArray)
        setFirmData(firmArray)
        setOpen(true);
      } else {
        console.error(result.message)
        ShowMessagePopup(false, "Firm Name not matched for this district", "")
      }
    } catch (error) {
      console.error("Error in Axios call:", error)
    }
  }

  const CreatecertiOrEsign = async (data: any) => {
    let resp: any = await UseCreateCertificate(data, data.token)
    if (resp.success == true) {
      setEsignData({ ...resp.data })
      setEsignUrl(resp.data.esignPostUrl)
      setXMLValue(resp.data.eSignRequest)
      resp.data.id = selectedRequest[`applicantFields`].applicantNumber
      resp.data.action = data.action
      localStorage.setItem("EsignData", JSON.stringify(resp.data))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const remarks: any = document.getElementById("remarks")
    const actionTaken: any = document.getElementById("actionTaken")
    let remarksData: any = {
      id: selectedRequest.firmFields.firmId,
      remarks: remarks.value,
    }
    // @Vejan make the changes
    if (role == "DR" && process.env.SECRET_KEY) {
      remarksData.status = actionTaken.value
      const enc = CryptoJS.AES.encrypt(
        JSON.stringify(remarksData),
        process.env.SECRET_KEY
      ).toString()
      if (actionTaken.value == "Approved") {
        let data: any = localStorage.getItem("FASPLoginDetails")
        if (data && data != "") {
          let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
          data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        }
        if (data) {
          getDeptSignature(data.deptUserId, data.token)
            .then((res) => {
              if (res.success && res.data && (!res.data.signature || res.data.signature == "")) {
                ShowMessagePopup(
                  false,
                  "Please upload your signature inside my account => Profile",
                  ""
                )
                return
              } else if (res.success) {
                api
                  .post(
                    "/firms/remarks",
                    { remark: enc },
                    {
                      headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((response: any) => {
                    if (!response || !response.data || !response.data.success) {
                      console.log("error-", response.data.message)
                      console.log(response.data.message)
                      setIsError(true)
                      setErrorMessage(response.data.message)
                      Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: response.data.message,
                        showConfirmButton: false,
                        timer: 1500,
                      })
                    } else {
                      Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text:
                          role == "DR"
                            ? `Application successfully ${actionTaken.value}`
                            : "Application successfully Forwarded",
                        showConfirmButton: false,
                        timer: 1500,
                      })
                      setTimeout(() => {
                        setIsView(false)
                      }, 1500)
                    }
                  })
                  .catch((error: any) => {
                    console.log("error-", error)
                    console.log(error.message)
                    setIsError(true)
                    setErrorMessage(error.message)
                    Swal.fire({
                      icon: "error",
                      title: "Error!",
                      text: error.message,
                      showConfirmButton: false,
                      timer: 1500,
                    })
                  })
              }
            })
            .catch(() => {
              console.log("error")
            })
        }
      } else {
        api
          .post(
            "/firms/remarks",
            { remark: enc },
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response: any) => {
            if (!response || !response.data || !response.data.success) {
              console.log("error-", response.data.message)
              console.log(response.data.message)
              setIsError(true)
              setErrorMessage(response.data.message)
              Swal.fire({
                icon: "error",
                title: "Error!",
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500,
              })
            } else {
              Swal.fire({
                icon: "success",
                title: "Success!",
                text:
                  role == "DR"
                    ? `Application successfully ${actionTaken.value}`
                    : "Application successfully Forwarded",
                showConfirmButton: false,
                timer: 1500,
              })
              setTimeout(() => {
                setIsView(false)
              }, 1500)
            }
          })
          .catch((error: any) => {
            console.log("error-", error)
            console.log(error.message)
            setIsError(true)
            setErrorMessage(error.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: error.message,
              showConfirmButton: false,
              timer: 1500,
            })
          })
      }
    } else if (process.env.SECRET_KEY) {
      const enc = CryptoJS.AES.encrypt(
        JSON.stringify(remarksData),
        process.env.SECRET_KEY
      ).toString()
      api
        .post(
          "/firms/remarks",
          { remark: enc },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response: any) => {
          if (!response || !response.data || !response.data.success) {
            console.log("error-", response.data.message)
            console.log(response.data.message)
            setIsError(true)
            setErrorMessage(response.data.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text:
                role == "DR"
                  ? `Application successfully ${actionTaken.value}`
                  : "Application successfully Forwarded",
              showConfirmButton: false,
              timer: 1500,
            })
            setTimeout(() => {
              setIsView(false)
            }, 1500)
          }
        })
        .catch((error: any) => {
          console.log("error-", error)
          console.log(error.message)
          setIsError(true)
          setErrorMessage(error.message)
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          })
        })
    }
  }

  const sendSms = (e: any) => {
    e.preventDefault()
    const applicantMessage: any = document.getElementById("applicantMessage")
    if (applicantMessage && applicantMessage.value != "" && applicantMessage.value.trim() != "") {
      let smsdata = {
        message: applicantMessage.value.trim(),
      }
      api
        .put("/firms/sendSMS/" + selectedRequest.firmFields.firmId, smsdata, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: any) => {
          if (!response || !response.data || !response.data.success) {
            console.log("error-", response.data.message)
            console.log(response.data.message)
            setIsError(true)
            setErrorMessage(response.data.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            })
          } else {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "SMS Sent Succesfully",
              showConfirmButton: false,
              timer: 1500,
            })
          }
        })
        .catch((error: any) => {
          console.log("error-", error)
          console.log(error.message)
          setIsError(true)
          setErrorMessage(error.message)
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.message,
            showConfirmButton: false,
            timer: 1500,
          })
        })
    }
  }

  return (
    <>
      {!isViewCertificate &&
        !isViewOldCertificate &&
        !isViewHistory &&
        !isPreview &&
        selectedRequest && (
          <>
            <Head>
              <title>Registration of Firms Details</title>
              <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
            </Head>

            <div className="societyRegSec">
              <div className="dataPrevSec">
                <Form className="formsec" onSubmit={handleSubmit}>
                   <div className="maindivContainer">
                    <Row>
                  <Col lg={12} md={12} xs={12}>
                    <div className="d-flex justify-content-between align-items-center page-title mb-3">
                      <div className="pageTitleLeft">
                        <h1>Registration of Firms</h1>
                      </div>

                      <div className="pageTitleRight">
                        <div className="page-header-btns">
                          <a className="btn btn-primary new-user" onClick={() => setIsView(false)}>
                            Go Back
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                    <div className="regofAppBg mb-3">
                      {selectedRequest && selectedRequest[`applicantFields`] && (
                        <div className="firmApplicationSec">
                          {/* <div className="formSectionTitle">
                            <h3>Applicant Details</h3>
                          </div> */}
                            <Card>
                              <Card.Header>Applicant Details</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                  <Row>
                                    <Col lg={2} md={2} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Application Number</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`applicantFields`].applicantNumber}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Name of the Applicant</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`applicantFields`].applicantName}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Email ID</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`contactFields`].emailId}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={2} md={2} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Role</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`applicantFields`].applicantRole}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={2} md={2} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Gender</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`applicantFields`].applicantGender}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>

                                  <Row>
                                    <Col lg={2} md={2} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Mobile No</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`contactFields`].contactMobile}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Address</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`addressFields`].doorNo && (
                                            <span>{selectedRequest[`addressFields`].doorNo} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].street && (
                                            <span>{selectedRequest[`addressFields`].street} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].villageCity && (
                                            <span>{selectedRequest[`addressFields`].villageCity} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].mandal && (
                                            <span>{selectedRequest[`addressFields`].mandal} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].district && (
                                            <span>{selectedRequest[`addressFields`].district} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].state && (
                                            <span>{selectedRequest[`addressFields`].state} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].country && (
                                            <span>{selectedRequest[`addressFields`].country} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].pinCode}
                                        </div>
                                      </div>
                                    </Col>
                                    {/* <Col lg={3} md={3} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Landline Phone No</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactFields`].contactPhone}
                              </div>
                            </div>
                          </Col> */}

                                    {/* <Col lg={2} md={2} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Fax</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactFields`].faxNumber}
                              </div>
                            </div>
                          </Col> */}
                                  </Row>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </div>
                      )}
                    </div>

                    <div className="regofAppBg mb-3">
                      {selectedRequest && selectedRequest[`firmFields`] && (
                        <div className="firmApplicationSec">               
                            <Card>
                              <Card.Header>Firm Details</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                  <Row>
                                    <Col lg={3} md={4} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Firm Name</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`firmFields`].firmName}
                                        </div>
                                      </div>
                                    </Col>
                                    <Col lg={3} md={4} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Firm Duration </label>
                                        {!selectedRequest[`firmFields`].atWill ? (
                                          <div className="valuePrev">
                                            {selectedRequest[`firmFields`].firmDurationFrom} To{" "}
                                            {selectedRequest[`firmFields`].firmDurationTo}
                                          </div>
                                        ) : (
                                          <div className="valuePrev">At Will</div>
                                        )}
                                      </div>
                                    </Col>

                                    <Col lg={3} md={4} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Industry Type</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`firmFields`].industryType}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={3} md={4} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Business Type</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`firmFields`].businessType}
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={2} md={2} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Mobile No</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`contactFields`].contactMobile}
                                        </div>
                                      </div>
                                    </Col>

                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <div className="form-group">
                                        <label className="form-label">Address</label>
                                        <div className="valuePrev">
                                          {selectedRequest[`addressFields`].doorNo && (
                                            <span>{selectedRequest[`addressFields`].doorNo} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].street && (
                                            <span>{selectedRequest[`addressFields`].street} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].villageCity && (
                                            <span>{selectedRequest[`addressFields`].villageCity} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].mandal && (
                                            <span>{selectedRequest[`addressFields`].mandal} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].district && (
                                            <span>{selectedRequest[`addressFields`].district} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].state && (
                                            <span>{selectedRequest[`addressFields`].state} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].country && (
                                            <span>{selectedRequest[`addressFields`].country} / </span>
                                          )}
                                          {selectedRequest[`addressFields`].pinCode}
                                        </div>
                                      </div>
                                    </Col>
                                    {/* <Col lg={3} md={3} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Landline Phone No</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactFields`].contactPhone}
                              </div>
                            </div>
                          </Col> */}

                                    {/* <Col lg={2} md={2} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Fax</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactFields`].faxNumber}
                              </div>
                            </div>
                          </Col> */}
                                  </Row>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                        </div>
                      )}

                      {selectedRequest &&
                        selectedRequest[`principalPlaceBusiness`] &&
                        selectedRequest[`principalPlaceBusiness`].length > 0 ? (
                        <div className="firmApplicationSec">

                          <div className="mb-3 mt-3">
                            <Card>
                              <Card.Header>Principal Place of Business</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                  {selectedRequest[`principalPlaceBusiness`].map((item: any, i: number) => {
                                    return (
                                      <Row className="otherDetailsList" key={i + 1}>
                                        <Col lg={2} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">Door No</label>
                                            <div className="valuePrev">{item.doorNo}</div>
                                          </div>
                                        </Col>
                                        <Col lg={3} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">Street</label>
                                            <div className="valuePrev">{item.street}</div>
                                          </div>
                                        </Col>
                                        <Col lg={2} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">District</label>
                                            <div className="valuePrev">{item.district}</div>
                                          </div>
                                        </Col>
                                        <Col lg={2} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">Mandal</label>
                                            <div className="valuePrev">{item.mandal}</div>
                                          </div>
                                        </Col>
                                        <Col lg={2} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">Village/City</label>
                                            <div className="valuePrev">{item.villageOrCity}</div>
                                          </div>
                                        </Col>
                                        <Col lg={1} md={4} xs={12} className="mb-3">
                                          <div className="form-group">
                                            <label className="form-label">PIN Code</label>
                                            <div className="valuePrev">{item.pinCode}</div>
                                          </div>
                                        </Col>
                                      </Row>
                                    )
                                  })}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      ) : (
                        <p>No Principal Place of Business Found</p>
                      )}
                      <div className="regFormBorder"></div>
                      {selectedRequest &&
                        selectedRequest[`otherPlaceBusiness`] &&
                        selectedRequest[`otherPlaceBusiness`].length > 0 ? (
                        <div className="firmApplicationSec">
                          <div className="formSectionTitle">
                            <h3>Other Place of Business</h3>
                          </div>
                          {selectedRequest[`otherPlaceBusiness`].map((item: any, i: number) => {
                            return (
                              <>
                                <Row key={i + 1}>
                                  <Col lg={2} md={4} xs={12}>
                                    <div className="formSectionTitle">
                                      <h3>Business {i + 1}</h3>
                                    </div>
                                  </Col>
                                </Row>
                                <Row className="otherDetailsList" key={i + 1}>
                                  <Col lg={2} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">Door No</label>
                                      <div className="valuePrev">{item.doorNo}</div>
                                    </div>
                                  </Col>
                                  <Col lg={3} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">Street</label>
                                      <div className="valuePrev">{item.street}</div>
                                    </div>
                                  </Col>
                                  <Col lg={2} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">District</label>
                                      <div className="valuePrev">{item.district}</div>
                                    </div>
                                  </Col>
                                  <Col lg={2} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">Mandal</label>
                                      <div className="valuePrev">{item.mandal}</div>
                                    </div>
                                  </Col>
                                  <Col lg={2} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">Village/City</label>
                                      <div className="valuePrev">{item.villageOrCity}</div>
                                    </div>
                                  </Col>
                                  <Col lg={1} md={4} xs={12} className="mb-3">
                                    <div className="form-group">
                                      <label className="form-label">PIN Code</label>
                                      <div className="valuePrev">{item.pinCode}</div>
                                    </div>
                                  </Col>
                                </Row>
                              </>
                            )
                          })}
                        </div>
                      ) : (
                        <p>No Other Place of Business Found</p>
                      )}
                    </div>

                    <div className="firmPartnerSec mb-3">
                      <div className="formSectionTitle mb-3">
                        <h3></h3>
                      </div>

                      <div className="regofAppBg mb-3">
                        <div className="pb-2">
                          <Card>
                            <Card.Header>Partner Details</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                <Row>
                                  <Col lg={12} md={12} xs={12}>
                                    <Table striped bordered className="tableData listData">
                                      <thead>
                                        <tr>
                                          <th className="siNo text-center">SI No</th>
                                          <th>Partner Name</th>
                                          <th>Relation</th>
                                          <th>Age</th>
                                          <th>Joining Date</th>
                                          <th>Share</th>
                                        </tr>
                                      </thead>

                                      {selectedRequest &&
                                        selectedRequest[`firmPartners`] &&
                                        selectedRequest[`firmPartners`].length > 0 ? (
                                        <tbody>
                                          {selectedRequest[`firmPartners`].map((item: any, i: number) => {
                                            return (
                                              <tr key={i + 1}>
                                                <td className="siNo text-center">{i + 1}</td>
                                                <td>{item.partnerName}</td>
                                                <td>
                                                  {item.relationType} {item.relation}
                                                </td>
                                                <td>{item.age}</td>
                                                <td>
                                                  {item.joiningDate
                                                    ? DateFormator(item.joiningDate, "dd/mm/yyyy")
                                                    : ""}
                                                </td>
                                                <td>{item.share}</td>
                                              </tr>
                                            )
                                          })}
                                        </tbody>
                                      ) : (
                                        <tbody>
                                          <tr>
                                            <td colSpan={6}>No Members Found</td>
                                          </tr>
                                        </tbody>
                                      )}
                                    </Table>
                                  </Col>
                                </Row>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </div>

                    <div className="firmApplicationSec mb-3">
                      <div className="regofAppBg mb-3">
                        <div className="pb-2">
                          <Card>
                            <Card.Header>Documents Attached</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                <Row>
                                  <Col lg={12} md={12} xs={12}>
                                    <ul>
                                      {selectedRequest &&
                                        selectedRequest?.documentAttached &&
                                        selectedRequest?.documentAttached?.map(
                                          (document: any, index: number) => {
                                            return (
                                              <li key={index + 1}>
                                                <span
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                    filedownload(document?.originalname)
                                                  }}
                                                >
                                                  {document?.originalname}
                                                </span>
                                              </li>
                                            )
                                          }
                                        )}
                                    </ul>
                                  </Col>
                                </Row>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    </div>
                     {(role === "DR" || role === "DLF") ? (
                     <div className="regofAppBg mb-3">
                      <Row className="mb-3">
                        <Col lg={3} md={3} xs={12}>
                          <TableText
                            label="Firm Name"
                            required={true}
                          />
                          <TableInputText
                            type="text"
                            placeholder="Firm Name"
                            required={true}
                            capital={false}
                            name="firmName"
                            value={firmDetails.firmName}
                            onChange={(e) => setFirmDetails({ 
                              ...firmDetails, 
                              firmName: e.target.value 
                            })}
                          />
                        </Col>                        
                        <Col lg={6} md={6} xs={12} className="mt-4 d-flex align-items-center gap-3">
                          <button
                            type="button"
                            className="btn btn-primary"
                            name="btn2"
                            value="Save"
                            onClick={handleSearch}
                          >
                            SEARCH
                          </button>
                          <div className="d-flex align-items-center">
                            <TableText label="" required={true} />
                            <input
                              type="checkbox"
                              className="ms-2"
                              name="check"
                              checked={isChecked}
                              required={true}
                              onChange={(e) => setIsChecked(e.target.checked)}
                            />
                            <span
                              style={{
                                fontFamily: "Montserrat",
                                fontWeight: 600,
                                color: "black",
                                fontSize: "15px",
                                marginLeft: "10px",
                              }}
                            >
                              Is Firm Name Checked
                            </span>
                          </div>
                        </Col>
                      </Row>
                      </div>):(
                        <Container/>
                      )}
                    {userType != "user" && (
                      <div className="firmPartnerSec tableSec mb-3">

                        <div className="regofAppBg mb-3 mt-5">
                          <div className="mt-3 pt-3">
                            <Card>
                              <Card.Header>Processing History</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                  <Row>
                                    <Col lg={12} md={12} xs={12}>
                                      <Table striped bordered className="tableData listData">
                                        <thead>
                                          <tr>
                                            <th className="siNo text-center">SI No</th>
                                            <th>Designation</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                            <th>Application taken Date</th>
                                            <th>Application Processed Date</th>
                                          </tr>
                                        </thead>

                                        {selectedRequest &&
                                          selectedRequest[`processingHistory`] &&
                                          selectedRequest[`processingHistory`].length > 0 ? (
                                          <tbody>
                                            {selectedRequest[`processingHistory`].map(
                                              (item: any, i: number) => {
                                                return (
                                                  <tr key={i + 1}>
                                                    <td className="siNo text-center">{i + 1}</td>
                                                    <td>{item.designation}</td>
                                                    <td>{item.status}</td>
                                                    <td>{item.remarks}</td>
                                                    <td>
                                                      {item.applicationTakenDate
                                                        ? DateFormator(
                                                          item.applicationTakenDate,
                                                          "dd/mm/yyyy"
                                                        )
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {item.applicationProcessedDate
                                                        ? DateFormator(
                                                          item.applicationProcessedDate,
                                                          "dd/mm/yyyy"
                                                        )
                                                        : ""}
                                                    </td>
                                                  </tr>
                                                )
                                              }
                                            )}
                                          </tbody>
                                        ) : (
                                          <tbody>
                                            <tr>
                                              <td colSpan={6}>No Data Found</td>
                                            </tr>
                                          </tbody>
                                        )}
                                      </Table>
                                    </Col>
                                  </Row>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {userType != "user" && (
                    <div className="firmPartnerSec tableSec mb-3">
                      <div className="formSectionTitle">
                        <h3>Applicant Message History</h3>
                      </div>
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <Table striped bordered className="tableData listData">
                            <thead>
                              <tr>
                                <th className="siNo text-center">SI No</th>
                                <th>Number</th>
                                <th>Message</th>
                                <th>Sent Date</th>
                              </tr>
                            </thead>

                            {selectedRequest[`messageToApplicant`].length > 0 ? (
                              <tbody>
                                {selectedRequest[`messageToApplicant`].map((item: any, i: number) => {
                                  return (
                                    <tr key={i + 1}>
                                      <td className="siNo text-center">{i + 1}</td>
                                      <td>{item.number}</td>
                                      <td>{item.message}</td>
                                      <td>{item.sentDate}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan={6}>No Data Found</td>
                                </tr>
                              </tbody>
                            )}
                          </Table>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {userType == "dept" &&
                    selectedRequest.applicantFields.status != "Rejected" &&
                    selectedRequest.applicantFields.status != "Approved" &&
                    (role == "DR" ||
                      (role != "DR" && selectedRequest.applicantFields.status != "Forwarded")) && (
                      <div className="uploadFirmList mb-4">
                        <Row>
                          <Col lg={12} md={12} xs={12}>
                            <h3>Message to Applicant</h3>
                          </Col>
                        </Row>
                        <div className="regofAppBg">
                          <Row className="align-items-center applicantMessage">
                            <Col lg={3} md={4} xs={12} className="mb-2">
                              <label className="form-label">
                                Message to Applicant <span>*</span>
                              </label>
                              <p>
                                (Please use this option to inform applicant in case of any
                                clarification required for your office)
                              </p>
                            </Col>
                            <Col lg={5} md={4} xs={12} className="mb-3">
                              <textarea
                                className="form-control textarea"
                                name="applicantMessage"
                                id="applicantMessage"
                              // required
                              ></textarea>
                            </Col>
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <Button variant="primary" onClick={sendSms}>
                                Send SMS
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    )
                  } */}

                  {userType == "dept" &&
                    <div className="regofAppBg mb-3">
                        <Card>
                          <Card.Header>Officer Recommendations</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              {userType == "dept" &&
                                selectedRequest.applicantFields.status != "Rejected" &&
                                selectedRequest.applicantFields.status != "Approved" &&
                                (role == "DR" ||
                                  (role != "DR" &&
                                    selectedRequest.applicantFields.status != "Forwarded")) && (
                                  <div className="uploadFirmList mb-4">

                                    <div className="regofAppBg">
                                      {/* @Vejan  show dropdown only to role DRI*/}
                                      {userType == "dept" &&
                                        role != "DR" &&
                                        selectedRequest.applicantFields.status != "Forwarded" &&
                                        selectedRequest.applicantFields.status != "Approved" &&
                                        !isTransVerified && (
                                          <Row>
                                            <Col lg={12} md={12} xs={12} className="text-center mb-3">
                                              <Button
                                                variant="primary"
                                                onClick={() => {
                                                  verifyTransacDetails()
                                                }}
                                              >
                                                Verify Transaction
                                              </Button>
                                            </Col>
                                          </Row>
                                        )}
                                      {userType == "dept" &&
                                        role == "DR" &&
                                        selectedRequest.applicantFields.status != "Approved" &&
                                        !isTransDefaced && (
                                          <Row>
                                            <Col lg={12} md={12} xs={12} className="text-center mb-3">
                                              <Button
                                                variant="primary"
                                                onClick={() => defaceTransacDetails()}
                                              >
                                                Deface Transaction
                                              </Button>
                                            </Col>
                                          </Row>
                                        )}

                                      {userType == "dept" &&
                                        selectedRequest.applicantFields.status != "Rejected" &&
                                        selectedRequest.applicantFields.status != "Approved" &&
                                        ((role == "DR" && isTransDefaced) ||
                                          (role != "DR" &&
                                            isTransVerified &&
                                            selectedRequest.applicantFields.status != "Forwarded")) && (
                                          <Row className="align-items-center">
                                            <Col lg={3} md={4} xs={12} className="mb-2">
                                              <label className="form-label">
                                                Remarks <span>*</span>
                                              </label>
                                            </Col>
                                            <Col lg={5} md={4} xs={12} className="mb-3">
                                              <textarea
                                                className="form-control textarea"
                                                name="remarks"
                                                style={{ textTransform: "uppercase" }}
                                                id="remarks"
                                                required
                                              ></textarea>
                                            </Col>
                                          </Row>
                                        )}
                                      {isTransDefaced &&
                                        role == "DR" &&
                                        selectedRequest.applicantFields.status != "Approved" &&
                                        selectedRequest.applicantFields.status == "Forwarded" &&
                                        selectedRequest.applicantFields.status != "Rejected" && (
                                          <>
                                            {" "}
                                            <Row>
                                              <Col lg={3} md={3} xs={12}>
                                                <TableText label="Device Type" required={true} />
                                              </Col>
                                              <Col lg={3} md={3} xs={12}>
                                                <div className="firmRegList formsec">
                                                  <Form.Check
                                                    inline
                                                    label="Biometric"
                                                    value="2"
                                                    name="type"
                                                    type="radio"
                                                    className="fom-checkbox"
                                                    onChange={DeviceOptionChange}
                                                    checked={deviceTpye.type == 2}
                                                  />
                                                  <Form.Check
                                                    inline
                                                    label="IRIS"
                                                    value="3"
                                                    name="type"
                                                    type="radio"
                                                    className="fom-checkbox"
                                                    onChange={DeviceOptionChange}
                                                    checked={deviceTpye.type == 3}
                                                  />
                                                </div>
                                              </Col>
                                            </Row>
                                            <Row className="align-items-center">
                                              <Col lg={3} md={4} xs={12} className="mb-2">
                                                <label className="form-label">
                                                  Action Taken <span>*</span>
                                                </label>
                                              </Col>
                                              <Col lg={6} md={4} xs={12}>
                                                <div className="actionTakenInfo jusify-content-center">
                                                  {/* <select
                                    className="form-control"
                                    name="actionTaken"
                                    id="actionTaken"
                                    style={{ textTransform: 'uppercase' }}
                                    required
                                  >
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                  </select> */}
                                                  <span id="actionTaken">
                                                    <Button
                                                      variant="primary"
                                                      className="accpBtn"
                                                      onClick={() => onApprovedOrRejected("Approved")}
                                                    >
                                                      Approved
                                                    </Button>
                                                    <Button
                                                      variant="danger"
                                                      className="accpBtn"
                                                      onClick={() => onApprovedOrRejected("Rejected")}
                                                    >
                                                      Refused
                                                    </Button>
                                                  </span>
                                                </div>
                                              </Col>
                                              <Col lg={3} md={4} xs={12}></Col>
                                            </Row>
                                          </>
                                        )}
                                    </div>
                                  </div>
                                )}
                              {userType == "dept" && (
                                <Row>
                                  <Col lg={12} md={12} xs={12}>
                                    <div className="d-flex justify-content-center text-center">
                                      <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => setIsPreview(true)}
                                      >
                                        Application Form Preview
                                      </Button>

                                      {(selectedRequest.applicantFields.status == "Rejected" ||
                                        selectedRequest.applicantFields.status == "Approved") && (
                                          <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={async () => {
                                              const pdfUrl = `${process.env.BACKEND_STATIC_FILES}/files/firms/${selectedRequest?.applicantFields?.applicantNumber}/signed${selectedRequest?.applicantFields?.status}FirmsDocument.pdf`
                                              const response = await fetch(pdfUrl)
                                              const blob = await response.blob()
                                              const url = URL.createObjectURL(blob)
                                              window.open(url, "_blank")
                                            }}
                                          >
                                            View Certificate
                                          </Button>
                                        )}
                                      {selectedRequest.historyDetails?.length > 0 && (
                                        <Button
                                          variant="primary"
                                          className="me-2"
                                          onClick={() => setViewHistory(true)}
                                        >
                                          View History
                                        </Button>
                                      )}
                                      {selectedRequest.applicantFields.status != "Rejected" &&
                                        selectedRequest.applicantFields.status != "Approved" &&
                                        selectedRequest.applicantFields.status != "Forwarded" &&
                                        isTransVerified &&
                                        role != "DR" && (
                                          <Button variant="primary" type="submit" onClick={handleForwardClick}>
                                            Forward
                                          </Button>
                                        )}
                                      {/* {selectedRequest.applicantFields.status != "Rejected" &&
                            selectedRequest.applicantFields.status == "Forwarded" &&
                            selectedRequest.applicantFields.status != "Approved" &&
                            role == "DR" &&
                            isTransDefaced && (
                              <Button variant="primary" type="submit">
                                Submit
                              </Button>
                            )} */}
                                    </div>
                                  </Col>
                                </Row>
                              )}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                    </div>}
               </div>
                </Form>
              </div>
            </div>
          </>
        )}

      {/* {isViewCertificate && (
        <PdfViewerCertificate type={selectedRequest.applicantFields.status} esignStatusData={certData} />
      )} */}
      {isViewHistory && selectedRequest.historyDetails?.length && (
        <ViewHistory
          reqsearchdata={reqsearchdata}
          selectedRequest={
            selectedRequest.historyDetails[selectedRequest.historyDetails.length - 1]
          }
          setReqSearchData={setReqSearchData}
          setIsView={setIsView}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
          appId={selectedRequest.firmFields.firmId}
          setViewHistory={setViewHistory}
        />
      )}
      {isPreview && (
        <PreviewFirm
          appId={selectedRequest.firmFields.firmId}
          formType={formType}
          setIsPreview={setIsPreview}
        />
      )}
      {esignData && (
        <form id="URL" name="URL" method="POST" encType="multipart/formdata" action={`${esignUrl}`}>
          <input type="Submit" value="Submit" id={"xmlInput"} style={{ visibility: "hidden" }} />
          <input type="hidden" name="msg" value={xmlValue} />
        </form>
      )}
      <FirmDialog  open={open}  onClose={() => setOpen(false)}  data={dlfFirmdata} />
    </>
  )
}

export default ViewDetails