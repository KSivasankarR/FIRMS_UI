import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Col, Row, Table } from "react-bootstrap"
import ViewDetails from "./viewDetails"
// import JsBarcode from "jsbarcode"
import { getDeptSignature } from "@/axios"
import { DateFormator } from "@/GenericFunctions"
import CryptoJS from "crypto-js"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"

interface RegistrationOfFirmsCertificateProps {
  reqsearchdata: any
  selectedRequest: any
  setReqSearchData: any
  setIsView: any
  setIsError: any
  setErrorMessage: any
}

const RegistrationofFirmsCertificate = ({
  reqsearchdata,
  selectedRequest,
  setReqSearchData,
  setIsView,
  setIsError,
  setErrorMessage,
}: RegistrationOfFirmsCertificateProps) => {
  const [isGoBack, setIsGoBack] = useState<boolean>(false)
  const [signature, setSignature] = useState<string>("")
  const current = new Date()
  //const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`
  const [date, setDate] = useState<any>()

  const [firmPartners, setFirmPartners] = useState<any>([])
  const [fullName, setFullName] = useState<string>("")
  const [locData, setLocData] = useState<any>({})

  useEffect(() => {
    const partnerData = [
      {
        partnerName: `Sivaiah`,
        partnerSurname: `Chirumamilla`,
        age: `64`,
        joiningDate: `16/11/2022`,
        partnerAddress: `4-5-29/134, 2nd Lane, Vidyanagar/Ring Road Vidyanagar Park/Guntur/Guntru West/Guntur/Andhra Pradesh/India/522007`,
      },
      {
        partnerName: `Chenchu Kumari`,
        partnerSurname: `Chirumamilla`,
        age: `32`,
        joiningDate: `16/11/2022`,
        partnerAddress: `4-5-29/134, 2nd Lane, Vidyanagar/Ring Road Vidyanagar Park/Guntur/Guntru West/Guntur/Andhra Pradesh/India/522007`,
      },
      {
        partnerName: `Mastan Rao`,
        partnerSurname: `Chirumamilla`,
        age: `65`,
        joiningDate: `16/11/2022`,
        partnerAddress: `4-5-29/134, 2nd Lane, Vidyanagar/Ring Road Vidyanagar Park/Guntur/Guntru West/Guntur/Andhra Pradesh/India/522007`,
      },
    ]
    setFirmPartners(partnerData)
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    const date =
      selectedRequest.processingHistory &&
      selectedRequest.processingHistory?.find((x: any) => x.status == "Approved")
    if (date && date.applicationProcessedDate) {
      setDate(DateFormator(date.applicationProcessedDate, "dd/mm/yyyy"))
    }
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
    }
    if (data) {
      getDeptSignature(selectedRequest[`firmFields`].deptId, data.token)
        .then((res: any) => {
          if (res.success && res.data) {
            setSignature("data:image/jpg;base64, " + res.data.signature)
            setFullName(res.data.fullName)
          }
        })
        .catch(() => {
          console.log("error")
        })
    }
    document.body.classList.add("viewCertificatePage")
    // if (selectedRequest && selectedRequest[`applicantFields`]) {
    //   JsBarcode("#barcode", selectedRequest[`applicantFields`].applicantNumber, {
    //     displayValue: false,
    //   })
    // }
    return () => {
      document.body.classList.remove(
        "viewCertificate",
        "bg-salmon",
        "viewCerticate",
        "viewCerticatePage"
      )
    }
  }, [])

  const handleBack = () => {
    setIsGoBack(true)
    document.body.classList.remove("viewCertificatePage")
  }

  return (
    <>
      {!isGoBack && selectedRequest && (
        <>
          <Head>
            <title>Acknowledgement of Registration of Firm</title>
            <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
          </Head>
          {locData?.userType != "user" && (
            <div className="societyRegSec viewCerticateSec">
              <Container>
                <div className="certificateHeader">
                  <div className="certificateHeaderLogo">
                    <img
                      src="/firmsHome/assets/Andhra_Pradesh_Official_Logo.jpg"
                      alt="Andhra_Pradesh_Official_Logo.jpg"
                      title=""
                    />
                  </div>
                  <h1>
                    GOVERNMENT OF ANDHRA PRADESH REGISTRATION AND STAMPS DEPARTMENT THE REGISTRAR OF
                    FIRMS
                  </h1>
                  <h5>Acknowledgement of Registration of Firm</h5>
                </div>

                <div className="certificateReg">
                  <Row className="d-flex justify-content-between align-items-center">
                    <Col md={{ span: 6, offset: 2 }}></Col>
                    <Col lg={4} md={4} xs={12}>
                      <div className="certificateInfo">
                        <h6>Application No </h6>
                        <img id="barcode" />
                        {selectedRequest && selectedRequest[`applicantFields`] && (
                          <h5>{selectedRequest[`applicantFields`].applicantNumber}</h5>
                        )}
                        <h6>Date: {date}</h6>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="certificateHereInfo">
                  <p>
                    The Registrar of Firms, hereby acknowledges the receipt of the statement
                    prescribed by section 58(1) of the Indian Partnership Act. 1932.
                  </p>
                  <p>
                    The statement has been filed and the name of the firm, has been entered in the
                    Register of Firms as No. No:{" "}
                    {selectedRequest && selectedRequest[`firmFields`].registrationNumber} of{" "}
                    {selectedRequest && selectedRequest[`firmFields`].registrationYear} at
                    Registration District{" "}
                    {selectedRequest && selectedRequest[`firmFields`].district}
                  </p>
                </div>

                <div className="certifyLogoSec">
                  <Row className="d-flex justify-content-between align-items-center">
                    <Col lg={6} md={6} xs={12}>
                      <div className="certifyLogoInfo text-center">
                        <div className="certifyLogoImgSec">
                          <img src="/firmsHome/assets/seal_firm.png" alt="seal_firm.png" />
                          <h6>{selectedRequest && selectedRequest[`firmFields`].district}</h6>
                        </div>
                        <h6>Date: {date}</h6>
                      </div>
                    </Col>

                    <Col lg={6} md={6} xs={12}>
                      <div className="certifySignInfo">
                        <h6>Certified By</h6>
                        <div className="certifySignImg">
                          <img src={signature} alt="signImg.png" />
                        </div>
                        <h6>Name: {fullName}</h6>
                        <h6>Designation: DISTRICT REGISTRAR</h6>
                        <h6>
                          District: : {selectedRequest && selectedRequest[`firmFields`].district}
                        </h6>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="certifyTopTitle text-center">
                  <h2>FORM-A</h2>
                  <h2>SEE RULE - 5</h2>
                </div>

                <div className="certifyMaintainSec text-center">
                  <h3>(Maintained Under Section 59 of the Indian Partnership Act, 1932)</h3>
                </div>

                <Table striped bordered className="certifiyTable">
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Serial Number Of Firm:</td>
                      <td>
                        No: {selectedRequest && selectedRequest[`firmFields`].registrationNumber} of{" "}
                        {selectedRequest && selectedRequest[`firmFields`].registrationYear}
                      </td>
                    </tr>

                    <tr>
                      <td>2</td>
                      <td>Name Of The Firm:</td>
                      <td>{selectedRequest && selectedRequest[`firmFields`].firmName}</td>
                    </tr>

                    <tr>
                      <td>3</td>
                      <td>Duration Of Firm From:</td>
                      <td>{selectedRequest && selectedRequest[`firmFields`].firmDurationFrom}</td>
                    </tr>

                    <tr>
                      <td>4</td>
                      <td>Duration Of Firm To:</td>
                      <td>{selectedRequest && selectedRequest[`firmFields`].firmDurationTo}</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="certifyMaintainSec text-center">
                  <h3>Principal Place of Business for the Firm</h3>
                </div>

                <Table striped bordered className="certifiyTable">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Door No</th>
                      <th>Street</th>
                      <th>District</th>
                      <th>Mandal</th>
                      <th>Village/City</th>
                      <th>PIN Code</th>
                    </tr>
                  </thead>

                  {selectedRequest && selectedRequest[`principalPlaceBusiness`].length > 0 ? (
                    <tbody>
                      {selectedRequest[`principalPlaceBusiness`].map((item: any, i: number) => {
                        return (
                          <tr key={i + 1}>
                            <td>1</td>
                            <td>{item.doorNo}</td>
                            <td>{item.street}</td>
                            <td>{item.district}</td>
                            <td>{item.mandal}</td>
                            <td>{item.villageOrCity}</td>
                            <td>{item.pinCode}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={6}>No Principal Place of Business Found</td>
                      </tr>
                    </tbody>
                  )}
                </Table>

                <div className="certifyMaintainSec text-center">
                  <h3>Partner Details for the Firm</h3>
                </div>

                <Table striped bordered className="certifiyTable">
                  <thead>
                    <tr>
                      <th className="text-center">SI No</th>
                      <th>Partner Name</th>
                      <th>Age</th>
                      <th>Joining Date</th>
                      <th>Partner Address</th>
                    </tr>
                  </thead>

                  {selectedRequest && selectedRequest[`firmPartners`].length > 0 ? (
                    <tbody>
                      {selectedRequest[`firmPartners`].map((item: any, i: number) => {
                        return (
                          <tr key={i + 1}>
                            <td>1</td>
                            <td>{item.partnerName}</td>
                            <td>{item.age}</td>
                            <td>{DateFormator(item.joiningDate, "dd/mm/yyyy")}</td>
                            <td>{`${item.doorNo}/${item.street}/${item.villageOrCity}/${item.mandal}/${item.district}/${item.state}/${item.country}`}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={6}>No Partners Found</td>
                      </tr>
                    </tbody>
                  )}
                </Table>

                <div className="certifyMaintainSec text-center">
                  <h3>Document Details</h3>
                </div>

                <Table striped bordered className="certifiyTable">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Document Name</th>
                    </tr>
                  </thead>

                  {selectedRequest && selectedRequest?.documentAttached?.length > 0 ? (
                    <tbody>
                      {selectedRequest?.documentAttached?.map((document: any, index: number) => {
                        const appName = document?.originalname
                        const appSplit = appName.split("_")
                        let appSplitVal = appSplit[0]
                        let appType = ""

                        if (appSplitVal == "leaseAgreement") {
                          appType = "Lease Agreement"
                        }

                        if (appSplitVal == "partnershipDeed") {
                          appType = "Partnership Deed"
                        }

                        if (appSplitVal == "affidavit") {
                          appType = "Lease Deed or Affidavit"
                        }

                        if (appSplitVal == "selfSignedDeclaration") {
                          appType = "Self signed declaration"
                        }
                        return (
                          <tr key={index + 1}>
                            <td>{appType}</td>
                            <td>{document?.originalname}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={6}>No Documents Found</td>
                      </tr>
                    </tbody>
                  )}
                </Table>

                <div className="certificateBtnSec">
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <div className="d-flex justify-content-center text-center">
                        <button className="btn btn-primary showPayment" onClick={handleBack}>
                          Back
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Container>
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

      {isGoBack && (
        <ViewDetails
          reqsearchdata={reqsearchdata}
          selectedRequest={selectedRequest}
          setReqSearchData={setReqSearchData}
          setIsView={setIsView}
          setIsError={setIsError}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  )
}

export default RegistrationofFirmsCertificate
