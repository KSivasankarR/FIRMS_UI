import React, { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Col, Row, Table } from "react-bootstrap"
import instance from "@/redux/api"
import { getFirmDetails } from "@/axios"
import { PopupAction } from "@/redux/commonSlice"
import { useAppDispatch } from "@/hooks/reduxHooks"
import { useRouter } from "next/router"
import { DateFormator } from "@/GenericFunctions"
import CryptoJS from "crypto-js"
import Pdf from "react-to-pdf"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"

interface PreviewFirmProps {
  appId?: any
  setIsPreview?: any
  formType?: any
}

const PreviewFirm = ({ appId, setIsPreview, formType }: PreviewFirmProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [selectedRequest, setSelectedRequest] = useState<any>({})
  const [existingFirmData, setExistingFirmData] = useState<any>({})
  const [districts, setDistricts] = useState<any>([])
  const [locData, setLocData] = useState<any>({})
  const [loggedInAadhar, setLoggedInAadhar] = useState<string>("")
  const [isView, setIsView] = useState<boolean>(false)
  const [isAlreadyDownloaded, setIsAlreadyDownloaded] = useState<boolean>(false)
  const [ispaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false)
  const [newPartnerAddress, setNewPartnerAddress] = useState<string>("")
  const [oldPartnerAddress, setOldPartnerAddress] = useState<string>("")
  const [outgoingPartner, setOutgoingPartner] = useState<any>([])
  const [inComingPartner, setInComingPartner] = useState<any>([])
  const [deletedPartner, setDeletedPartner] = useState<any>([])
  const [addedPartner, setAddedPartner] = useState<any>([])
  const [otherPlace, setOtherPlace] = useState<any>([])
  const [place, setPlace] = useState<any>([])

  let ref = React.useRef<HTMLDivElement | null>(null)
  let btnref = React.useRef<HTMLButtonElement | null>(null)

  const ShowAlert = (type: any, message: any) => {
    dispatch(PopupAction({ enable: true, type: type, message: message }))
  }

  useEffect(() => {
    document.body.classList.add("previewFormPage")
    return () => {
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
  }, [])

  async function getFileFromUrl(url: any, name: any, defaultType = "application/pdf") {
    const response: any = await instance.get(url, { responseType: "arraybuffer" })
    return new Blob([response.data], {
      type: "application/pdf",
    })
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
      instance.get("/getDistricts").then((response) => {
        setDistricts(response.data)
      })
      let AmendmentData: any = localStorage.getItem("AmendmentData")
      let PartnerData: any = localStorage.getItem("PartnerDetails")
      let PrincipalPlace: any = localStorage.getItem("PrincipalPlace")
      let OtherPlace: any = localStorage.getItem("otherPlace")
      let ApplicantDetails: any = localStorage.getItem("applicantDetails")
      AmendmentData = JSON.parse(AmendmentData)
      PartnerData = JSON.parse(PartnerData)
      PrincipalPlace = JSON.parse(PrincipalPlace)
      OtherPlace = JSON.parse(OtherPlace)
      ApplicantDetails = JSON.parse(ApplicantDetails)

      if (PrincipalPlace) {
        setPlace([{ ...PrincipalPlace }])
      }
      if (OtherPlace) {
        setOtherPlace(OtherPlace)
      }
      if (AmendmentData) {
        let firmdata: any = {}
        getFirmDetails(data.userType == "user" ? data.applicationId : appId, data.token).then(
          (response) => {
            if (response?.success) {
              setExistingFirmData(response.data.firm)
              firmdata = { ...response.data.firm }
              setSelectedRequest({
                ...AmendmentData,
                firmName: response.data.firm.firmName,
                applicantDetails: ApplicantDetails,
              })
              if (
                AmendmentData.isPartnerPermanentAddressChange == "true" ||
                AmendmentData.isPartnerReplaced == "true" ||
                AmendmentData.isNewPartnerAdded == "true" ||
                AmendmentData.isPartnerDeleted == "true"
              ) {
                firmdata.firmPartners.forEach((a: any) => {
                  if (
                    !PartnerData.some(
                      (item: any) =>
                        `${item.doorNo} / ${item.street} / ${item.district} / ${item.mandal} / ${item.villageOrCity} / ${item.pinCode}` ==
                        `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                    )
                  ) {
                    setOldPartnerAddress(
                      `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                    )
                  }
                  if (
                    PartnerData.some(
                      (item: any) =>
                        item._id == a._id &&
                        item.aadharNumber.toString() != a.aadharNumber.toString()
                    )
                  ) {
                    setOutgoingPartner([
                      ...outgoingPartner,
                      `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                        DateFormator(a.joiningDate, "dd-mm-yyyy"),
                    ])
                  }
                  if (PartnerData.some((item: any) => item._id != a._id)) {
                    setDeletedPartner([
                      ...deletedPartner,
                      `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                        DateFormator(a.joiningDate, "dd-mm-yyyy"),
                    ])
                  }
                })

                PartnerData.forEach((a: any) => {
                  if (
                    !firmdata.firmPartners.some(
                      (item: any) =>
                        `${item.doorNo} / ${item.street} / ${item.district} / ${item.mandal} / ${item.villageOrCity} / ${item.pinCode}` ==
                        `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                    )
                  ) {
                    setNewPartnerAddress(
                      `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                    )
                  }
                  if (
                    firmdata.firmPartners.some(
                      (item: any) =>
                        item._id == a._id &&
                        item.aadharNumber.toString() != a.aadharNumber.toString()
                    )
                  ) {
                    setInComingPartner([
                      ...inComingPartner,
                      `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                        DateFormator(a.joiningDate, "dd-mm-yyyy"),
                    ])
                  }
                  if (firmdata.firmPartners.some((item: any) => item._id != a._id)) {
                    setAddedPartner([
                      ...addedPartner,
                      `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                        DateFormator(a.joiningDate, "dd-mm-yyyy"),
                    ])
                  }
                })
              }
              Object.keys(AmendmentData).forEach((key) => {
                if (key == "selfSignedDeclaration") {
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
                  let inputEle: any = document.getElementById("IframePreview")
                  if (inputEle !== null) {
                    inputEle.src = window.URL.createObjectURL(new Blob([buffer], { type: type }))
                  }
                }
              })
            }
          }
        )
      } else {
        getFirmDetails(data?.userType == "user" ? data?.applicationId : appId, data?.token).then(
          (response) => {
            if (response?.success) {
              setSelectedRequest(response.data.firm)
              setPlace(response.data.firm.principalPlaceBusiness)
              setOtherPlace(response.data.firm.otherPlaceBusiness)
              if (response.data.firm.historyDetails?.length > 0) {
                setExistingFirmData(
                  response.data.firm.historyDetails[response.data.firm.historyDetails.length - 1]
                )
                if (
                  response.data.firm.isPartnerPermanentAddressChange ||
                  response.data.firm.isPartnerReplaced ||
                  response.data.firm.isNewPartnerAdded ||
                  response.data.firm.isPartnerDeleted
                ) {
                  response.data.firm.historyDetails[
                    response.data.firm.historyDetails.length - 1
                  ].firmPartners.forEach((a) => {
                    if (
                      !response.data.firm.firmPartners.some(
                        (item) =>
                          `${item.doorNo} / ${item.street} / ${item.district} / ${item.mandal} / ${item.villageOrCity} / ${item.pinCode}` ==
                          `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                      )
                    ) {
                      setOldPartnerAddress(
                        `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                      )
                    }
                    if (
                      !response.data.firm.firmPartners.some(
                        (item) =>
                          item._id == a._id &&
                          item.aadharNumber.toString() != a.aadharNumber.toString()
                      )
                    ) {
                      setOutgoingPartner([
                        ...outgoingPartner,
                        `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                          DateFormator(a.joiningDate, "dd-mm-yyyy"),
                      ])
                    }
                    if (response.data.firm.firmPartners.some((item) => item._id != a._id)) {
                      setDeletedPartner([
                        ...deletedPartner,
                        `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                          DateFormator(a.joiningDate, "dd-mm-yyyy"),
                      ])
                    }
                  })

                  response.data.firm.firmPartners.forEach((a: any) => {
                    if (
                      !response.data.firm.historyDetails[
                        response.data.firm.historyDetails.length - 1
                      ].firmPartners.some(
                        (item) =>
                          `${item.doorNo} / ${item.street} / ${item.district} / ${item.mandal} / ${item.villageOrCity} / ${item.pinCode}` ==
                          `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                      )
                    ) {
                      setNewPartnerAddress(
                        `${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}`
                      )
                    }
                    if (
                      !response.data.firm.historyDetails[
                        response.data.firm.historyDetails.length - 1
                      ].firmPartners.some(
                        (item: any) =>
                          item._id == a._id &&
                          item.aadharNumber.toString() != a.aadharNumber.toString()
                      )
                    ) {
                      setInComingPartner([
                        ...inComingPartner,
                        `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                          DateFormator(a.joiningDate, "dd-mm-yyyy"),
                      ])
                    }
                    if (
                      response.data.firm.historyDetails[
                        response.data.firm.historyDetails.length - 1
                      ].firmPartners.some((item) => item._id != a._id)
                    ) {
                      setAddedPartner([
                        ...addedPartner,
                        `${a.partnerName}, ${a.doorNo} / ${a.street} / ${a.district} / ${a.mandal} / ${a.villageOrCity} / ${a.pinCode}, ` +
                          DateFormator(a.joiningDate, "dd-mm-yyyy"),
                      ])
                    }
                  })
                }
              }
              const selfSignedPdf = response.data.firm.documentAttached?.find(
                (x: any) => x.originalname.split("_")[0] == "selfSignedDeclaration"
              )
              if (selfSignedPdf) {
                getFileFromUrl(
                  `/downloads/${response.data.firm._id}/${selfSignedPdf.originalname}`,
                  "selfSignedDeclaration.pdf"
                ).then((response) => {
                  let inputEle: any = document.getElementById("IframePreview")
                  if (inputEle !== null) {
                    inputEle.src = window.URL.createObjectURL(response)
                  }
                })
              }
              if (response.data.firm.status == "Approved" && response.data.firm.isdownload) {
                setIsAlreadyDownloaded(true)
              } else {
                setIsAlreadyDownloaded(false)
              }
            }
          }
        )
      }
    }
  }, [])

  const options = {
    orientation: "p",
    unit: "mm",
    format: [400, 480],
  }

  return (
    <>
      <Head>
        <title>Acknowledgement of Registration of Firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      {Object.keys(locData)?.length > 0 && locData?.userType != "" && (
        <>
          {selectedRequest && (
            <div ref={ref} className="societyRegSec" id="viewSocietyCerticate">
              <div className="viewCertificatePage">
                <div className="pageWrapper">
                  <div className="viewCerticateSec">
                    <Container>
                      {(!formType || formType == null) && (
                        <>
                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h1>Form No. I</h1>
                              <p>
                                (Vide Rule 3 of A.P. Partnership (Registration of Firms) Rules,
                                1957)
                              </p>
                              <h5>Application For Registration Of Firms</h5>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                By the{" "}
                                <strong>
                                  {selectedRequest.createdAt
                                    ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                    : ""}
                                </strong>{" "}
                                Presented/forwarded to the Registrar of Firms for filling by{" "}
                                <strong>
                                  {selectedRequest.applicantDetails?.name
                                    ? selectedRequest.applicantDetails.name
                                    : ""}
                                </strong>{" "}
                                *We, the understanding, being the partners of the firm{" "}
                                <strong>{selectedRequest.firmName}</strong> hereby apply for
                                registration pursuance of section 58 of the Indian Partnership Act,
                                1932:-
                              </p>
                              <p>
                                The Firm Name* <strong>{selectedRequest.firmName}</strong>
                              </p>
                              <p>
                                Nature of Business <strong>{selectedRequest.bussinessType}</strong>
                              </p>
                            </div>
                            <div className="certifyMaintainSec">
                              <h3>Place of Business:-</h3>
                            </div>
                            <div className="certifyMaintainSec subhead">
                              <h3>(a) Principal Place</h3>
                            </div>
                            <div className="addressPlace">
                              {selectedRequest.principalPlaceBusiness &&
                              selectedRequest.principalPlaceBusiness.length > 0 ? (
                                <div>
                                  {selectedRequest.principalPlaceBusiness.map(
                                    (item: any, i: number) => {
                                      return (
                                        <p key={i + 1}>
                                          {item.doorNo} / {item.street} / {item.district} /{" "}
                                          {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                        </p>
                                      )
                                    }
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <p>No Principal Place of Business Found</p>
                                </div>
                              )}
                            </div>
                            <div className="certifyMaintainSec subhead">
                              <h3>(b) Other Places</h3>
                            </div>

                            <div className="addressPlace">
                              {selectedRequest.otherPlaceBusiness &&
                              selectedRequest.otherPlaceBusiness.length > 0 ? (
                                <div>
                                  {selectedRequest.otherPlaceBusiness.map(
                                    (item: any, i: number) => {
                                      return (
                                        <p key={i + 1}>
                                          {item.doorNo} / {item.street} / {item.district} /{" "}
                                          {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                        </p>
                                      )
                                    }
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <p>No Other Places Found</p>
                                </div>
                              )}
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>Name of partners in full*</th>
                                  <th>Date of joining the firm</th>
                                  <th>Present address in full</th>
                                </tr>
                              </thead>

                              {selectedRequest.firmPartners &&
                              selectedRequest.firmPartners.length > 0 ? (
                                <tbody>
                                  {selectedRequest.firmPartners.map((item: any, i: number) => {
                                    return (
                                      <tr key={i + 1}>
                                        <td>{item.partnerName}</td>
                                        <td>
                                          {item.joiningDate != "Invalid date"
                                            ? DateFormator(item.joiningDate, "dd/mm/yyyy")
                                            : ""}
                                        </td>
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

                            {!selectedRequest.atWill && (
                              <div className="certifyMaintainSec subhead">
                                <h3>Duration of the Firm</h3>
                                <p>{DateFormator(selectedRequest.firmDurationTo, "dd/mm/yyyy")}</p>
                              </div>
                            )}
                          </div>

                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h5>"DECLARATION"</h5>
                            </div>

                            <div className="declarationDesc">
                              <p>
                                (i) We, solemnly and sincerely affirm and state that we, either
                                individual or jointly are not involved directly in any activity
                                which offend any rule of law or carrying out any business in
                                contravention of any of the provisions of the State or Central Laws
                                for the time being in force.
                              </p>
                            </div>

                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12}>
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {selectedRequest.createdAt
                                        ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                        : ""}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12}>
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of the partners or their <br />
                                      specially authorised agent.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>

                            <div className="declarationFirm">
                              <p>
                                <strong>{selectedRequest.firmName}</strong>
                                <br />* Here enter the name of the firm.
                              </p>
                              <p>
                                ** If any partner is a minor, the fact whether he is entitle to the
                                benefits of partnership should be set-out herein.
                              </p>
                              <p>
                                N.B. :- this form must be signed by all partners or their agents
                                specially authorised in this behalf in the presence of a witness who
                                must be either Gazetted Officer, Advocate, Vakil, a Honorary
                                Magistrate or Registered Accountant or I.T.P.
                              </p>
                            </div>
                          </div>

                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h5>A.P. Partnership Rules 1957</h5>
                            </div>

                            <div className="declarationDescPartners">
                              {selectedRequest.firmPartners &&
                              selectedRequest.firmPartners.length > 0 ? (
                                <div className="declarePartnersList">
                                  {selectedRequest.firmPartners.map((item: any, i: number) => {
                                    return (
                                      <div className="declarePartners" key={i + 1}>
                                        <p>
                                          <strong>{i + 1}.</strong> I{" "}
                                          <strong>{item.partnerName}</strong>, {item.relationType}{" "}
                                          <strong>{item.relation}</strong>,{" "}
                                          <strong>{item.age}</strong> of years of age,{" "}
                                          <strong className="religion"></strong> of religion, do
                                          hereby declare that the above statement is true and
                                          correct to the best of my knowledge and belief.
                                        </p>
                                        <p>
                                          Date:{" "}
                                          <strong>
                                            {selectedRequest.createdAt
                                              ? DateFormator(
                                                  selectedRequest.createdAt,
                                                  "dd/mm/yyyy"
                                                )
                                              : ""}
                                          </strong>
                                        </p>
                                        <Row>
                                          <Col lg={6} md={8} xs={12}>
                                            <p>
                                              Witness: <strong></strong>
                                            </p>
                                          </Col>
                                          <Col lg={6} md={4} xs={12}>
                                            <div className="d-flex justify-content-end text-center">
                                              <p>Signature</p>
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <div className="declarePartners">
                                  <p>No Partners Found</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {formType == "form-2" && (
                        <>
                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h1>Form No. II</h1>
                              <p>
                                (Vide Rule 3 of A.P. Partnership (Registration of Firms) Rules,
                                1957)
                              </p>
                              <h5>
                                STATEMENT OF ALTERATION IN THE NAME OF THE FIRM OR IN THE LOCATION
                                OF THE PRINCIPAL PLACE OF BUSINESS
                              </h5>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                Presented or forwarded to the Registrar of firms for filing by{" "}
                                <strong>
                                  {selectedRequest.applicantDetails?.name
                                    ? selectedRequest.applicantDetails.name
                                    : ""}
                                </strong>{" "}
                                We, the undersigned, being the partners of the firm{" "}
                                <strong>{selectedRequest.firmName}</strong> hereby supply the
                                following particulars pursuant to section 60(1) of the Indian
                                Partnership Act, 1932:-
                              </p>
                            </div>
                            <div className="certifyMaintainSec">
                              <h3>NAME OF FIRM</h3>
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>Previous name</th>
                                  <th>New name</th>
                                </tr>
                              </thead>

                              {selectedRequest.isFirmNameChange ? (
                                <tbody>
                                  <tr>
                                    <td>{existingFirmData?.firmName}</td>
                                    <td>{selectedRequest?.newFirmName}</td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td colSpan={6}>No change</td>
                                  </tr>
                                </tbody>
                              )}
                            </Table>
                            <div className="certifyMaintainSec">
                              <h3>PRINCIPAL PLACE OF BUSINESS</h3>
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>Previous place</th>
                                  <th>New place</th>
                                </tr>
                              </thead>

                              {selectedRequest.isPrincipaladdressChange ? (
                                <tbody>
                                  <tr>
                                    <td>
                                      {existingFirmData?.principalPlaceBusiness &&
                                        existingFirmData?.principalPlaceBusiness?.length > 0 &&
                                        existingFirmData?.principalPlaceBusiness.map(
                                          (item: any, i: number) => {
                                            return (
                                              <p key={i}>
                                                {item.doorNo} / {item.street} / {item.district} /{" "}
                                                {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                              </p>
                                            )
                                          }
                                        )}
                                    </td>
                                    <td>
                                      {place &&
                                        place?.length > 0 &&
                                        place.map((item: any, i: number) => {
                                          return (
                                            <p key={i}>
                                              {item.doorNo} / {item.street} / {item.district} /{" "}
                                              {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                            </p>
                                          )
                                        })}
                                    </td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td colSpan={6}>No change</td>
                                  </tr>
                                </tbody>
                              )}
                            </Table>
                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12} className="mt-5">
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {selectedRequest.createdAt
                                        ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                        : ""}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12} className="mt-5">
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of the partners or their <br />
                                      specially authorised agents.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <div className="declarationDescPartners">
                              {selectedRequest.firmPartners &&
                              selectedRequest.firmPartners.length > 0 ? (
                                <div className="declarePartnersList">
                                  {selectedRequest.firmPartners &&
                                    selectedRequest.firmPartners.map((item: any, i: number) => {
                                      return (
                                        <div className="declarePartners" key={i + 1}>
                                          <p>
                                            <strong>{i + 1}.</strong> I{" "}
                                            <strong>{item.partnerName}</strong>, {item.relationType}{" "}
                                            <strong>{item.relation}</strong>,{" "}
                                            <strong>{item.age}</strong> of years of age,{" "}
                                            <strong className="religion"></strong> of religion, do
                                            hereby declare that the above statement is true and
                                            correct to the best of my knowledge and belief.
                                          </p>
                                          <p>
                                            Date:{" "}
                                            <strong>
                                              {selectedRequest.createdAt
                                                ? DateFormator(
                                                    selectedRequest.createdAt,
                                                    "dd/mm/yyyy"
                                                  )
                                                : ""}
                                            </strong>
                                          </p>
                                          <Row>
                                            <Col lg={6} md={8} xs={12}>
                                              <p>
                                                Witness: <strong></strong>
                                              </p>
                                            </Col>
                                            <Col lg={6} md={4} xs={12}>
                                              <div className="d-flex justify-content-end text-center">
                                                <p>Signature</p>
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      )
                                    })}
                                </div>
                              ) : (
                                <div className="declarePartners">
                                  <p>No Partners Found</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {formType == "form-2" && (
                        <>
                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h1>Form No. III</h1>
                              <p>
                                (Vide Rule 3 of A.P. Partnership (Registration of Firms) Rules,
                                1957)
                              </p>
                              <h5>
                                INTIMATION OF CHANGE IN THE PLACE OF BUSINESS (OTHER THAN PRINCIPAL
                                PLACE OF BUSINESS)
                              </h5>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                Presented or forwarded to the Registrar of firms for filing by{" "}
                                <strong>
                                  {selectedRequest.applicantDetails?.name
                                    ? selectedRequest.applicantDetails.name
                                    : ""}
                                </strong>{" "}
                                Under section 61 of the Indian Partnership Act, 1932, intimation is
                                hereby given that the changes specified below have occurred in the
                                place of business of the firm*{"  "}
                                <strong>{selectedRequest.firmName}</strong>
                              </p>
                              <p>
                                Date of change <strong>{selectedRequest.newNameEffectDate}</strong>
                              </p>
                              <p>The Firm has discontinued business at :</p>

                              {existingFirmData?.otherPlaceBusiness &&
                                existingFirmData?.otherPlaceBusiness?.length > 0 &&
                                existingFirmData?.otherPlaceBusiness.map((item: any, i: number) => {
                                  return (
                                    <p key={i}>
                                      {item.doorNo} / {item.street} / {item.district} /{" "}
                                      {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                    </p>
                                  )
                                })}

                              <p>The Firm has begun to carry on business at :</p>
                              {otherPlace &&
                                otherPlace?.length > 0 &&
                                otherPlace.map((item: any, i: number) => {
                                  return (
                                    <p key={i}>
                                      {item.doorNo} / {item.street} / {item.district} /{" "}
                                      {item.mandal} /{item.villageOrCity} / {item.pinCode}
                                    </p>
                                  )
                                })}
                            </div>
                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12} className="mt-5">
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {selectedRequest.createdAt
                                        ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                        : ""}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12} className="mt-5">
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of any partner or
                                      <br />
                                      agent of the firm.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <p>* Here enter name of firm</p>
                            <p>N.B :- Strike out item not required</p>
                          </div>
                        </>
                      )}
                      {formType == "form-2" && (
                        <>
                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h1>Form No. IV</h1>
                              <p>
                                (Vide Rule 4 of A.P. Partnership (Registration of Firms) Rules,
                                1957)
                              </p>
                              <h5>
                                INTIMATION OF ALTERATION IN THE NAME OF PERMANENT ADDRESS OF PARTNER
                              </h5>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                Presented or forwarded to the Registrar of firms for filing by{" "}
                                <strong>
                                  {selectedRequest.applicantDetails?.name
                                    ? selectedRequest.applicantDetails.name
                                    : ""}
                                </strong>{" "}
                                Under section 62 of the Indian Partnership Act, 1932, intimation is
                                hereby given that the changes specified below has occurred in the
                                name or/and permanent address of partner in the firm*{"  "}
                                <strong>{selectedRequest.firmName}</strong>
                              </p>
                            </div>
                            <div className="previewFormPagePdf">
                              <div className="certificateHeader">
                                <h5>NAME OF PARTNER</h5>
                              </div>
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>Previous name (in full)</th>
                                  <th>New name (in full)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td colSpan={6}>No Partner Name Change</td>
                                </tr>
                              </tbody>
                            </Table>
                            <div className="previewFormPagePdf">
                              <div className="certificateHeader">
                                <h5>ADDRESS OF PARTNER</h5>
                              </div>
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>Previous permanent address (in full)</th>
                                  <th>Present permanent address (in full)</th>
                                </tr>
                              </thead>

                              {selectedRequest.isPartnerPermanentAddressChange ? (
                                <tbody>
                                  <tr>
                                    <td>{oldPartnerAddress}</td>
                                    <td>{newPartnerAddress}</td>
                                  </tr>
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td colSpan={6}>No Partner Address Change</td>
                                  </tr>
                                </tbody>
                              )}
                            </Table>
                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12} className="mt-5">
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12} className="mt-5">
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of any partner or
                                      <br />
                                      agent of the firm.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <p>* Here enter name of firm</p>
                            <p>N.B :- Strike out item not required</p>
                          </div>
                        </>
                      )}
                      {formType == "form-3" && (
                        <>
                          <div className="previewFormPagePdf">
                            <div className="certificateHeader">
                              <h1>Form No. V</h1>
                              <p>
                                (Vide Rule 4 of A.P. Partnership (Registration of Firms) Rules,
                                1957)
                              </p>
                              <h5>
                                NOTICE OF CHANGE IN THE CONSTITUTION OF FIRM OR OF THE DISSOLUTION
                                OF THE FIRM
                              </h5>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                Presented or forwarded to the Registrar of firms for filing by{" "}
                                <strong>
                                  {selectedRequest.applicantDetails?.name
                                    ? selectedRequest.applicantDetails.name
                                    : ""}
                                </strong>{" "}
                                Under section 63(1) of the Indian Partnership Act, 1932, intimation
                                is hereby given that --
                              </p>
                              <p>
                                (1) The Constitution of the firm*{"  "}
                                <strong>{selectedRequest.firmName}</strong> has been altered as
                                follows ;
                              </p>
                            </div>
                            <Table striped bordered className="certifiyTable">
                              <thead>
                                <tr>
                                  <th>
                                    Name and full address of the incoming partner and date of his
                                    joining the firm
                                  </th>
                                  <th>
                                    Name and full address of the outgoing partner and date of his
                                    ceasing to be the partner
                                  </th>
                                </tr>
                              </thead>

                              {selectedRequest.isPartnerReplaced &&
                                selectedRequest.isPartnerReplaced.toString() == "true" && (
                                  <tbody>
                                    <tr>Replaced Partner details</tr>
                                    <tr>
                                      <td>{inComingPartner}</td>
                                      <td>{outgoingPartner}</td>
                                    </tr>
                                  </tbody>
                                )}
                              {selectedRequest.isNewPartnerAdded &&
                                selectedRequest.isNewPartnerAdded.toString() == "true" && (
                                  <tbody>
                                    <tr>New Partner details</tr>
                                    {addedPartner?.map((item) => {
                                      return (
                                        <tr>
                                          <td>{item}</td>
                                          <td></td>
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                )}
                              {selectedRequest.isPartnerDeleted &&
                                selectedRequest.isPartnerDeleted.toString() == "true" && (
                                  <tbody>
                                    <tr>Exited Partner details</tr>
                                    <tr>
                                      <td></td>
                                      <td>{deletedPartner}</td>
                                    </tr>
                                  </tbody>
                                )}
                            </Table>
                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12} className="mt-5">
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {selectedRequest.createdAt
                                        ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                        : ""}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12} className="mt-5">
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of the incoming, continuing
                                      <br />
                                      or outgoing partner or his
                                      <br />
                                      specially authorised agent.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <div className="certificateHereInfo">
                              <p>
                                (2) The firm*{"  "}
                                <strong>{selectedRequest.firmName}</strong> <br />
                                has been dissolved with effect from the{" "}
                                {selectedRequest.firmDissolved ? (
                                  <strong>{selectedRequest.dissolveDate}</strong>
                                ) : (
                                  ""
                                )}
                              </p>
                            </div>
                            <div className="declarationInfo">
                              <Row>
                                <Col lg={6} md={8} xs={12} className="mt-5">
                                  <p>
                                    Station: <strong>{selectedRequest.district}</strong>
                                  </p>
                                  <p>
                                    Date:{" "}
                                    <strong>
                                      {selectedRequest.createdAt
                                        ? DateFormator(selectedRequest.createdAt, "dd/mm/yyyy")
                                        : ""}
                                    </strong>
                                  </p>
                                </Col>
                                <Col lg={6} md={4} xs={12} className="mt-5">
                                  <div className="d-flex justify-content-end text-center">
                                    <p>
                                      Signature of the person who was a partner
                                      <br />
                                      immediately before the dissolution or <br />
                                      of his specially authorised agent.
                                    </p>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <p>* Here enter name of firm</p>
                            <p>N.B :- Strike out item (1) or (2) not required</p>
                          </div>
                        </>
                      )}
                      <div className="previewFirmDocuments">
                        <h3>Self Signed Declaration</h3>
                      </div>
                      <iframe id="IframePreview" width="100%" height="400px" />
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="certificateBtnSec align-text-center">
            <Container>
              <Row>
                {/* <Col lg={6} md={6} xs={6}>
              {
                <Pdf
                  targetRef={ref}
                  filename={`${selectedRequest.applicationNumber}.pdf`}
                  options={options}
                >
                  {({ toPdf }: any) => (
                    <Button
                      id="downloadClick"
                      ref={btnref}
                      variant="primary"
                      onClick={() => {
                        toPdf()
                      }}
                    >
                      Print
                    </Button>
                  )}
                </Pdf>
              }
            </Col> */}
                <Col lg={12} md={12} xs={12}>
                  <div className="d-flex justify-content-center">
                    <a
                      className="btn btn-primary"
                      id="previewBack"
                      onClick={() => {
                        if (
                          locData?.userType == "dept" ||
                          !formType ||
                          formType == "form-3" ||
                          formType == "form-2"
                        )
                          setIsPreview(false)
                      }}
                    >
                      Back
                    </a>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      )}
      {(!locData?.userType || locData?.userType == "") && (
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

export default PreviewFirm
