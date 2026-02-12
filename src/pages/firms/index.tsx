/* eslint-disable @typescript-eslint/quotes */
import Head from "next/head"
import { useState, useEffect } from "react"
import { Container, Col, Row } from "react-bootstrap"
import PageHeader from "./pageHeader"
import DataTable from "./dataTable"
import ViewDetails from "./viewDetails"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import Swal from "sweetalert2"
import { getFirmDetails } from "@/axios"
import { KeepLoggedIn } from "@/GenericFunctions"
import CryptoJS from "crypto-js"

export default function Societies() {
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [requests, setRequests] = useState<any>([])
  const [reqsearchdata, setReqSearchData] = useState<any>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isView, setIsView] = useState<boolean>(false)
  const [isSearchView, setIsSearchView] = useState<boolean>(false)
  const [isTableView, setIsTableView] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const dispatch = useAppDispatch()
  const [SelectedformTypekey, setSelectedformTypekey] = useState<number>(1)
  let initialLoginDetails = useAppSelector((state: any) => state.login.loginDetails)
  const [isAuthenticated, setIsAuthenticated] = useState<any>(null)
  const [savedLoginDetails, setSavedLoginDetails] = useState<any>(null)
  const [LoginDetails, setLoginDetails] = useState<any>(initialLoginDetails)

  useEffect(() => {
    localStorage.removeItem("PaymentDone")
    if (KeepLoggedIn()) {
    }
  }, [])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setSavedLoginDetails(data)
  }, [initialLoginDetails])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }

    if (data != null && data.userType === "user") {
      getFirmDetails(data.applicationId, data.token)
        .then((response: any) => {
          if (!response || !response.success) {
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
          }

          if (response.data.firm) {
            response.data.firm = [response.data.firm]
          }

          const firmRegData: any = []
          for (let i = 0; i < response.data.firm.length; i++) {
            firmRegData.push(apiResponsetoFirmDataMapper(response.data.firm[i], i + 1))
          }

          setRequests(firmRegData)
          setReqSearchData(firmRegData)
        })
        .catch((error) => {
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
      setIsTableView(true)
    } else {
      setIsSearchView(true)
    }
  }, [])

  const handleView = (id: any) => {
    const [request]: any = reqsearchdata.filter(
      (request: any) => request["userFields"].userId === id
    )

    setSelectedRequest(request)
    setIsView(true)
  }

  const apiResponsetoFirmDataMapper = (firmData: any, ind: any) => {
    return {
      userFields: { userId: ind, portaluserName: "N/A", operatorName: "N/A", mobileNo: "N/A" },
      applicantFields: {
        id: firmData._id,
        applicantNumber: firmData.applicationNumber,
        applicantName: firmData.applicantDetails?.name,
        applicantGender: firmData.applicantDetails?.gender,
        applicantRole: firmData.applicantDetails?.role,
        status: firmData.status,
      },
      addressFields: {
        doorNo: firmData.applicantDetails?.doorNo,
        street: firmData.applicantDetails?.street,
        country: "INDIA",
        state: "Andhra Pradesh",
        district: firmData.applicantDetails?.district,
        mandal: firmData.applicantDetails?.mandal,
        villageCity: firmData.applicantDetails?.villageOrCity,
        pinCode: firmData.applicantDetails?.pinCode,
      },
      contactFields: {
        contactPhone: firmData.contactDetails?.landPhoneNumber,
        contactMobile: firmData.contactDetails?.mobileNumber,
        emailId: firmData.contactDetails?.email,
        faxNumber: firmData.contactDetails?.faxNumber,
      },
      firmFields: {
        firmName: firmData.firmName,
        firmId: firmData._id,
        firmDurationFrom: firmData.firmDurationFrom,
        industryType: firmData.industryType,
        firmDurationTo: firmData.firmDurationTo,
        businessType: firmData.bussinessType,
        deliveryType: firmData.deliveryType,
        firmType: firmData.firmType,
        registrationNumber: firmData.registrationNumber,
        registrationYear: firmData.registrationYear,
        district: firmData.district,
        firmCreatedAt: firmData.createdAt,
        atWill: firmData.atWill,
        deptId: firmData.approvedRejectedById,
      },
      historyDetails: firmData.historyDetails,
      principalPlaceBusiness: firmData.principalPlaceBusiness,
      otherPlaceBusiness: firmData.otherPlaceBusiness,
      processingHistory: firmData.processingHistory,
      messageToApplicant: firmData.messageToApplicant,
      documentAttached: firmData.documentAttached,
      firmPartners: firmData.firmPartners,
    }
  }

  return (
    <>
      <Head>
        <title>Registration Firm Requests</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className="firmReqSec">
        {savedLoginDetails && savedLoginDetails.userType != "" && !isAdding && !isView && (
          <>
            <PageHeader setIsAdding={setIsAdding} />
            <DataTable
              requests={requests}
              reqsearchdata={reqsearchdata}
              setReqSearchData={setReqSearchData}
              handleView={handleView}
              apiResponsetoFirmDataMapper={apiResponsetoFirmDataMapper}
              isTableView={isTableView}
              isSearchView={isSearchView}
              setIsTableView={setIsTableView}
              setIsError={setIsError}
              setErrorMessage={setErrorMessage}
            />
          </>
        )}
        {/* {isAdding && (
          <Details requests={requests} setRequests={setRequests} setIsAdding={setIsAdding} />
        )} */}

        {savedLoginDetails && savedLoginDetails.userType != "" && isView && (
          <ViewDetails
            reqsearchdata={reqsearchdata}
            selectedRequest={selectedRequest}
            setReqSearchData={setReqSearchData}
            setIsView={setIsView}
            setIsError={setIsError}
            setErrorMessage={setErrorMessage}
          />
        )}
        {(!savedLoginDetails?.userType || savedLoginDetails?.userType == "") && (
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
      </div>
    </>
  )
}
