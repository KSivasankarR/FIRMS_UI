import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { Container, Col, Row, Form, Table, Card, Modal } from "react-bootstrap"
import styles from "@/styles/pages/Forms.module.scss"
import { CallingAxios, DateFormator, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import TableText from "@/components/common/TableText"
import TableInputText from "@/components/common/TableInputText"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import TableDropdownSRO from "@/components/common/TableDropdownSRO"
import moment from "moment"
import PreviewFirm from "./previewFirm"
import {
  UseGetAadharDetails,
  UseGetAadharOTP,
  UseGetDistrictList,
  UseGetFirmDetailsById,
  UseGetMandalList,
  UseGetVillagelList,
} from "@/axios"
import Image from "next/image"
import { AadharOTPAction } from "@/redux/commonSlice"
import CryptoJS, { AES } from "crypto-js"
import {
  IApplicantDetailsForm1Model,
  IBusinessDetailsModel,
  IContactDetailsModel,
  IExistingPartnerDetailsModel,
  IFirmDetailsModel,
  IFirmInDetailsModel,
  IOtherBusinessForm1DetailsModel,
  ISelectedPartnerDetailsModel,
} from "@/models/firmsTypes"

const Form3 = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

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
    address: ""
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
  const [partnerDetails, setPartnerDetails] = useState<any>([])
  const [deletePartnerDetails, setDeletePartnerDetails] = useState<any>([])
  const ref = useRef<any>(null)
  const refUpdate = useRef<any>(null)
  const refDelete = useRef<any>(null)
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
  const [enableNewShare, setEnableNewShare] = useState<boolean>(false)
  const [enableRelpaceNewShare, setEnableRelpaceNewShare] = useState<boolean>(false)
  const [enableDeleteNewShare, setEnableDeleteNewShare] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [TempMemory, setTempMemory] = useState<any>({ OTPRequested: false, AadharVerified: false })
  const [TempMemoryPartner, setTempMemoryPartner] = useState<any>({
    OTPRequested: false,
    AadharVerified: false,
  })
  const [TempMemoryPartnerReplace, setTempMemoryPartnerReplace] = useState<any>({
    OTPRequested: false,
    AadharVerified: false,
  })
  const [TempMemoryExistingPartnerReplace, setTempMemoryExistingPartnerReplace] = useState<any>({
    OTPRequested: false,
    AadharVerified: false,
  })
  const [DistrictList, setDistrictList] = useState<any>([])
  const [MandalForApplicant, setMandalForApplicant] = useState<any>([])
  const [MandalForPrincipleAddr, setMandalForPrincipleAddr] = useState<any>([])
  const [MandalForOtherAddr, setMandalForOtherAddr] = useState<any>([])
  const [MandalForPartnerDetails, setMandalForPartnerDetails] = useState<any>([])
  const [MandalForPartnerReplaceDetails, setMandalForPartnerReplaceDetails] = useState<any>([])
  const [VillageListForApplicant, setVillageListForApplicant] = useState<any>([])
  const [VillageListForPrincipleAddr, setVillageListForPrincipleAddr] = useState<any>([])
  const [VillageListForOtherAddr, setVillageListForOtherAddr] = useState<any>([])
  const [VillageListForPartnerDetails, setVillageListForPartnerDetails] = useState<any>([])
  const [VillageListForPartnerReplaceDetails, setVillageListForPartnerReplaceDetails] =
    useState<any>([])
  const [LoginDetails, setLoginDetails] = useState<any>({})
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
      newShare: "",
      joiningDate: "",
      address: ""
    })
  const [SelectedPartnerReplaceDetails, setSelectedPartnerReplaceDetails] =
    useState<ISelectedPartnerDetailsModel>({
      _id: "",
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
      newShare: "",
      joiningDate: "",
      address: ""
    })
  const [ExistingPartnerReplaceDetails, setExistingPartnerReplaceDetails] =
    useState<IExistingPartnerDetailsModel>({
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
      address: ""
    })
  const [isPayNowClicked, setIsPayNowClicked] = useState<boolean>(false)
  const [isPartnerDeleted, setIsPartnerDeleted] = useState<boolean>(false)
  const [isNewPartnerAdded, setIsNewPartnerAdded] = useState<boolean>(false)
  const [isPartnerReplaced, setIsPartnerReplaced] = useState<boolean>(false)
  const [firmDissolved, setFirmDissolved] = useState<boolean>(false)
  const [locData, setLocData] = useState<any>({})
  const [isPreview, setIsPreview] = useState<boolean>(false)
  let AadharOption: any = useAppSelector((state) => state.common.AadharOTPMemory)
  const [firmPartnerData, setFirmPartnerData] = useState<any>([])
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
  const [ShouldDeleteFirm, setShouldDeleteFirm] = useState<boolean>(false)
  const [ShowAddPartner, setShowAddPartner] = useState<boolean>(false)
  const [ShowReplacePartner, setShowReplacePartner] = useState<boolean>(false)
  const [ShowDeletePartner, setShowDeletePartner] = useState<boolean>(false)
  const [NumberOfChanges, setNumberOfChanges] = useState<number>(0);

  const [show, setShow] = useState(false);
  const [unAuthshow, setUnAuthshow] = useState(false)

  const handleClose = () => setShow(false);
  const authhandleClose = () => setUnAuthshow(false);

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
    if (ShouldDeleteFirm) {
      let firmPartner: any = [...firmPartnerData]
      if (firmPartner && firmPartner?.length > 0) {
        firmPartner.forEach((f: any) => {
          f.newShare = f.share
        })
      }
      setPartnerDetails([...firmPartner])
      setDeletePartnerDetails([...firmPartner])
      setNumberOfChanges(1)
      setIsNewPartnerAdded(false)
      setIsPartnerDeleted(false)
      setIsPartnerReplaced(false)
    }
  }, [ShouldDeleteFirm])

  useEffect(() => {
    if (AadharOption.response && AadharOption.enable == false) {
      if (AadharOption.data && AadharOption.data.KYCResponse) {
        setNumberOfChanges(NumberOfChanges + 1)
        setIsPartnerDeleted(true)
        let data: any = [...partnerDetails]
        data.splice(AadharOption.passParams.index, 1)
        if (data && data?.length > 0) {
          data.forEach((d: any) => {
            d.newShare = d.share
          })
        }
        setPartnerDetails(data)
        ShowMessagePopup(true, "Partner deleted successfully", "")
        setTimeout(() => {
          let share: any = 0
          if (data && data?.length > 0) {
            data.forEach((x: any) => {
              if (x.share) {
                share = share + parseInt(x.share)
              }
            })
          }
          if (share != 100) {
            setEnableDeleteNewShare(true)
            ShowMessagePopup(
              false,
              "Please update new share value as it is not matching to 100%",
              ""
            )
            refDelete.current?.scrollIntoView({ behavior: "smooth" })
          } else {
            setEnableDeleteNewShare(false)
          }
        }, 2500)
      } else {
        ShowMessagePopup(false, "Unable to verify OTP", "")
      }
      dispatch(
        AadharOTPAction({
          enable: false,
          aadharNumber: "",
          response: false,
          status: false,
          data: {},
          op: "",
        })
      )
    }
  }, [AadharOption])

  const GetFirmDetails = async (data: any) => {
    let result = await UseGetFirmDetailsById(data.applicationId, data.token)
    if (result.success) {
      let otherAddressList = ["Add New"]
      let firmsValue = result.data.firm
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
      let firmPartner = [...firmsValue.firmPartners]
      if (firmPartner?.length > 0) {
        firmPartner.forEach((f: any) => {
          f.newShare = f.share
        })
      }
      setPartnerDetails([...firmPartner])
      setFirmPartnerData([...firmPartner])
      setDeletePartnerDetails([...firmPartner])
      setOtherBusinessDetails(firmsValue.otherPlaceBusiness)
      firmsValue?.principalPlaceBusiness &&
        firmsValue?.principalPlaceBusiness?.length &&
        setPrincipalBusiDetails(firmsValue?.principalPlaceBusiness[0])
      if (
        firmsValue?.principalPlaceBusiness &&
        firmsValue?.principalPlaceBusiness?.length > 0 &&
        firmsValue?.principalPlaceBusiness[0]?.district != ""
      ) {
        GetMandalList(firmsValue.principalPlaceBusiness[0].district, "principalAddr")
      }
      if (
        firmsValue?.principalPlaceBusiness &&
        firmsValue?.principalPlaceBusiness?.length > 0 &&
        firmsValue?.principalPlaceBusiness[0]?.mandal != ""
      ) {
        GetVillageList(
          firmsValue.principalPlaceBusiness[0].mandal,
          firmsValue.principalPlaceBusiness[0].district,
          "principalAddr"
        )
      }
    }
  }

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
        case "Partner2":
          setMandalForPartnerReplaceDetails(result.data)
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
        case "Partner2":
          setVillageListForPartnerReplaceDetails(result.data)
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
    if (MyKey && MyKey.aadharNumber && MyKey.aadharNumber.toString().length == 12) {
      CallGetOTP(MyKey)
    } else {
      ShowMessagePopup(false, "Kindly enter valid Aadhar number", "")
    }
  }

  const ReqDeleteOTP = (MyKey: any, i: any) => {
    if (MyKey && MyKey.aadharNumber.toString().length == 12) {
      CallGetDeleteFirmOTP(MyKey, i)
    } else {
      ShowMessagePopup(false, "Kindly enter valid Aadhar number", "")
    }
  }
  const ReqDetailsDelete = async (MyKey: any, i: any) => {
    let result: any = await CallingAxios(
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
      const data: any = [...deletePartnerDetails]
      const dat: any = { ...data[i], OTPRequested: false, AadharVerified: true }
      data.splice(i, 1, dat)
      setDeletePartnerDetails([...data])
      ShowMessagePopup(true, "Aadhaar details are verified", "")
    } else {
      ShowMessagePopup(false, "Please Enter Valid OTP", "")
    }
  }
  const ReqDetails = async (MyKey: any) => {
    let result: any = await CallingAxios(
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
        case SelectedPartnerReplaceDetails:
          setSelectedPartnerReplaceDetails(latestData)
          setTempMemoryPartnerReplace({ OTPRequested: false, AadharVerified: true })
          break
        case ExistingPartnerReplaceDetails:
          setExistingPartnerReplaceDetails(latestData)
          setTempMemoryExistingPartnerReplace({ OTPRequested: false, AadharVerified: true })
          break

        default:
          break
      }
    } else {
      ShowMessagePopup(false, "Please Enter Valid OTP", "")
    }
  }

  const CallGetDeleteFirmOTP = async (MyKey: any, i: any) => {
    if (process.env.IGRS_SECRET_KEY) {
      const ciphertext = AES.encrypt(MyKey.aadharNumber.toString(), process.env.IGRS_SECRET_KEY)
      let result: any = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
      if (result && result.status != "Failure") {
        const data = [...deletePartnerDetails]
        const dat = {
          ...data[i],
          OTPRequested: true,
          AadharVerified: false,
          otp: "",
          OTPResponse: result,
        }
        data.splice(i, 1, dat)
        setDeletePartnerDetails([...data])
        ShowMessagePopup(
          true,
          "The OTP has been sent to your Aadhaar registered mobile number successfully.",
          ""
        )
      } else {
        ShowMessagePopup(false, "Exceeded Maximum OTP generation Limit", "")
      }
    }
  }

  const CallGetOTP = async (MyKey: any) => {
    if (process.env.IGRS_SECRET_KEY) {
      const ciphertext = AES.encrypt(MyKey.aadharNumber.toString(), process.env.IGRS_SECRET_KEY)
      let result: any = await CallingAxios(UseGetAadharOTP(ciphertext.toString()))
      if (result && result.status != "Failure") {
        switch (MyKey) {
          case applicantDetails:
            setTempMemory({ OTPRequested: true, AadharVerified: false })
            break
          case SelectedPartnerDetails:
            setTempMemoryPartner({ OTPRequested: true, AadharVerified: false })
            break
          case SelectedPartnerReplaceDetails:
            setTempMemoryPartnerReplace({ OTPRequested: true, AadharVerified: false })
            break
          case ExistingPartnerReplaceDetails:
            setTempMemoryExistingPartnerReplace({ OTPRequested: true, AadharVerified: false })
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
          case SelectedPartnerReplaceDetails:
            setSelectedPartnerReplaceDetails({ ...MyKey, OTPResponse: result })
            break
          case ExistingPartnerReplaceDetails:
            setExistingPartnerReplaceDetails({ ...MyKey, otp: "", OTPResponse: result })
            break
          default:
            break
        }
        ShowMessagePopup(
          true,
          "The OTP has been sent to your Aadhaar registered mobile number successfully.",
          ""
        )
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

          case SelectedPartnerReplaceDetails:
            setSelectedPartnerReplaceDetails({
              ...MyKey,
              otp: "",
              OTPResponse: { transactionNumber: "" },
              KYCResponse: {},
            })
            setTempMemoryPartnerReplace({ OTPRequested: false, AadharVerified: false })
            break
          case ExistingPartnerReplaceDetails:
            setExistingPartnerReplaceDetails({
              ...MyKey,
              otp: "",
              OTPResponse: { transactionNumber: "" },
              KYCResponse: {},
            })
            setTempMemoryExistingPartnerReplace({ OTPRequested: false, AadharVerified: false })
            break
          default:
            break
        }
        ShowMessagePopup(false, "Please Enter Valid Aadhar", "")
      }
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
    setFirmDetails({ ...TempDetails, [AddName]: AddValue })
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

  const DeletePartnerDetails = (event: any, i: any) => {
    const data: any = [...deletePartnerDetails]
    const dat: any = {
      ...data[i],
      OTPRequested: true,
      AadharVerified: false,
      otp: event.target.value,
    }
    data.splice(i, 1, dat)
    setDeletePartnerDetails([...data])
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
        e.target.value &&
        e.target.value.length > 0 &&
        e.target.value.length > SelectedPartnerDetails.aadharNumber.length
      ) {
        newNo = e.target.value[e.target.value.length - 1]
      } else if (e.target.value.length == 0) {
        newNo = "del"
      }
      if (e.target.value && e.target.value.length > 0) {
        for (let i = 0; i <= e.target.value.length - 1; i++) {
          if (i < 8) {
            newVal = newVal + "X"
          } else {
            newVal = newVal + e.target.value[i]
          }
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

  const NumberCheck = (e: any) => {
    const regex = /[0-9]|,/
    if (!regex.test(e.key) && e.key != "Backspace") {
      e.preventDefault()
    }
  }

  const partnerShareUpdate = (i: any, event: any) => {
    let temp: any = [...partnerDetails]
    let tempDetails = { ...temp[i] }
    let AddValue = event.target.value
    tempDetails.newShare = event.target.value
    temp.splice(i, 1, tempDetails)
    setPartnerDetails([...temp])
  }
  const partnerReplaceDetailsChange = (e: any) => {
    let tempDetails = { ...SelectedPartnerReplaceDetails }
    let AddName = e.target.name
    let AddValue = e.target.value
    if (AddName == "district") {
      setMandalForPartnerReplaceDetails([])
      setVillageListForPartnerReplaceDetails([])
      GetMandalList(AddValue, "Partner2")
    }
    if (AddName == "mandal") {
      setVillageListForPartnerDetails([])
      GetVillageList(AddValue, tempDetails.district, "Partner2")
    }
    if (AddName == "maskedAadhar") {
      let newNo = ""
      let newVal = ""
      let aadharNo = ""
      if (
        e.target.value.length > 0 &&
        e.target.value.length > SelectedPartnerReplaceDetails.aadharNumber.length
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
          SelectedPartnerReplaceDetails.aadharNumber.substring(0, startpos) +
          SelectedPartnerReplaceDetails.aadharNumber.substring(
            startpos + 1,
            SelectedPartnerReplaceDetails.aadharNumber.length
          )
      }
      setSelectedPartnerReplaceDetails({
        ...tempDetails,
        [AddName]: newVal,
        aadharNumber:
          newNo == "del"
            ? ""
            : newNo != ""
            ? SelectedPartnerReplaceDetails.aadharNumber + newNo
            : aadharNo,
      })
    } else {
      setSelectedPartnerReplaceDetails({ ...tempDetails, [AddName]: AddValue })
    }
  }

  const partnerExistingReplaceDetailsChange = (event: any) => {
    let tempDetails = { ...ExistingPartnerReplaceDetails }
    let AddName = event.target.name
    let AddValue = event.target.value

    setExistingPartnerReplaceDetails({ ...tempDetails, [AddName]: AddValue })
  }

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  const addPartnerFields = () => {
    let object: any = { ...SelectedPartnerDetails, newShare: SelectedPartnerDetails.share }
    const validRelationTypes = ["S/O", "W/O", "D/O"];
    if (!validRelationTypes.includes(object.relationType)) {
      return ShowMessagePopup( false, "Please select Relation Type (S/O, W/O, D/O).","");
    }
    if (
      object.aadharNumber == "" ||
      object.relationType == "" ||
      object.gender == "" ||
      object.age == "" ||
      object.role == "" ||
      // object.doorNo == "" ||
      // object.street == "" ||
      // object.district == "" ||
      // object.mandal == "" ||
      // object.villageOrCity == "" ||
      // object.pinCode == "" ||
      object.relation == "" ||
      object.mobileNumber == "" ||
      // object.email == "" ||
      object.share == "" ||
      object.joiningDate == "" ||
      object.address == ""
    ) {
      return ShowMessagePopup(false, "Kindly fill all inputs for Add New Partner.", "")
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
    } else if (
      partnerDetails?.length > 0 &&
      partnerDetails.some((x: any) => x.aadharNumber.toString() == object.aadharNumber.toString())
    ) {
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
        newShare: "",
        joiningDate: "",
        address: ""
      })
      return ShowMessagePopup(
        false,
        "Aadhaar number is already exist. Please enter new aadhaar number",
        ""
      )
    } else if (object.age && parseInt(object.age) < 18) {
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
        newShare: "",
        joiningDate: "",
        address: ""
      })
      return ShowMessagePopup(false, "Minimum age of partner should be 18", "")
    } else if (
      partnerDetails &&
      partnerDetails?.length > 0 &&
      partnerDetails.some((x: any) => parseInt(x.mobileNumber) == parseInt(object.mobileNumber))
    ) {
      return ShowMessagePopup(
        false,
        "Mobile number is already exist. Please enter new mobile number",
        ""
      )
    } else if (
      partnerDetails &&
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
    setNumberOfChanges(NumberOfChanges + 1)
    setIsNewPartnerAdded(true)
    let Details: any = [...partnerDetails]
    Details.push(object)
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
      newShare: "",
      joiningDate: "",
      address: ""
    })
    ShowMessagePopup(true, "New Partner Added Successfully", "")
    setTimeout(() => {
      let share: any = 0
      if (Details?.length > 0) {
        Details.forEach((x: any) => {
          if (x.share) {
            share = share + parseInt(x.share)
          }
        })
      }
      if (share != 100) {
        setEnableNewShare(true)
        ShowMessagePopup(false, "Please update new share value as it is not matching to 100%", "")
        ref.current?.scrollIntoView({ behavior: "smooth" })
      } else {
        setEnableNewShare(false)
      }
    }, 2500)
  }

  const ReplacePartnerFields = () => {
    let object: any = {
      ...SelectedPartnerReplaceDetails,
      newShare: SelectedPartnerReplaceDetails.share,
    }
    const validRelationTypes = ["S/O", "W/O", "D/O"];
    if (!validRelationTypes.includes(object.relationType)) {
      return ShowMessagePopup( false, "Please select Relation Type (S/O, W/O, D/O).","");
    }
    if (
      object.aadharNumber == "" ||
      object.relationType == "" ||
      object.gender == "" ||
      object.age == "" ||
      object.role == "" ||
      // object.doorNo == "" ||
      // object.street == "" ||
      // object.district == "" ||
      // object.mandal == "" ||
      // object.villageOrCity == "" ||
      // object.pinCode == "" ||
      object.relation == "" ||
      object.mobileNumber == "" ||
      // object.email == "" ||
      object.share == "" ||
      object.joiningDate == "" ||
      object.address == ""
    ) {
      return ShowMessagePopup(false, "Kindly fill all inputs to Proceed", "")
    } else if (
      object.mobileNumber &&
      (object.mobileNumber.length != 10 ||
        (object.mobileNumber.length == 10 &&
          object.mobileNumber.charAt(0) != "6" &&
          object.mobileNumber.charAt(0) != "7" &&
          object.mobileNumber.charAt(0) != "8" &&
          object.mobileNumber.charAt(0) != "9"))
    ) {
      return ShowMessagePopup(false, "Please enter vaild mobile number", "")
    } else if (object.pinCode != "" && object.pinCode.length != 6) {
      return ShowMessagePopup(false, "Please enter valid pincode for partner", "")
    } else if (
      partnerDetails &&
      partnerDetails?.length > 0 &&
      partnerDetails.some((x: any) => x.aadharNumber.toString() == object.aadharNumber.toString())
    ) {
      setTempMemoryPartnerReplace({ OTPRequested: false, AadharVerified: false })
      setSelectedPartnerReplaceDetails({
        _id: SelectedPartnerReplaceDetails._id,
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
        newShare: "",
        joiningDate: "",
        address: ""
      })
      return ShowMessagePopup(
        false,
        "Aadhaar number is already exist. Please enter new aadhaar number",
        ""
      )
    } else if (object.age && parseInt(object.age) < 18) {
      setTempMemoryPartnerReplace({ OTPRequested: false, AadharVerified: false })
      setSelectedPartnerReplaceDetails({
        _id: SelectedPartnerReplaceDetails._id,
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
        newShare: "",
        joiningDate: "",
        address: ""
      })
      return ShowMessagePopup(false, "Minimum age of partner should be 18", "")
    } else if (
      partnerDetails &&
      partnerDetails?.length > 0 &&
      partnerDetails.some((x: any) => parseInt(x.mobileNumber) == parseInt(object.mobileNumber))
    ) {
      return ShowMessagePopup(
        false,
        "Mobile number is already exist. Please enter new mobile number",
        ""
      )
    } else if (
      partnerDetails &&
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
    setNumberOfChanges(NumberOfChanges + 1)
    setIsPartnerReplaced(true)
    let Details: any = [...partnerDetails]
    const index = Details.findIndex((obj: any) => {
      return obj._id === object._id
    })
    Details.splice(index, 1, object)
    setPartnerDetails(Details)
    setTempMemoryPartnerReplace({ OTPRequested: false, AadharVerified: false })
    setSelectedPartnerReplaceDetails({
      _id: "",
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
      newShare: "",
      joiningDate: "",
      address: ""
    })
    ShowMessagePopup(true, "Partner Replaced Successfully", "")
    setTimeout(() => {
      let share: any = 0
      if (Details?.length > 0) {
        Details.forEach((x: any) => {
          if (x.share) {
            share = share + parseInt(x.share)
          }
        })
      }
      if (share != 100) {
        setEnableRelpaceNewShare(true)
        ShowMessagePopup(false, "Please update new share value as it is not matching to 100%", "")
        refUpdate.current?.scrollIntoView({ behavior: "smooth" })
      } else {
        setEnableRelpaceNewShare(false)
      }
    }, 2500)
  }

  const removeSelectedPartner = (index: any, aadharNumber: any) => {
    if (aadharNumber && String(aadharNumber).length == 12) {
      dispatch(
        AadharOTPAction({
          enable: true,
          status: false,
          response: false,
          data: {},
          passParams: { index: index },
          aadharNumber: aadharNumber.toString(),
        })
      )
    } else {
      ShowMessagePopup(false, "Partner with invalid Aadhar Number Can not be Deleted", "")
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

  const checkShareLogic = (isReplace: any, isDelete?: any) => {
    let share: any = 0
    partnerDetails.forEach((e: any) => {
      if (e.newShare) {
        share = share + parseInt(e.newShare)
      }
    })
    if (share != 100) {
      if (isReplace) {
        setEnableRelpaceNewShare(true)
      } else if (isDelete) {
        setEnableDeleteNewShare(true)
      } else {
        setEnableNewShare(true)
      }
      ShowMessagePopup(false, "Please update new share value as it is not matching to 100%", "")
    } else {
      if (isReplace) {
        setEnableRelpaceNewShare(false)
      } else if (isDelete) {
        setEnableDeleteNewShare(false)
      } else {
        setEnableNewShare(false)
      }
    }
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
    e.preventDefault()
    if (partnerDetails && partnerDetails?.length > 0) {
      let share = 0
      partnerDetails.forEach((element: any) => {
        share =
          element.newShare != ""
            ? share + parseInt(element.newShare)
            : element.newShare != ""
            ? share + parseInt(element.share)
            : share
      })
      if (Math.round(share) != 100) {
        ShowMessagePopup(false, "Please enter proper share for partner it should be 100 percent")
        return
      }
    }

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
    if ((partnerDetails && !partnerDetails?.length) || partnerDetails?.length < 1) {
      return ShowMessagePopup(false, "Please add minimum two partners", "")
    }

    if (ShouldDeleteFirm) {
      let showerr: any = false
      deletePartnerDetails.forEach((element: any) => {
        if (!element.AadharVerified) {
          showerr = true
        }
      })
      if (showerr) {
        return ShowMessagePopup(
          false,
          "Please verify all partner aadhaar otp's to disolve firm",
          ""
        )
      }
      if (!window.confirm("Are you sure, you wish to disolve the firm?")) {
        return
      }
    }
    const newData = new FormData()

    newData.append("applicantDetails[aadharNumber]", applicantDetails?.aadharNumber)
    newData.append("applicantDetails[name]", applicantDetails?.name?.toUpperCase())
    newData.append("applicantDetails[surName]", applicantDetails?.surName)
    newData.append("applicantDetails[gender]", applicantDetails?.gender?.toUpperCase())
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
    newData.append("applicantDetails[pinCode]", applicantDetails?.address)
    newData.append("contactDetails[landPhoneNumber]", contactDetails?.landPhoneNumber)
    newData.append("contactDetails[mobileNumber]", contactDetails?.mobileNumber)
    newData.append("contactDetails[email]", contactDetails?.email)

    // newData.append("firmDurationFrom", firmDetails?.firmDurationFrom)
    // newData.append("firmDurationTo", firmDetails?.firmDurationTo)
    // newData.append("industryType", firmDetails?.industryType)
    // newData.append("bussinessType", firmDetails?.bussinessType)
    newData.append("applicationNumber", LoginDetails.applicationNumber)
    newData.append("id", LoginDetails.applicationId)
    newData.append("formType", "form-1")
    newData.append("isPartnerReplaced", isPartnerReplaced ? "true" : "false")
    newData.append("isNewPartnerAdded", isNewPartnerAdded ? "true" : "false")
    newData.append("isPartnerDeleted", isPartnerDeleted ? "true" : "false")

    if (ShouldDeleteFirm) {
      newData.append("firmDissolved", "true")
    } else {
      newData.append("firmDissolved", "false")
      if (principalBusiDetails.type?.toUpperCase() == "LEASE") {
        newData.append("leaseAgreement", file?.leaseAgreement)
      }
      if (principalBusiDetails.type?.toUpperCase() == "OWN") {
        newData.append("affidavit", file.affidavit)
      }
      newData.append("partnershipDeed", file.partnershipDeed)
      newData.append("selfSignedDeclaration", file.selfSignedDeclaration)

      newData.append("principalPlaceBusiness[doorNo]", principalBusiDetails.doorNo?.toUpperCase())
      newData.append("principalPlaceBusiness[street]", principalBusiDetails.street?.toUpperCase())
      newData.append("principalPlaceBusiness[state]", "ANDHRA PRADESH")
      newData.append(
        "principalPlaceBusiness[district]",
        principalBusiDetails.district?.toUpperCase()
      )
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
        newData.append(
          "partnerDetails[" + j + "][share]",
          partnerDetails[j].newShare != "" ? partnerDetails[j].newShare : partnerDetails[j].share
        )
        newData.append("partnerDetails[" + j + "][joiningDate]", partnerDetails[j].joiningDate)
        newData.append("partnerDetails[" + j + "][joiningDate]", partnerDetails[j].address)
        newData.append(
          "partnerDetails[" + j + "][landPhoneNumber]",
          partnerDetails[j].landPhoneNumber
        )
        newData.append("partnerDetails[" + j + "][mobileNumber]", partnerDetails[j].mobileNumber)
        newData.append("partnerDetails[" + j + "][email]", partnerDetails[j].email)
        newData.append("partnerDetails[" + j + "][state]", "ANDHRA PRADESH")
        newData.append("partnerDetails[" + j + "][country]", "INDIA")
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

    //let Result = await CallingAxios(UseSaveFirmDetails(newData, LoginDetails.token))
    let object: any = {}
    newData.forEach((value, key) => (object[key] = value))
    if (principalBusiDetails.type?.toUpperCase() == "LEASE") {
      object.leaseAgreement = await file2Base64(file?.leaseAgreement)
    }

    if (principalBusiDetails.type?.toUpperCase() == "OWN") {
      object.affidavit = await file2Base64(file?.affidavit)
    }
    object.partnershipDeed = await file2Base64(file?.partnershipDeed)
    object.selfSignedDeclaration = await file2Base64(file?.selfSignedDeclaration)
    localStorage.setItem("AmendmentData", JSON.stringify(object))
    localStorage.setItem("PartnerDetails", JSON.stringify(partnerDetails))
    localStorage.setItem("PrincipalPlace", JSON.stringify(principalBusiDetails))
    localStorage.setItem("otherPlace", JSON.stringify(otherbusinessDetails))
    localStorage.setItem("applicantDetails", JSON.stringify(applicantDetails))
    if (isPayNowClicked) {
      await RedirectToPayment()
    } else {
      setIsPreview(true)
    }
    // ShowMessagePopup(true, "Firms Details Saved SuccessFully", "");
  }
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
  }, [isPreview])
  const RedirectToPayment = async () => {
    if (NumberOfChanges == 0) {
      return ShowMessagePopup(false, "No Changes Identified")
    }
    let code: any = 0
    const dis = DistrictList?.find((x: any) => x.name == principalBusiDetails.district)
    if (dis) {
      code = dis.code
    }
    const paymentsData = {
      type: "firmsFee",
      source: "Firms",
      deptId: LoginDetails.applicationNumber,
      rmName: applicantDetails?.name,
      rmId: applicantDetails?.aadharNumber,
      mobile: contactDetails.mobileNumber,
      email: contactDetails.email,
      drNumber: code,
      rf: 300,
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

  const OnSelectPartner = (e: any) => {
    let SelectedPartner: any = firmData.firmPartners.find((x: any) => x._id == e.target.value)
    // GetMandalList(SelectedPartner.district, "Partner")
    // GetVillageList(SelectedPartner.mandal, SelectedPartner.district, "Partner")
    setMandalForPartnerReplaceDetails([])
    setVillageListForPartnerReplaceDetails([])
    if (SelectedPartner) {
      SelectedPartner.disabled = false
      SelectedPartner.AddNew = false
      //setSelectedPartnerReplaceDetails(SelectedPartner)
      setExistingPartnerReplaceDetails(SelectedPartner)
      setSelectedPartnerReplaceDetails({
        ...SelectedPartnerReplaceDetails,
        _id: SelectedPartner._id,
      })
    } else {
      setSelectedPartnerReplaceDetails({ ...SelectedPartnerReplaceDetails, _id: "" })
      setExistingPartnerReplaceDetails({
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
        address: ""
      })
    }
    setTempMemoryExistingPartnerReplace({ OTPRequested: false, AadharVerified: false })
  }

  return (
    <>
      <Head>
        <title>Add & Delete Partner or Dissolve Firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {!isPreview && locData && locData?.userType && locData?.userType == "user" && (
        <div className={styles.RegistrationMain}>
          <div className="societyRegSec">
            {(firmData.status == "Approved" ||
              (firmData.status == "Rejected" &&
                firmData.processingHistory?.length > 0 &&
                firmData.processingHistory.some((x: any) => x.status == "Approved")) ||
              (firmData.status == "Incomplete" &&
                firmData.paymentDetails.length > 0 &&
                !firmData.paymentStatus)) && (
              <Form
                className={`formsec ${styles.RegistrationInput}`}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                 <div className="maindivContainer">   
                   <Row>
                <Col lg={12} md={12} xs={12}>
                  <div className="d-flex justify-content-between align-items-center page-title mb-2">
                    <div className="pageTitleLeft">
                      <h1>Reconstitution of Firm</h1>
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
                                    disabled={true}
                                    required={true}
                                    name={"relation"}
                                    value={applicantDetails.relation}
                                    onChange={() => { }}
                                  />
                                </div>
                              </Col>

                              {/* <Col lg={3} md={3} xs={12}>
                    <TableText label="Surname" required={true}  />
                    <TableInputText disabled={false} type='text' placeholder='Enter Applicant SirName' required={true} name={'surName'} value={applicantDetails.surName} onChange={applicantDetailsChange} />
                  </Col> */}

                              {/* <Col lg={3} md={3} xs={12}>
                    <TableText label="Age" required={true} />
                    <TableInputText disabled={true} type='text' placeholder='Enter Age' required={true} name={'age'} value={applicantDetails.age} onChange={()=>{}} />
                  </Col> */}

                              {/* {applicantDetails.gender ? (
                    <Col lg={3} md={3} xs={12}>
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

                              <Col lg={2} md={2} xs={12} className="mb-3">
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
                                  onChange={partnerDetailsChange}
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
                                />
                              </Col>
                            </Row>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                  </div>

                  <div className="regofAppBg mb-3">
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
                                onChange={firmDetailsChange}
                              />
                              {/* <TableDropdown required={true} options={["Own", "Manual", "Other"]} name={"businessType"} value={firmDetails.businessType} onChange={firmDetailsChange} /> */}
                            </Col>
                          </Row>

                          <h6 className="appConTitle"><u>Principal Place of Business:</u></h6>
                          <Row>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Door No" required={false} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="Door No"
                                required={false}
                                name={"doorNo"}
                                value={principalBusiDetails.doorNo}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Street" required={false} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="Street"
                                required={false}
                                name={"street"}
                                value={principalBusiDetails.street}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="State" required={false} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="State"
                                required={false}
                                name={"state"}
                                value={principalBusiDetails.state}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="District" required={false} />
                              <TableDropdownSRO
                                disabled={true}
                                keyName={"name"}
                                required={false}
                                options={DistrictList}
                                name={"district"}
                                value={principalBusiDetails.district}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Mandal" required={false} />
                              <TableDropdownSRO
                                disabled={true}
                                keyName={"mandalName"}
                                required={false}
                                options={MandalForPrincipleAddr}
                                name={"mandal"}
                                value={principalBusiDetails.mandal}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Village/City" required={false} />
                              <TableDropdownSRO
                                disabled={true}
                                keyName="villageName"
                                required={false}
                                options={VillageListForPrincipleAddr}
                                name={"villageOrCity"}
                                value={principalBusiDetails.villageOrCity}
                                onChange={() => { }}
                              />
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="PIN Code" required={false} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                maxLength={6}
                                placeholder="PIN Code"
                                required={false}
                                name={"pinCode"}
                                value={principalBusiDetails.pinCode}
                                onChange={() => { }}
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={12} md={12} xs={12} className="mb-3">
                              <div className="firmDuration">
                                {!ShouldDeleteFirm ? (
                                  <Form.Check
                                    inline
                                    label="Add New Partner"
                                    checked={ShowAddPartner}
                                    name="atwill"
                                    type="checkbox"
                                    className="fom-checkbox"
                                    onChange={() => setShowAddPartner(!ShowAddPartner)}
                                  />
                                ) : null}
                                {!ShouldDeleteFirm ? (
                                  <Form.Check
                                    inline
                                    label="Replace Partner"
                                    checked={ShowReplacePartner}
                                    name="atwill"
                                    type="checkbox"
                                    className="fom-checkbox"
                                    onChange={() => setShowReplacePartner(!ShowReplacePartner)}
                                  />
                                ) : null}
                                {!ShouldDeleteFirm ? (
                                  <Form.Check
                                    inline
                                    label="Exit Partner"
                                    checked={ShowDeletePartner}
                                    name="atwill"
                                    type="checkbox"
                                    className="fom-checkbox"
                                    onChange={() => setShowDeletePartner(!ShowDeletePartner)}
                                  />
                                ) : null}
                                <Form.Check
                                  inline
                                  label="Dissolve Firm"
                                  checked={ShouldDeleteFirm}
                                  name="atwill"
                                  type="checkbox"
                                  className="fom-checkbox2"
                                  onChange={() => {
                                    if (ShouldDeleteFirm == false) {
                                      setShouldDeleteFirm(true)
                                      setShowAddPartner(false)
                                      setShowDeletePartner(false)
                                      setShowReplacePartner(false)
                                      setNumberOfChanges(NumberOfChanges + 1)
                                      setFirmDissolved(true)
                                    } else {
                                      setShouldDeleteFirm(false)
                                      setFirmDissolved(false)
                                    }
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                              {!ShouldDeleteFirm ? (
                    <div>
                      {/* <Row>
                    <Col lg={12} md={12} xs={12} className="mb-3">
                      <div className="firmDuration">
                        <Form.Check
                          inline
                          label="Add New Partner"
                          checked={ShowAddPartner}
                          name="atwill"
                          type="checkbox"
                          className="fom-checkbox"
                          onChange={() => setShowAddPartner(!ShowAddPartner)}
                        />
                      </div>
                    </Col>
                  </Row> */}
                      {ShowAddPartner ? (
                        <div className="FirmSecNew mb-3">
                          <div className="NewFirmSecTitle">
                            <Row>
                              <Col lg={12} md={12} xs={12}>
                                <h3>Add Partner </h3>
                              </Col>
                            </Row>
                          </div>
                          <div className="regofAppBg mb-3">
                            <Row>
                              {/* <Col lg={3} md={3} xs={12}>
                            <TableText label="List of Addresses" required={false}  />
                            <TableDropdownSRO keyName={"partnerName"} required={true} options={firmData?.firmPartners} name={"_id"} onChange={(e: any) => { OnSelectPartner(e) }} />
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
                                        dot={false}
                                        placeholder="Enter Aadhaar Number"
                                        required={false}
                                        name={"maskedAadhar"}
                                        value={SelectedPartnerDetails.maskedAadhar}
                                        onChange={(e: any) => {
                                          if (!TempMemoryPartner.AadharVerified) {
                                            partnerDetailsChange(e)
                                          }
                                        }}
                                        onKeyPress={true}
                                        onPaste={(e: any) => e.preventDefault()}
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
                                        value={SelectedPartnerDetails.otp}
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
                                  disabled={true}
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
                                    disabled={true}
                                    required={false}
                                    name={"relation"}
                                    value={SelectedPartnerDetails.relation}
                                    onChange={() => {}}
                                  />
                                </div>
                              </Col>

                              {/* <Col lg={3} md={3} xs={12} className="mb-3">
                            <TableText label="Age" required={true} />
                            <TableInputText
                              disabled={true}
                              type="number"
                              placeholder="Enter Age"
                              required={false}
                              maxLength={3}
                              dot={false}
                              name={"age"}
                              value={SelectedPartnerDetails.age}
                              onChange={()=>{}}
                            />
                          </Col> */}

                              {/* {SelectedPartnerDetails.gender ? (
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <TableText label="Gender" required={false} />
                              <TableInputText
                                disabled={true}
                                type="text"
                                placeholder="Enter Gender"
                                required={false}
                                name={"gender"}
                                value={SelectedPartnerDetails.gender}
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
                                  required={false}
                                  placeholder="DD/MM/YYYY"
                                  name="joiningDate"
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
                            </Row>
                            <div className="regFormBorder"></div>
                            <div className="formSectionTitle">
                              <h3>Contact Details</h3>
                            </div>

                            <Row>
                              {/* <Col lg={3} md={4} xs={12} className="mb-3">
                            <TableText
                              label="Landline Phone No"
                              required={false}
                              
                            />
                            <TableInputText
                              disabled={false}
                              type="number"
                              placeholder="Enter Landline Phone No"
                              required={false}
                              name={"landPhoneNumber"}
                              value={SelectedPartnerDetails.landPhoneNumber}
                              onChange={partnerDetailsChange}
                            />
                          </Col> */}
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
                            <div ref={ref} className="addedPartnerSec mt-3">
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
                                        <th>Current Share</th>
                                        <th>New Share</th>
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
                                              <input
                                                type={"text"}
                                                style={{ width: "50px" }}
                                                disabled={!enableNewShare}
                                                onKeyDown={NumberCheck}
                                                onChange={(e: any) => partnerShareUpdate(i, e)}
                                                name="newShare"
                                                value={item.newShare}
                                              />
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </Table>
                                  {enableNewShare && (
                                    <div
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: "12px",
                                      }}
                                    >
                                      <div
                                        className="btn btn-primary "
                                        style={{ justifySelf: "end" }}
                                        onClick={() => {
                                          checkShareLogic(false)
                                        }}
                                      >
                                        Save New Share
                                      </div>
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {!ShouldDeleteFirm && ShowReplacePartner ? (
                    <div className="regofAppBg mb-3">
                      {/* <Row>
                    <Col lg={12} md={12} xs={12} className="mb-3">
                      <div className="firmDuration">
                        <Form.Check
                          inline
                          label="Add New Partner"
                          checked={ShowAddPartner}
                          name="atwill"
                          type="checkbox"
                          className="fom-checkbox"
                          onChange={() => setShowAddPartner(!ShowAddPartner)}
                        />
                      </div>
                    </Col>
                  </Row> */}
                      {ShowReplacePartner ? (
                        <div className="FirmSecNew mb-3">
                          <div className="NewFirmSecTitle">
                            <Row>
                              <Col lg={12} md={12} xs={12}>
                                <h3>Replace Partner</h3>
                              </Col>
                            </Row>
                          </div>
                          <div className="regofAppBg mb-3">
                            <Row>
                              <Col lg={3} md={3} xs={12}>
                                <TableText label="List of Partners" required={false} />
                                <TableDropdownSRO
                                  keyName={"partnerName"}
                                  required={false}
                                  options={partnerDetails}
                                  name={"_id"}
                                  onChange={(e: any) => {
                                    OnSelectPartner(e)
                                  }}
                                />
                              </Col>
                              <Col lg={3} md={3} xs={12} className="mb-3">
                                {!TempMemoryExistingPartnerReplace.OTPRequested ? (
                                  <Form.Group>
                                    <TableText label="Enter Aadhaar Number" required={true} />
                                    <div className="formGroup">
                                      <TableInputText
                                        disabled={true}
                                        type="text"
                                        maxLength={12}
                                        dot={false}
                                        placeholder="Enter Aadhaar Number"
                                        required={false}
                                        name={"aadharNumber"}
                                        value={
                                          ExistingPartnerReplaceDetails.aadharNumber.toString()
                                            .length > 0
                                            ? "XXXXXXXX" +
                                              ExistingPartnerReplaceDetails.aadharNumber
                                                .toString()
                                                .substring(8, 12)
                                            : ""
                                        }
                                        onChange={() => {}}
                                        onPaste={(e: any) => e.preventDefault()}
                                      />
                                      {!TempMemoryExistingPartnerReplace.AadharVerified ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "2px",
                                          }}
                                          onClick={() => ReqOTP(ExistingPartnerReplaceDetails)}
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
                                        value={ExistingPartnerReplaceDetails.otp}
                                        onChange={partnerExistingReplaceDetailsChange}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderRadius: "2px",
                                        }}
                                        onClick={() => {
                                          ReqDetails(ExistingPartnerReplaceDetails)
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
                                            setTempMemoryExistingPartnerReplace({
                                              ...TempMemoryPartnerReplace,
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
                            </Row>
                            {TempMemoryExistingPartnerReplace.AadharVerified && (
                              <>
                                <div className="desktopFirmTitle NewFirmSecTitle mt-3">
                                  <Row>
                                    <Col lg={6} md={6} xs={12}>
                                      <h3>New Partner Details</h3>
                                    </Col>

                                    <Col lg={6} md={6} xs={12}>
                                      <h3>Old Partner Details</h3>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="regofAppBg">
                                  <Row>
                                    <Col lg={6} md={6} xs={12}>
                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          {!TempMemoryPartnerReplace.OTPRequested ? (
                                            <Form.Group>
                                              <TableText
                                                label="Enter Aadhaar Number"
                                                required={true}
                                              />
                                              <div className="formGroup">
                                                <TableInputText
                                                  disabled={TempMemoryPartnerReplace.AadharVerified}
                                                  type="text"
                                                  maxLength={12}
                                                  dot={false}
                                                  placeholder="Enter Aadhaar Number"
                                                  required={false}
                                                  name={"maskedAadhar"}
                                                  value={SelectedPartnerReplaceDetails.maskedAadhar}
                                                  onChange={(e: any) => {
                                                    if (!TempMemoryPartnerReplace.AadharVerified) {
                                                      partnerReplaceDetailsChange(e)
                                                    }
                                                  }}
                                                  onKeyPress={true}
                                                  onPaste={(e: any) => e.preventDefault()}
                                                />
                                                {!TempMemoryPartnerReplace.AadharVerified ? (
                                                  <div
                                                    style={{
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                      borderRadius: "2px",
                                                    }}
                                                    onClick={() =>
                                                      ReqOTP(SelectedPartnerReplaceDetails)
                                                    }
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
                                                  value={SelectedPartnerReplaceDetails.otp}
                                                  onChange={partnerReplaceDetailsChange}
                                                />
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: "2px",
                                                  }}
                                                  onClick={() => {
                                                    ReqDetails(SelectedPartnerReplaceDetails)
                                                  }}
                                                  className="verify btn btn-primary"
                                                >
                                                  Verify
                                                </div>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                      marginRight: "20px",
                                                      color: "blue",
                                                      fontSize: "10px",
                                                    }}
                                                    onClick={() => {
                                                      setTempMemoryPartnerReplace({
                                                        ...TempMemoryPartnerReplace,
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

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Name of the Partner" required={true} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Enter Name of the Partner"
                                            required={false}
                                            name={"partnerName"}
                                            value={SelectedPartnerReplaceDetails.partnerName}
                                            onChange={() => {}}
                                          />
                                          <TableText
                                            label={`Gender: ${SelectedPartnerReplaceDetails.gender}  / Age: ${SelectedPartnerReplaceDetails.age}`}
                                            required={false}
                                          />
                                        </Col>

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText
                                            label={"Relation type and Name"}
                                            required={true}
                                          />
                                          <div className={styles.relationData}>
                                            <select
                                              className={styles.selectData}
                                              required={false}
                                              name={"relationType"}
                                              value={SelectedPartnerReplaceDetails.relationType}
                                              onChange={partnerReplaceDetailsChange}
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
                                              disabled={true}
                                              required={false}
                                              name={"relation"}
                                              value={SelectedPartnerReplaceDetails.relation}
                                              onChange={() => {}}
                                            />
                                          </div>
                                        </Col>

                                        {/* <Col lg={6} md={6} xs={12} className="mb-3">
                                    <TableText label="Age" required={true} />
                                    <TableInputText
                                      disabled={true}
                                      type="text"
                                      placeholder="Enter Age"
                                      required={false}
                                      name={"age"}
                                      value={SelectedPartnerReplaceDetails.age}
                                      onChange={()=>{}}
                                    />
                                  </Col>

                                  {SelectedPartnerReplaceDetails.gender ? (
                                    <Col lg={6} md={6} xs={12} className="mb-3">
                                      <TableText label="Gender" required={false} />
                                      <TableInputText
                                        disabled={true}
                                        type="text"
                                        placeholder="Enter Gender"
                                        required={false}
                                        name={"gender"}
                                        value={SelectedPartnerReplaceDetails.gender}
                                        onChange={()=>{}}
                                      />
                                    </Col>
                                  ) : null} */}

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Role" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="text"
                                            placeholder="Enter Role"
                                            required={false}
                                            name={"role"}
                                            value={SelectedPartnerReplaceDetails.role}
                                            onChange={partnerReplaceDetailsChange}
                                            maxLength={50}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Joining Date" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="date"
                                            placeholder="DD/MM/YYYY"
                                            name="joiningDate"
                                            required={false}
                                            value={SelectedPartnerReplaceDetails.joiningDate}
                                            onChange={partnerReplaceDetailsChange}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText
                                            label="Partner Percentage(%)"
                                            required={true}
                                          />
                                          <TableInputText
                                            disabled={false}
                                            type="number"
                                            maxLength={5}
                                            placeholder="Enter Share Percentage"
                                            required={false}
                                            name={"share"}
                                            value={SelectedPartnerReplaceDetails.share}
                                            onChange={partnerReplaceDetailsChange}
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
                                            value={SelectedPartnerReplaceDetails.address}
                                            onChange={partnerDetailsChange}
                                            maxLength={10000}
                                          ></textarea>
                                        </Col>
                                      </Row>
                                      <div className="regFormBorder"></div>
                                      <div className="formSectionTitle">
                                        <h3>Contact Details</h3>
                                      </div>

                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Mobile No" required={true} />
                                          <TableInputText
                                            disabled={false}
                                            type="text"
                                            dot={false}
                                            placeholder="Enter Mobile No"
                                            required={false}
                                            maxLength={10}
                                            name={"mobileNumber"}
                                            value={SelectedPartnerReplaceDetails.mobileNumber}
                                            onChange={partnerReplaceDetailsChange}
                                          />
                                        </Col>

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Email ID" required={false} />
                                          <TableInputText
                                            disabled={false}
                                            type="email"
                                            placeholder="Enter Email ID"
                                            required={false}
                                            name={"email"}
                                            value={SelectedPartnerReplaceDetails.email}
                                            onChange={partnerReplaceDetailsChange}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col lg={6} md={6} xs={12}>
                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Name of the Partner" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Enter Name of the Partner"
                                            required={false}
                                            name={"partnerName"}
                                            value={ExistingPartnerReplaceDetails.partnerName}
                                            onChange={() => {}}
                                          />
                                          <TableText
                                            label={`Gender: ${ExistingPartnerReplaceDetails.gender}  / Age: ${ExistingPartnerReplaceDetails.age}`}
                                            required={false}
                                          />
                                        </Col>

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText
                                            label={"Relation type and Name"}
                                            required={false}
                                          />
                                          <div className={styles.relationData}>
                                            <select
                                              className={styles.selectData}
                                              required={false}
                                              disabled={true}
                                              name={"relationType"}
                                              value={ExistingPartnerReplaceDetails.relationType}
                                              onChange={() => {}}
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
                                              disabled={true}
                                              required={false}
                                              name={"relation"}
                                              value={ExistingPartnerReplaceDetails.relation}
                                              onChange={() => {}}
                                            />
                                          </div>
                                        </Col>

                                        {/* <Col lg={6} md={6} xs={12} className="mb-3">
                                    <TableText label="Age" required={false} />
                                    <TableInputText
                                      disabled={true}
                                      type="text"
                                      placeholder="Enter Age"
                                      required={false}
                                      name={"age"}
                                      value={ExistingPartnerReplaceDetails.age}
                                      onChange={()=>{}}
                                    />
                                  </Col>
                                  <Col lg={6} md={6} xs={12} className="mb-3">
                                    <TableText
                                      label="Gender"
                                      required={false}

                                    />
                                    <TableInputText
                                      disabled={true}
                                      type="text"
                                      placeholder="Enter Gender"
                                      required={false}
                                      name={"gender"}
                                      value={ExistingPartnerReplaceDetails.gender}
                                      onChange={()=>{}}
                                    />
                                  </Col> */}

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Role" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="Enter Role"
                                            required={false}
                                            name={"role"}
                                            value={ExistingPartnerReplaceDetails.role}
                                            onChange={() => {}}
                                            maxLength={50}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Joining Date" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            placeholder="DD/MM/YYYY"
                                            name="joiningDate"
                                            required={false}
                                            value={DateFormator(
                                              ExistingPartnerReplaceDetails.joiningDate,
                                              "dd-mm-yyyy"
                                            )}
                                            onChange={() => {}}
                                          />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText
                                            label="Partner Percentage(%)"
                                            required={false}
                                          />
                                          <TableInputText
                                            disabled={true}
                                            type="number"
                                            maxLength={5}
                                            placeholder="Enter Share Percentage"
                                            required={false}
                                            name={"share"}
                                            value={ExistingPartnerReplaceDetails.share}
                                            onChange={() => {}}
                                          />
                                        </Col>
                                      </Row>

                                      <div className="regFormBorder"></div>
                                      <div className="formSectionTitle">
                                        <h3>Address Details</h3>
                                      </div>
                                      <Row>
                                        <Col lg={6} md={4} xs={12} className="mb-3">
                                          <TableText label="Address" required={false} />
                                          <textarea
                                            className="form-control textarea"                              
                                            disabled={true}
                                            placeholder="Enter Address"
                                            required={false}
                                            name={"address"}                              
                                            value={ExistingPartnerReplaceDetails.address}
                                            onChange={() => {}}
                                            maxLength={10000}
                                          ></textarea>
                                        </Col>
                                      </Row>
                                      <div className="regFormBorder"></div>
                                      <div className="formSectionTitle">
                                        <h3>Contact Details</h3>
                                      </div>

                                      <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Mobile No" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="text"
                                            dot={false}
                                            placeholder="Enter Mobile No"
                                            required={false}
                                            maxLength={10}
                                            name={"mobileNumber"}
                                            value={ExistingPartnerReplaceDetails.mobileNumber}
                                            onChange={() => {}}
                                          />
                                        </Col>

                                        <Col lg={6} md={6} xs={12} className="mb-3">
                                          <TableText label="Email ID" required={false} />
                                          <TableInputText
                                            disabled={true}
                                            type="email"
                                            placeholder="Enter Email ID"
                                            required={false}
                                            name={"email"}
                                            value={ExistingPartnerReplaceDetails.email}
                                            onChange={() => {}}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div
                                    className="btn btn-primary "
                                    style={{ justifySelf: "end" }}
                                    onClick={() => {
                                      ReplacePartnerFields()
                                    }}
                                  >
                                    Save
                                  </div>
                                </div>
                                {partnerDetails && partnerDetails.length ? (
                                  <div ref={refUpdate} className="addedPartnerSec mt-3">
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
                                              <th>Current Share</th>
                                              <th>New Share</th>
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
                                                    <input
                                                      type={"text"}
                                                      style={{ width: "50px" }}
                                                      disabled={!enableRelpaceNewShare}
                                                      onKeyDown={NumberCheck}
                                                      onChange={(e: any) =>
                                                        partnerShareUpdate(i, e)
                                                      }
                                                      name="newShare"
                                                      value={item.newShare}
                                                    />
                                                  </td>
                                                </tr>
                                              )
                                            })}
                                          </tbody>
                                        </Table>
                                        {enableRelpaceNewShare && (
                                          <div
                                            style={{
                                              width: "100%",
                                              display: "flex",
                                              justifyContent: "center",
                                              marginTop: "12px",
                                            }}
                                          >
                                            <div
                                              className="btn btn-primary "
                                              style={{ justifySelf: "end" }}
                                              onClick={() => {
                                                checkShareLogic(true)
                                              }}
                                            >
                                              Save New Share
                                            </div>
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {!ShouldDeleteFirm && ShowDeletePartner ? (
                    <div className="regofAppBg mb-3">
                      {/* <Row>
                    <Col lg={12} md={12} xs={12} className="mb-3">
                      <div className="firmDuration">
                        <Form.Check
                          inline
                          label="Exit Partner"
                          checked={ShowDeletePartner}
                          name="atwill"
                          type="checkbox"
                          className="fom-checkbox"
                          onChange={() => setShowDeletePartner(!ShowDeletePartner)}
                        />
                      </div>
                    </Col>
                  </Row> */}
                      {ShowDeletePartner ? (
                        <>
                          <div className="NewFirmSecTitle mb-3">
                            <Row>
                              <Col lg={12} md={12} xs={12}>
                                <h3>Exit Partner </h3>
                              </Col>
                            </Row>
                          </div>
                          <div className="FirmSecNew mb-3">
                            {partnerDetails.length ? (
                              <div ref={refDelete} className="addedPartnerSec">
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
                                          <th>Current Share</th>
                                          <th>New Share</th>
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
                                                <input
                                                  type={"text"}
                                                  style={{ width: "50px" }}
                                                  disabled={!enableDeleteNewShare}
                                                  onKeyDown={NumberCheck}
                                                  onChange={(e: any) => partnerShareUpdate(i, e)}
                                                  name="newShare"
                                                  value={item.newShare}
                                                />
                                              </td>
                                              <td>
                                                {" "}
                                                <Image
                                                  alt="Image"
                                                  height={18}
                                                  width={17}
                                                  src="/firmsHome/assets/delete-icon.svg"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                    if (partnerDetails?.length > 2) {
                                                      removeSelectedPartner(i, item.aadharNumber)
                                                    } else if (
                                                      partnerDetails?.length <= 2 &&
                                                      window.confirm(
                                                        "Minimum two partners are required. Are you sure, you wish to disolve the firm?"
                                                      )
                                                    ) {
                                                      setShouldDeleteFirm(true)
                                                      setShowAddPartner(false)
                                                      setShowDeletePartner(false)
                                                      setShowReplacePartner(false)
                                                      setFirmDissolved(true)
                                                    }
                                                  }}
                                                />
                                              </td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </Table>
                                    {enableDeleteNewShare && (
                                      <div
                                        style={{
                                          width: "100%",
                                          display: "flex",
                                          justifyContent: "center",
                                          marginTop: "12px",
                                        }}
                                      >
                                        <div
                                          className="btn btn-primary "
                                          style={{ justifySelf: "end" }}
                                          onClick={() => {
                                            checkShareLogic(false, true)
                                          }}
                                        >
                                          Save New Share
                                        </div>
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  {ShouldDeleteFirm && deletePartnerDetails && deletePartnerDetails.length ? (
                    <div className="addedPartnerSec">
                      <Row className="mb-4">
                        {deletePartnerDetails.map((item: any, i: number) => {
                          return (
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              {!item.OTPRequested ? (
                                <Form.Group>
                                  <TableText
                                    label={`${item.partnerName} Aadhaar Number`}
                                    required={true}
                                  />
                                  <div className="formGroup">
                                    <TableInputText
                                      disabled={true}
                                      type="text"
                                      maxLength={12}
                                      dot={false}
                                      placeholder="Enter Aadhaar Number"
                                      required={false}
                                      name={"aadharNumber"}
                                      value={
                                        "XXXXXXXX" + item.aadharNumber.toString().substring(8, 12)
                                      }
                                      onChange={() => {}}
                                    />
                                    {!item.AadharVerified ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderRadius: "2px",
                                        }}
                                        onClick={() => ReqDeleteOTP(item, i)}
                                        className="verify btn btn-primary"
                                      >
                                        Get OTP
                                      </div>
                                    ) : null}
                                  </div>
                                </Form.Group>
                              ) : (
                                <Form.Group>
                                  <TableText
                                    label={`Enter Partner ${i + 1} OTP`}
                                    required={false}
                                  />
                                  <div className="formGroup">
                                    <TableInputText
                                      disabled={false}
                                      type="number"
                                      placeholder="Enter OTP Received"
                                      maxLength={6}
                                      required={false}
                                      name={"otp"}
                                      value={item.otp}
                                      onChange={(e: any) => DeletePartnerDetails(e, i)}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "2px",
                                      }}
                                      onClick={() => {
                                        ReqDetailsDelete(item, i)
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
                                          const data: any = [...deletePartnerDetails]
                                          const dat: any = { ...data[i], OTPRequested: false }
                                          data.splice(i, 1, dat)
                                          setDeletePartnerDetails([...data])
                                        }}
                                      >
                                        clear
                                      </div>
                                    </div>
                                  </div>
                                </Form.Group>
                              )}
                            </Col>
                          )
                        })}
                      </Row>
                    </div>
                  ) : null}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="regofAppBg mb-3">
                  <Card>
                    <Card.Header>Upload Firm Related Documents-(All Uploaded Documents should be in PDF
                    format only upto 3MB )</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        {true ? (
                          <div className="uploadFirmList appDocList mb-4">
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

                                {firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "LEASE" && (
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

                                {firmData?.principalPlaceBusiness[0]?.type?.toUpperCase() == "OWN" && (
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
                                        <a
                                          href="/firmsHome/assets/downloads/Form-III.pdf"
                                          target="_blank"
                                        >
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

                                <Col lg={2} md={4} xs={12}>
                                  <div className="firmFile mt-2">
                                    <Form.Group controlId="formFile">
                                      <TableText label="Others" required={false} />
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
                          </div>
                        ) : null}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  </div>

                  {/* <Row>
                <Col lg={12} md={12} xs={12} className="mb-3">
                  <div className="firmDuration">
                    <Form.Check
                      inline
                      label="Dissolve Firm"
                      checked={ShouldDeleteFirm}
                      name="atwill"
                      type="checkbox"
                      className="fom-checkbox2"
                      onChange={() => {
                        if (
                          ShouldDeleteFirm == false &&
                          window.confirm("Are you sure, you wish to disolve the firm?")
                        ) {
                          setShouldDeleteFirm(true)
                          setNumberOfChanges(NumberOfChanges + 1)
                        } else {
                          setShouldDeleteFirm(false)
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row> */}

                  <div className="firmSubmitSec mt-5">
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <div className="d-flex justify-content-center text-center">
                          <button
                            className="btn btn-primary showPayment"
                            name="btn1"
                            onClick={() => setIsPayNowClicked(true)}
                            value="Show Payment"
                          >
                            Show Payment
                          </button>
                          <button
                            className="btn btn-primary submit"
                            name="btn1"
                            value="Show Payment"
                          >
                            Preview
                          </button>
                          {/* <button className="btn btn-primary saveDraft" name="btn2" value="Save as Draft"> Save as Draft </button> */}
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
        </div>
      )}


      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={unAuthshow} onHide={() => { redirectToPage("/firms/dashboard") }}
        backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Application Status Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isPreview && (!locData?.userType || locData?.userType != "user") && (
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
          {isPreview && (
            <PreviewFirm
              appId={locData.applicationId}
              formType={"form-3"}
              setIsPreview={setIsPreview}
            />
          )}
        </Modal.Body>
      </Modal>
     
    </>
  )
}

export default Form3
