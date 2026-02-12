import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import Swal from "sweetalert2"
import Head from "next/head"
import { Container, Col, Row, Form, Table, Card, Modal } from "react-bootstrap"
import styles from "@/styles/pages/Mixins.module.scss"
import { CallingAxios, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import moment from "moment"
import {
  UseGetAadharDetails,
  UseGetAadharOTP,
  UseGetFirmDetailsById,
  UseGetDistrictList,
  UseGetMandalList,
  UseGetVillagelList,
  UseFirmNameCheck,
  UseFirmNameCheckAvailability,
} from "@/axios"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import TableDropdownSRO from "@/components/common/TableDropdownSRO"
import TableSelectDate from "@/components/common/TableSelectDate"
import CryptoJS, { AES } from "crypto-js"
import PreviewFirm from "./previewFirm"
import {
  IApplicantDetailsForm2Model,
  IContactDetailsModel,
  IFirmDetailsModel,
  IFirmInDetailsModel,
  IFirmNameChangeModel,
  IFirmPartnerDetailsModel,
  IOtherBusinessForm2DetailsModel,
  IPrincipleForm2BusinessDetails,
} from "@/models/firmsTypes"

const Form2 = () => {
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
    status: "",
    processingHistory: [],
  })
  console.log("::::::firmData.status:::", firmData.status);
  const [file, setFile] = useState<any>({})
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [DistrictList, setDistrictList] = useState<any>([])
  const [MandalForApplicant, setMandalForApplicant] = useState<any>([])
  const [MandalForPrincipleAddr, setMandalForPrincipleAddr] = useState<any>([])
  const [MandalForOtherAddr, setMandalForOtherAddr] = useState<any>([])
  const [MandalForPartnerDetails, setMandalForPartnerDetails] = useState<any>([])
  const [VillageListForApplicant, setVillageListForApplicant] = useState<any>([])
  const [VillageListForPrincipleAddr, setVillageListForPrincipleAddr] = useState<any>([])
  const [VillageListForOtherAddr, setVillageListForOtherAddr] = useState<any>([])
  const [VillageListForPartnerDetails, setVillageListForPartnerDetails] = useState<any>([])
  const [changeFirm, setChangeFirm] = useState<string[]>([])
  const [TempMemory, setTempMemory] = useState<any>({ OTPRequested: false, AadharVerified: false })
  const [LoginDetails, setLoginDetails] = useState<any>({})
  const [isOtherAddressChange, setIsOtherAddressChange] = useState<boolean>(false)
  const [isPartnerPermanentAddressChange, setIsPartnerPermanentAddressChange] =
    useState<boolean>(false)
  const [SelectedOtherbusinessDetails, setSelectedOtherbusinessDetails] =
    useState<IOtherBusinessForm2DetailsModel>({
      doorNo: "",
      street: "",
      state: "AndhraPradesh",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      disabled: true,
      AddNew: false,
    })
  const [SelectedFirmPartner, setSelectedFirmPartner] = useState<IFirmPartnerDetailsModel>({
    doorNo: "",
    street: "",
    state: "AndhraPradesh",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    role: "",
    disabled: true,
    AddNew: false,
    address: ""
  })
  const [isPayNowClicked, setIsPayNowClicked] = useState<boolean>(false)
  const [partnerDetails, setPartnerDetails] = useState<any>([])
  const [applicantDetails, setApplicantDetails] = useState<IApplicantDetailsForm2Model>({
    maskedAadhar: "",
    name: "",
    aadharNumber: "",
    applicantName: "",
    spoof: "",
    relation: "",
    relationType: "",
    role: "",
    otp: "",
    OTPResponse: { transactionNumber: "" },
    KYCResponse: {},
    doorNo: "",
    street: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    deliveryType: "",
    gender: "",
    address: ""
  })
  const [contactDetails, setContactDetails] = useState<IContactDetailsModel>({
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
    fieldName: "",
  })
  const [firmDetails, setFirmDetails] = useState<IFirmDetailsModel>({
    firmName: "",
    firmDurationFrom: "",
    firmDurationTo: "",
    industryType: "",
    businessType: "",
    atWill: false,
  })
  const [principalBusiDetails, setPrincipalBusiDetails] = useState<IPrincipleForm2BusinessDetails>({
    doorNo: "",
    street: "",
    country: "",
    state: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    fieldName: "",
    type: "",
  })
  const [otherbusinessDetails, setOtherBusinessDetails] = useState<
    IOtherBusinessForm2DetailsModel[]
  >([
    {
      doorNo: "",
      street: "",
      state: "",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      role: "",
    },
  ])
  const [firmNameChangeDetails, setFirmNameChangeDetails] = useState<IFirmNameChangeModel>({
    newFirmName: "",
    newNameEffectDate: "",
  })
  const [newprincipalBusiDetails, setNewPrincipalBusiDetails] =
    useState<IPrincipleForm2BusinessDetails>({
      doorNo: "",
      street: "",
      country: "",
      state: "Andhra Pradesh",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      newPlaceEffectDate: "",
      fieldName: "",
      type: "",
    })
  const [NumberOfChanges, setNumberOfChanges] = useState<number>(0)
  const [locData, setLocData] = useState<any>({})
  const router = useRouter()
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const [unAuthshow, setUnAuthshow] = useState(false)
  const [savedFirm, setSavedFirm] = useState<any>({})
  const [PreviewBtnClicked, setPreviewBtnClicked] = useState(false)

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLocData(data)
    }
    let LoginData = KeepLoggedIn()
    if (LoginData && LoginData.userType == "user") {
      setLoginDetails(LoginData)
      GetFirmDetails(LoginData)
      GetDistrictList(LoginData.token)
    }
    if (unAuthshow) {
      setShow(false);
    }
    setShow(true);
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    if (file?.partnershipDeed) {
      let inputEle = document.getElementById("partnershipDeed") as HTMLInputElement
      if (inputEle !== null) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file.partnershipDeed)
        inputEle.files = dataTransfer.files
      }
    }
    if (file?.leaseAgreement) {
      let inputEle = document.getElementById("leaseAgreement") as HTMLInputElement
      if (inputEle !== null) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file.leaseAgreement)
        inputEle.files = dataTransfer.files
      }
    }
    if (file?.affidavit) {
      let inputEle = document.getElementById("affidavit") as HTMLInputElement
      if (inputEle !== null) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file.affidavit)
        inputEle.files = dataTransfer.files
      }
    }
    if (file?.selfSignedDeclaration) {
      let inputEle = document.getElementById("selfSignedDeclaration") as HTMLInputElement
      if (inputEle !== null) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file.selfSignedDeclaration)
        inputEle.files = dataTransfer.files
      }
    }
  }, [isPreview]);

  const GetFirmDetails = async (data: any) => {
    let result = await UseGetFirmDetailsById(data.applicationId, data.token)    
    if (result.success) {      
      let otherAddressList = ["Add New"]
      let firmsValue = result.data.firm
      setSavedFirm(firmsValue)
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
      // setApplicantDetails(firmsValue.applicantDetails);
      // if (firmsValue?.applicantDetails?.district != "") { GetMandalList(firmsValue.applicantDetails.district, "applicant"); }
      // if (firmsValue?.applicantDetails?.mandal != "") { GetVillageList(firmsValue.applicantDetails.mandal, firmsValue.applicantDetails.district, "applicant"); }
      setFirmDetails({
        ...firmDetails,
        firmName: firmsValue.firmName,
        firmDurationFrom: firmsValue.firmDurationFrom,
        firmDurationTo: firmsValue.firmDurationTo,
        industryType: firmsValue.industryType,
        businessType: firmsValue.bussinessType,
        atWill: firmsValue.atWill,
      })
      setPartnerDetails(firmsValue.firmPartners)
      setOtherBusinessDetails(firmsValue.otherPlaceBusiness)
      setNewPrincipalBusiDetails({
        ...newprincipalBusiDetails,
        district: firmsValue?.principalPlaceBusiness[0]?.district,
      })
      firmsValue?.principalPlaceBusiness?.length &&
        setPrincipalBusiDetails(firmsValue?.principalPlaceBusiness[0])
      if (
        firmsValue?.principalPlaceBusiness?.length > 0 &&
        firmsValue?.principalPlaceBusiness[0]?.district != ""
      ) {
        GetMandalList(firmsValue.principalPlaceBusiness[0].district, "principalAddr")
      }
      if (firmsValue?.district != "") {
        setSelectedOtherbusinessDetails({
          ...SelectedOtherbusinessDetails,
          district: firmsValue?.district,
        })
        GetMandalList(firmsValue.district, "otherAddr")
      }
      if (
        firmsValue?.principalPlaceBusiness?.length > 0 &&
        firmsValue?.principalPlaceBusiness[0]?.mandal != ""
      ) {
        GetVillageList(
          firmsValue.principalPlaceBusiness[0].mandal,
          firmsValue.principalPlaceBusiness[0].district,
          "principalAddr"
        )
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: result.message,
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const GetDistrictList = async (token: any) => {
    let result = await CallingAxios(UseGetDistrictList(token))
    if (result.success) {
      setDistrictList(result.data)
    }
  }

  const GetMandalList = async (district: string, saveto: string) => {
    let result = await CallingAxios(UseGetMandalList({ districtName: district }, LoginDetails))
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
      UseGetVillagelList({ districtName: district, mandalName: mandal }, LoginDetails)
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

  const ReqOTP = () => {
    if (applicantDetails.aadharNumber.length == 12) {
      CallGetOTP()
    } else {
      ShowMessagePopup(false, "Kindly enter valid Aadhar number", "")
    }
  }
  const ReqDetails = async () => {
    let result = await CallingAxios(
      UseGetAadharDetails({
        aadharNumber: btoa(applicantDetails.aadharNumber),
        transactionNumber: applicantDetails.OTPResponse.transactionNumber,
        otp: applicantDetails.otp,
      })
    )
    if (
      result.status &&
      result.status === "Success" &&
      applicantDetails.OTPResponse.transactionNumber == result.transactionNumber.split(":")[1]
    ) {
      let latestData: any = {
        ...applicantDetails,
        name: result.userInfo.name ? result.userInfo.name : "",
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
      setTempMemory({ OTPRequested: false, AadharVerified: true })
      setApplicantDetails(latestData)
    } else {
      ShowMessagePopup(false, "Please Enter Valid OTP", "")
    }
  }

  const CallGetOTP = async () => {
    if (process.env.IGRS_SECRET_KEY) {
      const ciphertext = AES.encrypt(
        applicantDetails.aadharNumber.toString(),
        process.env.IGRS_SECRET_KEY
      )
      let result = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
      if (result && result.status != "Failure") {
        setTempMemory({ OTPRequested: true, AadharVerified: false })
        setApplicantDetails({ ...applicantDetails, OTPResponse: result })
        ShowMessagePopup(
          true,
          "The OTP has been sent to your Aadhaar registered mobile number successfully.",
          ""
        )
      } else {
        setTempMemory({ OTPRequested: false, AadharVerified: false })
        setApplicantDetails({
          ...applicantDetails,
          otp: "",
          OTPResponse: { transactionNumber: "" },
          KYCResponse: {},
        })
        ShowMessagePopup(false, "Please Enter Valid Aadhar", "")
      }
    }
  }

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  const CheckFirmName = async (name: string, district: string) => {
    let data: any = {
      firmName: name,
      registrationName: name,
      district: district,
    }
    let result = await CallingAxios(UseFirmNameCheckAvailability(data, LoginDetails))
    if (result.success) {
      let result2 = await CallingAxios(UseFirmNameCheck(data, LoginDetails))
      if (result2.success) {
        ShowMessagePopup(true, result2.message, "")
      } else {
        ShowMessagePopup(false, result2.message, "")
      }
    } else {
      ShowMessagePopup(false, result.message, "")
    }
  }

  const applicantDetailsChange = (e: any) => {
    let TempDetails: IApplicantDetailsForm2Model = { ...applicantDetails }
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
    let TempDetails: IFirmNameChangeModel = { ...firmNameChangeDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    setFirmNameChangeDetails({ ...TempDetails, [AddName]: AddValue })
  }

  const newprincipalBusinessChange = (e: any) => {
    let TempDetails: IPrincipleForm2BusinessDetails = { ...newprincipalBusiDetails }
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
    setNewPrincipalBusiDetails({ ...TempDetails, [AddName]: AddValue })
  }

  const otherDetailsChange = (event: any, index: number) => {
    let tempDetails: IOtherBusinessForm2DetailsModel = { ...SelectedOtherbusinessDetails }
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

  const partnerDetailsChange = (event: any, index: number) => {
    let tempDetails: IFirmPartnerDetailsModel = { ...SelectedFirmPartner }
    let AddName = event.target.name
    let AddValue = event.target.value
    if (AddName == "district") {
      setMandalForPartnerDetails([])
      setVillageListForPartnerDetails([])
      GetMandalList(AddValue, "Partner")
    }
    if (AddName == "mandal") {
      setVillageListForOtherAddr([])
      GetVillageList(AddValue, tempDetails.district, "Partner")
    }
    setSelectedFirmPartner({ ...tempDetails, [AddName]: AddValue })
  }

  const FirmNameDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setFirmNameChangeDetails(newInput)
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

  const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      if (reader && reader != null && file) {
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result?.toString() || "")
        reader.onerror = (error) => reject(error)
      }
    })
  }

  const handleSubmit = async (e: any) => {
    let ChangeCount: number = NumberOfChanges
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
      return ShowMessagePopup(false, "Please enter vaild applicant mobile number", "")
    }
    if (
      applicantDetails.pinCode?.toString() != "" &&
      applicantDetails.pinCode?.toString()?.length != 6
    ) {
      return ShowMessagePopup(false, "Please enter valid applicant pincode", "")
    }
    if (newprincipalBusiDetails.pinCode != "" && newprincipalBusiDetails.pinCode.length != 6) {
      return ShowMessagePopup(
        false,
        "Please enter valid pincode for principal place of business",
        ""
      )
    }
    const newData = new FormData()
    newData.append("applicantDetails[aadharNumber]", applicantDetails?.aadharNumber)
    newData.append("applicantDetails[name]", applicantDetails?.name?.toUpperCase() || "")
    newData.append(
      "applicantDetails[surName]",
      applicantDetails?.surName ? applicantDetails?.surName : ""
    )
    newData.append("applicantDetails[gender]", applicantDetails?.gender?.toUpperCase() || "")
    newData.append("applicantDetails[relationType]", applicantDetails?.relationType?.toUpperCase() || "")
    newData.append("applicantDetails[relation]", applicantDetails?.relation?.toUpperCase() || "")
    newData.append("applicantDetails[age]", applicantDetails?.age ? applicantDetails?.age : "")
    newData.append("applicantDetails[role]", applicantDetails?.role?.toUpperCase() || "")
    newData.append("applicantDetails[doorNo]", applicantDetails?.doorNo?.toUpperCase() || "")
    newData.append("applicantDetails[street]", applicantDetails?.street?.toUpperCase() || "")
    newData.append("applicantDetails[district]", applicantDetails?.district?.toUpperCase() || "")
    newData.append("applicantDetails[mandal]", applicantDetails?.mandal?.toUpperCase() || "")
    newData.append(
      "applicantDetails[villageOrCity]",
      applicantDetails?.villageOrCity?.toUpperCase()
     || "")
    newData.append("applicantDetails[address]", applicantDetails?.address || "")
    newData.append("applicantDetails[pinCode]", applicantDetails?.pinCode || "")
    newData.append("applicantDetails[country]", "INDIA")
    newData.append("applicantDetails[state]", "ANDHRA PRADESH")

    newData.append("contactDetails[landPhoneNumber]", contactDetails?.landPhoneNumber || "")
    newData.append("contactDetails[mobileNumber]", contactDetails?.mobileNumber || "")
    newData.append("contactDetails[email]", contactDetails?.email || "")

    newData.append("firmDurationFrom", firmDetails?.firmDurationFrom || "")
    newData.append("firmDurationTo", firmDetails?.firmDurationTo || "")
    newData.append("industryType", firmDetails?.industryType?.toUpperCase() || "")
    newData.append("bussinessType", firmDetails?.businessType?.toUpperCase() || "")
    newData.append("district", firmData.district || "")
    if (
      (newprincipalBusiDetails.type == "" &&
        firmData?.principalPlaceBusiness &&
        firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "LEASE") ||
      newprincipalBusiDetails.type?.toUpperCase() == "LEASE"
    ) {
      newData.append("leaseAgreement", file?.leaseAgreement || "")
    }
    if (
      (newprincipalBusiDetails.type == "" &&
        firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "OWN") ||
      newprincipalBusiDetails.type?.toUpperCase() == "OWN"
    ) {
      newData.append("affidavit", file.affidavit)
    }
    newData.append("partnershipDeed", file.partnershipDeed)
    newData.append("selfSignedDeclaration", file.selfSignedDeclaration)
    newData.append("formType", "form-1")
    newData.append("applicationNumber", LoginDetails.applicationNumber)
    newData.append("id", LoginDetails.applicationId)
    newData.append("isOtherAddressChange", isOtherAddressChange ? "true" : "false")
    newData.append(
      "isPartnerPermanentAddressChange",
      isPartnerPermanentAddressChange ? "true" : "false"
    )

    if (firmNameChangeDetails.newFirmName != "") {
      ChangeCount = ChangeCount + 1
      newData.append("isFirmNameChange", "true")
      newData.append("newFirmName", firmNameChangeDetails.newFirmName?.toUpperCase())
      newData.append("newNameEffectDate", firmNameChangeDetails.newNameEffectDate)
    } else {
      newData.append("isFirmNameChange", "false")
    }

    if (newprincipalBusiDetails.doorNo != "") {
      ChangeCount = ChangeCount + 1
      newData.append("isPrincipaladdressChange", "true")
      newData.append(
        "principalPlaceBusiness[doorNo]",
        newprincipalBusiDetails.doorNo?.toUpperCase()
      )
      newData.append(
        "principalPlaceBusiness[street]",
        newprincipalBusiDetails.street?.toUpperCase()
      )
      newData.append("principalPlaceBusiness[state]", "ANDHRA PRADESH")
      newData.append(
        "principalPlaceBusiness[district]",
        newprincipalBusiDetails.district?.toUpperCase()
      )
      newData.append(
        "principalPlaceBusiness[mandal]",
        newprincipalBusiDetails.mandal?.toUpperCase()
      )
      newData.append(
        "principalPlaceBusiness[villageOrCity]",
        newprincipalBusiDetails.villageOrCity?.toUpperCase()
      )
      newData.append("principalPlaceBusiness[pinCode]", newprincipalBusiDetails.pinCode)
      newData.append("principalPlaceBusiness[country]", "INDIA")
      newData.append("principalPlaceBusiness[branch]", "MAIN")
      newData.append("principalPlaceBusiness[type]", newprincipalBusiDetails.type?.toUpperCase())
    } else {
      newData.append("isPrincipaladdressChange", "false")
    }
    const partnerDetails = [...firmData.firmPartners]
    if (partnerDetails && partnerDetails.length > 0) {
      for (let j = 0; j < partnerDetails.length; j++) {
        newData.append("partnerDetails[" + j + "][aadharNumber]", partnerDetails[j]?.aadharNumber || "")
        newData.append(
          "partnerDetails[" + j + "][partnerName]",
          partnerDetails[j].partnerName?.toUpperCase()
        || "")
        newData.append("partnerDetails[" + j + "][partnerSurname]", partnerDetails[j].surName || "")
        newData.append(
          "partnerDetails[" + j + "][relation]",
          partnerDetails[j].relation?.toUpperCase()
         || "")
        newData.append(
          "partnerDetails[" + j + "][relationType]",
          partnerDetails[j].relationType?.toUpperCase()
         || "")
        newData.append("partnerDetails[" + j + "][role]", partnerDetails[j].role?.toUpperCase()  || "")
        newData.append("partnerDetails[" + j + "][age]", partnerDetails[j].age  || "")
        newData.append("partnerDetails[" + j + "][doorNo]", partnerDetails[j].doorNo?.toUpperCase()  || "")
        newData.append("partnerDetails[" + j + "][street]", partnerDetails[j].street?.toUpperCase()  || "")
        newData.append(
          "partnerDetails[" + j + "][district]",
          partnerDetails[j].district?.toUpperCase()
         || "")
        newData.append("partnerDetails[" + j + "][mandal]", partnerDetails[j].mandal?.toUpperCase() || "")
        newData.append(
          "partnerDetails[" + j + "][villageOrCity]",
          partnerDetails[j].villageOrCity?.toUpperCase()
         || "")
        newData.append("partnerDetails[" + j + "][pinCode]", partnerDetails[j].pinCode || "")
        newData.append("partnerDetails[" + j + "][address]", partnerDetails[j].address || "")
        newData.append(
          "partnerDetails[" + j + "][landPhoneNumber]",
          partnerDetails[j].landPhoneNumber
         || "")
        newData.append("partnerDetails[" + j + "][share]", partnerDetails[j].share || "")
        newData.append("partnerDetails[" + j + "][joiningDate]", partnerDetails[j].joiningDate  || "")
        newData.append("partnerDetails[" + j + "][mobileNumber]", partnerDetails[j].mobileNumber || "")
        newData.append("partnerDetails[" + j + "][email]", partnerDetails[j].email || "")
        newData.append("partnerDetails[" + j + "][state]", "ANDHRA PRADESH")
        newData.append("partnerDetails[" + j + "][country]", "INDIA")
      }
    }    

    const otherbusinessDetails = [...firmData.otherPlaceBusiness]
    if (otherbusinessDetails && otherbusinessDetails.length > 0) {
      for (let j = 0; j < otherbusinessDetails.length; j++) {
        newData.append(
          "otherPlaceBusiness[" + j + "][doorNo]",
          otherbusinessDetails[j].doorNo?.toUpperCase()
        )
        newData.append(
          "otherPlaceBusiness[" + j + "][street]",
          otherbusinessDetails[j].street?.toUpperCase()
        )
        newData.append("otherPlaceBusiness[" + j + "][state]", "ANDHRA PRADESH")
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
    }

    let object: any = {}
    newData.forEach((value, key) => (object[key] = value))
    if (
      (newprincipalBusiDetails.type == "" &&
        firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "OWN") ||
      newprincipalBusiDetails.type?.toUpperCase() == "OWN"
    ) {
      object.affidavit = await file2Base64(file?.affidavit)
    }
    if (
      (newprincipalBusiDetails.type == "" &&
        firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "LEASE") ||
      newprincipalBusiDetails.type?.toUpperCase() == "LEASE"
    ) {
      object.leaseAgreement = await file2Base64(file?.leaseAgreement)
    }
    object.partnershipDeed = await file2Base64(file?.partnershipDeed)
    object.selfSignedDeclaration = await file2Base64(file?.selfSignedDeclaration)
    localStorage.setItem("AmendmentData", JSON.stringify(object))
    localStorage.setItem("PartnerDetails", JSON.stringify(partnerDetails))
    localStorage.setItem("PrincipalPlace", JSON.stringify(newprincipalBusiDetails))
    localStorage.setItem("otherPlace", JSON.stringify(otherbusinessDetails))
    localStorage.setItem("applicantDetails", JSON.stringify(applicantDetails))

    // let Result = await CallingAxios(UseSaveFirmDetails(newData, LoginDetails.token))

    if (isPayNowClicked) {
      await RedirectToPayment(ChangeCount)
    } else {
      setIsPreview(true)
    }
  }

  const RedirectToPayment = async (ChangeCount: number) => {
    if (ChangeCount == 0) {
      return ShowMessagePopup(false, "No Changes Identified")
    }
    let code = 0
    const dis = DistrictList?.find((x: any) => x.name == principalBusiDetails.district)
    if (dis) {
      code = dis.code
    }
    const memCount = partnerDetails.length
    const paymentsData = {
      type: "firmsFee",
      source: "Firms",
      deptId: LoginDetails.applicationNumber,
      rmName: applicantDetails?.name,
      rmId: applicantDetails?.aadharNumber,
      mobile: contactDetails.mobileNumber,
      email: contactDetails.email,
      drNumber: code,
      rf: ChangeCount * 100,
      uc: 0,
      oc: 0,
      returnURL: process.env.BACKEND_URL + "/firms/redirectPayment",
    }
    let paymentRedirectUrl = process.env.PAYMENT_REDIRECT_URL
    let encodedData = Buffer.from(JSON.stringify(paymentsData), "utf8").toString("base64")
    console.log("ENCODED VALUE IS ", encodedData)
    let paymentLink = document.createElement("a")
    paymentLink.href = paymentRedirectUrl + encodedData
    //paymentLink.target = "_blank";
    paymentLink.click()
    setIsPayNowClicked(false)
    setTimeout(function () {
      paymentLink.remove()
    }, 1000)
  }

  const amountCalculator = () => { }

  const OnSelectOtherBusniess = (e: any, status: string) => {
    if (status == "new") {
      setSelectedOtherbusinessDetails({
        doorNo: "",
        street: "",
        state: "AndhraPradesh",
        district: firmData.district,
        mandal: "",
        villageOrCity: "",
        pinCode: "",
        disabled: false,
        AddNew: true,
      })
      GetMandalList(firmData.district, "principalAddr")
    } else if (status == "clear" || !e?.target?.value) {
      setSelectedOtherbusinessDetails({
        doorNo: "",
        street: "",
        state: "AndhraPradesh",
        district: "",
        mandal: "",
        villageOrCity: "",
        pinCode: "",
        disabled: true,
        AddNew: false,
      })
    } else {
      let SelectedBusniess: any = firmData.otherPlaceBusiness.find(
        (x: any) => x._id == e.target.value
      )
      GetMandalList(SelectedBusniess.district, "otherAddr")
      GetVillageList(SelectedBusniess.mandal, SelectedBusniess.district, "otherAddr")
      SelectedBusniess.disabled = false
      SelectedBusniess.AddNew = false
      setSelectedOtherbusinessDetails(SelectedBusniess)
    }
  }

  const OnSelectFirmPartners = (e: any, status: string) => {
    let SelectedPartner: any = firmData.firmPartners.find((x: any) => x._id == e.target.value)
    GetMandalList(SelectedPartner?.district, "Partner")
    GetVillageList(SelectedPartner?.mandal, SelectedPartner?.district, "Partner")
    setSelectedFirmPartner(SelectedPartner ? SelectedPartner : {})
  }

  const SaveOtherBusniessDetails = () => {
    let Data: any = { ...SelectedOtherbusinessDetails }
    let otherPlaceBusiness: any = firmData.otherPlaceBusiness
    if (
      SelectedOtherbusinessDetails?.doorNo == "" ||
      SelectedOtherbusinessDetails.district == "" ||
      SelectedOtherbusinessDetails.mandal == "" ||
      SelectedOtherbusinessDetails.villageOrCity == "" ||
      SelectedOtherbusinessDetails.pinCode == "" ||
      SelectedOtherbusinessDetails.street == ""
    ) {
      return ShowMessagePopup(false, "Kindly Fill all the empty fields", "")
    } else if (
      SelectedOtherbusinessDetails.pinCode != "" &&
      SelectedOtherbusinessDetails.pinCode.length != 6
    ) {
      return ShowMessagePopup(false, "Please enter valid pincode for other business place", "")
    } else if (SelectedOtherbusinessDetails.AddNew) {
      setNumberOfChanges(NumberOfChanges + 1)
      setIsOtherAddressChange(true)
      otherPlaceBusiness.push({ ...Data, _id: Math.floor(Math.random() * 90000) + 10000 })
    } else {
      setNumberOfChanges(NumberOfChanges + 1)
      setIsOtherAddressChange(true)
      const index = otherPlaceBusiness.findIndex((obj: any) => {
        return obj._id === Data._id
      })
      otherPlaceBusiness.splice(index, 1, Data)
    }
    setFirmData({ ...firmData, otherPlaceBusiness: otherPlaceBusiness })
    setSelectedOtherbusinessDetails({
      doorNo: "",
      street: "",
      state: "AndhraPradesh",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      disabled: true,
      AddNew: false,
    })
    ShowMessagePopup(true, "Other place business updated Successfully", "")
  }

  const SaveFirmPartnerDetails = () => {
    let Data: any = { ...SelectedFirmPartner }
    let firmPartners: any = firmData.firmPartners
    if (
      SelectedFirmPartner.district == "" ||
      SelectedFirmPartner.address == ""
    ) {
      return ShowMessagePopup(false, "Kindly Fill all the empty fields", "")
    } else {
      setNumberOfChanges(NumberOfChanges + 1)
      setIsPartnerPermanentAddressChange(true)
      const index = firmPartners.findIndex((obj: any) => {
        return obj._id === Data._id
      })
      firmPartners.splice(index, 1, Data)
      setFirmData({ ...firmData, firmPartners: firmPartners })
      setSelectedFirmPartner({
        doorNo: "",
        street: "",
        state: "AndhraPradesh",
        district: "",
        mandal: "",
        villageOrCity: "",
        pinCode: "",
        role: "",
        disabled: true,
        AddNew: true,
        address: ""
      })
      setTimeout(() => {
        setSelectedFirmPartner({
          doorNo: "",
          street: "",
          state: "AndhraPradesh",
          district: "",
          mandal: "",
          villageOrCity: "",
          pinCode: "",
          role: "",
          disabled: true,
          AddNew: false,
          address: ""
        })
      }, 100)
      ShowMessagePopup(true, "New Partner updated Successfully", "")
    }
  }

  return (
    <>
      <Head>
        <title>Alteration in the name of firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      {!isPreview && locData && locData?.userType && locData?.userType == "user" && (
        <div className="societyRegSec">
          {/* <pre>{NumberOfChanges}</pre> */}
          {(firmData.status == "Approved" ||
            (firmData.status == "Rejected" &&
              firmData.processingHistory?.length > 0 &&
              firmData.processingHistory.some((x: any) => x.status == "Approved")) ||
            (firmData.status == "Incomplete" &&
              firmData.paymentDetails.length > 0 &&
              !firmData.paymentStatus)) && (
              <Form className="formsec" onSubmit={handleSubmit} encType="multipart/form-data">

                <div className="maindivContainer">
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <div className="d-flex justify-content-between align-items-center page-title mb-2">
                        <div className="pageTitleLeft">
                          <h1>Alterations in Firm</h1>
                        </div>

                        <div className="pageTitleRight">
                          {/* <div className="page-header-btns">
                      <a className="btn btn-primary new-user" onClick={() => router.back()}>
                        Go Back
                      </a>
                    </div> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="regofAppBg mb-3">
                    <Card>
                      <Card.Header>Applicant Details</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <Row>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              {!TempMemory.OTPRequested ? (
                                <Form.Group>
                                  <TableText label="Enter Aadhaar Number" required={true} />
                                  <div className="formGroup">
                                    <TableInputText
                                      disabled={TempMemory.AadharVerified}
                                      type="text"
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
                                        onClick={ReqOTP}
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
                                      onClick={ReqDetails}
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
                                disabled={true}
                                type="text"
                                placeholder="Enter Name of the Applicant"
                                required={true}
                                name={"name"}
                                value={applicantDetails.name}
                                onChange={() => { }}
                              />
                              <TableText
                                label={`Gender: ${applicantDetails.gender}  / Age: ${applicantDetails.age}`}
                                required={false}
                              />
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
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
                                  disabled={true}
                                  name={"relation"}
                                  value={applicantDetails.relation}
                                  onChange={() => { }}
                                />
                              </div>
                            </Col>

                            {/* <Col lg={3} md={3} xs={12}>
                  <TableText label="Age" required={true} />
                  <TableInputText disabled={true} type='text' placeholder='Enter Age' required={true} name={'age'} value={applicantDetails.age} onChange={()=>{}} />
                </Col> */}

                            {/* {applicantDetails.gender ? (
                  <Col lg={2} md={2} xs={12}>
                    <TableText label="Gender" required={false} />
                    <TableInputText
                      disabled={true}
                      type="text"
                      placeholder="Enter Gender"
                      required={false}
                      name={"gender"}
                      value={applicantDetails.gender}
                      onChange={()=>{}}
                    />
                  </Col>
                ) : null} */}

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
                          <h6 className="appConTitle"><u>Address Details:</u></h6>
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
                          </Row>
                          <h6 className="appConTitle"><u>Contact Details:</u></h6>
                          <Row>
                            {/* <Col lg={3} md={4} xs={12} className="mb-3">
                  <TableText label="Landline Phone No" required={true}  />
                  <TableInputText
                    disabled={false}
                    type="number"
                    placeholder="Enter Landline Phone No"
                    required={true}
                    name={"landPhoneNumber"}
                    value={contactDetails.landPhoneNumber}
                    onChange={contactDetailsChange}
                  />
                </Col> */}
                            <Col lg={3} md={4} xs={12} className="mb-3">
                              <TableText label="Mobile No" required={true} />
                              <TableInputText
                                disabled={false}
                                type="text"
                                dot={false}
                                placeholder="Enter Mobile No"
                                required={true}
                                maxLength={10}
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
                              />
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="regofAppBg mb-3 mt-7">
                    <Card>
                      <Card.Header>Firm Details</Card.Header>
                      <Card.Body>
                        <Card.Text>
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
                                onChange={() => { }}
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
                                    disabled={true}
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
                                <div className="d-flex justify-content-between firmDurationInfo disableVals">
                                  <TableInputText
                                    disabled={true}
                                    type="text"
                                    placeholder="Business Type"
                                    required={true}
                                    name={"firmDurationFrom"}
                                    value={firmDetails.firmDurationFrom}
                                    onChange={firmDetailsChange}
                                    min={moment(moment().toDate()).format("YYYY-MM-DD")}
                                  />
                                  <TableInputText
                                    disabled={true}
                                    type="text"
                                    placeholder="Business Type"
                                    required={true}
                                    name={""}
                                    value={"To"}
                                    onChange={firmDetailsChange}
                                    min={moment(firmDetails.firmDurationFrom).format("YYYY-MM-DD")}
                                  />
                                  {/* <TableText label="To" required={false}  /> */}
                                  <TableInputText
                                    disabled={true}
                                    type="text"
                                    placeholder="Business Type"
                                    required={true}
                                    name={"firmDurationTo"}
                                    value={firmDetails.firmDurationTo}
                                    onChange={firmDetailsChange}
                                  />
                                  {/* <TableSelectDate required={false} name="firmDurationFrom" value={firmDetails.firmDurationFrom} onChange={firmDetailsChange} /> */}
                                  {/* <Form.Control
                          type="date"
                          placeholder="DD/MM/YYYY"
                          name="firmDurationFrom"
                          onChange={firmDetailsChange}
                          value={firmDetails.firmDurationFrom}
                          className="durationFrom"
                        /> */}
                                  {/* <div className="middleLabel">TO</div> */}

                                  {/* <Form.Control
                          type="date"
                          placeholder="DD/MM/YYYY"
                          name="firmDurationTo"
                          onChange={firmDetailsChange}
                          value={firmDetails.firmDurationTo}
                          className="durationTo"
                        /> */}
                                </div>
                              </Form.Group>
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Industry Type" required={true} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="Industry Type"
                                required={true}
                                name={"industryType"}
                                value={firmData.industryType}
                                onChange={() => { }}
                              />
                              {/* <TableDropdown  required={true} options={["Own", "Manual", "Other"]} name={"industryType"} value={firmDetails.industryType} onChange={firmDetailsChange} /> */}
                            </Col>

                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Business Type" required={true} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="Business Type"
                                required={true}
                                name={"businessType"}
                                value={firmDetails.businessType}
                                onChange={() => { }}
                              />
                              {/* <TableDropdown required={true} options={["Own", "Manual", "Other"]} name={"businessType"} value={firmDetails.businessType} onChange={firmDetailsChange} /> */}
                            </Col>
                          </Row>
                          <h6 className="appConTitle"><u>Please Select Type of Change in Firm<span> * </span>:</u></h6>
                          <Row>
                            <Col lg={12} md={12} xs={12} className="mb-3">
                              <div className="firmChangeList">
                                <Form.Check
                                  inline
                                  label="Firm Name Change"
                                  value="Firm Name Change"
                                  name="changeFirm"
                                  type="checkbox"
                                  className="fom-checkbox"
                                  checked={changeFirm?.some((x: any) =>
                                    x == "Firm Name Change" ? true : false
                                  )}
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      setChangeFirm([...changeFirm, e.target.value])
                                    } else {
                                      let change: any = []
                                      if (changeFirm.some((x: any) => x == "Principal Address Change")) {
                                        change.push("Principal Address Change")
                                      }
                                      if (changeFirm.some((x: any) => x == "Other Address Change")) {
                                        change.push("Other Address Change")
                                      }
                                      if (
                                        changeFirm.some(
                                          (x: any) => x == "Partner Permanent Address Change"
                                        )
                                      ) {
                                        change.push("Partner Permanent Address Change")
                                      }
                                      setChangeFirm([...change])
                                    }
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="Principal Address Change"
                                  value="Principal Address Change"
                                  name="changeFirm"
                                  type="checkbox"
                                  checked={changeFirm?.some((x: any) =>
                                    x == "Principal Address Change" ? true : false
                                  )}
                                  className="fom-checkbox"
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      setChangeFirm([...changeFirm, e.target.value])
                                    } else {
                                      let change: any = []
                                      if (changeFirm.some((x: any) => x == "Firm Name Change")) {
                                        change.push("Firm Name Change")
                                      }
                                      if (changeFirm.some((x: any) => x == "Other Address Change")) {
                                        change.push("Other Address Change")
                                      }
                                      if (
                                        changeFirm.some(
                                          (x: any) => x == "Partner Permanent Address Change"
                                        )
                                      ) {
                                        change.push("Partner Permanent Address Change")
                                      }
                                      setChangeFirm([...change])
                                    }
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="Other Address Change"
                                  value="Other Address Change"
                                  name="changeFirm"
                                  type="checkbox"
                                  className="fom-checkbox"
                                  checked={changeFirm?.some((x: any) =>
                                    x == "Other Address Change" ? true : false
                                  )}
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      setChangeFirm([...changeFirm, e.target.value])
                                    } else {
                                      let change: any = []
                                      if (changeFirm.some((x: any) => x == "Principal Address Change")) {
                                        change.push("Principal Address Change")
                                      }
                                      if (changeFirm.some((x: any) => x == "Firm Name Change")) {
                                        change.push("Firm Name Change")
                                      }
                                      if (
                                        changeFirm.some(
                                          (x: any) => x == "Partner Permanent Address Change"
                                        )
                                      ) {
                                        change.push("Partner Permanent Address Change")
                                      }
                                      setChangeFirm([...change])
                                    }
                                  }}
                                />
                                <Form.Check
                                  inline
                                  label="Partner Permanent Address Change"
                                  value="Partner Permanent Address Change"
                                  name="changeFirm"
                                  type="checkbox"
                                  className="fom-checkbox"
                                  checked={changeFirm?.some((x: any) =>
                                    x == "Partner Permanent Address Change" ? true : false
                                  )}
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      setChangeFirm([...changeFirm, e.target.value])
                                    } else {
                                      let change: any = []
                                      if (changeFirm.some((x: any) => x == "Principal Address Change")) {
                                        change.push("Principal Address Change")
                                      }
                                      if (changeFirm.some((x: any) => x == "Other Address Change")) {
                                        change.push("Other Address Change")
                                      }
                                      if (changeFirm.some((x: any) => x == "Firm Name Change")) {
                                        change.push("Firm Name Change")
                                      }
                                      setChangeFirm([...change])
                                    }
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="mb-3 mt-7">
                    {changeFirm && changeFirm.some((x) => x == "Firm Name Change") && (
                      <div className="FirmSecNew regofAppBg mb-3">
                        <Card>
                          <Card.Header>Firm Name Change</Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <div className="">
                                <Row>
                                  <Col lg={3} md={3} xs={12} className="mb-3">
                                    <Form.Group>
                                      <TableText label="New Name" required={true} />
                                      <div className="formGroup">
                                        <TableInputText
                                          type="text"
                                          maxLength={50}
                                          dot={false}
                                          placeholder="Enter New Name"
                                          required={true}
                                          name={"newFirmName"}
                                          value={firmNameChangeDetails.newFirmName}
                                          onChange={firmDetailsChange}
                                        />
                                        {
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "2px",
                                            }}
                                            onClick={() =>
                                              CheckFirmName(
                                                firmNameChangeDetails.newFirmName,
                                                firmData.district
                                              )
                                            }
                                            className="verify btn btn-primary"
                                          >
                                            Check
                                          </div>
                                        }
                                      </div>
                                    </Form.Group>
                                  </Col>

                                  <Col lg={3} md={3} xs={12} className="mb-3">
                                    <Form.Group>
                                      <div className="d-flex justify-content-between">
                                        <Form.Label>
                                          New Name Effect of Date<span>*</span>
                                        </Form.Label>
                                      </div>

                                      <Form.Control
                                        type="date"
                                        placeholder="Enter Name Effect of Date"
                                        name="newNameEffectDate"
                                        required
                                        onChange={FirmNameDetailsChange}
                                        value={firmNameChangeDetails.newNameEffectDate}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </div>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    )}

                    {changeFirm && changeFirm.some((x) => x == "Principal Address Change") && (
                      <div className="regofAppBg mb-3">
                        <div className="desktopFirmTitle">
                          <Card>
                            <Card.Header>
                              <Row>
                                <Col lg={6} md={6} xs={12}>
                                  <h3>New Principal Address</h3>
                                </Col>

                                <Col lg={6} md={6} xs={12}>
                                  <h3>Old Principal Address</h3>
                                </Col>
                              </Row>
                            </Card.Header>
                            <Card.Body>
                              <Card.Text>
                                <div>
                                  <Row>
                                    <Col lg={6} md={6} xs={12}>
                                      <div className="mobileFirmTitle NewFirmSecTitle">
                                        <h3>New Principal Address</h3>
                                      </div>
                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Door No" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="text"
                                            placeholder="Door No"
                                            required={true}
                                            name={"doorNo"}
                                            value={newprincipalBusiDetails.doorNo}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Street" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="text"
                                            placeholder="Street"
                                            required={true}
                                            name={"street"}
                                            value={newprincipalBusiDetails.street}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="State" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="State"
                                            required={true}
                                            name={"state"}
                                            value={newprincipalBusiDetails.state}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="District" required={true} />
                                          <TableDropdownSRO
                                            keyName={"name"}
                                            disabled={true}
                                            required={true}
                                            options={DistrictList}
                                            name={"district"}
                                            value={newprincipalBusiDetails.district}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Mandal" required={true} />
                                          <TableDropdownSRO
                                            keyName={"mandalName"}
                                            required={true}
                                            options={MandalForPrincipleAddr}
                                            name={"mandal"}
                                            value={newprincipalBusiDetails.mandal}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Village/City" required={true} />
                                          <TableDropdownSRO
                                            keyName="villageName"
                                            required={true}
                                            options={VillageListForPrincipleAddr}
                                            name={"villageOrCity"}
                                            value={newprincipalBusiDetails.villageOrCity}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="PIN Code" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="text"
                                            maxLength={6}
                                            placeholder="PIN Code"
                                            required={true}
                                            name={"pinCode"}
                                            value={newprincipalBusiDetails.pinCode}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="New Place Effect Date" required={true} />
                                          <TableSelectDate
                                            placeholder="Select Date"
                                            required={true}
                                            name={"newPlaceEffectDate"}
                                            value={newprincipalBusiDetails.newPlaceEffectDate}
                                            onChange={newprincipalBusinessChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12}>
                                          <TableText label="Type" required={true} />
                                          <div className="firmRegList formsec">
                                            <Form.Check
                                              inline
                                              label="Own"
                                              value="Own"
                                              name="type"
                                              type="radio"
                                              className="fom-checkbox"
                                              onChange={newprincipalBusinessChange}
                                              checked={newprincipalBusiDetails.type?.toUpperCase() == "OWN"}
                                            />
                                            <Form.Check
                                              inline
                                              label="Lease"
                                              value="Lease"
                                              name="type"
                                              type="radio"
                                              className="fom-checkbox"
                                              onChange={newprincipalBusinessChange}
                                              checked={newprincipalBusiDetails.type?.toUpperCase() == "LEASE"}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                    </Col>

                                    <Col lg={6} md={6} xs={12}>
                                      <div className="mobileFirmTitle NewFirmSecTitle">
                                        <h3>Old Principal Address</h3>
                                      </div>
                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Door No" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Door No"
                                            required={false}
                                            name={"doorNo"}
                                            value={firmData?.principalPlaceBusiness[0]?.doorNo}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Street" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Street"
                                            required={true}
                                            name={"street"}
                                            value={firmData?.principalPlaceBusiness[0]?.street}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="State" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="State"
                                            required={true}
                                            name={"state"}
                                            value={firmData?.principalPlaceBusiness[0]?.state}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="District" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="District"
                                            required={true}
                                            name={"district"}
                                            value={firmData?.principalPlaceBusiness[0]?.district}
                                            onChange={() => { }}
                                          />
                                          {/* <TableDropdownSRO keyName={"name"} required={true} options={DistrictList} name={"district"} value={firmData.principalPlaceBusiness.district} onChange={()=>{}} /> */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Mandal" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Mandal"
                                            required={true}
                                            name={"mandal"}
                                            value={firmData?.principalPlaceBusiness[0]?.mandal}
                                            onChange={() => { }}
                                          />
                                          {/* <TableDropdownSRO keyName={"mandalName"} required={true} options={MandalList} name={"mandal"} value={firmData.principalPlaceBusiness.mandal} onChange={()=>{}} /> */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Village/City" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="villageOrCity"
                                            required={true}
                                            name={"villageOrCity"}
                                            value={firmData?.principalPlaceBusiness[0]?.villageOrCity}
                                            onChange={() => { }}
                                          />
                                          {/* <TableDropdownSRO keyName="villageName" required={true} options={VillageList} name={"villageOrCity"} value={firmData.principalPlaceBusiness.villageOrCity} onChange={()=>{}} /> */}
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="PIN Code" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            maxLength={6}
                                            placeholder="PIN Code"
                                            required={true}
                                            name={"pinCode"}
                                            value={firmData.principalPlaceBusiness[0]?.pinCode}
                                            onChange={() => { }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    )}

                    {changeFirm && changeFirm.some((x: any) => x == "Other Address Change") && (
                      <div className="regofAppBg mb-3">
                        <div className="FirmSecNew mb-3">
                          <Card>
                            <Card.Header>Other Place of Business</Card.Header>
                            <Card.Body>
                              <Card.Text>
                                <Row className="align-items-center mb-3 mt-2">
                                  <Col lg={3} md={3} xs={12}>
                                    <TableText label="List of Addresses" required={false} />
                                    <TableDropdownSRO
                                      disabled={SelectedOtherbusinessDetails.AddNew}
                                      keyName={["doorNo", "street"]}
                                      required={false}
                                      options={firmData?.otherPlaceBusiness}
                                      name={"_id"}
                                      onChange={(e: any) => {
                                        OnSelectOtherBusniess(e, "")
                                      }}
                                    />
                                  </Col>
                                  <div style={{ width: "15rem", height: "1em", margin: "10px" }}>
                                    {!SelectedOtherbusinessDetails.AddNew ? (
                                      <div
                                        className="btn btn-primary "
                                        onClick={() => {
                                          OnSelectOtherBusniess("", "new")
                                        }}
                                      >
                                        Add New
                                      </div>
                                    ) : (
                                      <div
                                        className="btn btn-primary "
                                        onClick={() => {
                                          OnSelectOtherBusniess("", "clear")
                                        }}
                                      >
                                        Clear
                                      </div>
                                    )}
                                  </div>
                                </Row>

                                <div className="mb-3">
                                  <Row>
                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <TableText label="Door No" required={true} />
                                      <TableInputText
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
                                        onChange={() => { }}
                                      />
                                    </Col>
                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <TableText label="District" required={true} />
                                      <TableDropdownSRO
                                        keyName={"name"}
                                        disabled={true}
                                        required={false}
                                        options={DistrictList}
                                        name={"district"}
                                        value={SelectedOtherbusinessDetails.district}
                                        onChange={() => { }}
                                      />
                                    </Col>
                                    <Col lg={3} md={3} xs={12} className="mb-3">
                                      <TableText label="Mandal" required={true} />
                                      <TableDropdownSRO
                                        disabled={SelectedOtherbusinessDetails.disabled}
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
                                        disabled={SelectedOtherbusinessDetails.disabled}
                                        keyName="villageName"
                                        required={false}
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
                                        required={false}
                                        name={"pinCode"}
                                        value={SelectedOtherbusinessDetails.pinCode}
                                        onChange={otherDetailsChange}
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <div
                              className="btn btn-primary mt-3"
                              style={{ justifySelf: "end" }}
                              onClick={() => {
                                SaveOtherBusniessDetails()
                              }}
                            >
                              Save
                            </div>
                          </div>
                          {firmData?.otherPlaceBusiness && firmData?.otherPlaceBusiness?.length > 0 ? (
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
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {firmData?.otherPlaceBusiness?.map((item: any, i: number) => {
                                        return (
                                          <tr key={i + 1}>
                                            <td className="siNo text-center">{i + 1}</td>
                                            <td>{item.doorNo}</td>
                                            <td>{item.street}</td>
                                            <td>{item.villageOrCity}</td>
                                            <td>{item.mandal}</td>
                                            <td>{item.district}</td>
                                            <td>{item.state}</td>
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
                    )}

                    {changeFirm.some((x: any) => x == "Partner Permanent Address Change") && (
                      <div className="regofAppBg">
                        <div className="FirmSecNew mb-3">
                          <div className="mb-3">
                            <Card>
                              <Card.Header>Partner Permanent Address</Card.Header>
                              <Card.Body>
                                <Card.Text>
                                  <Row className="mb-3">
                                    <Col lg={3} md={3} xs={12}>
                                      <TableText label="List of Partners" required={false} />
                                      <TableDropdownSRO
                                        disabled={SelectedFirmPartner.AddNew}
                                        keyName={"partnerName"}
                                        required={false}
                                        options={firmData?.firmPartners}
                                        name={"_id"}
                                        onChange={OnSelectFirmPartners}
                                      />
                                    </Col>
                                  </Row>

                                  <div className="mb-3">
                                    <Row>
                                      <Col lg={6} md={4} xs={12} className="mb-3">
                                        <TableText label="Address" required={true} />
                                        <textarea
                                          className="form-control textarea"
                                          placeholder="Enter Address"
                                          required={false}
                                          disabled={false}
                                          name={"address"}
                                          value={SelectedFirmPartner.address}
                                          onChange={(e: any) => partnerDetailsChange(e, 0)}
                                          maxLength={10000}
                                        ></textarea>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                    <div
                                      className="btn btn-primary "
                                      style={{ justifySelf: "end" }}
                                      onClick={() => {
                                        SaveFirmPartnerDetails()
                                      }}
                                    >
                                      Save
                                    </div>
                                  </div>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>

                          {true && (
                            <div className="addedPartnerSec mt-3">
                              <Row className="mb-4">
                                <Col lg={12} md={12} xs={12}>
                                  <Table striped bordered className="tableData listData">
                                    <thead>
                                      <tr>
                                        <th className="siNo text-center">S.No</th>
                                        <th>Partner Name</th>
                                        <th>Address</th>
                                        <th>District</th>
                                        <th>State</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {firmData?.firmPartners?.map((item: any, i: number) => {
                                        return (
                                          <tr key={i + 1}>
                                            <td className="siNo text-center">{i + 1}</td>
                                            <td>{item.partnerName}</td>
                                            <td>{item.address}</td>
                                            <td>{item.district}</td>
                                            <td>{item.state}</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </Table>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="mb-3 pb-3">
                    <div className="regofAppBg">
                      <Card>
                        <Card.Header>Upload Firm Related Documents-(All Uploaded Documents should be in PDF
                          format only upto 3MB )</Card.Header>
                        <Card.Body>
                          <Card.Text>
                            <div className="firmFileStep1">
                              <Row>
                                {/* <Col lg={2} md={4} xs={12}>
                    <div className="firmFile">
                      <Form.Group controlId="formFile">
                        <TableText label="Application Form" required={true} />
                        <Form.Control
                          type="file"
                          name="applicationForm"
                          ref={inputRef}
                          onChange={handleFileChange}
                          accept="application/pdf"
                        />
                      </Form.Group>
                    </div>
                  </Col> */}
                                <Col lg={3} md={4} xs={12}>
                                  <div className="firmFile mt-2">
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

                                {((newprincipalBusiDetails.type == "" &&
                                  firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "LEASE") ||
                                  newprincipalBusiDetails.type?.toUpperCase() == "LEASE") && (
                                    <Col lg={3} md={4} xs={12}>
                                      <div className="firmFile mt-2">
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

                                {((newprincipalBusiDetails.type == "" &&
                                  firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "OWN") ||
                                  newprincipalBusiDetails.type?.toUpperCase() == "OWN") && (
                                    <Col lg={3} md={4} xs={12}>
                                      <div className="firmFile mt-2">
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
                                        <a href="/firmsHome/assets/downloads/Form-II.pdf" target="_blank">
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

                                <Col lg={3} md={4} xs={12}>
                                  <div className="firmFile mt-2">
                                    <Form.Group controlId="formFile">
                                      <TableText label="others" required={false} />
                                      <Form.Control
                                        type="file"
                                        id="others"
                                        name="others"
                                        ref={inputRef}
                                        onChange={handleFileChange}
                                        accept="application/pdf"
                                      />
                                    </Form.Group>
                                  </div>
                                </Col>

                              </Row>
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>

                  <div className="firmSubmitSec mb-2">
                    <Row>
                      <Col lg={12} md={12} xs={12} className="mt-3 mb-3">
                        <div className="d-flex justify-content-center text-center">
                          <button
                            className="btn btn-primary showPayment"
                            onClick={() => setIsPayNowClicked(true)}
                          >
                            Show Payment
                          </button>
                          <button className="btn btn-primary submit" name="btn1" value="Show Payment">
                            Preview
                          </button>
                          {/* <button className="btn btn-primary saveDraft">Save as Draft</button> */}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            )}


          {firmData.status != "Incomplete" && firmData.status != "Approved" && (
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={() => { redirectToPage("/firms/dashboard") }}
              backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Application Status Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
              </Modal.Body>
            </Modal>
          )}
          {firmData.status == "Incomplete" && (
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={() => { redirectToPage("/firms/dashboard") }}
              backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title>Application Status Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className="d-flex justify-content-between pagesubmitSecTitle mb-3">
                    <div className="ms-2">
                      <h2>
                        Your application is incomplete.{" "}
                        <a href="/firmsHome/firms" style={{ color: "blue" }}>
                          click here
                        </a>{" "}
                        to check application status
                      </h2>
                    </div>
                  </div>
              </Modal.Body>
            </Modal>
          )}
        </div>
      )}

     
      {!isPreview && (!locData?.userType || locData?.userType != "user") && (
        <div>
          <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={unAuthshow} onHide={() => { redirectToPage("/firms/dashboard") }} s
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>  
              <Modal.Title>Application Status Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex justify-content-between page-title mb-2">
                <div className="pageTitleLeft">
                  <h1>Unauthorized page</h1>
                </div>
              </div>
              {isPreview && (
                <PreviewFirm
                  appId={locData.applicationId}
                  formType={"form-2"}
                  setIsPreview={setIsPreview}
                />
              )}
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  )
}

export default Form2
