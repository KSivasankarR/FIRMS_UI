import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Container, Col, Row, Form, Table, Tab, Tabs } from "react-bootstrap"
import styles from "@/styles/pages/Forms.module.scss"
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import TableDropdownSRO from "@/components/common/TableDropdownSRO"
import moment from "moment"
import CryptoJS, { AES } from "crypto-js"
import {
  UseGetAadharDetails,
  getDLFdata,
  UseGetDistrictList,
  UseGetMandalList,
  UseGetVillagelList,
  UseSaveDataEntryFirmDetails,
  UseSaveDataEntryFirmLegacy,
  UseGetFraDetails,
  UseGetAadharOTP,
  UseSaveDataUserLegacySociety,
} from "@/axios"
import TableDropdown from "@/components/common/TableDropdown"
import Image from "next/image"
import {
  IAAdditionalDetailsModel,
  IAApplicantDetailsModel,
  IABusinessDetailsModel,
  IAContactDetailsModel,
  IAFirmAdditionalDetailsModel,
  IAFirmDetailsModel,
  IAOtherBusinessDetailsModel,
  IAPartnerDetailsModel,
} from "@/models/appTypes"
import TableSelectDate from "@/components/common/TableSelectDate"
import { PopupAction } from "@/redux/commonSlice"
import { useAppDispatch } from "@/hooks/reduxHooks"

