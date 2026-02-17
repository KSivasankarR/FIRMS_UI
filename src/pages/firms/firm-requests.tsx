import { useState, useEffect } from "react"
import Head from "next/head"
import PageHeader from "./pageHeader"
import DataTable from "./dataTable"
import FirmViewDetails from "./viewDetails"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"

export default function RegistrationFirmRequests() {
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [requests, setRequests] = useState<any>([])
  const [reqsearchdata, setReqSearchData] = useState<any>([])
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isView, setIsView] = useState<boolean>(false)

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    const firmRegData: any = [
      {
        userFields: { userId: 1, portaluserName: "Test", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021786",
          applicantName: "Sivaiah",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Pending",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Baba Infra and Constructions",
          firmDurationFrom: "20/01/2022 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/08/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 2, portaluserName: "Test 2", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021860",
          applicantName: "Gopi",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Forwarded to DR",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 3, portaluserName: "Test 3", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021882",
          applicantName: "Rama Chandra Rao",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Not Viewed",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 4, portaluserName: "Test 4", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021786",
          applicantName: "Sivaiah",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Pending",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Baba Infra and Constructions",
          firmDurationFrom: "20/01/2022 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/08/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 5, portaluserName: "Test 5", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021860",
          applicantName: "Gopi",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "not Viewed",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 6, portaluserName: "Test 6", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021882",
          applicantName: "Rama Chandra Rao",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Pending",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 7, portaluserName: "Test 7", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021786",
          applicantName: "Sivaiah",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Forwarded to DR",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Baba Infra and Constructions",
          firmDurationFrom: "20/01/2022 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/08/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 8, portaluserName: "Test 8", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021860",
          applicantName: "Gopi",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Forwarded to DR",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },

      {
        userFields: { userId: 9, portaluserName: "Test 9", operatorName: "N/A", mobileNo: "N/A" },
        applicantFields: {
          applicantNumber: "FRA012300021882",
          applicantName: "Rama Chandra Rao",
          applicantSurname: "N/A",
          applicantGender: "Male",
          applicantMessage: "N/A",
          status: "Pending",
        },
        addressFields: {
          doorNo: "4-5-29/134, Vidyanagar, Lane 2",
          street: "N/A",
          country: "India",
          state: "Andhra Pradesh",
          district: "Guntur",
          mandal: "Guntur West",
          villageCity: "Guntur",
          pinCode: "522007",
        },
        contactFields: {
          contactPhone: "N/A",
          contactMobile: "N/A",
          fax: "N/A",
          emailId: "N/A",
          deliveryType: "N/A",
        },
        firmFields: {
          firmName: "Move to Grow",
          firmDurationFrom: "20/01/2023 10:21:28",
          industryType: "N/A",
          firmDurationTo: "22/10/2023 10:21:28",
          businessType: "N/A",
          deliveryType: "N/A",
          firmType: "N/A",
        },
        principalBusinessFields: {
          principalDoorNo: "4-5-29/134, Vidyanagar, Lane 2",
          principalStreet: "N/A",
          principalState: "Andhra Pradesh",
          principalDistrict: "Guntur",
          principalMandal: "Guntur West",
          principalVillageCity: "Guntur",
          principalPinCode: "522007",
          principalregDistrictName: "Guntur",
        },
        remarks: "Madam, I Verified Found Correct and Submitted for  Approval",
      },
    ]

    //const userToken = localStorage.getItem("token")

    /*api
      .get("/firms", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: userToken,
        },
      })
      .then((response) => {
        setRequests(response.data.data.firms)
        setReqSearchData(response.data.data.firms)
      })
      .catch((error) => {
        console.log("error-", error)
      })*/

    setRequests(firmRegData)
    setReqSearchData(firmRegData)
  }, [])

  const handleView = (id: string | number) => {
    const [request] = reqsearchdata.filter(
      (request: { userId: string | number }) => request.userId === id
    )
    setSelectedRequest(request)
    setIsView(true)
  }

  return (
    <>
      <Head>
        <title>Registration of Firms-Processing</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className="firmReqSec">
        {!isAdding && !isView && (
          <>
            <PageHeader setIsAdding={setIsAdding} />
            <DataTable
              requests={requests}
              reqsearchdata={reqsearchdata}
              setReqSearchData={setReqSearchData}
              handleView={handleView}
            />
          </>
        )}
        {/* {isAdding && (
          <FirmDetails
            reqsearchdata={reqsearchdata}
            setReqSearchData={setReqSearchData}
            setIsAdding={setIsAdding}
          />
        )} */}

        {isView && (
          <FirmViewDetails
            reqsearchdata={reqsearchdata}
            selectedRequest={selectedRequest}
            setReqSearchData={setReqSearchData}
            setIsView={setIsView}
            setIsError={undefined}
            setErrorMessage={undefined}
          />
        )}
      </div>
    </>
  )
}
