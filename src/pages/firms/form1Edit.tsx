import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Container, Col, Row, Form, Table } from "react-bootstrap"
import styles from "@/styles/pages/Forms.module.scss"
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import TableDropdownSRO from "@/components/common/TableDropdownSRO"
import moment from "moment"
import CryptoJS, { AES } from "crypto-js"
import { UseGetAadharDetails, UseGetAadharOTP, UseGetDistrictList, UseGetFirmDetailsById, UseGetMandalList, UseGetVillagelList, UseSaveFirmDetails } from "@/axios"
import TableDropdown from "@/components/common/TableDropdown"
import Image from "next/image"
import instance from "@/redux/api"
import PreviewFirm from "./previewFirm"
import { IApplicantDetailsForm1Model, IBusinessDetailsModel, IContactDetailsModel, IFirmDetailsModel, IFirmInDetailsModel, IOtherBusinessForm1DetailsModel, ISelectedPartnerDetailsModel, ICheckListDetailsModel} from "@/models/firmsTypes"

const Form1Edit = () => {
  const router = useRouter()  
  const [PreviewBtnClicked, setPreviewBtnClicked] = useState(false)
  const [IsOtherChecked, setIsOtherChecked] = useState<boolean>(false)
  const [applicantDetails, setApplicantDetails] = useState<IApplicantDetailsForm1Model>({
    maskedAadhar: "",
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
    address:"",
  })
  const [contactDetails, setContactDetails] = useState<IContactDetailsModel>({
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
  })
  const [firmDetails, setFirmDetails] = useState<IFirmDetailsModel>({
    firmName: "",
    atWill: false,
    firmDurationFrom: "",
    firmDurationTo: "",
    industryType: "",
    businessType: "",
  })
  const [partnerDetails, setPartnerDetails] = useState<ISelectedPartnerDetailsModel[]>([])
  const [savedFirm, setSavedFirm] = useState<any>({})
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [isResubmission, setIsResubmission] = useState<string>("false")
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [principalBusiDetails, setPrincipalBusiDetails] = useState<IBusinessDetailsModel>({
    doorNo: "",
    street: "",
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
  const [SelectedOtherbusinessDetails, setSelectedOtherbusinessDetails] =
    useState<IOtherBusinessForm1DetailsModel>({
      doorNo: "",
      street: "",
      state: "AndhraPradesh",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
    })
  const [SelectedPartnerDetails, setSelectedPartnerDetails] =
    useState<ISelectedPartnerDetailsModel>({
      maskedAadhar: "",
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
      address:"",
    })
  const [isPayNowClicked, setIsPayNowClicked] = useState<boolean>(false)
  const [locData, setLocData] = useState<any>({})
  const [firmData, setFirmData] = useState<IFirmInDetailsModel>({
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

    const [checkList, setCheckList] = useState<ICheckListDetailsModel>({
        isPartnershipDeedDoc: false,
        isAffidvitOrLeaseAgreementDoc: false,
        isSelfSignDeclarationDoc: false,
        isForm1DigitalSignDoc: false
    })  

  const onNumberOnlyChange = (event: any) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const isValid = new RegExp("[0-9]").test(keyValue)
    if (!isValid) {
      event.preventDefault()
      return
    }
  }

  useEffect(() => {
    const isResubmit: any = localStorage.getItem("isResubmission")
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
    }
    if (isResubmit == "true") {
      setIsResubmission("true")
    } else {
      setIsResubmission("false")
    }
    let LoginData = KeepLoggedIn()
    if (LoginData) {
      setLoginDetails(LoginData)
      GetFirmDetails(LoginData, isResubmit)
      GetDistrictList(LoginData.token)
    }
    localStorage.removeItem("isResubmission")
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  async function getFileFromUrl(url: any, name: any, defaultType = "application/pdf") {
    const response = await instance.get(url, { responseType: "arraybuffer" })

    return new File([response.data], name, {
      type: defaultType,
    })
  }

  const GetFirmDetails = async (data: any, isResubmission: string) => {
    let result = await UseGetFirmDetailsById(data.applicationId, data.token)    
    if (result.success) {
      let otherAddressList = ["Add New"]
      let firmsValue = result.data.firm
      setSavedFirm(firmsValue)
      setMandalForPrincipleAddr([])
      setVillageListForPrincipleAddr([])
      setMandalForOtherAddr([])
      setVillageListForOtherAddr([])
      GetMandalList(firmsValue.district, "principalAddr")
      GetMandalList(firmsValue.district, "otherAddr")
      setPrincipalBusiDetails({ ...principalBusiDetails, district: firmsValue.district })
      setSelectedOtherbusinessDetails({
        ...SelectedOtherbusinessDetails,
        district: firmsValue.district,
      })
      setFirmDetails({
        ...firmDetails,
        firmName: firmsValue.firmName,
      });      
      if (isResubmission) {                        
        if (firmsValue.principalPlaceBusiness && firmsValue.principalPlaceBusiness.length > 0) {
          firmsValue.principalPlaceBusiness.map((element: any, i: number) => {
            if (element.branch != "Main") {
              otherAddressList.push(
                element.doorNo + " " + element.street + " " + element.villageOrCity
              )
            }
          })
        }
        firmsValue.otherAddressList = otherAddressList
        setFirmData(firmsValue)
        if (firmsValue.applicantDetails) {
          let maskedAadhar = ""
          if (firmsValue.applicantDetails.name != "") {
            maskedAadhar =
              "XXXXXXXX" + firmsValue.applicantDetails.aadharNumber?.toString().substring(8, 12)
            setTempMemory({ OTPRequested: false, AadharVerified: true })
          }
          setApplicantDetails({ ...firmsValue.applicantDetails, maskedAadhar: maskedAadhar })
          if (firmsValue?.applicantDetails?.district != "") {
            GetMandalList(firmsValue.applicantDetails.district, "applicant")
          }
          if (firmsValue?.applicantDetails?.mandal != "") {
            GetVillageList(
              firmsValue.applicantDetails.mandal,
              firmsValue.applicantDetails.district,
              "applicant"
            )
          }
        }
        if (firmsValue.industryType == "") {
          setBussinessList([])
        } else {
          const data = busList.find((x) => x.key == firmsValue.industryType)
          if (data?.value) {
            setBussinessList(data.value)
          }
        }
        setFirmDetails({
          ...firmDetails,
          firmName: firmsValue.firmName,
          firmDurationFrom: firmsValue.firmDurationFrom,
          firmDurationTo: firmsValue.firmDurationTo,
          industryType: firmsValue.industryType,
          businessType: firmsValue.bussinessType,
          atWill: firmsValue.atWill,
        })
        if (firmsValue.contactDetails) {
          setContactDetails(firmsValue.contactDetails)
        }

        if (firmsValue.documentAttached?.length) {
          firmsValue.documentAttached.forEach((z: any) => {
            if (z.originalname) {
              const fileName = z.originalname.split("_")[0]
              getFileFromUrl(`/downloads/${firmsValue._id}/${z.originalname}`, fileName).then(
                (response) => {
                  let inputEle = document.getElementById(fileName.split(".")[0]) as HTMLInputElement
                  if (inputEle !== null) {
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(response)
                    inputEle.files = dataTransfer.files
                    const newInput = (data: any) => ({
                      ...data,
                      [fileName.split(".")[0]]: response,
                    })
                    setFile(newInput)
                  }
                }
              )
            }
          })
        }

        setPartnerDetails(firmsValue.firmPartners)
        setOtherBusinessDetails(firmsValue.otherPlaceBusiness)
        setCheckList(firmsValue.checkList)
        if (firmsValue?.principalPlaceBusiness?.length) {
          setPrincipalBusiDetails(firmsValue?.principalPlaceBusiness[0])
          if (firmsValue?.principalPlaceBusiness[0]?.district != "") {
            GetMandalList(firmsValue.principalPlaceBusiness[0].district, "principalAddr")
          }
          if (firmsValue?.principalPlaceBusiness[0]?.mandal != "") {
            GetVillageList(
              firmsValue.principalPlaceBusiness[0].mandal,
              firmsValue.principalPlaceBusiness[0].district,
              "principalAddr"
            )
          }
        }
      }
    }
  }  

  useEffect(() => {
    if (savedFirm?.documentAttached?.length > 0) {
      savedFirm.documentAttached.forEach((z: any) => {
        if (z.originalname) {
          const fileName = z.originalname.split("_")[0]
          getFileFromUrl(`/downloads/${savedFirm._id}/${z.originalname}`, fileName).then(
            (response) => {
              let inputEle = document.getElementById(fileName.split(".")[0]) as HTMLInputElement
              if (inputEle !== null) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(response)
                inputEle.files = dataTransfer.files
                const newInput = (data: any) => ({
                  ...data,
                  [fileName.split(".")[0]]: response,
                })
                setFile(newInput)
              }
            }
          )
        }
      })
    }
  }, [isPreview])

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
        partnerName: result.userInfo.name ? result.userInfo.name : "",
        relationType: result.userInfo.co ? result.userInfo.co.substring(0, 3) : "",
        relation: result.userInfo.co ? result.userInfo.co.substring(4) : "",
        age: result.userInfo.dob ? CalculateAge(result.userInfo.dob) : "",
        gender: result.userInfo.gender == "M" ? "Male" : "Female",
        district: result.userInfo.dist ? result.userInfo.dist : "",
        pinCode: result.userInfo.pc ? result.userInfo.pc : "",
        street: result.userInfo.loc ? result.userInfo.street : "",
        villageOrCity: result.userInfo.vtc ? result.userInfo.vtc : "",
        doorNo: result.userInfo.house ? result.userInfo.house : "",
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

  const applicantDetailsChange = (e: any) => {
    let TempDetails: IApplicantDetailsForm1Model = { ...applicantDetails }
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
    if (AddName == "maskedAadhar") {
      let newNo = ""
      let newVal = ""
      let aadharNo = ""
      if (
        e.target.value.length > 0 &&
        e.target.value.length > applicantDetails.aadharNumber.length
      ) {
        newNo = e.target.value[e.target.value.length - 1]
      } else if (e.target.value.length == 0) {
        newNo = "del"
      }
      for (let i = 0; i <= e.target.value.length - 1; i++) {
        if (i < 8) {
          newVal = newVal + "X"
        } else {
          newVal = newVal + e.target.value[i]
        }
      }
      if (newNo == "") {
        let startpos = parseInt(e.target.selectionStart)
        aadharNo =
          applicantDetails.aadharNumber.substring(0, startpos) +
          applicantDetails.aadharNumber.substring(
            startpos + 1,
            applicantDetails.aadharNumber.length
          )
      }
      setApplicantDetails({
        ...TempDetails,
        [AddName]: newVal,
        aadharNumber:
          newNo == "del" ? "" : newNo != "" ? applicantDetails.aadharNumber + newNo : aadharNo,
      })
    } else {
      setApplicantDetails({ ...TempDetails, [AddName]: AddValue })
    }
  }

  const contactDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setContactDetails(newInput)
  }

  const firmDetailsChange = (e: any) => {
    let TempDetails: IFirmDetailsModel = { ...firmDetails }
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
    let TempDetails: IBusinessDetailsModel = { ...principalBusiDetails }
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
    let tempDetails: IOtherBusinessForm1DetailsModel = { ...SelectedOtherbusinessDetails }
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
    let tempDetails: ISelectedPartnerDetailsModel = { ...SelectedPartnerDetails }
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
    if (AddName == "maskedAadhar") {
      let newNo = ""
      let newVal = ""
      let aadharNo = ""
      if (
        e.target.value.length > 0 &&
        e.target.value.length > SelectedPartnerDetails.aadharNumber?.length
      ) {
        newNo = e.target.value[e.target.value.length - 1]
      } else if (e.target.value && e.target.value.length == 0) {
        newNo = "del"
      }
      for (let i = 0; i <= e.target.value.length - 1; i++) {
        if (i < 8) {
          newVal = newVal + "X"
        } else {
          newVal = newVal + e.target.value[i]
        }
      }
      if (newNo == "") {
        let startpos = parseInt(e.target.selectionStart)
        aadharNo =
          SelectedPartnerDetails.aadharNumber.substring(0, startpos) +
          SelectedPartnerDetails.aadharNumber.substring(
            startpos + 1,
            SelectedPartnerDetails.aadharNumber.length
          )
      }
      setSelectedPartnerDetails({
        ...tempDetails,
        [AddName]: newVal,
        aadharNumber:
          newNo == "del"
            ? ""
            : newNo != ""
            ? SelectedPartnerDetails.aadharNumber + newNo
            : aadharNo,
      })
    } else {
      setSelectedPartnerDetails({ ...tempDetails, [AddName]: AddValue })
    }
  }

  const addOtherbusinessFields = () => {
    let object: IOtherBusinessForm1DetailsModel = { ...SelectedOtherbusinessDetails }
    if (
      object.doorNo == "" ||
      object.villageOrCity == "" ||      
      object.pinCode == ""
    ) {
      return ShowMessagePopup(false, "Kindly fill all inputs for other place of business.", "")
    } else if (object.pinCode != "" && object.pinCode.length != 6) {
      return ShowMessagePopup(false, "Please enter valid pincode for other place of business.", "")
    }
    let Details = [...otherbusinessDetails]
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
    })
    ShowMessagePopup(true, "New other place business Added Successfully", "")
  }

  const addPartnerFields = () => {
    let object: ISelectedPartnerDetailsModel = { ...SelectedPartnerDetails }
    const isAadharDuplicate = partnerDetails?.some(
      (x: ISelectedPartnerDetailsModel, i: number) =>
        i !== editingIndex && x.aadharNumber.toString() === object.aadharNumber.toString()
    )
    if (
      object.aadharNumber == "" ||
      object.relationType == "" ||
      object.gender == "" ||
      object.age == "" ||
      object.role == "" ||
      object.doorNo == "" ||      
      object.district == "" ||      
      object.villageOrCity == "" ||
      object.pinCode == "" ||
      object.relation == "" ||
      object.mobileNumber == "" ||
      object.share == "" ||
      object.joiningDate == ""
    ) {
      return ShowMessagePopup(false, "Kindly fill all inputs for New Partner", "")
    } else if (
      object.mobileNumber &&
      (object.mobileNumber.length != 10 ||
        (object.mobileNumber.length == 10 &&
          object.mobileNumber.charAt(0) != "6" &&
          object.mobileNumber.charAt(0) != "7" &&
          object.mobileNumber.charAt(0) != "8" &&
          object.mobileNumber.charAt(0) != "9"))
    ) {
      return ShowMessagePopup(false, "Please enter vaild mobile number for partner", "")
    } else if (object.pinCode != "" && object.pinCode.length != 6) {
      return ShowMessagePopup(false, "Please enter valid pincode for partner", "")
    } else if (isAadharDuplicate) {
      setTempMemoryPartner({ OTPRequested: false, AadharVerified: false })
      setSelectedPartnerDetails({
        maskedAadhar: "",
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
        address:"",
      })
      return ShowMessagePopup(
        false,
        "Aadhaar number is already exist. Please enter new aadhaar number",
        ""
      )
    } else if (parseInt(object.age) < 18) {
      setTempMemoryPartner({ OTPRequested: false, AadharVerified: false })
      setSelectedPartnerDetails({
        maskedAadhar: "",
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
        address:"",
      })
      return ShowMessagePopup(false, "Minimum age of partner should be 18", "")
    } else if (parseInt(object.share) < 0 || parseInt(object.share) >= 100) {
      return ShowMessagePopup(false, "share should be above 0 and less than 100 percent", "")
    } else if (partnerDetails?.length > 0) {
      let share = 0
      partnerDetails.forEach((element: any, idx: number) => {
        if (idx !== editingIndex) {
        share = element.share != "" ? share + parseFloat(element.share) : share
        }
      })
      share = share + parseFloat(object.share)
      if (Math.round(share) > 100) {
        return ShowMessagePopup(
          false,
          "Please enter proper share for partner as cummulative total share has exceeded 100 percent"
        )
      }
      if (editingIndex !== -1) {
        const updatedPartners = [...partnerDetails];
        updatedPartners[editingIndex] = { ...object };
        setPartnerDetails(updatedPartners);
        setEditingIndex(-1);
      } else {
        // Otherwise, add new partner
        setPartnerDetails([...partnerDetails, object]);
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
    } else if (
      partnerDetails?.length > 0 &&
      partnerDetails.some(
        (x: any) =>
          x.email != "" &&
          x.email.length > 0 &&
          x.email.trim() != "" &&
          object.email != "" &&
          object.email.length > 0 &&
          object.email.trim() != "" &&
          x.email.toLowerCase() == object.email.toLowerCase()
      )
    ) {
      return ShowMessagePopup(false, "email is already exist. Please enter new email", "")
    }
    let Details: ISelectedPartnerDetailsModel[] = [...partnerDetails]
    if (editingIndex > -1) {
      // UPDATE EXISTING PARTNER
      Details[editingIndex] = object
      ShowMessagePopup(true, "Partner Details Updated Successfully", "")
    } else {
      Details.push(object)
      ShowMessagePopup(true, "New Partner Added Successfully", "")
    }
    setPartnerDetails(Details)
    setTempMemoryPartner({ OTPRequested: false, AadharVerified: false })
    setSelectedPartnerDetails({
      maskedAadhar: "",
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
      address:"",
    })
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

  const updateSelectedPartner = (index: number) => {
    const partnerToEdit = partnerDetails[index]
    if (partnerToEdit) {
      setSelectedPartnerDetails(partnerToEdit)
      setEditingIndex(index)
    }
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return
    }
    if (e.target.files[0].size > 1024000) {
      ShowMessagePopup(false, "File size 1MB size. please upload small size file.", "")
      e.target.value = ""
    }
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.files[0] })
    setFile(newInput)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (
      !contactDetails?.mobileNumber ||
      (contactDetails.mobileNumber && contactDetails.mobileNumber.toString().length != 10) ||
      (contactDetails.mobileNumber &&
        contactDetails.mobileNumber.length == 10 &&
        contactDetails.mobileNumber.charAt(0) != "6" &&
        contactDetails.mobileNumber.charAt(0) != "7" &&
        contactDetails.mobileNumber.charAt(0) != "8" &&
        contactDetails.mobileNumber.charAt(0) != "9")
    ) {
      setPreviewBtnClicked(false)
      return ShowMessagePopup(false, "Please enter vaild applicant mobile number", "")
    }
    if (
      applicantDetails.pinCode?.toString() != "" &&
      applicantDetails.pinCode?.toString()?.length != 6
    ) {
      return ShowMessagePopup(false, "Please enter valid applicant pincode", "")
    }
    if (
      principalBusiDetails.pinCode?.toString() != "" &&
      principalBusiDetails.pinCode?.toString()?.length != 6
    ) {
      return ShowMessagePopup(
        false,
        "Please enter valid pincode for principal place of business",
        ""
      )
    }
    if (partnerDetails && partnerDetails?.length) {
      let share = 0
      partnerDetails.forEach((element: any) => {
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
    if ((partnerDetails && !partnerDetails?.length) || partnerDetails?.length < 1) {
      setPreviewBtnClicked(false)
      return ShowMessagePopup(false, "Please add minimum two partners", "")
    }
    if (principalBusiDetails.type == "") {
      setPreviewBtnClicked(false)
      return ShowMessagePopup(false, "Please select type for principal place of business", "")
    }
    const newData = new FormData()
    newData.append("applicantDetails[aadharNumber]", applicantDetails?.aadharNumber)
    newData.append("applicantDetails[name]", applicantDetails?.name?.toUpperCase())
    newData.append("applicantDetails[surName]", applicantDetails?.surName)
    newData.append("applicantDetails[gender]", applicantDetails?.gender?.toUpperCase())
    newData.append("applicantDetails[age]", applicantDetails?.age)
    newData.append("applicantDetails[relationType]", applicantDetails?.relationType?.toUpperCase())
    newData.append("applicantDetails[relation]", applicantDetails?.relation?.toUpperCase())
    newData.append("applicantDetails[role]", applicantDetails?.role?.toUpperCase())
    newData.append("applicantDetails[doorNo]", applicantDetails?.doorNo?.toUpperCase())
    newData.append("applicantDetails[street]", applicantDetails?.street?.toUpperCase())
    newData.append("applicantDetails[district]", applicantDetails?.district?.toUpperCase())
    newData.append("applicantDetails[mandal]", applicantDetails?.mandal?.toUpperCase())
    newData.append(
      "applicantDetails[villageOrCity]",
      applicantDetails?.villageOrCity?.toUpperCase()
    )
    newData.append("applicantDetails[pinCode]", applicantDetails?.pinCode)
    newData.append("applicantDetails[country]", "INDIA")
    newData.append("applicantDetails[state]", "ANDHRA PRADESH")

    newData.append("contactDetails[landPhoneNumber]", contactDetails?.landPhoneNumber)
    newData.append("contactDetails[mobileNumber]", contactDetails?.mobileNumber)
    newData.append("contactDetails[email]", contactDetails?.email)

    newData.append(
      "firmDurationFrom",
      firmDetails?.firmDurationFrom ? firmDetails?.firmDurationFrom : ""
    )
    newData.append("firmDurationTo", firmDetails?.firmDurationTo ? firmDetails?.firmDurationTo : "")
    newData.append("industryType", firmDetails?.industryType)
    newData.append("bussinessType", firmDetails?.businessType)
    newData.append("atWill", firmDetails?.atWill ? "true" : "false")
    if (isResubmission == "true") {
      newData.append("isResubmission", "true")
    }

    //newData.append("applicationForm", file?.applicationForm)
    if (principalBusiDetails.type?.toUpperCase() == "LEASE") {
      newData.append("leaseAgreement", file?.leaseAgreement)
    }
    newData.append("partnershipDeed", file.partnershipDeed)
    if (principalBusiDetails.type?.toUpperCase() == "OWN") {
      newData.append("affidavit", file.affidavit)
    }
    newData.append("selfSignedDeclaration", file.selfSignedDeclaration)
    newData.append("formType", "form-1")
    newData.append("applicationNumber", LoginDetails.applicationNumber)
    newData.append("id", LoginDetails.applicationId)

    newData.append("principalPlaceBusiness[doorNo]", principalBusiDetails.doorNo?.toUpperCase())
    newData.append("principalPlaceBusiness[street]", principalBusiDetails.street?.toUpperCase())
    newData.append("principalPlaceBusiness[state]", "ANDHRA PRADESH")
    newData.append("principalPlaceBusiness[district]", principalBusiDetails.district?.toUpperCase())
    newData.append("principalPlaceBusiness[mandal]", principalBusiDetails.mandal?.toUpperCase())
    newData.append(
      "principalPlaceBusiness[villageOrCity]",
      principalBusiDetails.villageOrCity?.toUpperCase()
    )
    newData.append("principalPlaceBusiness[pinCode]", principalBusiDetails.pinCode)
    newData.append("principalPlaceBusiness[country]", "INDIA")
    newData.append("principalPlaceBusiness[branch]", "MAIN")
    newData.append(
      "principalPlaceBusiness[type]",
      principalBusiDetails.type ? principalBusiDetails.type?.toUpperCase() : ""
    )

    for (let j = 0; j < partnerDetails.length; j++) {
      newData.append("partnerDetails[" + j + "][aadharNumber]", partnerDetails[j]?.aadharNumber)
      newData.append(
        "partnerDetails[" + j + "][partnerName]",
        partnerDetails[j].partnerName?.toUpperCase()
      )
      newData.append("partnerDetails[" + j + "][partnerSurname]", partnerDetails[j].surName)
      newData.append(
        "partnerDetails[" + j + "][relation]",
        partnerDetails[j].relation?.toUpperCase()
      )
      newData.append(
        "partnerDetails[" + j + "][relationType]",
        partnerDetails[j].relationType?.toUpperCase()
      )
      newData.append("partnerDetails[" + j + "][role]", partnerDetails[j].role?.toUpperCase())
      newData.append("partnerDetails[" + j + "][age]", partnerDetails[j].age)
      newData.append("partnerDetails[" + j + "][doorNo]", partnerDetails[j].doorNo?.toUpperCase())
      newData.append("partnerDetails[" + j + "][street]", partnerDetails[j].street?.toUpperCase())
      newData.append(
        "partnerDetails[" + j + "][district]",
        partnerDetails[j].district?.toUpperCase()
      )
      newData.append("partnerDetails[" + j + "][mandal]", partnerDetails[j].mandal?.toUpperCase())
      newData.append(
        "partnerDetails[" + j + "][villageOrCity]",
        partnerDetails[j].villageOrCity?.toUpperCase()
      )
      newData.append("partnerDetails[" + j + "][pinCode]", partnerDetails[j].pinCode)
      newData.append("partnerDetails[" + j + "][share]", partnerDetails[j].share)
      newData.append("partnerDetails[" + j + "][joiningDate]", partnerDetails[j].joiningDate)

      newData.append(
        "partnerDetails[" + j + "][landPhoneNumber]",
        partnerDetails[j].landPhoneNumber
      )
      newData.append("partnerDetails[" + j + "][mobileNumber]", partnerDetails[j].mobileNumber)
      newData.append("partnerDetails[" + j + "][email]", partnerDetails[j].email)
      newData.append("partnerDetails[" + j + "][state]", "Andhra Pradesh")
      newData.append("partnerDetails[" + j + "][country]", "India")
    }

    for (let j = 0; j < otherbusinessDetails.length; j++) {
      newData.append(
        "otherPlaceBusiness[" + j + "][doorNo]",
        otherbusinessDetails[j].doorNo?.toUpperCase()
      )
      newData.append(
        "otherPlaceBusiness[" + j + "][street]",
        otherbusinessDetails[j].street?.toUpperCase()
      )
      newData.append("otherPlaceBusiness[" + j + "][state]", "Andhra Pradesh")
      newData.append(
        "otherPlaceBusiness[" + j + "][district]",
        otherbusinessDetails[j].district?.toUpperCase()
      )
      newData.append(
        "otherPlaceBusiness[" + j + "][mandal]",
        otherbusinessDetails[j].mandal?.toUpperCase()
      )
      newData.append(
        "otherPlaceBusiness[" + j + "][villageOrCity]",
        otherbusinessDetails[j].villageOrCity?.toUpperCase()
      )
      newData.append("otherPlaceBusiness[" + j + "][pinCode]", otherbusinessDetails[j].pinCode)
      newData.append("otherPlaceBusiness[" + j + "][country]", "INDIA")
      newData.append("otherPlaceBusiness[" + j + "][branch]", "SUB")
    }
    newData.append("checkList[isPartnershipDeedUpload]",checkList.isPartnershipDeedDoc ? "true" : "false");
    newData.append("checkList[isAffidvitUpload]",checkList.isAffidvitOrLeaseAgreementDoc ? "true" : "false");
    newData.append("checkList[isSelfSignDeclarationUpload]",checkList.isSelfSignDeclarationDoc ? "true" : "false");
    newData.append("checkList[isLeaseAgreementUpload]",checkList.isForm1DigitalSignDoc ? "true" : "false");

    let Result = await CallingAxios(UseSaveFirmDetails(newData, LoginDetails.token))
    if (Result.success) {
      setSavedFirm(Result.data.firm?.newFirm)
      ShowMessagePopup(true, `Thank You! Your application has been submitted successfully.`, "")
      router.push("/firms")
    } else {
      setPreviewBtnClicked(false)
      console.log(Result)
      ShowMessagePopup(false, Result.message.message, "")
    }
  }

  return (
    <>
      <Head>
        <title>E-Registration of Firm Resubmit</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className={styles.RegistrationMain}>
        {locData && locData?.userType && locData?.userType == "user" && !isPreview && (
          <div className="societyRegSec">
            <Container>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <div className="d-flex justify-content-between align-items-center page-title mb-2">
                    <div className="pageTitleLeft">
                      <h1>E-Registration of Firm</h1>
                    </div>

                    <div className="pageTitleRight">                      
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
            {(firmData.status == "Incomplete" || isResubmission == "true") && (
              <Form
                className={`formsec ${styles.RegistrationInput}`}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <Container>
                  <div className="regofAppBg mb-3">
                    <div className="formSectionTitle">
                      <h3>Applicant Details</h3>
                    </div>
                    <Row>
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
                                name={"maskedAadhar"}
                                value={applicantDetails.maskedAadhar}
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
                                value={applicantDetails.otp}
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
                          disabled={false}
                          type="text"
                          placeholder="Enter Name of the Applicant"
                          required={true}
                          name={"name"}
                          value={applicantDetails.name}
                          onChange={() => {}}
                        />
                        <TableText
                          label={`Gender: ${applicantDetails.gender}  / Age: ${applicantDetails.age}`}
                          required={false}
                        />
                      </Col>

                      <Col lg={3} md={2} xs={12} className="mb-3">
                        <TableText label={"Relation type and Name"} required={true} />
                        <div className={styles.relationData}>
                          <select
                            className={styles.selectData}
                            required={true}
                            name={"relationType"}
                            value={applicantDetails.relationType}
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
                            disabled={false}
                            name={"relation"}
                            value={applicantDetails.relation}
                            onChange={() => {}}
                          />
                        </div>
                      </Col>                      
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="Role" required={true} />
                        <TableInputText
                          disabled={false}
                          type="text"
                          placeholder="Enter Role"
                          required={true}
                          name={"role"}
                          value={applicantDetails.role}
                          onChange={applicantDetailsChange}
                          maxLength={50}
                        />
                      </Col>
                    </Row>

                    <div className="regFormBorder"></div>

                    <div className="formSectionTitle">
                      <h3>Address Details</h3>
                    </div>
                    <Row>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Door No" required={true} />
                        <TableInputText
                          type="text"
                          placeholder="Door No"
                          required={true}
                          name={"doorNo"}
                          value={applicantDetails.doorNo}
                          onChange={applicantDetailsChange}
                          disabled={false}
                        />
                      </Col>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Street" required={false} />
                        <TableInputText
                          type="text"
                          placeholder="Street"
                          required={true}
                          name={"street"}
                          value={applicantDetails.street}
                          onChange={applicantDetailsChange}
                          disabled={false}
                        />
                      </Col>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="District" required={true} />                       
                        <TableDropdownSRO
                          keyName={"name"}
                          required={true}
                          options={DistrictList}
                          name={"district"}
                          value={applicantDetails.district}
                          onChange={applicantDetailsChange}
                        />
                      </Col>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Mandal" required={false} />                       
                        <TableDropdownSRO
                          keyName={"mandalName"}
                          required={true}
                          options={MandalForApplicant}
                          name={"mandal"}
                          value={applicantDetails.mandal}
                          onChange={applicantDetailsChange}
                        />
                      </Col>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Village/City" required={true} />                        
                        <TableDropdownSRO
                          keyName="villageName"
                          required={true}
                          options={VillageListForApplicant}
                          name={"villageOrCity"}
                          value={applicantDetails.villageOrCity}
                          onChange={applicantDetailsChange}
                        />
                      </Col>
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="PIN Code" required={true} />
                        <TableInputText
                          type="text"
                          maxLength={6}
                          placeholder="PIN Code"
                          required={true}
                          name={"pinCode"}
                          value={applicantDetails.pinCode}
                          onChange={applicantDetailsChange}
                          disabled={false}
                        />
                      </Col>
                    </Row>
                    <div className="regFormBorder"></div>
                    <div className="formSectionTitle">
                      <h3>Contact Details</h3>
                    </div>

                    <Row>                      
                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Mobile No" required={true} />
                        <TableInputText
                          disabled={false}
                          type="text"
                          dot={false}
                          maxLength={10}
                          placeholder="Enter Mobile No"
                          required={true}
                          name={"mobileNumber"}
                          value={contactDetails.mobileNumber}
                          onChange={contactDetailsChange}
                        />
                      </Col>

                      <Col lg={3} md={4} xs={12} className="mb-3">
                        <TableText label="Email ID" required={false} />
                        <TableInputText
                          disabled={false}
                          type="email"
                          placeholder="Enter Email ID"
                          required={false}
                          name={"email"}
                          value={contactDetails.email}
                          onChange={contactDetailsChange}
                          maxLength={100}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="regofAppBg mb-3">
                    <div className="formSectionTitle">
                      <h3>Firm Details</h3>
                    </div>

                    <Row>
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="Firm Name" required={true} />
                        <TableInputText
                          disabled={true}
                          type="text"
                          placeholder="Enter Firm Name"
                          required={true}
                          name={"firmName"}
                          value={firmDetails.firmName}
                          onChange={() => {}}
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

                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="Industry Type" required={true} />                        
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

                    <div className="formSectionTitle">
                      <h3>Principal Place of Business</h3>
                    </div>

                    <Row>
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="Door No" required={true} />
                        <TableInputText
                          disabled={false}
                          type="text"
                          placeholder="Door No"
                          required={false}
                          name={"doorNo"}
                          value={principalBusiDetails.doorNo}
                          onChange={principalBusinessChange}
                        />
                      </Col>
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="Street" required={true} />
                        <TableInputText
                          disabled={false}
                          type="text"
                          placeholder="Street"
                          required={true}
                          name={"street"}
                          value={principalBusiDetails.street}
                          onChange={principalBusinessChange}
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
                        />
                      </Col>
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="District" required={true} />
                        <TableDropdownSRO
                          keyName={"name"}
                          disabled={true}
                          required={true}
                          options={DistrictList}
                          name={"district"}
                          value={principalBusiDetails.district}
                          onChange={() => {}}
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
                        <TableDropdownSRO
                          keyName="villageName"
                          required={true}
                          options={VillageListForPrincipleAddr}
                          name={"villageOrCity"}
                          value={principalBusiDetails.villageOrCity}
                          onChange={principalBusinessChange}
                        />
                      </Col>
                      <Col lg={3} md={3} xs={12} className="mb-3">
                        <TableText label="PIN Code" required={true} />
                        <TableInputText
                          disabled={false}
                          type="text"
                          maxLength={6}
                          placeholder="PIN Code"
                          required={true}
                          name={"pinCode"}
                          dot={false}
                          value={principalBusiDetails.pinCode}
                          onChange={principalBusinessChange}
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
                            checked={principalBusiDetails.type?.toUpperCase() == "OWN"}
                          />
                          <Form.Check
                            inline
                            label="Lease"
                            value="Lease"
                            name="type"
                            type="radio"
                            className="fom-checkbox"
                            onChange={principalBusinessChange}
                            checked={principalBusiDetails.type?.toUpperCase() == "LEASE"}
                          />
                        </div>
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
                            onChange={otherPlaceHandle}
                          />
                        </div>
                      </Col>
                    </Row>

                    {IsOtherChecked || (otherbusinessDetails && otherbusinessDetails.length) ? (
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
                              <TableText label="Door No" required={false} />
                              <TableInputText
                                disabled={false}
                                type="text"
                                placeholder="Door No"
                                required={false}
                                name={"doorNo"}
                                value={SelectedOtherbusinessDetails.doorNo}
                                onChange={otherDetailsChange}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Street" required={true} />
                              <TableInputText
                                disabled={false}
                                type="text"
                                placeholder="Street"
                                required={false}
                                name={"street"}
                                value={SelectedOtherbusinessDetails.street}
                                onChange={otherDetailsChange}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="State" required={true} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="State"
                                required={false}
                                name={"state"}
                                value={SelectedOtherbusinessDetails.state}
                                onChange={() => {}}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="District" required={true} />
                              <TableDropdownSRO
                                disabled={false}
                                keyName={"name"}
                                required={false}
                                options={DistrictList}
                                name={"district"}
                                value={SelectedOtherbusinessDetails.district}
                                onChange={otherDetailsChange}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Mandal" required={true} />
                              <TableDropdownSRO
                                disabled={false}
                                keyName={"mandalName"}
                                required={false}
                                options={MandalForOtherAddr}
                                name={"mandal"}
                                value={SelectedOtherbusinessDetails.mandal}
                                onChange={otherDetailsChange}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Village/City" required={true} />
                              <TableDropdownSRO
                                disabled={false}
                                keyName="villageName"
                                required={false}
                                options={VillageListForOtherAddr}
                                name={"villageOrCity"}
                                value={SelectedOtherbusinessDetails.villageOrCity}
                                onChange={otherDetailsChange}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="PIN Code" required={false} />
                              <TableInputText
                                disabled={false}
                                type="text"
                                maxLength={6}
                                placeholder="PIN Code"
                                required={false}
                                name={"pinCode"}
                                value={SelectedOtherbusinessDetails.pinCode}
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
                      </div>
                    ) : null}
                  </div>

                  <div className="regofAppBg mb-3">
                    <div className="FirmSecNew mb-3">
                      <div className="NewFirmSecTitle">
                        <Row>
                          <Col lg={12} md={12} xs={12}>
                            <h3>Partner Details</h3>
                          </Col>
                        </Row>
                      </div>
                      <div className="regofAppBg mb-3">
                        <Row>
                          <Col lg={3} md={3} xs={12} className="mb-3">
                            {editingIndex === -1 ? (
                            !TempMemoryPartner.OTPRequested ? (
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
                                    name={"maskedAadhar"}
                                    value={SelectedPartnerDetails.maskedAadhar}
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
                                <TableText label="Enter OTP" required={false} />
                                <div className="formGroup">
                                  <TableInputText
                                    disabled={false}
                                    type="number"
                                    placeholder="Enter OTP Received"
                                    maxLength={6}
                                    required={false}
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
                            )
                          ) : (
                                <Form.Group>
                                  <TableText label="Aadhaar Number" required={false} />
                                  <div className="formGroup">
                                    <TableInputText
                                      disabled={true}
                                      type="text"
                                      maxLength={12}
                                      placeholder="Aadhaar Number"
                                      name={"maskedAadhar"}
                                      value={SelectedPartnerDetails.maskedAadhar} required={false}                                    />
                                  </div>
                                </Form.Group>
                              )}
                          </Col>

                          <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label="Name of the Partner" required={true} />
                            <TableInputText
                              disabled={false}
                              type="text"
                              placeholder="Enter Name of the Partner"
                              required={false}
                              name={"partnerName"}
                              value={SelectedPartnerDetails.partnerName}
                              onChange={() => {}}
                            />
                            <TableText
                              label={`Gender: ${SelectedPartnerDetails.gender}  / Age: ${SelectedPartnerDetails.age}`}
                              required={false}
                            />
                          </Col>

                          <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label={"Relation type and Name"} required={true} />
                            <div className={styles.relationData}>
                              <select
                                className={styles.selectData}
                                required={false}
                                name={"relationType"}
                                value={SelectedPartnerDetails.relationType}
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
                                required={false}
                                disabled={false}
                                name={"relation"}
                                value={SelectedPartnerDetails.relation}
                                onChange={() => {}}
                              />
                            </div>
                          </Col>
                          <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label="Role" required={true} />
                            <TableInputText
                              disabled={false}
                              type="text"
                              placeholder="Enter Role"
                              required={false}
                              name={"role"}
                              value={SelectedPartnerDetails.role}
                              onChange={partnerDetailsChange}
                              maxLength={50}
                            />
                          </Col>
                          <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label="Joining Date" required={true} />

                            <TableInputText
                              disabled={false}
                              type="date"
                              placeholder="DD/MM/YYYY"
                              name="joiningDate"
                              required={false}
                              max={moment(moment().toDate()).format("YYYY-MM-DD")}
                              value={SelectedPartnerDetails.joiningDate}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                          <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label="Partner Percentage(%)" required={true} />
                            <TableInputText
                              disabled={false}
                              type="text"
                              maxLength={3}
                              placeholder="Enter Share Percentage"
                              required={false}
                              name={"share"}
                              value={SelectedPartnerDetails.share}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                        </Row>

                        <div className="regFormBorder"></div>

                        <div className="formSectionTitle">
                          <h3>Address Details</h3>
                        </div>
                        <Row>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Door No" required={true} />
                            <TableInputText
                              type="text"
                              placeholder="Door No"
                              required={false}
                              name={"doorNo"}
                              value={SelectedPartnerDetails.doorNo}
                              onChange={partnerDetailsChange}
                              disabled={false}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Street" required={false} />
                            <TableInputText
                              type="text"
                              placeholder="Street"
                              required={false}
                              name={"street"}
                              value={SelectedPartnerDetails.street}
                              onChange={partnerDetailsChange}
                              disabled={false}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="District" required={true} />                           
                            <TableDropdownSRO
                              keyName={"name"}
                              required={false}
                              options={DistrictList}
                              name={"district"}
                              value={SelectedPartnerDetails.district}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Mandal" required={false} />                            
                            <TableDropdownSRO
                              keyName={"mandalName"}
                              required={false}
                              options={MandalForPartnerDetails}
                              name={"mandal"}
                              value={SelectedPartnerDetails.mandal}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Village/City" required={true} />                            
                            <TableDropdownSRO
                              keyName="villageName"
                              required={false}
                              options={VillageListForPartnerDetails}
                              name={"villageOrCity"}
                              value={SelectedPartnerDetails.villageOrCity}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="PIN Code" required={true} />
                            <TableInputText
                              type="text"
                              maxLength={6}
                              placeholder="PIN Code"
                              required={false}
                              name={"pinCode"}
                              value={SelectedPartnerDetails.pinCode}
                              onChange={partnerDetailsChange}
                              disabled={false}
                            />
                          </Col>
                        </Row>
                        <div className="regFormBorder"></div>
                        <div className="formSectionTitle">
                          <h3>Contact Details</h3>
                        </div>

                        <Row>                          
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Mobile No" required={true} />
                            <TableInputText
                              disabled={false}
                              type="text"
                              dot={false}
                              maxLength={10}
                              placeholder="Enter Mobile No"
                              required={false}
                              name={"mobileNumber"}
                              value={SelectedPartnerDetails.mobileNumber}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                          <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText label="Email ID" required={false} />
                            <TableInputText
                              disabled={false}
                              type="email"
                              placeholder="Enter Email ID"
                              required={false}
                              name={"email"}
                              value={SelectedPartnerDetails.email}
                              onChange={partnerDetailsChange}
                            />
                          </Col>
                        </Row>
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
                      {partnerDetails && partnerDetails.length ? (
                        <div className="addedPartnerSec mt-3">
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
                                    <th>Village</th>
                                    <th>Share</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {partnerDetails.map((item: any, i: number) => {
                                    return (
                                      <tr key={i + 1}>
                                        <td>
                                          {"XXXXXXXX" +
                                            item.aadharNumber.toString().substring(8, 12)}
                                        </td>
                                        <td>{item.partnerName}</td>
                                        <td>{item.age}</td>
                                        <td>{item.role}</td>
                                        <td>{item.mobileNumber}</td>
                                        <td>{item.villageOrCity}</td>
                                        <td>{item.share}</td>
                                        <td>
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
                                          <Image
                                            alt="Edit"
                                            height={18}
                                            width={17}
                                            src="/firmsHome/assets/edit-icon.svg"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => updateSelectedPartner(i)}
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
                    </div>
                  </div>

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
                        {principalBusiDetails.type != "" &&
                          principalBusiDetails.type?.toUpperCase() == "LEASE" && (
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

                        {principalBusiDetails.type != "" &&
                          principalBusiDetails.type?.toUpperCase() == "OWN" && (
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
                              <Form.Label>
                                Self Signed Declaration <span>*</span> :{" "}
                                <a href="/firmsHome/assets/downloads/Form-I.pdf" target="_blank">
                                  <img src="/firmsHome/assets/pdf_symbol.jpg" />
                                </a>
                              </Form.Label>
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
                      <Row className="mt-5">
                        <div className="d-flex justify-content-between align-items-center page-title mb-3">
                            <div className="pageTitleLeft">
                              <h1 className="mb-3">
                                Checklist for Uploaded Documents:
                              </h1>
                            </div>
                          </div>
                            <Col lg={3} md={6} xs={12}>
                                <div className="checkboxInfo">
                                <input
                                    type="checkbox"
                                    required={true}                                    
                                />
                                <h6>Is Partnership Deed Uploaded? <span>*</span></h6>
                                </div>
                            </Col>
                            <Col lg={3} md={6} xs={12}>
                                <div className="checkboxInfo">
                                <input
                                    type="checkbox"
                                    required={true}                                    
                                />
                                <h6>Is Affidavit/Lease Agreement Uploaded? <span>*</span></h6>
                                </div>
                            </Col>
                            <Col lg={3} md={6} xs={12}>
                                <div className="checkboxInfo">
                                <input
                                    type="checkbox"
                                    required={true}
                                />
                                <h6>Is Self Signed Declaration Uploaded? <span>*</span></h6>
                                </div>
                            </Col>
                            <Col lg={3} md={6} xs={12}>
                                <div className="checkboxInfo">
                                <input
                                    type="checkbox"
                                    required={true}
                                /> <h6>Is Form 1 with Digital Sign Uploaded? <span>*</span></h6>
                                </div> 
                            </Col>
                        </Row>
                    </div>
                  </div>
                  <div className="firmSubmitSec">
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-center text-center">
                          <button
                            className="btn btn-primary showPreview"
                            onClick={() => setPreviewBtnClicked(true)}
                          >
                            Preview
                          </button>
                          <button
                            className="btn btn-primary showPayment"
                            name="btn1"
                            onClick={() => setIsPayNowClicked(true)}
                            value="Submit"
                          >
                            Submit
                          </button>                          
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Container>
              </Form>
            )}
            {firmData.status != "Incomplete" && isResubmission != "true" && (
              <Col lg={12} md={12} xs={12}>
                <div className="d-flex justify-content-between pagesubmitSecTitle mb-3">
                  <div className="ms-2">
                    <h2>
                      <p>
                        <b>Thank You! Your application has been submitted successfully.</b>
                      </p>{" "}
                      <a href="/firmsHome/firms" style={{ color: "blue" }}>
                        click here
                      </a>{" "}
                      to check application status
                    </h2>
                  </div>
                </div>
              </Col>
            )}
          </div>
        )}
        {isPreview && <PreviewFirm setIsPreview={setIsPreview} />}
        {(!locData?.userType || locData?.userType != "user") && (
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

export default Form1Edit
