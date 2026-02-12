import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Container, Col, Row, Table, Form } from "react-bootstrap"
import api from "@/pages/api/api"
import Swal from "sweetalert2"
import { DefaceTransactionDetails, getFirmDetails, VerifyTransactionDetails } from "@/axios"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { PopupAction } from "@/redux/commonSlice"
import { get } from "lodash"
import { DateFormator, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import CryptoJS from "crypto-js"

interface ViewHistoryProps {
  reqsearchdata: any
  selectedRequest: any
  setReqSearchData: any
  setIsView: any
  setIsError: any
  setErrorMessage: any
  appId: any
  setViewHistory: any
}

const ViewHistory = ({
  reqsearchdata,
  selectedRequest,
  setReqSearchData,
  setIsView,
  setIsError,
  setErrorMessage,
  appId,
  setViewHistory,
}: ViewHistoryProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [firmPartners, setFirmPartners] = useState<any>([])
  const [firmProcessing, setFirmProcessing] = useState<any>([])
  const [isTransVerified, SetIsTransVerified] = useState<boolean>(false)
  const [isTransDefaced, setIsTransDefaced] = useState<boolean>(false)
  const [transactionDetails, setTransactionDetails] = useState<any>({})
  const [userType, setUserType] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [token, setToken] = useState<string>("")
  const [isViewCertificate, setIsViewCertificate] = useState<boolean>(false)
  const [existingSocietyDetails, setExistingSocietyDetails] = useState<any>({})
  const [locData, setLocData] = useState<any>({})

  const loadDocs = async () => {
    if (selectedRequest?.documentAttached && selectedRequest?.documentAttached?.length > 0) {
      selectedRequest?.documentAttached.forEach(async (document: any, index: number) => {
        await docLink(document?.originalname, index, document?.path)
      })
    }
  }

  useEffect(() => {
    loadDocs()
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
    }
    setUserType(data.userType)
    setRole(data.role)
    setToken(data.token)
    getFirmDetails(appId, data.token).then((response: any) => {
      setExistingSocietyDetails(response.data.firm)
    })
    // const processingData = [
    //   {
    //     designation: `DLF-AS-GUN-ADMIN`,
    //     status: `Forwarded BY DLS`,
    //     remarks: `Madam, I Verified Found Correct and Submitted for Approval`,
    //     attachments: `N/A`,
    //     applicationTakenDate: `04/02/2023 10:41:06`,
    //     applicationProcessedDate: `04/02/2023 10:41:06`,
    //   },
    // ]
    // setFirmProcessing(processingData)
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  const ShowAlert = (type: boolean, message: string) => {
    dispatch(PopupAction({ enable: true, type: type, message: message }))
  }

  const verifyTransacDetails = async () => {
    let result: any = await VerifyTransactionDetails({
      deptTransactionID: btoa(transactionDetails.departmentTransID),
    })
    if (result.status && result.status === "Success") {
      ShowAlert(true, "Tansaction details are verified Successfully")
      SetIsTransVerified(true)
    } else {
      ShowAlert(false, get(result, "message", "Tansaction details verification Failed"))
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
              title: "Succes!",
              text: "Succesfully Defaced",
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
      ShowAlert(false, get(result, "message", "Tansaction deface Failed"))
    }
  }

  const docLink = async (name: any, index: number, path: any) => {
    let url: any = ""
    url = `/downloads/${selectedRequest.firmFields.firmId}/${name}`
    if (path.split("/")[2] == 0) {
      url = `/downloads/${path.split("/")[2]}/${name}`
    }
    const res: any = await api.get(url, { responseType: "arraybuffer" })
    const urls: any = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }))
    var link: any = document.getElementById(`docFile${index}`)
    if (link) {
      link.href = urls
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const remarks: any = document.getElementById("remarks")
    const actionTaken: any = document.getElementById("actionTaken")
    let remarksData: any = {
      remarks: remarks.value,
    }
    // @Vejan make the changes
    if (role == "DR") {
      remarksData.status = actionTaken.value
    }

    api
      .put("/firms/remarks/" + selectedRequest.societyFields.societyId, remarksData, {
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
            title: "Succes!",
            text: "Succesfully Added Remarks",
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

  const sendSms = (e: any) => {
    e.preventDefault()
    const applicantMessage: any = document.getElementById("applicantMessage")
    let smsdata = {
      message: applicantMessage.value,
    }
    api
      .put("/firms/sendSMS/" + selectedRequest.societyFields.societyId, smsdata, {
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
            title: "Succes!",
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

  return (
    <>
      {!isViewCertificate && selectedRequest && (
        <>
          <Head>
            <title>Registration of Firms Details</title>
            <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
          </Head>

          {locData?.userType != "user" && (
            <div className="societyRegSec">
              <Container>
                <Row>
                  <Col lg={12} md={12} xs={12}>
                    <div className="d-flex justify-content-between align-items-center page-title mb-3">
                      <div className="pageTitleLeft">
                        <h1>Registration of Firms</h1>
                      </div>

                      <div className="pageTitleRight">
                        <div className="page-header-btns">
                          <a
                            className="btn btn-primary new-user"
                            onClick={() => setViewHistory(false)}
                          >
                            Go Back
                          </a>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>

              <div className="dataPrevSec">
                <Form className="formsec" onSubmit={handleSubmit}>
                  <Container>
                    <div className="regofAppBg mb-3">
                      {selectedRequest && selectedRequest[`applicantDetails`] && (
                        <div className="firmApplicationSec">
                          <div className="formSectionTitle">
                            <h3>Applicant Details</h3>
                          </div>

                          <Row>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Application Number</label>
                                <div className="valuePrev">{selectedRequest.applicationNumber}</div>
                              </div>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Name of the Applicant</label>
                                <div className="valuePrev">
                                  {selectedRequest[`applicantDetails`].name}
                                </div>
                              </div>
                            </Col>

                            <Col lg={2} md={2} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Gender</label>
                                <div className="valuePrev">
                                  {selectedRequest[`applicantDetails`].gender}
                                </div>
                              </div>
                            </Col>

                            <Col lg={2} md={2} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Role</label>
                                <div className="valuePrev">
                                  {selectedRequest[`applicantDetails`].role}
                                </div>
                              </div>
                            </Col>

                            <Col lg={2} md={4} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Email ID</label>
                                <div className="valuePrev">
                                  {selectedRequest[`contactDetails`].email}
                                </div>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Address</label>
                                <div className="valuePrev">
                                  {selectedRequest[`applicantDetails`].doorNo && (
                                    <span>{selectedRequest[`applicantDetails`].doorNo} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].street && (
                                    <span>{selectedRequest[`applicantDetails`].street} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].villageCity && (
                                    <span>
                                      {selectedRequest[`applicantDetails`].villageCity} /{" "}
                                    </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].mandal && (
                                    <span>{selectedRequest[`applicantDetails`].mandal} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].district && (
                                    <span>{selectedRequest[`applicantDetails`].district} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].state && (
                                    <span>{selectedRequest[`applicantDetails`].state} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].country && (
                                    <span>{selectedRequest[`applicantDetails`].country} / </span>
                                  )}
                                  {selectedRequest[`applicantDetails`].pinCode}
                                </div>
                              </div>
                            </Col>
                            {/* <Col lg={3} md={3} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Landline Phone No</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactDetails`].contactPhone}
                              </div>
                            </div>
                          </Col> */}

                            <Col lg={2} md={2} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Mobile No</label>
                                <div className="valuePrev">
                                  {selectedRequest[`contactDetails`].mobileNumber}
                                </div>
                              </div>
                            </Col>

                            {/* <Col lg={2} md={2} xs={12} className="mb-3">
                            <div className="form-group">
                              <label className="form-label">Fax</label>
                              <div className="valuePrev">
                                {selectedRequest[`contactDetails`].faxNumber}
                              </div>
                            </div>
                          </Col> */}
                          </Row>
                        </div>
                      )}
                    </div>

                    <div className="regofAppBg mb-3">
                      {selectedRequest && (
                        <div className="firmApplicationSec">
                          <div className="formSectionTitle">
                            <h3>Firm Details</h3>
                          </div>

                          <Row>
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Firm Name</label>
                                <div className="valuePrev">{selectedRequest.firmName}</div>
                              </div>
                            </Col>
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Firm Duration </label>
                                {!selectedRequest.atWill ? (
                                  <div className="valuePrev">
                                    {selectedRequest.firmDurationFrom} To{" "}
                                    {selectedRequest.firmDurationTo}
                                  </div>
                                ) : (
                                  <div className="valuePrev">At Will</div>
                                )}
                              </div>
                            </Col>

                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Industry Type</label>
                                <div className="valuePrev">{selectedRequest.industryType}</div>
                              </div>
                            </Col>

                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <div className="form-group">
                                <label className="form-label">Business Type</label>
                                <div className="valuePrev">{selectedRequest.bussinessType}</div>
                              </div>
                            </Col>
                          </Row>
                          <div className="regFormBorder"></div>
                        </div>
                      )}

                      {selectedRequest[`principalPlaceBusiness`] &&
                      selectedRequest[`principalPlaceBusiness`].length > 0 ? (
                        <div className="firmApplicationSec">
                          <div className="formSectionTitle">
                            <h3>Principal Place of Business</h3>
                          </div>

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
                        </div>
                      ) : (
                        <p>No Principal Place of Business Found</p>
                      )}

                      {selectedRequest[`otherPlaceBusiness`] &&
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
                        <h3>Partner Details</h3>
                      </div>
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
                              </tr>
                            </thead>

                            {selectedRequest[`firmPartners`] &&
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
                    </div>

                    <div className="firmApplicationSec mb-3">
                      <div className="formSectionTitle mb-3">
                        <h3>Documents Attached</h3>
                      </div>

                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <ul>
                            {selectedRequest?.documentAttached?.map(
                              (document: any, index: number) => {
                                return (
                                  <li key={index + 1}>
                                    <a id={`docFile${index}`} target="_blank">
                                      {document?.originalname}
                                    </a>
                                  </li>
                                )
                              }
                            )}
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    {userType != "user" && (
                      <div className="firmPartnerSec tableSec mb-3">
                        <div className="formSectionTitle">
                          <h3>Processing History</h3>
                        </div>
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

                              {selectedRequest[`processingHistory`] &&
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
                                                                            <td>{DateFormator(item.sentDate, "dd/mm/yyyy")}</td>
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
                                    )} */}
                  </Container>
                </Form>
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
      )}
    </>
  )
}

export default ViewHistory