const DataEntry = () => {
  const router = useRouter()

  const [IsOtherChecked, setIsOtherChecked] = useState<boolean>(false)
  const [applicantDetails, setApplicantDetails] = useState<IAApplicantDetailsModel>({
    aadharNumber: "",
    firstName: "",
    surName: "",
    relationType: "",
    relation: "",
    gender: "",
    age: "",
    role: "",
    doorNo: "",
    street: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    otpCode: "",
    otpStatus: "",
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
    name: "",
    select: "",
    ApplicantID: "",
    nameOfFirm: "",
    legacyAadharNumber: "",
    registrationNumber: "",
    registrationYear: "",
    address: ""
  })
  const [contactDetails, setContactDetails] = useState<IAContactDetailsModel>({
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
  })
  const [firmDetails, setFirmDetails] = useState<IAFirmDetailsModel>({
    firmName: "",
    atWill: false,
    firmDurationFrom: "",
    firmDurationTo: "",
    industryType: "",
    businessType: "",
  })
  const [partnerDetails, setPartnerDetails] = useState<any>([])
  const [legacyPartnerDetails, setLegacyPartnerDetails] = useState<any>([])
  const [PreviewBtnClicked, setPreviewBtnClicked] = useState(false)
  const [savedFirm, setSavedFirm] = useState<any>({})
  const [isResubmission, setIsResubmission] = useState<string>("false")
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [principalBusiDetails, setPrincipalBusiDetails] = useState<any>({
    doorNo: "",
    street: "",
    dateOfChange: "",
    remarks: "",
    placeParticulars: "",
    country: "",
    state: "AndhraPradesh",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    registrationDistrict: "",
    branch: "Main",
    type: "",
  })
  const [otherbusinessDetails, setOtherBusinessDetails] = useState<any>([])
  const [file, setFile] = useState<any>({})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [TempMemory, setTempMemory] = useState<any>({ OTPRequested: false, AadharVerified: false })
  const [TempMemoryPartner, setTempMemoryPartner] = useState<any>({
    OTPRequested: false,
    AadharVerified: false,
  })
  const [DistrictList, setDistrictList] = useState<any>([])
  const [genderList, setGenderList] = useState<string[]>(["Male", "Female", "Other"])
  const [MandalForApplicant, setMandalForApplicant] = useState<any>([])
  const [MandalForPrincipleAddr, setMandalForPrincipleAddr] = useState<any>([])
  const [MandalForOtherAddr, setMandalForOtherAddr] = useState<any>([])
  const [MandalForPartnerDetails, setMandalForPartnerDetails] = useState<any>([])
  const [VillageListForApplicant, setVillageListForApplicant] = useState<any>([])
  const [VillageListForPrincipleAddr, setVillageListForPrincipleAddr] = useState<any>([])
  const [VillageListForOtherAddr, setVillageListForOtherAddr] = useState<any>([])
  const [VillageListForPartnerDetails, setVillageListForPartnerDetails] = useState<any>([])
  const [LoginDetails, setLoginDetails] = useState<any>({})
  const [key, setKey] = useState("home")
  const [SelectedOtherbusinessDetails, setSelectedOtherbusinessDetails] = useState<any>({
    doorNo: "",
    openingDate: "",
    placeName: "",
    street: "",
    ceasingDate: "",
    state: "AndhraPradesh",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
  })
  const [SelectedPartnerDetails, setSelectedPartnerDetails] = useState<any>({
    aadharNumber: "",
    remarks: "",
    ceasingDate: "",
    applicantName: "",
    surName: "",
    relationType: "",
    relation: "",
    gender: "",
    age: "",
    role: "",
    doorNo: "",
    street: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    otpCode: "",
    otpStatus: "",
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
    partnerName: "",
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
    share: "",
    joiningDate: "",
  })
  const [isPayNowClicked, setIsPayNowClicked] = useState<boolean>(false)
  const [locData, setLocData] = useState<any>({})
  const [firmData, setFirmData] = useState<IAFirmAdditionalDetailsModel>({
    firmName: "",
    firmDurationFrom: "",
    firmDurationTo: "",
    firmType: "",
    industryType: "",
    principalBusinessFields: [],
    otherAddressList: [],
    businessType: "",
    district: "",
  })
  const [additionalDetails, setAdditionalDetails] = useState<IAAdditionalDetailsModel>({
    submissionResponse: "",
    registrationNumber: "",
    applicationProcessedDate: "",
    registrationYear: "",
  })
  const [dlfFirmdata, setDlfFirmdata] = useState<any>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [bussinessList, setBussinessList] = useState<any>([])
  const [busList] = useState<any>([
      {
        key: "Agriculture & Forestry/wildlife",
        value: [
          "extermination/pest control",
          "Farming (animal production)",
          "Farming (crop production)",
          "Fishing/hunting",
          "landscape services",
          "lawn care services",
          "other (agriculture & forestry/wildlife)",
        ],
      },
      {
        key: "Business & Information",
        value: [
          "Consultant",
          "Employment office",
          "Fundraisers",
          "going out of business sales",
          "martketing/advertising",
          "non profit organisations",
          "Notary Public",
          "online Business",
          "other Business & information",
          "publishing services",
          "record business",
          "retail sales",
          "Technology services",
          "telemarketing",
          "travel agency",
          "video production",
        ],
      },
      {
        key: "Construction/Utilities Contracting",
        value: [
          "AC & Heating",
          "Architect",
          "Building Construction",
          "Building Inspection",
          "Concrete Manufacturing",
          "Contractor",
          "Engineering/Drafting",
          "Equipment rental",
          "Other (Construction/Utities/Contracting)",
          "Plumbing",
          "Remodelling",
          "Repair/Maintenance",
        ],
      },
      {
        key: "Education",
        value: [
          "Child care services",
          "College/universities",
          "Cosmetology school",
          "elementary & secondary education",
          "GED certification",
          "Other (Education)",
          "Private school",
          "Real estate",
          "Technical school",
          "Trade School",
          "Tutoring services",
          "Vocational School",
        ],
      },
      {
        key: "Finance & Insurance",
        value: [
          "Accountant",
          "Auditing",
          "Bank/ Credit Union",
          "cash Advances",
          "Collection Agency",
          "Insurance",
          "Investor",
          "Other (finance& Insurance)",
          "Pawn Brokers",
          "Tax preparation",
        ],
      },
      {
        key: "Food & Hospitality",
        value: [
          "Alcohol / Tobacco sales",
          "Alcoholic beverage manufacturing",
          "Bakery",
          "Caterer",
          "Food/beverage Manufacturing",
          "Grocery/Convenience Store (Gas station)",
          "Grocery/Convenience Store (No Gas station)",
          "Hotels/Motels(Casino)",
          "Hotels/Motels (No Casino)",
          "Mobile food services",
          "Other (Food & Hospitality)",
          "Restaurant/ Bar",
          "Speciality Food (Fruits/Vegetables)",
          "Speciality Food (Meat)",
          "Speciality Food (Sea Food)",
          "Tobacco Product manufacturing",
          "Truck Stop",
          "Vending Machine",
        ],
      },
      {
        key: "Gaming",
        value: [
          "Auctioneer",
          "Boxing/Wrestling",
          "Casino/Video Gaming",
          "Other (Gaming)",
          "Race Track",
          "Sports Agent",
        ],
      },
      {
        key: "Health Services",
        value: [
          "Acupuncturist",
          "Athletic Trainer",
          "Child/Youth Services",
          "Chiropractic Office",
          "Dentistry",
          "Electrolysis",
          "embalmer",
          "Emergency Medical Services",
          "Emergency Medical Transportation",
          "Hearing Aid Dealers",
          "Home Health Services",
          "Hospital",
          "Massage Therapy",
          "Medical Office",
          "Mental Health Services",
          "Non Emergency Medical transportation",
          "Optometry",
          "Other (Health Services)",
          "Pharmacy",
          "Physical Therapy",
          "Physician's Office",
          "Radiology",
          "Residential Care Facility",
          "Speech/Occupational therapy",
          "Substance Abuse services",
          "Veterinary Medicine",
          "Vocational Rehabitation",
          "Wholesale Drug Distribution",
        ],
      },
      {
        key: "Motor vehicle",
        value: [
          "Automotive part Sales",
          "Car Wash/Detailing",
          "Motor vehicle Rental",
          "Motor vehicle Repair",
          "New Motor Vehicle Sales",
          "other (Motor Vehicle)",
          "Recreational Vehicle Sales",
          "Used Motor Vehicle Sales",
        ],
      },
      {
        key: "Natural Resources/Environmental",
        value: [
          "Conservation Organizations",
          "Environmental Health",
          "Land Surveying",
          "Oil & Gas Distribution",
          "Oil & Gas Extraction/Production",
          "Other(Natural Resources/ Environmental)",
          "Pipeline",
          "Water Well Drilling",
        ],
      },
      {
        key: "Personal Services",
        value: [
          "Animal Boarding",
          "Barber Shop",
          "Beauty Salon",
          "Cemetery",
          "Diet Center",
          "Dry cleaning/laundry",
          "Entertainment/party Rentals",
          "event planning",
          "fitness Center",
          "Florist",
          "Funeral Director",
          "Janitorial/Cleaning Services",
          "Massage/Day Spa",
          "Nail Salon",
          "Other (Personal Services)",
          "Personal Assistant",
          "Photography",
          "Tanning Salon",
        ],
      },
      {
        key: "Real Estate & Housing",
        value: [
          "Home Inspection",
          "Interior Design",
          "Manufactured Housing",
          "Mortgage Company",
          "Other (Real Estate & Housing)",
          "Property Management",
          "Real estate/Broker/Agent",
          "Warehouse/Storage",
        ],
      },
      {
        key: "Safety/Security& Legal",
        value: [
          "Attorney",
          "Bail Bonds",
          "Court Reporter",
          "Drug Screening",
          "Locksmith",
          "Other (Safety/Security & Legal)",
          "Private Investigator",
          "Security Guard",
          "Security System services",
        ],
      },
      {
        key: "Transportation",
        value: [
          "Air Transportation",
          "Road Services",
          "Limousine Services",
          "Other (Transportation)",
          "Taxi Services",
          "Towing",
          "Truck Transportation (Fuel)",
          "Truck Transportation (No Fuel)",
        ],
      },
      {
        key: "Other",
        value: ["Other"],
      },
    ])

  useEffect(() => {
    const isResubmit = localStorage.getItem("isResubmission")
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    GetDistrictList("")
    if (data && data.token) {
      setLocData(data)
      if ((data.userType === "dept" && data.district !== undefined) || data.district !== "") {
        applicantDetailsChange({ target: { name: "district", value: data.district } })
        principalBusinessChange({ target: { name: "district", value: data.district } })
      }
    }
    if (isResubmit == "true") {
      setIsResubmission("true")
    } else {
      setIsResubmission("false")
    }
    let LoginData = KeepLoggedIn()
    if (LoginData) {
      setLoginDetails(LoginData)      
    }
    return () => {
      localStorage.removeItem("isResubmission")
    }
  }, [])

  const GetDistrictList = async (token: any) => {
    let result = await CallingAxios(UseGetDistrictList(token))
    if (result.success) {
      setDistrictList(result.data)
    }
  }

  const GetMandalList = async (district: string, saveto: string) => {
    let result = await CallingAxios(
      UseGetMandalList({ districtName: district }, LoginDetails.token)
    )
    if (result.success) {
      switch (saveto) {
        case "applicant":
          setMandalForApplicant(result.data)
          break
        case "principalAddr":
          setMandalForPrincipleAddr(result.data)
          break
        case "otherAddr":
          setMandalForOtherAddr(result.data)
          break
        case "Partner":
          setMandalForPartnerDetails(result.data)
          break
        default:
          break
      }
    }
  }

  const GetVillageList = async (mandal: string, district: string, saveto: string) => {
    let result = await CallingAxios(
      UseGetVillagelList({ districtName: district, mandalName: mandal }, LoginDetails.token)
    )
    if (result.success) {
      switch (saveto) {
        case "applicant":
          setVillageListForApplicant(result.data)
          break
        case "principalAddr":
          setVillageListForPrincipleAddr(result.data)
          break
        case "otherAddr":
          setVillageListForOtherAddr(result.data)
          break
        case "Partner":
          setVillageListForPartnerDetails(result.data)
          break
        default:
          break
      }
    }
  }

  const applicantDetailsChange = (e: any) => {
    let TempDetails: IAApplicantDetailsModel = { ...applicantDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    if (AddName == "district") {
      setMandalForApplicant([])
      setVillageListForApplicant([])
      GetMandalList(AddValue, "applicant")
    }
    if (AddName == "mandal") {
      setVillageListForApplicant([])
      GetVillageList(AddValue, applicantDetails.district, "applicant")
    }
    if (AddName === "select") {
      AddValue = e.target.value
    }
    if (AddName == "name" || AddName == "relation") {
      AddValue = AddValue.replace(/[^\w\s]/gi, "")
      AddValue = AddValue.replace(/[0-9]/gi, "")
    }
    setApplicantDetails({ ...TempDetails, [AddName]: AddValue })
  }

  const contactDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setContactDetails(newInput)
  }

  const firmDetailsChange = (e: any) => {
    let TempDetails: IAFirmDetailsModel = { ...firmDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    if (AddName == "industryType") {
      if (AddValue == "") {
        setBussinessList([])
      } else {
        const data = busList.find((x) => x.key == AddValue)
        if (data?.value) {
          setBussinessList(data.value)
        }
      }
    }
    if (AddName == "atWill") {
      AddValue = e.target.checked
      setFirmDetails({
        ...TempDetails,
        [AddName]: AddValue,
        firmDurationFrom: "",
        firmDurationTo: "",
      })
    } else {
      setFirmDetails({ ...TempDetails, [AddName]: AddValue })
    }
  }

  const principalBusinessChange = (e: any) => {
    let TempDetails: any = { ...principalBusiDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    if (AddName == "district") {
      setMandalForPrincipleAddr([])
      setVillageListForPrincipleAddr([])
      GetMandalList(AddValue, "principalAddr")
    }
    if (AddName == "mandal") {
      setVillageListForPrincipleAddr([])
      GetVillageList(AddValue, TempDetails.district, "principalAddr")
    }
    setPrincipalBusiDetails({ ...TempDetails, [AddName]: AddValue })
  }

  const otherPlaceHandle = (event: any) => {
    setIsOtherChecked(event.target.checked)
  }

  const otherDetailsChange = (event: any) => {
    let tempDetails: any = { ...SelectedOtherbusinessDetails }
    let AddName = event.target.name
    let AddValue = event.target.value
    if (AddName == "district") {
      setMandalForOtherAddr([])
      setVillageListForOtherAddr([])
      GetMandalList(AddValue, "otherAddr")
    }
    if (AddName == "mandal") {
      setVillageListForOtherAddr([])
      GetVillageList(AddValue, tempDetails.district, "otherAddr")
    }
    setSelectedOtherbusinessDetails({ ...tempDetails, [AddName]: AddValue })
  }

  const partnerDetailsChange = (e: any) => {
    let tempDetails: any = { ...SelectedPartnerDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    if (AddName == "district") {
      setMandalForPartnerDetails([])
      setVillageListForPartnerDetails([])
      GetMandalList(AddValue, "Partner")
    }
    if (AddName == "mandal") {
      setVillageListForPartnerDetails([])
      GetVillageList(AddValue, tempDetails.district, "Partner")
    }
    if (AddName == "villageOrCity") {
      console.log("Village changed to:", AddValue)
    }
    if (AddName == "partnerName" || AddName == "relation") {
      AddValue = AddValue.replace(/[^\w\s]/gi, "")
      AddValue = AddValue.replace(/[0-9]/gi, "")
    }
    setSelectedPartnerDetails({ ...tempDetails, [AddName]: AddValue })
    // setSelectedPartnerDetails({
    //   ...tempDetails,
    //   [AddName]: AddValue,
    // });
    setCurrentIndex(currentIndex)
  }

  const addOtherbusinessFields = () => {
    let object: any = { ...SelectedOtherbusinessDetails }
    if (
      object.doorNo == "" ||
      object.villageOrCity == "" ||
      object.street == "" ||
      object.pinCode == "" ||
      object.ceasingDate == "" ||
      object.openingDate == "" ||
      object.placeName == ""
    ) {
      return ShowMessagePopup(false, "Kindly fill all inputs for other place of business.", "")
    }
    let Details: any = [...otherbusinessDetails]
    Details.push(object)
    setOtherBusinessDetails(Details)
    setMandalForOtherAddr([])
    setVillageListForOtherAddr([])
    GetMandalList(firmData.district, "otherAddr")
    GetMandalList(firmData.district, "otherAddr")
    setSelectedOtherbusinessDetails({
      doorNo: "",
      street: "",
      state: "AndhraPradesh",
      district: firmData.district,
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      openingDate: "",
      placeName: "",
      ceasingDate: "",
    })
    ShowMessagePopup(true, "Other Place of Business added successfully.", "")
  }

  const removeOtherbusinessFields = (index: any) => {
    let data: any = [...otherbusinessDetails]
    data.splice(index, 1)
    setOtherBusinessDetails(data)
  }

  const removeSelectedPartner = (index: any) => {
    let data: any = [...partnerDetails]
    data.splice(index, 1)
    setPartnerDetails(data)
  }

  const emailValidation = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regex.test(email.toString())) {
      return false
    } else {
      return true
    }
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return
    }
    if (e.target.files && e.target.files[0].size > 1024000) {
      ShowMessagePopup(false, "File size 1MB size. please upload small size file.", "")
      e.target.value = ""
    }
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.files[0] })
    setFile(newInput)
  }

  const additonalDetailsChange = (e: any) => {
    let tempDetails: IAAdditionalDetailsModel = { ...additionalDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    setAdditionalDetails({ ...tempDetails, [AddName]: AddValue })
  }

  const getApplicantDetail = (field) => {
    if (Array.isArray(dlfFirmdata?.applicantDetails) && dlfFirmdata?.applicantDetails.length > 0) {
      return dlfFirmdata?.applicantDetails[0][field] || applicantDetails[field]
    } else if (dlfFirmdata?.applicantDetails && typeof dlfFirmdata?.applicantDetails === "object") {
      return dlfFirmdata?.applicantDetails[field] || applicantDetails[field]
    }

    return applicantDetails[field]
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if ((partnerDetails && !partnerDetails?.length) || partnerDetails?.length < 1) {
      return ShowMessagePopup(false, "Please add minimum two partners", "")
    }
    if (
      additionalDetails?.applicationProcessedDate === "" ||
      additionalDetails?.applicationProcessedDate === undefined
    ) {
      ShowMessagePopup(false, "Please Select Registration Date")
    }
    if (additionalDetails?.registrationYear === "") {
      ShowMessagePopup(false, "Please Enter Registration Year")
    }
    if (additionalDetails?.registrationNumber === "") {
      ShowMessagePopup(false, "Please Enter Registration Number")
    }
    if (additionalDetails?.submissionResponse === "") {
      return ShowMessagePopup(false, "Please enter Application Submission Details to Proceed")
    }
    const newData = new FormData()
    newData.append("applicantDetails[aadharNumber]", applicantDetails?.aadharNumber)
    newData.append("applicantDetails[name]", applicantDetails?.name)
    newData.append("applicantDetails[surName]", applicantDetails?.surName)
    newData.append("applicantDetails[gender]", applicantDetails?.gender)
    newData.append("applicantDetails[age]", applicantDetails?.age)
    newData.append("applicantDetails[relationType]", applicantDetails?.relationType)
    newData.append("applicantDetails[relation]", applicantDetails?.relation)
    newData.append("applicantDetails[role]", applicantDetails?.role)
    newData.append("applicantDetails[doorNo]", applicantDetails?.doorNo)
    newData.append("applicantDetails[street]", applicantDetails?.street)
    newData.append("applicantDetails[district]", applicantDetails?.district)
    newData.append("applicantDetails[mandal]", applicantDetails?.mandal)
    newData.append("applicantDetails[villageOrCity]", applicantDetails?.villageOrCity)
    newData.append("applicantDetails[pinCode]", applicantDetails?.pinCode)
    newData.append("applicantDetails[country]", "India")
    newData.append("applicantDetails[state]", "Andhra Pradesh")

    newData.append("contactDetails[mobileNumber]", contactDetails?.mobileNumber)
    newData.append("contactDetails[email]", contactDetails?.email)

    newData.append("firmName", firmDetails?.firmName)
    newData.append("district", applicantDetails?.district)
    newData.append(
      "firmDurationFrom",
      firmDetails?.firmDurationFrom ? firmDetails?.firmDurationFrom : ""
    )
    newData.append("firmDurationTo", firmDetails?.firmDurationTo ? firmDetails?.firmDurationTo : "")
    newData.append("industryType", firmDetails?.industryType)
    newData.append("bussinessType", firmDetails?.businessType)
    newData.append("atWill", firmDetails?.atWill ? "true" : "false")
    newData.append(
      "status",
      additionalDetails?.submissionResponse === "Yes" ? "Not Viewed" : "Incomplete"
    )
    newData.append("applicationProcessedDate", additionalDetails?.applicationProcessedDate)
    newData.append("registrationYear", additionalDetails?.registrationYear)
    newData.append("registrationNumber", additionalDetails?.registrationNumber)

    if (principalBusiDetails.type == "Lease") {
      newData.append("leaseAgreement", file?.leaseAgreement)
    }
    newData.append("partnershipDeed", file.partnershipDeed)
    if (principalBusiDetails.type == "Own") {
      newData.append("affidavit", file.affidavit)
    }
    newData.append("selfSignedDeclaration", file.selfSignedDeclaration)
    newData.append(
      "principalPlaceBusiness[placeParticulars]",
      principalBusiDetails.placeParticulars
    )
    newData.append("principalPlaceBusiness[remarks]", principalBusiDetails.remarks)
    newData.append("principalPlaceBusiness[dateOfChange]", principalBusiDetails.dateOfChange)

    newData.append("principalPlaceBusiness[doorNo]", principalBusiDetails.doorNo)
    newData.append("principalPlaceBusiness[street]", principalBusiDetails.street)
    newData.append("principalPlaceBusiness[state]", "Andhra Pradesh")
    newData.append("principalPlaceBusiness[district]", principalBusiDetails.district)
    newData.append("principalPlaceBusiness[mandal]", principalBusiDetails.mandal)
    newData.append("principalPlaceBusiness[villageOrCity]", principalBusiDetails.villageOrCity)
    newData.append("principalPlaceBusiness[pinCode]", principalBusiDetails.pinCode)
    newData.append("principalPlaceBusiness[country]", "India")
    newData.append("principalPlaceBusiness[branch]", "Main")
    newData.append(
      "principalPlaceBusiness[type]",
      principalBusiDetails.type ? principalBusiDetails.type : ""
    )

    for (let j = 0; j < partnerDetails.length; j++) {
      newData.append("firmPartners[" + j + "][aadharNumber]", partnerDetails[j]?.aadharNumber)
      newData.append("firmPartners[" + j + "][partnerName]", partnerDetails[j].partnerName)
      newData.append("firmPartners[" + j + "][partnerSurname]", partnerDetails[j].surName)
      newData.append("firmPartners[" + j + "][relation]", partnerDetails[j].relation)
      newData.append("firmPartners[" + j + "][relationType]", partnerDetails[j].relationType)
      newData.append("firmPartners[" + j + "][role]", partnerDetails[j].role)
      newData.append("firmPartners[" + j + "][age]", partnerDetails[j].age)
      newData.append("firmPartners[" + j + "][doorNo]", partnerDetails[j].doorNo)
      newData.append("firmPartners[" + j + "][street]", partnerDetails[j].street)
      newData.append("firmPartners[" + j + "][district]", partnerDetails[j].district)
      newData.append("firmPartners[" + j + "][mandal]", partnerDetails[j].mandal)
      newData.append("firmPartners[" + j + "][villageOrCity]", partnerDetails[j].villageOrCity)
      newData.append("firmPartners[" + j + "][pinCode]", partnerDetails[j].pinCode)
      newData.append("firmPartners[" + j + "][share]", partnerDetails[j].share)
      newData.append("firmPartners[" + j + "][joiningDate]", partnerDetails[j].joiningDate)
      newData.append("firmPartners[" + j + "][remarks]", partnerDetails[j].remarks)

      newData.append("firmPartners[" + j + "][ceasingDate]", partnerDetails[j].ceasingDate)

      newData.append("firmPartners[" + j + "][mobileNumber]", partnerDetails[j].mobileNumber)
      newData.append("firmPartners[" + j + "][email]", partnerDetails[j].email)
      newData.append("firmPartners[" + j + "][state]", "Andhra Pradesh")
      newData.append("firmPartners[" + j + "][country]", "India")
    }

    for (let j = 0; j < otherbusinessDetails.length; j++) {
      newData.append(
        "otherPlaceBusiness[" + j + "][ceasingDate]",
        otherbusinessDetails[j].ceasingDate
      )
      newData.append("otherPlaceBusiness[" + j + "][placeName]", otherbusinessDetails[j].placeName)
      newData.append(
        "otherPlaceBusiness[" + j + "][openingDate]",
        otherbusinessDetails[j].openingDate
      )
      newData.append("otherPlaceBusiness[" + j + "][doorNo]", otherbusinessDetails[j].doorNo)
      newData.append("otherPlaceBusiness[" + j + "][street]", otherbusinessDetails[j].street)
      newData.append("otherPlaceBusiness[" + j + "][state]", "Andhra Pradesh")
      newData.append("otherPlaceBusiness[" + j + "][district]", otherbusinessDetails[j].district)
      newData.append("otherPlaceBusiness[" + j + "][mandal]", otherbusinessDetails[j].mandal)
      newData.append(
        "otherPlaceBusiness[" + j + "][villageOrCity]",
        otherbusinessDetails[j].villageOrCity
      )
      newData.append("otherPlaceBusiness[" + j + "][pinCode]", otherbusinessDetails[j].pinCode)
      newData.append("otherPlaceBusiness[" + j + "][country]", "India")
      newData.append("otherPlaceBusiness[" + j + "][branch]", "Sub")
    }

    let Result = await CallingAxios(UseSaveDataEntryFirmDetails(newData, LoginDetails.token))
    if (Result.success) {
      ShowMessagePopup(true, "Record Saved SuccessFully", "/reports")
    } else {
      console.log(Result)
      ShowMessagePopup(false, Result.message.message, "")
    }
  }  
  const currentPartner = dlfFirmdata?.firmPartners?.[currentIndex] || {}
  //legacy submit start
  const handleSubmitLegacy = async (e: any) => {
    e.preventDefault()

    if (!partnerDetails || !partnerDetails.length || partnerDetails.length < 2) {
      return ShowMessagePopup(false, "Please add minimum two partners", "")
    }

    if (!additionalDetails?.applicationProcessedDate) {
      return ShowMessagePopup(false, "Please Select Registration Date")
    }

    if (!additionalDetails?.registrationYear) {
      return ShowMessagePopup(false, "Please Enter Registration Year")
    }

    if (!additionalDetails?.registrationNumber) {
      return ShowMessagePopup(false, "Please Enter Registration Number")
    }
    if (!firmDetails.atWill && !(firmDetails.firmDurationFrom && firmDetails.firmDurationTo)) {
      return ShowMessagePopup(false, "Please Select firm Duration date")
    }

    if (!additionalDetails?.submissionResponse) {
      return ShowMessagePopup(false, "Please enter Application Submission Details to Proceed")
    }
    const totalMembers = dlfFirmdata?.firmPartners?.length || 0
    const filledPartners = partnerDetails.filter(
      (partner: { aadharNumber: any; partnerName: any; share: string }) =>
        partner.aadharNumber &&
        partner.partnerName &&
        partner.share &&
        parseFloat(partner.share) >= 0
    ).length;
    if (filledPartners < totalMembers) {
      return ShowMessagePopup(false, `Please add all  member details before proceeding`)
    }
    ///start
    if (currentPartner && currentPartner?.length) {
      let share = 0
      currentPartner.forEach((element: any) => {
        share = element.share != "" ? share + parseFloat(element.share) : share
      })
      if (Math.round(share) != 100) {
        setPreviewBtnClicked(false)
        return ShowMessagePopup(
          false,
          "Please enter proper share for partner it should be 100 percent"
        )
      }
    }
    //end
    const newData = new FormData()

    // Applicant Details
    newData.append("applicantDetails[aadharNumber]", getApplicantDetail("aadharNumber"))
    newData.append("applicantDetails[name]", getApplicantDetail("name"))
    newData.append("applicantDetails[surName]", getApplicantDetail("surName"))
    newData.append("applicantDetails[gender]", applicantDetails?.gender)
    newData.append("applicantDetails[age]", getApplicantDetail("age"))
    newData.append("applicantDetails[relationType]", getApplicantDetail("relationType"))
    newData.append("applicantDetails[relation]", getApplicantDetail("relation"))
    newData.append("applicantDetails[role]", getApplicantDetail("role"))
    newData.append("applicantDetails[doorNo]", getApplicantDetail("doorNo"))
    newData.append("applicantDetails[street]", getApplicantDetail("street"))
    newData.append("applicantDetails[district]", applicantDetails?.district)
    newData.append("applicantDetails[mandal]", getApplicantDetail("mandal"))
    newData.append("applicantDetails[villageOrCity]", applicantDetails.villageOrCity)
    newData.append("applicantDetails[pinCode]", getApplicantDetail("pinCode"))
    newData.append("applicantDetails[address]", applicantDetails?.address)
    newData.append("applicantDetails[country]", "India")
    newData.append("applicantDetails[state]", "Andhra Pradesh")

    // Contact Details
    newData.append("contactDetails[mobileNumber]", contactDetails?.mobileNumber)
    newData.append("contactDetails[email]", contactDetails?.email)

    // Firm Details
    newData.append("firmName", dlfFirmdata?.firmName || firmDetails?.firmName)
    newData.append("district", applicantDetails?.district)
    newData.append("firmDurationFrom", firmDetails?.firmDurationFrom || "")
    newData.append("firmDurationTo", firmDetails?.firmDurationTo || "")
    newData.append("industryType", firmDetails?.industryType)
    newData.append("bussinessType", firmDetails?.businessType)
    newData.append("atWill", firmDetails?.atWill ? "true" : "false")
    newData.append(
      "status",
      additionalDetails?.submissionResponse === "Yes" ? "Not Viewed" : "Incomplete"
    )
    newData.append("applicationProcessedDate", additionalDetails?.applicationProcessedDate)
    newData.append(
      "registrationYear",
      dlfFirmdata?.registrationYear || additionalDetails?.registrationYear
    )
    newData.append(
      "registrationNumber",
      dlfFirmdata?.registrationNumber || additionalDetails?.registrationNumber
    )

    // Files based on business type
    if (principalBusiDetails.type === "Lease") {
      newData.append("leaseAgreement", file?.leaseAgreement)
    }

    newData.append("partnershipDeed", file.partnershipDeed)

    if (principalBusiDetails.type === "Own") {
      newData.append("affidavit", file.affidavit)
    }

    newData.append("selfSignedDeclaration", file.selfSignedDeclaration)

    // Principal Business Place
    newData.append(
      "principalPlaceBusiness[placeParticulars]",
      principalBusiDetails.placeParticulars
    )
    newData.append("principalPlaceBusiness[remarks]", principalBusiDetails.remarks)
    newData.append("principalPlaceBusiness[dateOfChange]", principalBusiDetails.dateOfChange)
    newData.append("principalPlaceBusiness[doorNo]", principalBusiDetails.doorNo)
    newData.append("principalPlaceBusiness[street]", principalBusiDetails.street)
    newData.append("principalPlaceBusiness[state]", "Andhra Pradesh")
    newData.append("principalPlaceBusiness[district]", principalBusiDetails.district)
    newData.append("principalPlaceBusiness[mandal]", principalBusiDetails.mandal)
    newData.append("principalPlaceBusiness[villageOrCity]", principalBusiDetails.villageOrCity)
    newData.append("principalPlaceBusiness[pinCode]", principalBusiDetails.pinCode)
    newData.append("principalPlaceBusiness[country]", "India")
    newData.append("principalPlaceBusiness[branch]", "Main")
    newData.append("principalPlaceBusiness[type]", principalBusiDetails.type || "")

    for (let j = 0; j < partnerDetails.length; j++) {
      const partner = partnerDetails[j]

      if (j === currentIndex && currentPartner) {
        newData.append(
          `firmPartners[${j}][aadharNumber]`,
          currentPartner.aadharNumber || partner.aadharNumber || ""
        )
        newData.append(
          `firmPartners[${j}][partnerName]`,
          currentPartner.partnerName || partner.partnerName || ""
        )
        newData.append(
          `firmPartners[${j}][partnerSurname]`,
          currentPartner.partnerSurname || partner.surName || ""
        )
      } else {
        newData.append(`firmPartners[${j}][aadharNumber]`, partner.aadharNumber || "")
        newData.append(`firmPartners[${j}][partnerName]`, partner.partnerName || "")
        newData.append(`firmPartners[${j}][partnerSurname]`, partner.surName || "")
      }

      // Common partner fields
      newData.append(`firmPartners[${j}][relation]`, partner.relation || "")
      newData.append(`firmPartners[${j}][relationType]`, partner.relationType || "")
      newData.append(`firmPartners[${j}][role]`, partner.role || "")
      newData.append(`firmPartners[${j}][age]`, partner.age || "")
      newData.append(`firmPartners[${j}][doorNo]`, partner.doorNo || "")
      newData.append(`firmPartners[${j}][street]`, partner.street || "")
      newData.append(`firmPartners[${j}][district]`, partner.district || "")
      newData.append(`firmPartners[${j}][mandal]`, partner.mandal || "")
      newData.append(`firmPartners[${j}][villageOrCity]`, partner.villageOrCity || "")
      newData.append(`firmPartners[${j}][pinCode]`, partner.pinCode || "")
      newData.append(`firmPartners[${j}][share]`, partner.share || "")
      newData.append(`firmPartners[${j}][joiningDate]`, partner.joiningDate || "")
      newData.append(`firmPartners[${j}][remarks]`, partner.remarks || "")
      newData.append(`firmPartners[${j}][ceasingDate]`, partner.ceasingDate || "")
      newData.append(`firmPartners[${j}][mobileNumber]`, partner.mobileNumber || "")
      newData.append(`firmPartners[${j}][address]`, partner.address || "")
      newData.append(`firmPartners[${j}][email]`, partner.email || "")
      newData.append(`firmPartners[${j}][state]`, "Andhra Pradesh")
      newData.append(`firmPartners[${j}][country]`, "India")
    }

    // Other Business Details
    for (let j = 0; j < otherbusinessDetails.length; j++) {
      const business = otherbusinessDetails[j]
      newData.append(`otherPlaceBusiness[${j}][ceasingDate]`, business.ceasingDate || "")
      newData.append(`otherPlaceBusiness[${j}][placeName]`, business.placeName || "")
      newData.append(`otherPlaceBusiness[${j}][openingDate]`, business.openingDate || "")
      newData.append(`otherPlaceBusiness[${j}][doorNo]`, business.doorNo || "")
      newData.append(`otherPlaceBusiness[${j}][street]`, business.street || "")
      newData.append(`otherPlaceBusiness[${j}][state]`, "Andhra Pradesh")
      newData.append(`otherPlaceBusiness[${j}][district]`, business.district || "")
      newData.append(`otherPlaceBusiness[${j}][mandal]`, business.mandal || "")
      newData.append(`otherPlaceBusiness[${j}][villageOrCity]`, business.villageOrCity || "")
      newData.append(`otherPlaceBusiness[${j}][pinCode]`, business.pinCode || "")
      newData.append(`otherPlaceBusiness[${j}][country]`, "India")
      newData.append(`otherPlaceBusiness[${j}][branch]`, "Sub")
    }

    try {
      const Result = await CallingAxios(UseSaveDataUserLegacySociety(newData))

      if (Result.success) {
        ShowMessagePopup(true, "Record Saved Successfully", "/reports")
      } else {
        console.error("Error saving data:", Result)
        ShowMessagePopup(false, Result.message?.message || "Failed to save data", "")
      }
    } catch (error) {
      console.error("Exception occurred:", error)
      ShowMessagePopup(false, "An error occurred while saving data", "")
    }
  }

  useEffect(() => {
    setAdditionalDetails((prevState) => ({
      ...prevState,
      registrationNumber: dlfFirmdata.registrationNumber || prevState.registrationNumber,
      registrationYear: dlfFirmdata.registrationYear || prevState.registrationYear,
      applicationProcessedDate:
        dlfFirmdata.applicationProcessedDate || prevState.applicationProcessedDate,
    }))

    if (dlfFirmdata?.firmPartners && dlfFirmdata.firmPartners.length > 0) {
      setPartnerDetails([...dlfFirmdata.firmPartners])
    }
  }, [dlfFirmdata])
  const dispatch = useAppDispatch()
  const ShowAlert = (type: boolean, message: string) => {
    dispatch(PopupAction({ enable: true, type: type, message: message }))
  }
  const updateSelectedPartner = (index: number) => {
    const partnerToEdit = partnerDetails[index]
    if (partnerToEdit) {
      setSelectedPartnerDetails(partnerToEdit)
      setCurrentIndex(index)
      setIsAllPartnersSaved(false);
    }
  }
  const [isAllPartnersSaved, setIsAllPartnersSaved] = useState(false);
  const addPartnerFields = () => {
    let object: any = { ...SelectedPartnerDetails }
    if (!currentPartner.aadharNumber && !SelectedPartnerDetails.aadharNumber) {
      ShowAlert(false, "Please Enter Aadhar number field")
      return
    }
    if (!currentPartner.partnerName && !SelectedPartnerDetails.partnerName) {
      ShowAlert(false, "Please Enter Partner Name field")
      return
    }
    if (
      (!SelectedPartnerDetails.relationType || SelectedPartnerDetails.relationType === "")
    ) {
      ShowAlert(false, "Please enter Relation Type field");
      return;
    }
    if (!TempMemoryPartner.AadharVerified) {
      return ShowMessagePopup(false, "Please verify Aadhaar before saving partner details", "")
    }
    if (!currentPartner.relation && !SelectedPartnerDetails.relation) {
      ShowAlert(false, "Please Enter relation field")
      return
    }
    if (!currentPartner.age && !SelectedPartnerDetails.age) {
      ShowAlert(false, "Please Enter Age field")
      return
    }
    if (!currentPartner.role && !SelectedPartnerDetails.role) {
      ShowAlert(false, "Please Enter Role field")
      return
    }
    if (!currentPartner.doorNo && !SelectedPartnerDetails.doorNo) {
      ShowAlert(false, "Please Enter Door No. field")
      return
    }
    if (!currentPartner.street && !SelectedPartnerDetails.street) {
      ShowAlert(false, "Please Enter Street field")
      return
    }
    if (!SelectedPartnerDetails.remarks) {
      return ShowMessagePopup(false, "Kindly fill the Remarks field", "")
    }
    if (!SelectedPartnerDetails.share) {
      return ShowMessagePopup(false, "Kindly fill the Percentage field", "")
    }
    if (!SelectedPartnerDetails.joiningDate) {
      return ShowMessagePopup(false, "Kindly fill the Joining Date field", "")
    }
    if (!SelectedPartnerDetails.ceasingDate) {
      return ShowMessagePopup(false, "Kindly fill the ceasing Date field", "")
    }
    if (!SelectedPartnerDetails.email) {
      return ShowMessagePopup(false, "Kindly fill the email field", "")
    }
    if (!SelectedPartnerDetails.mobileNumber) {
      return ShowMessagePopup(false, "Kindly fill the Mobile Number field", "")
    }
    const isAadharDuplicate = partnerDetails.some(
      (member, index) =>
        index !== currentIndex && member?.aadharNumber === SelectedPartnerDetails.aadharNumber
    )

    if (isAadharDuplicate) {
      return ShowMessagePopup(false, "This Aadhaar number has already been used", "")
    }

    const currentPartnerData = dlfFirmdata?.firmPartners?.[currentIndex] || {}
    let mergedPartnerData = {
      ...currentPartnerData,
      ...SelectedPartnerDetails,
    }

    Object.keys(mergedPartnerData).forEach((key) => {
      if (!mergedPartnerData[key] && currentPartnerData[key]) {
        mergedPartnerData[key] = currentPartnerData[key]
      }
    })

    // required fields
    const requiredFields = [
      "aadharNumber",
      "partnerName",
      "relation",
      "gender",
      "age",
      "doorNo",
      "street",
      "role",
    ]

    const missingField = requiredFields.find((field) => !mergedPartnerData[field])

    if (missingField) {
      return ShowMessagePopup(false, "Kindly fill all inputs for New Partner", "");
    }
    //calculation
   if (parseInt(object.share) <= 0 || parseInt(object.share) >= 100) {
      return ShowMessagePopup(false, "share should be above 0 and less than 100 percent", "")
    } else if (partnerDetails?.length >= 0) {
      let share = 0
      partnerDetails.forEach((partner: any, index: number) => {
        if (index !== currentIndex && partner.share) {
        share = partner.share != "" ? share + parseFloat(partner.share) : share
        }
      })
      share = share + parseFloat(object.share)
      if (Math.round(share) > 100) {
        return ShowMessagePopup(
          false,
          "Please enter proper share for partner as cummulative total share has exceeded 100 percent"
        )
      }

      if (currentIndex !== -1) {
        const updatedPartners = [...partnerDetails];
        updatedPartners[currentIndex] = { ...object };
        setPartnerDetails(updatedPartners);
        setCurrentIndex(-1);
        setIsAllPartnersSaved(false);
      } else {
        setPartnerDetails([...partnerDetails, object]);
      }

     if (Math.round(share) === 100) {
       setIsAllPartnersSaved(true);
     } else {
       setIsAllPartnersSaved(false);
     }
    } else if (
      partnerDetails?.length > 0 &&
      partnerDetails.some((x: any) => parseInt(x.mobileNumber) == parseInt(object.mobileNumber))
    ) {
      return ShowMessagePopup(
        false,
        "Mobile number is already exist. Please enter new mobile number",
        ""
      )
    }
    let Details = [...partnerDetails]
    if (currentIndex < Details.length) {
      Details[currentIndex] = mergedPartnerData;
    } else {
      Details.push(mergedPartnerData);
    }

    setPartnerDetails(Details)
    setTempMemoryPartner({ OTPRequested: false, AadharVerified: false })
    //
    if (currentIndex < dlfFirmdata?.firmPartners?.length - 1) {
      setCurrentIndex(currentIndex + 1)
      ShowMessagePopup(true, "Partner Details Saved Successfully", "")
    } else {
      ShowMessagePopup(true, "All Partner Details Saved Successfully", "")
    }
    setSelectedPartnerDetails({
      aadharNumber: "",
      applicantName: "",
      surName: "",
      relationType: "",
      relation: "",
      gender: "",
      age: "",
      role: "",
      doorNo: "",
      street: "",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      otpCode: "",
      otpStatus: "",
      otp: "",
      OTPResponse: { transactionNumber: "" },
      KYCResponse: {},
      partnerName: "",
      landPhoneNumber: "",
      mobileNumber: "",
      email: "",
      share: "",
      joiningDate: "",
      remarks: "",
      ceasingDate: "",
    })

    // clearCurrentFirmPartner();
  }


   const CalculateAge = (birthDate: any) => {
    let dataArray = birthDate.split("-")
    const date1: any = new Date(`${dataArray[2]}-${dataArray[1]}-${dataArray[0]}`)
    const current: any = new Date()
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const date2: any = new Date(date)
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    let finalValue = (diffDays / 365).toFixed()
    return finalValue
  }
  const ReqOTP = (MyKey: any) => {
      if (MyKey.aadharNumber && MyKey.aadharNumber.length == 12) {
        CallGetOTP(MyKey)
      } else {
        ShowMessagePopup(false, "Kindly enter valid Aadhar number", "")
      }
  }
  const CallGetOTP = async (MyKey: any) => {
      if (process.env.IGRS_SECRET_KEY) {
        const ciphertext = AES.encrypt(MyKey.aadharNumber.toString(), process.env.IGRS_SECRET_KEY)
        let result = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
        if (result && result.status != "Failure") {
          switch (MyKey) {
            case applicantDetails:
              setTempMemory({ OTPRequested: true, AadharVerified: false })
              break
            case SelectedPartnerDetails:
              setTempMemoryPartner({ OTPRequested: true, AadharVerified: false })
              break
            default:
              break
          }
          switch (MyKey) {
            case applicantDetails:
              setApplicantDetails({ ...MyKey, OTPResponse: result })
              break
            case SelectedPartnerDetails:
              setSelectedPartnerDetails({ ...MyKey, OTPResponse: result })
              break
            default:
              break
          }
          ShowMessagePopup(
            true,
            "The OTP has been sent to your Aadhaar registered mobile number successfully.",
            ""
          )
        }
      } else {
        switch (MyKey) {
          case applicantDetails:
            setApplicantDetails({
              ...MyKey,
              otp: "",
              OTPResponse: { transactionNumber: "" },
              KYCResponse: {},
            })
            setTempMemory({ OTPRequested: false, AadharVerified: false })
            break
          case SelectedPartnerDetails:
            setSelectedPartnerDetails({
              ...MyKey,
              otp: "",
              OTPResponse: { transactionNumber: "" },
              KYCResponse: {},
            })
            setTempMemoryPartner({ OTPRequested: false, AadharVerified: false })
            break
          default:
            break
        }
        ShowMessagePopup(false, "Please Enter Valid Aadhar", "")
      }
  }
  const ReqDetails = async (MyKey: any) => {
      let result = await CallingAxios(
        UseGetAadharDetails({
          aadharNumber: btoa(MyKey.aadharNumber),
          transactionNumber: MyKey?.OTPResponse?.transactionNumber,
          otp: MyKey.otp,
        })
      )
      if (
        result.status &&
        result.status === "Success" &&
        MyKey?.OTPResponse?.transactionNumber == result.transactionNumber.split(":")[1]
      ) {
        let latestData: any = {
          ...MyKey,
          name: result.userInfo.name ? result.userInfo.name : "",
          // partnerName: result.userInfo.name ? result.userInfo.name : "",
          // relationType: result.userInfo.co ? result.userInfo.co.substring(0, 3) : "",
          // relation: result.userInfo.co ? result.userInfo.co.substring(4) : "",
          // age: result.userInfo.dob ? CalculateAge(result.userInfo.dob) : "",
          // gender: result.userInfo.gender == "M" ? "Male" : "Female",
          // district: result.userInfo.dist ? result.userInfo.dist : "",
          // pinCode: result.userInfo.pc ? result.userInfo.pc : "",
          // street: result.userInfo.loc ? result.userInfo.street : "",
          // villageOrCity: result.userInfo.vtc ? result.userInfo.vtc : "",
          // doorNo: result.userInfo.house ? result.userInfo.house : "",
          address:
            (result.userInfo.lm ? result.userInfo.lm + ", \n" : "") +
            (result.userInfo.loc ? result.userInfo.loc + ", \n" : "") +
            (result.userInfo.dist ? result.userInfo.dist + ", \n" : "") +
            (result.userInfo.vtc ? result.userInfo.vtc : "") +
            (result.userInfo.pc ? "-" + result.userInfo.pc : ""),
          OTPResponse: result,
        }
  
        switch (MyKey) {
          case applicantDetails:
            setApplicantDetails(latestData)
            setTempMemory({ OTPRequested: false, AadharVerified: true })
            break
          case SelectedPartnerDetails:
            setSelectedPartnerDetails(latestData)
            setTempMemoryPartner({ OTPRequested: false, AadharVerified: true })
            break
  
          default:
            break
        }
      } else {
        ShowMessagePopup(false, "Please Enter Valid OTP", "")
      }
  }
  
  const handleSearch = async () => {
    let regNumber = applicantDetails.registrationNumber
    let regYear = applicantDetails.registrationYear
    let district = applicantDetails.district
    if (!regNumber && !regYear) {
    ShowMessagePopup(false, "Please enter both Registration Number and Registration Year", "");
    return;
    }
    if (!regNumber) {
      ShowMessagePopup(false, "Please enter Registration Number", "");
     return;
    }

    if (!regYear) {
      ShowMessagePopup(false, "Please enter a valid Registration Year", "");
      return;
    }

    setCurrentIndex(0);
    try {
      const result = await UseGetFraDetails(regNumber,regYear,district)      
      if (result?.status == false) {
        const msg = result.message 
        return ShowMessagePopup(false, msg, "");
      }

      if (result) {
        setDlfFirmdata(result)
        const applicantData = Array.isArray(result?.applicantDetails) 
        ? result?.applicantDetails[0] 
        : result?.applicantDetails;
      
      if (applicantData) {
        setApplicantDetails({
          ...applicantDetails,
          aadharNumber: applicantData?.aadharNumber || "",
          name: applicantData?.name || "",
          relationType: applicantData?.relationType || "",          
          age: applicantData?.age || "",
          gender: applicantData?.gender || "",
          role: applicantData?.role || "",
          doorNo: applicantData?.doorNo || "",
          street: applicantData?.street || "",
          pinCode: applicantData?.pinCode || "",          
          registrationNumber: regNumber,
          registrationYear: regYear,
        });
      }
        ShowMessagePopup(true, "Data Fetched SuccessFully", "")
        console.log("result",result)
      } else {        
        ShowMessagePopup(false, "Registration Number or Registration Year Not Found", "")

      }
    } catch (error) {
      console.error("Error in Axios call:", error)
    }
  }
  //end
  useEffect(() => {
    if (otherbusinessDetails.length > 0) {
      setIsOtherChecked(false);
    }
  }, [otherbusinessDetails]);

  return (
    <>
      <Head>
        <title>Data Entry for Firms</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      <div className={styles.RegistrationMain}>            
              <div className="societyRegSec">
                <Container>
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <div className="d-flex justify-content-between align-items-center page-title mb-2">
                        <div className="pageTitleLeft">
                          <h1>Please Update the legacy data</h1>
                        </div>

                        <div className="pageTitleRight">
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
                <Form
                  className={`formsec ${styles.RegistrationInput}`}
                  onSubmit={handleSubmitLegacy}
                  encType="multipart/form-data"
                >
                  <Container>
                    <div className="regofAppBg mb-3">
                       <Row className="mb-3">
                        <Col lg={3} md={3} xs={12}>
                          <TableText
                            label="Enter Registration Number"
                            required={true}                            
                          />
                          <TableInputText
                            type="text"
                            placeholder="Enter Registration Number"
                            required={false}
                            name={"registrationNumber"}
                            value={applicantDetails.registrationNumber || ""}
                            onChange={(e: any) => applicantDetailsChange(e)}
                            maxLength={4}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12}>
                          <TableText
                            label="Enter Registration Year"
                            required={true}                            
                          />
                          <TableInputText
                            type="text"
                            placeholder="Enter Registration Year"
                            required={true}
                            name={"registrationYear"}
                            value={applicantDetails.registrationYear  || ""}
                            onChange={(e: any) => applicantDetailsChange(e)}
                            maxLength={4}
                          />
                        </Col>
                         <Col lg={3} md={4} xs={12} className="mb-3">
                          <TableText label="District" required={true} />                          
                          <TableDropdownSRO
                            keyName={"name"}
                            required={true}
                            options={DistrictList}
                            name={"district"}
                            value={locData.district ? locData.district : applicantDetails.district}
                            disabled={locData.district ? true : false}
                            onChange={applicantDetailsChange}
                          />
                        </Col>
                        {/* <Col lg={2} md={4} xs={12} className="mb-3">
                          <TableText label="Old District" required={false} />
                          <TableDropdownSRO
                            keyName={"name"}
                            required={false}
                            options={DistrictList}
                            name={"district"}
                            value={applicantDetails.district}
                            onChange={applicantDetailsChange}
                          />
                        </Col> */}
                        <Col lg={3} md={3} xs={12} className="mt-4">
                          <div className="mt-4">
                            <button
                              type='button'
                              className="btn btn-primary"
                              name="btn2"
                              value="Save"
                              onClick={handleSearch}                              
                            >
                              SEARCH
                            </button>
                          </div>
                        </Col>
                      </Row>
                      <div className="formSectionTitle">
                        <h3>Applicant Details</h3>
                      </div>

                      <Row>
                        {/* <Col lg={3} md={3} xs={12} className="mb-3">
                          <Form.Group>
                            <TableText label="Enter Aadhaar Number" required={true} />
                            <div className="formGroup">
                              <TableInputText
                                type="text"
                                placeholder="Enter Aadhaar Number"
                                required={true}
                                maxLength={12}
                                name={"aadharNumber"}
                                value={getApplicantDetail("aadharNumber")}
                                onChange={(e: any) => applicantDetailsChange(e)}
                                onKeyPress={true}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                            </div>
                          </Form.Group>
                        </Col> */}
                        <Col lg={3} md={3} xs={12} className="mb-3">
                        {!TempMemory.OTPRequested ? (
                          <Form.Group>
                            <TableText label="Enter Aadhaar Number" required={true} />
                            <div className="formGroup">
                              <TableInputText
                                disabled={TempMemory.AadharVerified}
                                type={"text"}
                                maxLength={12}
                                dot={false}
                                placeholder="Enter Aadhaar Number"
                                required={true}
                                name={"aadharNumber"}
                                value={applicantDetails.aadharNumber}
                                onChange={(e: any) => {
                                  if (!TempMemory.AadharVerified) {
                                    applicantDetailsChange(e)
                                  }
                                }}
                                onKeyPress={true}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                              {!TempMemory.AadharVerified ? (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "2px",
                                  }}
                                  onClick={() => ReqOTP(applicantDetails)}
                                  className="verify btn btn-primary"
                                >
                                  Get OTP
                                </div>
                              ) : null}
                            </div>
                          </Form.Group>
                        ) : (
                          <Form.Group>
                            <TableText label="Enter OTP" required={true} />
                            <div className="formGroup">
                              <TableInputText
                                disabled={false}
                                type="number"
                                placeholder="Enter OTP Received"
                                maxLength={6}
                                required={true}
                                name={"otp"}
                                value={applicantDetails.otp || ""}
                                onChange={applicantDetailsChange}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "2px",
                                }}
                                onClick={() => {
                                  ReqDetails(applicantDetails)
                                }}
                                className="verify btn btn-primary"
                              >
                                Verify
                              </div>
                              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <div
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "20px",
                                    color: "blue",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => {
                                    setTempMemory({ ...TempMemory, OTPRequested: false })
                                  }}
                                >
                                  clear
                                </div>
                              </div>
                            </div>
                          </Form.Group>
                        )}
                      </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Name of the Applicant" required={true} />
                          <TableInputText
                            type="text"
                            placeholder="Enter Name of the Applicant"
                            required={true}
                            name={"name"}
                            value={getApplicantDetail("name")}
                            onChange={(e: any) => applicantDetailsChange(e)}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>

                        <Col lg={3} md={2} xs={12} className="mb-3">
                          <TableText label={"Relation type and Name"} required={true} />
                          <div className={styles.relationData}>
                            <select
                              className={styles.selectData}
                              required={true}
                              name={"relationType"}
                              value={getApplicantDetail("relationType")}
                              onChange={applicantDetailsChange}
                            >
                              <option value={""}>Select</option>
                              <option value={"S/O"}>S/O</option>
                              <option value={"W/O"}>W/O</option>
                              <option value={"D/O"}>D/O</option>
                            </select>
                            <TableInputText
                              capital={true}
                              type="text"
                              placeholder="Enter Relation type and Name"
                              required={true}
                              name={"relation"}
                              value={getApplicantDetail("relation")}
                              onChange={(e: any) => applicantDetailsChange(e)}
                              onPaste={(e: any) => e.preventDefault()}
                            />
                          </div>
                        </Col>

                        {/* <Col lg={3} md={3} xs={12}>
                    <TableText label="Surname" required={true}  />
                    <TableInputText disabled={false} type='text' placeholder='Enter Applicant SirName' required={true} name={'surName'} value={applicantDetails.surName} onChange={applicantDetailsChange} />
                  </Col> */}

                        <Col lg={3} md={3} xs={12}>
                          <TableText label="Age" required={true} />
                          <TableInputText
                            type="number"
                            placeholder="Enter Age"
                            required={true}
                            name={"age"}
                            maxLength={3}
                            value={getApplicantDetail("age")}
                            onChange={(e: any) => applicantDetailsChange(e)}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>

                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Gender" required={true} />
                          <TableDropdownSRO
                            keyName={"label"}
                            required={true}
                            options={[
                              { label: "Male", value: "Male" },
                              { label: "Female", value: "Female" },
                              { label: "Others", value: "Others" },
                            ]}
                            name={"gender"}
                            value={applicantDetails.gender}
                            onChange={applicantDetailsChange}
                          />
                        </Col>

                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Role" required={true} />
                          <TableInputText
                            disabled={false}
                            type="text"
                            placeholder="Enter Role"
                            required={true}
                            name={"role"}
                            value={getApplicantDetail("role")}
                            onChange={applicantDetailsChange}
                            maxLength={50}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                      </Row>

                      <div className="regFormBorder"></div>

                      <div className="formSectionTitle">
                        <h3>Address Details</h3>
                      </div>
                      <Row>
                        <Col lg={6} md={4} xs={12} className="mb-3">
                          <TableText label="Address" required={true} />
                          <textarea
                            className="form-control textarea"
                            disabled={false}
                            placeholder="Enter Address"
                            required={false}
                            name={"address"}
                            value={applicantDetails.address}
                            onChange={applicantDetailsChange}
                            maxLength={10000}
                          ></textarea>
                        </Col>
                        <Col lg={3} md={4} xs={12} className="mb-3">
                          <TableText label="Mobile No" required={true} />
                          <TableInputText
                            type="number"
                            dot={false}
                            maxLength={10}
                            placeholder="Enter Mobile No"
                            required={true}
                            name={"mobileNumber"}
                            value={contactDetails.mobileNumber}
                            onChange={contactDetailsChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>

                        <Col lg={3} md={4} xs={12} className="mb-3">
                          <TableText label="Email ID" required={true} />
                          <Form.Control
                            disabled={false}
                            type="email"
                            placeholder="Enter Email ID"
                            required={true}
                            name="email"
                            value={contactDetails.email}
                            onChange={contactDetailsChange}
                            autoComplete="new-off"
                            maxLength={100}
                            minLength={15}
                            onBlurCapture={() => {
                              if (
                                !emailValidation(contactDetails.email) &&
                                contactDetails.email != ""
                              ) {
                                ShowMessagePopup(false, "Enter Valid email ID", "")
                                setContactDetails({ ...contactDetails, email: "" })
                              }
                            }}
                            onPaste={(e: any) => e.preventDefault()}
                          />                          
                        </Col>
                      </Row>
                      <div className="regFormBorder"></div>
                    </div>

                    <div className="regofAppBg mb-3">
                      <div className="formSectionTitle">
                        <h3>Firm Details</h3>
                      </div>

                      <Row>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Firm Name" required={true} />
                          <TableInputText
                            type="text"
                            placeholder="Enter Firm Name"
                            required={true}
                            name={"firmName"}
                            value={dlfFirmdata.firmName?.trim() || firmDetails.firmName?.trim()}
                            onChange={firmDetailsChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>

                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <Form.Group>
                            <div className="checkBox">
                              <TableText label="Firm Duration(From-To)" required={true} />
                              <input
                                type="checkbox"
                                className="ms-3"
                                name="atWill"
                                onChange={firmDetailsChange}
                                checked={firmDetails.atWill}
                              />{" "}
                              <span
                                style={{
                                  fontFamily: "Montserrat",
                                  fontWeight: 600,
                                  color: "black",
                                  fontSize: "12px",
                                  lineHeight: "20px",
                                  display: "block",
                                }}
                              >
                                At Will
                              </span>
                            </div>

                            <div className="d-flex justify-content-between firmDurationInfo">
                              <Form.Control
                                disabled={false}
                                type="date"
                                placeholder="DD/MM/YYYY"
                                name="firmDurationFrom"
                                onChange={firmDetailsChange}
                                value={firmDetails.firmDurationFrom}
                                className="durationFrom"
                                required
                              />
                              <div className="middleLabel">TO</div>
                              <Form.Control
                                disabled={firmDetails.atWill}
                                type="date"
                                placeholder="DD/MM/YYYY"
                                name="firmDurationTo"
                                onChange={firmDetailsChange}
                                value={firmDetails.firmDurationTo}
                                className="durationTo"
                                min={moment(moment().toDate()).format("YYYY-MM-DD")}
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg={3} md={3} xs={3}>
                          <TableText label="Date of Registration" required={true} />
                          <TableSelectDate
                            placeholder="DD/MM/YYYY"
                            required={false}
                            value={additionalDetails.applicationProcessedDate}
                            onChange={additonalDetailsChange}
                            name={"applicationProcessedDate"}
                          />
                          {/* <Form.Control
                        type="date"
                        placeholder="DD/MM/YYYY"
                        name="applicationProcessedDate"
                        value={additionalDetails.applicationProcessedDate}
                        onChange={additonalDetailsChange}
                      /> */}
                        </Col>
                        <Col lg={3} md={3} xs={3}>
                          <TableText label="Firm Register No." required={true} />
                          <TableInputText
                            type="number"
                            maxLength={4}
                            placeholder="Enter Registration Number"
                            required={true}
                            dot={false}
                            name={"registrationNumber"}
                            value={
                              additionalDetails.registrationNumber ||
                              dlfFirmdata.registrationNumber ||
                              ""
                            }
                            onChange={additonalDetailsChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={3}>
                          <TableText label="Registration Year" required={true} />
                          <TableInputText
                            type="number"
                            maxLength={4}
                            placeholder="Enter Registration Year"
                            required={true}
                            dot={false}
                            name={"registrationYear"}
                            value={
                              dlfFirmdata.registrationYear || additionalDetails.registrationYear
                            }
                            onChange={additonalDetailsChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Industry Type" required={true} />
                          {/* <TableInputText disabled={false} type='text' placeholder="Industry Type" required={true} name={"industryType"} value={firmData.industryType} onChange={firmDetailsChange} /> */}
                          <TableDropdown
                                required={true}
                                options={[
                                  "Agriculture & Forestry/wildlife",
                                  "Business & Information",
                                  "Construction/Utilities Contracting",
                                  "Education",
                                  "Finance & Insurance",
                                  "Food & Hospitality",
                                  "Gaming",
                                  "Health Services",
                                  "Motor vehicles",
                                  "Natural Resources/Environmental",
                                  "Personal Services",
                                  "Real Estate & Housing",
                                  "Safety/Security& Legal",
                                  "Transportation",
                                  "Other",
                                ]}
                                name={"industryType"}
                                value={firmDetails.industryType}
                                onChange={firmDetailsChange}
                              />
                        </Col>

                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Business Type" required={true} />
                          {/* <TableInputText disabled={false} type='text' placeholder="Business Type" required={true} name={"businessType"} value={firmDetails.businessType} onChange={firmDetailsChange} /> */}
                          <TableDropdown
                            required={true}
                            options={[...bussinessList]}
                            name={"businessType"}
                            value={firmDetails.businessType}
                            onChange={firmDetailsChange}
                          />
                        </Col>
                      </Row>
                      <div className="regFormBorder"></div>
                      <Row>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Door No" required={true} />
                          <TableInputText
                            type="text"
                            placeholder="Door No"
                            required={true}
                            name={"doorNo"}
                            // value={dlfFirmdata?.principalPlaceBusiness?.[0]?.doorNo || ""}
                            value={principalBusiDetails.doorNo}
                            onChange={principalBusinessChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Street" required={true} />
                          <TableInputText
                            type="text"
                            placeholder="Street"
                            required={true}
                            name={"street"}
                            // value={dlfFirmdata?.principalPlaceBusiness?.[0]?.street || ""}
                            value={principalBusiDetails.street}
                            onChange={principalBusinessChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="State" required={true} />
                          <TableInputText
                            disabled={true}
                            type="text"
                            placeholder="State"
                            required={true}
                            name={"state"}
                            value={principalBusiDetails.state}
                            onChange={() => {}}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="District" required={true} />
                          <TableDropdownSRO
                            keyName={"name"}
                            disabled={locData.district ? true : false}
                            required={true}
                            options={DistrictList}
                            name={"district"}
                            value={
                              locData.district ? locData.district : principalBusiDetails.district
                            }
                            onChange={principalBusinessChange}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Mandal" required={true} />
                          <TableDropdownSRO
                            keyName={"mandalName"}
                            required={true}
                            options={MandalForPrincipleAddr}
                            name={"mandal"}
                            value={principalBusiDetails.mandal}
                            onChange={principalBusinessChange}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Village/City" required={true} />
                          {/* <TableInputText
                        type="text"
                        maxLength={6}
                        placeholder="Enter villageOrCity"
                        required={true}
                        name={"villageOrCity"}
                        dot={false}
                        value={principalBusiDetails.villageOrCity}
                        onChange={principalBusinessChange}
                      /> */}
                          <TableDropdownSRO
                            keyName="villageName"
                            required={true}
                            options={VillageListForPrincipleAddr}
                            name={"villageOrCity"}
                            value={principalBusiDetails.villageOrCity}
                            // value={dlfFirmdata?.principalPlaceBusiness?.[0]?.villageOrCity || ""}
                            onChange={principalBusinessChange}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="PIN Code" required={true} />
                          <TableInputText
                            type="text"
                            maxLength={6}
                            placeholder="PIN Code"
                            required={true}
                            name={"pinCode"}
                            dot={false}
                            value={principalBusiDetails.pinCode}
                            onChange={principalBusinessChange}
                            onPaste={(e: any) => e.preventDefault()}
                          />
                        </Col>
                        <Col lg={3} md={3} xs={12}>
                          <TableText label="Type" required={true} />
                          <div className="firmRegList formsec">
                            <Form.Check
                              inline
                              label="Own"
                              value="Own"
                              name="type"
                              type="radio"
                              className="fom-checkbox"
                              onChange={principalBusinessChange}
                              checked={principalBusiDetails.type == "Own"}
                            />
                            <Form.Check
                              inline
                              label="Lease"
                              value="Lease"
                              name="type"
                              type="radio"
                              className="fom-checkbox"
                              onChange={principalBusinessChange}
                              checked={principalBusiDetails.type == "Lease"}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="regofAppBg mb-3">
                      <div className="FirmSecNew mb-3">
                        {!isAllPartnersSaved && (
                        <>
                        <div className="NewFirmSecTitle">
                          <Row>
                            <Col lg={12} md={12} xs={12}>
                              <h3>Partner Details</h3>
                            </Col>
                          </Row>
                        </div>
                        <div className="regofAppBg mb-3">
                          <Row>
                            {/* <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <TableText label="Enter Aadhaar Number" required={true} />
                                <div className="formGroup">
                                  <TableInputText
                                    type="text"
                                    maxLength={12}
                                    placeholder="Enter Aadhaar Number"
                                    required={false}
                                    dot={false}
                                    name={"aadharNumber"}
                                    value={
                                      currentPartner.aadharNumber ||
                                      SelectedPartnerDetails.aadharNumber
                                    }
                                    onChange={(e: any) => partnerDetailsChange(e)}
                                    onKeyPress={true}
                                    onPaste={(e: any) => e.preventDefault()}
                                  />
                                </div>
                              </Form.Group>
                            </Col> */}
                            <Col lg={3} md={3} xs={12} className="mb-3">
                                                        {!TempMemoryPartner.OTPRequested ? (
                                                          <Form.Group>
                                                            <TableText label="Enter Aadhaar Number" required={true} />
                                                            <div className="formGroup">
                                                              <TableInputText
                                                                disabled={TempMemoryPartner.AadharVerified}
                                                                type="text"
                                                                maxLength={12}
                                                                placeholder="Enter Aadhaar Number"
                                                                required={false}
                                                                dot={false}
                                                                name={"aadharNumber"}
                                                                value={SelectedPartnerDetails.aadharNumber}
                                                                onChange={(e: any) => {
                                                                  if (!TempMemoryPartner.AadharVerified) {
                                                                    partnerDetailsChange(e)
                                                                  }
                                                                }}
                                                                onKeyPress={true}
                                                                onPaste={(e) => e.preventDefault()}
                                                              />
                                                              {!TempMemoryPartner.AadharVerified ? (
                                                                <div
                                                                  style={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    borderRadius: "2px",
                                                                  }}
                                                                  onClick={() => ReqOTP(SelectedPartnerDetails)}
                                                                  className="verify btn btn-primary"
                                                                >
                                                                  Get OTP
                                                                </div>
                                                              ) : null}
                                                            </div>
                                                          </Form.Group>
                                                        ) : (
                                                          <Form.Group>
                                                            <TableText label="Enter OTP" required={true} />
                                                            <div className="formGroup">
                                                              <TableInputText
                                                                disabled={false}
                                                                type="number"
                                                                placeholder="Enter OTP Received"
                                                                maxLength={6}
                                                                required={true}
                                                                name={"otp"}
                                                                value={SelectedPartnerDetails.otp || ""}
                                                                onChange={partnerDetailsChange}
                                                              />
                                                              <div
                                                                style={{
                                                                  display: "flex",
                                                                  justifyContent: "center",
                                                                  alignItems: "center",
                                                                  borderRadius: "2px",
                                                                }}
                                                                onClick={() => {
                                                                  ReqDetails(SelectedPartnerDetails)
                                                                }}
                                                                className="verify btn btn-primary"
                                                              >
                                                                Verify
                                                              </div>
                                                              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                                <div
                                                                  style={{
                                                                    cursor: "pointer",
                                                                    marginRight: "20px",
                                                                    color: "blue",
                                                                    fontSize: "10px",
                                                                  }}
                                                                  onClick={() => {
                                                                    setTempMemoryPartner({
                                                                      ...TempMemoryPartner,
                                                                      OTPRequested: false,
                                                                    })
                                                                  }}
                                                                >
                                                                  clear
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </Form.Group>
                                                        )}
                                                      </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Name of the Partner" required={true} />
                              <TableInputText
                                type="text"
                                placeholder="Enter Name of the Partner"
                                required={false}
                                name={"partnerName"}
                                onPaste={(e: any) => e.preventDefault()}
                                value={
                                  currentPartner.partnerName 
                                }
                                onChange={partnerDetailsChange}
                              />
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label={"Relation type and Name"} required={true} />
                              <div className={styles.relationData}>
                                <select
                                  className={styles.selectData}
                                  required={true}
                                  name={"relationType"}
                                  value={
                                    SelectedPartnerDetails.relationType || ""
                                  }
                                  onChange={partnerDetailsChange}
                                >
                                  <option value={""}>Select</option>
                                  <option value={"S/O"}>S/O</option>
                                  <option value={"W/O"}>W/O</option>
                                  <option value={"D/O"}>D/O</option>
                                </select>
                                <TableInputText
                                  capital={true}
                                  type="text"
                                  placeholder="Enter Relation type and Name"
                                  required={true}
                                  name={"relation"}
                                  value={currentPartner.relation || SelectedPartnerDetails.relation}
                                  onChange={partnerDetailsChange}
                                  onPaste={(e: any) => e.preventDefault()}
                                />
                              </div>
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Age" required={true} />
                              <TableInputText
                                type="number"
                                maxLength={3}
                                placeholder="Enter Age"
                                required={false}
                                dot={false}
                                name={"age"}
                                value={currentPartner.age || SelectedPartnerDetails.age}
                                onChange={partnerDetailsChange}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Gender" required={true} />
                              <TableDropdownSRO
                                keyName={"label"}
                                required={false}
                                options={[
                                  { label: "Male", value: "Male" },
                                  { label: "Female", value: "Female" },
                                  { label: "Others", value: "Others" },
                                ]}
                                name={"gender"}
                                value={SelectedPartnerDetails.gender}
                                onChange={partnerDetailsChange}
                              />
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Role" required={true} />
                              <TableInputText
                                type="text"
                                placeholder="Enter Role"
                                required={false}
                                name={"role"}
                                value={currentPartner.role || SelectedPartnerDetails.role}
                                onChange={partnerDetailsChange}
                                maxLength={50}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Joining Date" required={true} />
                              <TableSelectDate
                                placeholder="DD/MM/YYYY"
                                required={false}
                                value={SelectedPartnerDetails.joiningDate}
                                onChange={partnerDetailsChange}
                                name={"joiningDate"}
                              />
                              {/* <TableInputText
                            type="date"
                            placeholder="DD/MM/YYYY"
                            name="joiningDate"
                            required={false}
                            value={dlfFirmdata?.firmPartners?.[0]?.joiningDate}
                            value={SelectedPartnerDetails.joiningDate}
                            onChange={partnerDetailsChange}
                          /> */}
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Date of Ceasing" required={true} />
                              <TableSelectDate
                                placeholder="DD/MM/YYYY"
                                required={false}
                                value={SelectedPartnerDetails.ceasingDate}
                                onChange={partnerDetailsChange}
                                name={"ceasingDate"}
                              />
                              {/* <TableInputText
                            type="date"
                            placeholder="DD/MM/YYYY"
                            name="ceasingDate"
                            required={false}
                            value={SelectedPartnerDetails.ceasingDate}
                            onChange={partnerDetailsChange}
                          /> */}
                            </Col>
                            <Col lg={6} md={4} xs={12} className="mb-3">
                              <TableText label="Remarks" required={true} />
                              <textarea
                                className="form-control textarea"
                                disabled={false}
                                placeholder="Enter Remarks"
                                required={false}
                                name={"remarks"}
                                value={SelectedPartnerDetails.remarks}
                                onChange={partnerDetailsChange}
                                maxLength={10000}
                              ></textarea>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Partner Percentage(%)" required={true} />
                              <TableInputText
                                type="text"
                                maxLength={3}
                                placeholder="Enter Share Percentage"
                                required={false}
                                name={"share"}
                                value={SelectedPartnerDetails.share}
                                onChange={partnerDetailsChange}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                            </Col>
                          </Row>

                          <div className="regFormBorder"></div>

                          <div className="formSectionTitle">
                            <h3>Address Details</h3>
                          </div>
                          <Row>
                             <Col lg={6} md={4} xs={12} className="mb-3">
                              <TableText label="Address" required={true} />
                              <textarea
                                className="form-control textarea"
                                disabled={false}
                                placeholder="Enter Address"
                                required={false}
                                name={"address"}
                                value={SelectedPartnerDetails.address}
                                onChange={partnerDetailsChange}
                                maxLength={10000}
                              ></textarea>
                            </Col>
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <TableText label="Mobile No" required={true} />
                              <TableInputText
                                type="number"
                                dot={false}
                                maxLength={10}
                                placeholder="Enter Mobile No"
                                required={false}
                                name={"mobileNumber"}
                                value={SelectedPartnerDetails.mobileNumber}
                                onChange={partnerDetailsChange}
                                onPaste={(e: any) => e.preventDefault()}
                              />
                            </Col>
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <TableText label="Email ID" required={true} />
                              {/* <Form.Control
                           disabled={false}
                            type="email"
                            placeholder="Enter Email ID"
                            required={false}
                            name="email"
                            value={SelectedPartnerDetails.email}
                            onChange={partnerDetailsChange}
                            autoComplete="new-off"
                            maxLength={100}
                            minLength={15}
                            onPaste={(e: any) => e.preventDefault()}
                          /> */}
                              <TableInputText
                                type="email"
                                placeholder="Enter Email ID"
                                required={false}
                                name={"email"}
                                maxLength={100}
                                value={SelectedPartnerDetails.email}
                                onChange={partnerDetailsChange}
                                onPaste={(e: any) => e.preventDefault()}
                                onBlurCapture={() => {
                                  if (
                                    !emailValidation(SelectedPartnerDetails.email) &&
                                    SelectedPartnerDetails.email != ""
                                  ) {
                                    ShowMessagePopup(false, "Enter Valid emailID", "")
                                    setSelectedPartnerDetails({
                                      ...SelectedPartnerDetails,
                                      email: "",
                                    })
                                  }
                                }}
                              />
                            </Col>
                          </Row>
                          <div className="regFormBorder"></div>
                        </div>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                          <div
                            className="btn btn-primary "
                            style={{ justifySelf: "end" }}
                            onClick={() => {
                              addPartnerFields()
                            }}
                          >
                            Save
                          </div>
                        </div>
                        </>
                         )}
                        {partnerDetails && partnerDetails.length ? (
                          <div className="addedPartnerSec mt-3">
                            <div >
                          <Row>
                            <Col lg={6} md={12} xs={12}>
                              <h5>Partner Details</h5>
                            </Col>
                          </Row>
                          </div>
                            <Row className="mb-4">
                              <Col lg={12} md={12} xs={12}>
                                <Table striped bordered className="tableData listData">
                                  <thead>
                                    <tr>
                                      <th>Aadhaar Number</th>
                                      <th>Partner Name</th>
                                      <th>Age</th>
                                      <th>Role</th>
                                      <th>Contact Number</th>
                                      <th>Address</th>
                                      <th>Share</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {partnerDetails.map((item: any, i: number) => {
                                      return (
                                        <tr key={i + 1}>
                                          <td>{item.aadharNumber}</td>
                                          <td>{item.partnerName}</td>
                                          <td>{item.age}</td>
                                          <td>{item.role}</td>
                                          <td>{item.mobileNumber}</td>
                                          <td>{item.address}</td>
                                          <td>{item.share}</td>
                                          <td className="text-center">
                                          {" "}
                                          <Image
                                            alt="Edit"
                                            height={18}
                                            width={17}
                                            src="/firmsHome/assets/edit-icon.svg"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => updateSelectedPartner(i)}
                                          />
                                          </td>
                                          {/* <td>
                              {" "}
                              <Image
                              alt="Image"
                              height={18}
                              width={17}
                              src="/firmsHome/assets/delete-icon.svg"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                              removeSelectedPartner(i)
                              }}
                            />
                          </td> */}
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="regofAppBg mb-3">
                      <div className="formSectionTitle">
                        <h3>Principal Place of Business</h3>
                      </div>

                      <Row>
                        <Col lg={6} md={4} xs={12} className="mb-3">
                          <TableText label="Particulars regarding the place" required={true} />
                          <textarea
                            className="form-control textarea"
                            disabled={false}
                            placeholder="Enter Particulars"
                            required={true}
                            name={"placeParticulars"}
                            value={principalBusiDetails.placeParticulars}
                            onChange={principalBusinessChange}
                            maxLength={10000}
                          ></textarea>
                        </Col>
                        <Col lg={6} md={4} xs={12} className="mb-3">
                          <TableText label="Remarks" required={true} />
                          <textarea
                            className="form-control textarea"
                            disabled={false}
                            placeholder="Enter Remarks"
                            required={true}
                            name={"remarks"}
                            value={principalBusiDetails.remarks}
                            onChange={principalBusinessChange}
                            maxLength={10000}
                          ></textarea>
                        </Col>
                        <Col lg={3} md={3} xs={12} className="mb-3">
                          <TableText label="Date Of Change" required={true} />
                          <TableSelectDate
                            placeholder="DD/MM/YYYY"
                            required={true}
                            value={principalBusiDetails.dateOfChange}
                            onChange={principalBusinessChange}
                            name={"dateOfChange"}
                          />
                          {/* <TableInputText
                        type="date"
                        placeholder="DD/MM/YYYY"
                        name="dateOfChange"
                        required={false}
                        value={principalBusiDetails.dateOfChange}
                        onChange={principalBusinessChange}
                      /> */}
                        </Col>
                      </Row>
                    </div>
                    <div className="regofAppBg mb-3">
                      <Row>
                        <Col lg={12} md={12} xs={12} className="mb-3">
                          <div className="firmDuration">
                            <Form.Check
                              inline
                              label="Please add Other Place of Business (If any)"
                              value="Please add Other Place of Business (If any)"
                              name="atwill"
                              type="checkbox"
                              className="fom-checkbox"
                              checked={IsOtherChecked}
                              onChange={otherPlaceHandle}
                            />
                          </div>
                        </Col>
                      </Row>

                      {IsOtherChecked ? (
                        <div className="FirmSecNew mb-3">
                          <div className="NewFirmSecTitle">
                            <Row>
                              <Col lg={12} md={12} xs={12}>
                                <h3>Other Place of Business</h3>
                              </Col>
                            </Row>
                          </div>
                          <div className="regofAppBg mb-3">
                            <Row>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Door No" required={true} />
                                <TableInputText
                                  type="text"
                                  placeholder="Door No"
                                  required={true}
                                  name={"doorNo"}
                                  value={SelectedOtherbusinessDetails.doorNo}
                                  onChange={otherDetailsChange}
                                  onPaste={(e: any) => e.preventDefault()}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Street" required={true} />
                                <TableInputText
                                  type="text"
                                  placeholder="Street"
                                  required={true}
                                  name={"street"}
                                  value={SelectedOtherbusinessDetails.street}
                                  onChange={otherDetailsChange}
                                  onPaste={(e: any) => e.preventDefault()}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="State" required={true} />
                                <TableInputText
                                  disabled={true}
                                  type="text"
                                  placeholder="State"
                                  required={true}
                                  name={"state"}
                                  value={SelectedOtherbusinessDetails.state}
                                  onChange={otherDetailsChange}
                                  onPaste={(e: any) => e.preventDefault()}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="District" required={true} />
                                <TableDropdownSRO
                                  keyName={"name"}
                                  required={true}
                                  options={DistrictList}
                                  name={"district"}
                                  value={SelectedOtherbusinessDetails.district}
                                  onChange={otherDetailsChange}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Mandal" required={true} />
                                <TableDropdownSRO
                                  keyName={"mandalName"}
                                  required={true}
                                  options={MandalForOtherAddr}
                                  name={"mandal"}
                                  value={SelectedOtherbusinessDetails.mandal}
                                  onChange={otherDetailsChange}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Village/City" required={true} />
                                <TableDropdownSRO
                                  keyName="villageName"
                                  required={true}
                                  options={VillageListForOtherAddr}
                                  name={"villageOrCity"}
                                  value={SelectedOtherbusinessDetails.villageOrCity}
                                  onChange={otherDetailsChange}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="PIN Code" required={true} />
                                <TableInputText
                                  type="text"
                                  maxLength={6}
                                  placeholder="PIN Code"
                                  required={true}
                                  name={"pinCode"}
                                  value={SelectedOtherbusinessDetails.pinCode}
                                  onChange={otherDetailsChange}
                                  onPaste={(e: any) => e.preventDefault()}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Date of Ceasing" required={true} />
                                <TableInputText
                                  type="date"
                                  placeholder="DD/MM/YYYY"
                                  name="ceasingDate"
                                  required={true}
                                  value={SelectedOtherbusinessDetails.ceasingDate}
                                  onChange={otherDetailsChange}
                                />
                              </Col>

                              <Col lg={6} md={4} xs={12} className="mb-3">
                                <TableText label="Name of the Place" required={true} />
                                <textarea
                                  className="form-control textarea"
                                  disabled={false}
                                  placeholder="Enter Place Name"
                                  required={true}
                                  name={"placeName"}
                                  value={SelectedOtherbusinessDetails.placeName}
                                  onChange={otherDetailsChange}
                                  maxLength={10000}
                                ></textarea>
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                <TableText label="Date of Opening" required={true} />
                                <TableInputText
                                  type="date"
                                  placeholder="DD/MM/YYYY"
                                  name="openingDate"
                                  required={true}
                                  value={SelectedOtherbusinessDetails.openingDate}
                                  onChange={otherDetailsChange}
                                />
                              </Col>
                            </Row>
                          </div>
                          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <div
                              className="btn btn-primary "
                              style={{ justifySelf: "end" }}
                              onClick={() => {
                                addOtherbusinessFields()
                              }}
                            >
                              Save
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {otherbusinessDetails && otherbusinessDetails?.length ? (
                      <div className="addedPartnerSec mt-3">
                        <Row className="mb-4">
                          <Col lg={12} md={12} xs={12}>
                            <Table striped bordered className="tableData listData">
                              <thead>
                                <tr>
                                  <th className="siNo text-center">S.No</th> <th>Door No</th>
                                  <th>Street</th>
                                  <th>Village / City</th>
                                  <th>Mandal</th>
                                  <th>District</th>
                                  <th>State</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {otherbusinessDetails?.map((item: any, i: number) => {
                                  return (
                                    <tr key={i + 1}>
                                      <td className="siNo text-center">{i + 1}</td>
                                      <td>{item.doorNo}</td>
                                      <td>{item.street}</td>
                                      <td>{item.villageOrCity}</td>
                                      <td>{item.mandal}</td>
                                      <td>{item.district}</td>
                                      <td>{item.state}</td>
                                      <td>
                                        {" "}
                                        <Image
                                          alt="Image"
                                          height={18}
                                          width={17}
                                          src="/firmsHome/assets/delete-icon.svg"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            removeOtherbusinessFields(i)
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </Table>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                    <div className="uploadFirmList appDocList mb-4">
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <h3>
                            Upload Firm Related Documents-(All Uploaded Documents should be in PDF
                            format only upto 3MB )
                          </h3>
                        </Col>
                      </Row>

                      <div className="firmFileStep1">
                        <Row>
                          {/* <Col lg={2} md={4} xs={12}>
                      <div className="firmFile">
                        <Form.Group controlId="formFile">
                          <TableText label="Application Form" required={true} />
                          <Form.Control
                            type="file"
                            id="applicationForm"
                            name="applicationForm"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </Form.Group>
                      </div>
                    </Col> */}
                          <Col lg={3} md={4} xs={12}>
                            <div className="firmFile mt-1">
                              <Form.Group controlId="formFile">
                                <TableText label="Partnership Deed" required={true} />
                                <Form.Control
                                  type="file"
                                  id="partnershipDeed"
                                  name="partnershipDeed"
                                  ref={inputRef}
                                  onChange={handleFileChange}
                                  accept="application/pdf"
                                />
                              </Form.Group>
                            </div>
                          </Col>
                          {principalBusiDetails.type != "" && principalBusiDetails.type == "Lease" && (
                            <Col lg={3} md={4} xs={12}>
                              <div className="firmFile mt-1">
                                <Form.Group controlId="formFile">
                                  <TableText label="Lease Agreement" required={true} />
                                  <Form.Control
                                    type="file"
                                    id="leaseAgreement"
                                    name="leaseAgreement"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                          )}

                          {principalBusiDetails.type != "" && principalBusiDetails.type == "Own" && (
                            <Col lg={3} md={4} xs={12}>
                              <div className="firmFile mt-1">
                                <Form.Group controlId="formFile">
                                  <TableText label="Affidavit" required={true} />
                                  <Form.Control
                                    type="file"
                                    id="affidavit"
                                    name="affidavit"
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                  />
                                </Form.Group>
                              </div>
                            </Col>
                          )}

                          <Col lg={3} md={4} xs={12}>
                            <div className="firmFile">
                              <Form.Group controlId="formFile">
                                <Form.Label>Self Signed Declaration :</Form.Label>
                                <Form.Control
                                  type="file"
                                  id="selfSignedDeclaration"
                                  name="selfSignedDeclaration"
                                  ref={inputRef}
                                  onChange={handleFileChange}
                                  accept="application/pdf"
                                />
                              </Form.Group>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>

                    <div className="uploadFirmList appDocList mb-4">
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <h3>Application Submission</h3>
                        </Col>
                      </Row>

                      <div className="firmFileStep1">
                        <Row className="my-2">
                          <Col lg={4} md={4} xs={4} className="d-flex align-items-center">
                            <TableText
                              label="Do you want to Accept this Application"
                              required={true}
                            />
                            <Form.Check
                              inline
                              label="Yes"
                              value="Yes"
                              name="submissionResponse"
                              type="radio"
                              className="fom-checkbox mx-3 "
                              defaultChecked={additionalDetails.submissionResponse === "Yes"}
                              onChange={(e: any) => additonalDetailsChange(e)}
                            />
                            <Form.Check
                              inline
                              label="No"
                              value="No"
                              name="submissionResponse"
                              type="radio"
                              className="fom-checkbox "
                              defaultChecked={additionalDetails.submissionResponse === "No"}
                              onChange={(e: any) => additonalDetailsChange(e)}
                            />
                          </Col>
                          {/* <Col lg={3} md={3} xs={3}>
                        <TableText label="Date Of Registration" required={true} />
                        <Form.Control
                          type="date"
                          placeholder="DD/MM/YYYY"
                          name="applicationProcessedDate"
                          value={additionalDetails.applicationProcessedDate}
                          onChange={additonalDetailsChange}
                        />
                      </Col>
                      <Col lg={3} md={3} xs={3}>
                        <TableText label="Registration Year" required={true} />
                        <TableInputText
                          type="number"
                          maxLength={4}
                          placeholder="Enter Registration Year"
                          required={true}
                          dot={false}
                          name={"registrationYear"}
                          value={additionalDetails.registrationYear}
                          onChange={additonalDetailsChange}
                        />
                      </Col> */}
                        </Row>
                      </div>
                    </div>
                    <div className="firmSubmitSec">
                      <Row>
                        <Col lg={12} md={12} xs={12}>
                          <div className="d-flex justify-content-center text-center">
                            <button className="btn btn-primary" name="btn2" value="Save">
                              Save
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Container>
                </Form>
              </div>            
        {/* <pre>{JSON.stringify(dlfFirmdata, null, 2)}</pre> */}
      </div>
    </>
  )
}

export default DataEntry
