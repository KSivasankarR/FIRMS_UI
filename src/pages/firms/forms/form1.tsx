import React, { useState, useRef } from "react"
import { useRouter } from "next/router"
import Swal from "sweetalert2"
import Head from "next/head"
import { Container, Col, Row, Form, Table } from "react-bootstrap"
import styles from "@/styles/pages/Forms.module.scss"
import { NameValidation } from "@/utils"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { PopupAction } from "@/redux/commonSlice"
import { updateFirmDetails, getFirmDetails } from "@/axios"
import CryptoJS from "crypto-js"
import { IBusinessDetailsModel, IContactDetailsModel, IFirmDetailsModel } from "@/models/firmsTypes"

const Form1 = () => {
  const dispatch = useAppDispatch()
  const verifyUserData = useAppSelector((state) => state.login.verifyUserData)
  const verifyUserLoading = useAppSelector((state) => state.login.verifyUserLoading)
  const verifyUserMsg = useAppSelector((state) => state.login.verifyUserMsg)
  const router = useRouter()
  const componentRef = useRef<HTMLElement | null>(null)

  const [addFirm, setAddFirm] = useState<string>("")
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [FormErrors, setFormErrors] = useState<any>({})

  const [isPartnerError, setIsPartnerError] = useState<boolean>(false)
  const [isPartnerShow, setIsPartnerShow] = useState<boolean>(false)
  const [sentOTP, setSentOTP] = useState<boolean>(false)
  const [otp, setOTP] = useState<string>("")
  const [aadhaarOTPResponse, setAadhaarOTPResponse] = useState<any>({})

  const [IsOtherChecked, setIsOtherChecked] = useState<boolean>(false)

  const [applicantDetails, setApplicantDetails] = useState<any>({})
  const [existingFirmDetail, setExistingFirmDetail] = useState<any>({})
  const [token, setToken] = useState<string>("")
  const [loggedInAadhar, setLoggedInAadhar] = useState<string>("")
  const [isPayNowClicked, setIsPayNowClicked] = useState<boolean>(false)
  const [contactDetails, setContactDetails] = useState<IContactDetailsModel>({
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
  })

  const [firmDetails, setFirmDetails] = useState<IFirmDetailsModel>({
    firmName: "",
    firmDurationFrom: "",
    firmDurationTo: "",
    industryType: "",
    businessType: "",
  })
  const [partnerDetails, setPartnerDetails] = useState<any>([])
  const [principalBusiDetails, setPrincipalBusiDetails] = useState<IBusinessDetailsModel>({
    doorNo: "",
    street: "",
    country: "",
    state: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    registrationDistrict: "",
    branch: "Main",
  })

  const [otherbusinessDetails, setOtherBusinessDetails] = useState<IBusinessDetailsModel[]>([
    {
      doorNo: "",
      street: "",
      state: "",
      country: "",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      registrationDistrict: "",
      branch: "Sub",
    },
  ])

  const [file, setFile] = useState<any>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [fileName, setFileName] = useState<string>("Upload Boundary File")

  React.useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setToken(data.token)
    console.log(data.token, "----------token")
    setLoggedInAadhar(data.aadharNumber)
    setApplicantDetails({
      ...applicantDetails,
      applicationNumber: data.applicationNumber,
    })
    getFirmDetails(data.applicationId, data.token).then((response) => {
      if (response?.success) {
        console.log(response, "9999999999999999")
        setExistingFirmDetail(response)
      }
    })
  }, [])

  const handleApplicantsData = (data: any, type: string) => {
    if (type === "applicant") setApplicantDetails({ ...applicantDetails, ...data })
    else if (type === "contact") setContactDetails({ ...contactDetails, ...data })
  }

  const handlePartnerDetails = (data: any, inV: number) => {
    console.log(data, "_________________________________")
    setPartnerDetails((prevDetails) => {
      console.log(prevDetails[inV], "***************")
      if (typeof prevDetails[inV] === "undefined") {
        prevDetails[inV] = {}
      }
      prevDetails.splice(inV, 1, data[inV])
      console.log(prevDetails, "$$$$$$$")
      return prevDetails
    })

    if (partnerDetails.length) {
      setIsPartnerShow(true)
    } else {
      setIsPartnerShow(false)
    }
  }

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const applicantDetailsChange = (e) => {
    let addName = e.target.name
    let addValue = e.target.value
    if (addName == "aadhaarNumber") {
      if (addValue.length > 12) {
        addValue = addValue.substring(0, 12)
      }
    } else if (addName == "applicantName" || addName == "relation" || addName == "role") {
      addValue = NameValidation(addValue)
    }
    setApplicantDetails({ ...applicantDetails, [addName]: addValue })
  }

  const validate = () => {
    const errors: any = {}
    const logDetails: any = { ...applicantDetails }
    if (applicantDetails.aadhaarNumber && applicantDetails.aadhaarNumber.length < 12) {
      errors["aadhaarNumber"] = "*Please enter a valid 12 digit aadhaar number"
    }
    setFormErrors({ ...errors })

    console.log("errors", errors)
    return errors
  }

  const contactDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setContactDetails(newInput)
  }

  const firmDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setFirmDetails(newInput)
  }

  const principalBusinessChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setPrincipalBusiDetails(newInput)
  }

  const otherPlaceHandle = (event: any) => {
    setIsOtherChecked(event.target.checked)
  }

  const otherDetailsChange = (event: any, index: number) => {
    let data: any = [...otherbusinessDetails]
    data[index][event.target.name] = event.target.value
    setOtherBusinessDetails(data)
  }

  const partnerDetailsChange = (event: any, index) => {
    let data: any = [...partnerDetails]
    data[index][event.target.name] = event.target.value
    setPartnerDetails(data)
  }

  const ShowMessagePopup = (type: any, message: any, redirectOnSuccess: any) => {
    dispatch(PopupAction({ enable: true, type, message, redirectOnSuccess }))
  }

  const addFields = () => {
    let object = {
      doorNo: "",
      street: "",
      state: "",
      country: "",
      district: "",
      mandal: "",
      villageOrCity: "",
      pinCode: "",
      registrationDistrict: "",
      branch: "Sub",
    }
    setOtherBusinessDetails([...otherbusinessDetails, object])
  }

  const removeFields = (index: number) => {
    let data: any = [...otherbusinessDetails]
    data.splice(index, 1)
    setOtherBusinessDetails(data)
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) {
      return
    }
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.files[0] })
    setFile(newInput)
  }

  const countryList: string[] = ["India"]
  const stateList: string[] = ["Andhra Pradesh"]
  const districtList: string[] = [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Amalapuram",
    "Bapatla",
    "Chittoor",
    "Kadapa",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "NTR - Vijayawada",
    "Nandyal",
    "Nellore",
    "Palnadu - Narsaraopeta",
    "Parvathipuram",
    "Prakasam",
    "Srikakulam",
    "Puttaparthy",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
  ]
  const genderList: string[] = ["Female", "Male", "Other"]

  const mandalList: string[] = ["AGALI", "AMADAGUR", "AMARAPURAM"]

  const villageList: string[] = ["AGALI", "AKKAGALADEVARAHALLI", "HULIKERADEVARAHALLI", "INAGALORE"]

  const deliveryList: string[] = ["Own", "Other"]

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (!Object.keys(validate()).length) {
      console.log(applicantDetails, "(((((((((((")
      const firmPreview = {
        applicantDetails: applicantDetails,
        firmDetails: firmDetails,
        contactDetails: contactDetails,
        partnerDetails: partnerDetails,
        otherbusinessDetails: [principalBusiDetails, ...otherbusinessDetails],
      }

      const {
        applicationForm,
        form1EnglishTelugu,
        partnershipDeed,
        affidavit,
        selfSignedDeclaration,
      }: any = file

      const appDoc = applicationForm

      const form1Doc = form1EnglishTelugu

      const partnerDoc = partnershipDeed

      const affidavitDoc = affidavit

      const selfDoc = selfSignedDeclaration

      const data: any = {
        applicantDetails: applicantDetails,
        contactDetails: contactDetails,
        firmDetails: firmDetails,
        applicationForm: applicationForm,
        affidavit: affidavit,
        selfSignedDeclaration: selfSignedDeclaration,
      }

      const newData = new FormData()

      // newData.append("applicantDetails[applicationNumber]", existingFirmDetail.applicationNumber)

      newData.append("applicantDetails[aadharNumber]", firmPreview.applicantDetails.aadhaarNumber)
      newData.append("applicantDetails[name]", firmPreview.applicantDetails.applicantName)
      newData.append("applicantDetails[surName]", firmPreview.applicantDetails.surName)
      newData.append("applicantDetails[gender]", firmPreview.applicantDetails.gender)
      newData.append("applicantDetails[relationType]", firmPreview.applicantDetails.relationType)

      newData.append("applicantDetails[relation]", firmPreview.applicantDetails.relation)
      newData.append("applicantDetails[role]", firmPreview.applicantDetails.role)

      newData.append("applicantDetails[doorNo]", firmPreview.applicantDetails.doorNo)
      newData.append("applicantDetails[street]", firmPreview.applicantDetails.street)
      newData.append("applicantDetails[district]", firmPreview.applicantDetails.district)
      newData.append("applicantDetails[mandal]", firmPreview.applicantDetails.mandal)
      newData.append("applicantDetails[villageOrCity]", firmPreview.applicantDetails.villageOrCity)
      newData.append("applicantDetails[pinCode]", firmPreview.applicantDetails.pinCode)
      newData.append("applicantDetails[country]", "India")
      newData.append("applicantDetails[state]", "Andhra Pradesh")
      newData.append("contactDetails[landPhoneNumber]", firmPreview.contactDetails.landPhoneNumber)
      newData.append("contactDetails[mobileNumber]", firmPreview.contactDetails.mobileNumber)
      newData.append("contactDetails[email]", firmPreview.contactDetails.email)

      newData.append("firmDetails[firmName]", firmPreview.firmDetails.firmName)
      newData.append("firmDetails[firmDurationFrom]", firmPreview.firmDetails.firmDurationFrom)
      newData.append("firmDetails[firmDurationTo]", firmPreview.firmDetails.firmDurationTo)
      newData.append("firmDetails[industryType]", firmPreview.firmDetails.industryType)
      newData.append("firmDetails[bussinessType]", firmPreview.firmDetails.businessType)

      newData.append("applicationForm", appDoc)
      newData.append("form1EnglishTelugu", form1Doc)
      newData.append("partnershipDeed", partnerDoc)
      newData.append("affidavit", affidavitDoc)
      newData.append("selfSignedDeclaration", selfDoc)
      newData.append("formType", "form-1")

      for (let j = 0; j < firmPreview.partnerDetails.length; j++) {
        newData.append(
          "partnerDetails[" + j + "][partnerName]",
          firmPreview.partnerDetails[j].partnerName
        )
        newData.append(
          "partnerDetails[" + j + "][partnerSurname]",
          firmPreview.partnerDetails[j].partnerSurname
        )
        newData.append(
          "partnerDetails[" + j + "][relation]",
          firmPreview.partnerDetails[j].relation
        )
        newData.append(
          "partnerDetails[" + j + "][relationType]",
          firmPreview.partnerDetails[j].relationType
        )
        newData.append("partnerDetails[" + j + "][role]", firmPreview.partnerDetails[j].role)
        newData.append("partnerDetails[" + j + "][age]", firmPreview.partnerDetails[j].age)
        newData.append("partnerDetails[" + j + "][doorNo]", firmPreview.partnerDetails[j].doorNo)
        newData.append("partnerDetails[" + j + "][street]", firmPreview.partnerDetails[j].street)
        newData.append(
          "partnerDetails[" + j + "][district]",
          firmPreview.partnerDetails[j].district
        )
        newData.append("partnerDetails[" + j + "][mandal]", firmPreview.partnerDetails[j].mandal)
        newData.append(
          "partnerDetails[" + j + "][villageOrCity]",
          firmPreview.partnerDetails[j].villageOrCity
        )
        newData.append("partnerDetails[" + j + "][pinCode]", firmPreview.partnerDetails[j].pinCode)
        newData.append(
          "partnerDetails[" + j + "][landPhoneNumber]",
          firmPreview.partnerDetails[j].landPhoneNumber
        )
        newData.append(
          "partnerDetails[" + j + "][mobileNo]",
          firmPreview.partnerDetails[j].mobileNumber
        )
        newData.append("partnerDetails[" + j + "][emailID]", firmPreview.partnerDetails[j].email)
        newData.append("partnerDetails[" + j + "][state]", "Andhra Pradesh")
        newData.append("partnerDetails[" + j + "][country]", "India")
      }
      for (let j = 0; j < firmPreview.otherbusinessDetails.length; j++) {
        newData.append(
          "principalPlaceBusiness[" + j + "][doorNo]",
          firmPreview.otherbusinessDetails[j].doorNo
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][street]",
          firmPreview.otherbusinessDetails[j].street
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][state]",
          firmPreview.otherbusinessDetails[j].state !== ""
            ? firmPreview.otherbusinessDetails[j].state
            : "Andhra Pradesh"
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][district]",
          firmPreview.otherbusinessDetails[j].district
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][mandal]",
          firmPreview.otherbusinessDetails[j].mandal
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][villageOrCity]",
          firmPreview.otherbusinessDetails[j].villageOrCity
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][pinCode]",
          firmPreview.otherbusinessDetails[j].pinCode
        )
        newData.append(
          "principalPlaceBusiness[" + j + "][registrationDistrict]",
          firmPreview.otherbusinessDetails[j].registrationDistrict
        )
        newData.append("principalPlaceBusiness[" + j + "][country]", "India")
        newData.append(
          "principalPlaceBusiness[" + j + "][branch]",
          firmPreview.otherbusinessDetails[j].branch
        )
        console.log(existingFirmDetail?.data?.firm?._id, ")))))))))")
        newData.append("id", existingFirmDetail?.data?.firm?._id)
        console.log(newData, "_______new Data")
      }

      console.log(existingFirmDetail, "------existingFirmDetail---------")
      updateFirmDetails(existingFirmDetail?.data?.firm?._id, token, newData)
        .then((response: any) => {
          console.log(response)
          // setAddSociety(response.data)
          if (isPayNowClicked) {
            let code = 0
            const dis = districtList?.find((x: any) => x.name == data.applicantDetails.district)
            // if (dis) {
            //   code = dis.code
            // }
            const noOfPartners = partnerDetails.length
            console.log(noOfPartners, "---no.of parnterns")
            const rfAmount = 100 * noOfPartners
            console.log(data, "----------data_________")
            const paymentsData = {
              type: "firmsFee",
              source: "Firms",
              deptId: existingFirmDetail?.data?.firm?.applicationNumber,
              rmName: data.applicantDetails.applicantName,
              rmId: loggedInAadhar,
              mobile: 9652041014,
              email: "aravind.peerla@criticalriver.com",
              drNumber: code,
              rf: rfAmount,
              uc: 1,
              oc: 0,
              returnURL: process.env.BASE_URL + "/firms/paymentSuccess",
            }
            console.log(paymentsData, "______payment Data")
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
          } else {
            //ShowAlert(true, "Saved Successfully")
          }

          Swal.fire({
            icon: "success",
            title: "Added!",
            text: `societies data has been Added.`,
            showConfirmButton: false,
            timer: 1500,
          })
          // router.push("/societies/societies")
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

      // api
      //   .post("/firm/update", newData, {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/x-www-form-urlencoded",
      //     },
      //   })
      //   .then((response: any) => {
      //     console.log(response)
      //     setAddFirm(response.data)
      //     Swal.fire({
      //       icon: "success",
      //       title: "Added!",
      //       text: `firms data has been Added.`,
      //       showConfirmButton: false,
      //       timer: 1500,
      //     })
      //     router.push("/firms")
      //     //setIsAdding(false)
      //   })
      //   .catch((error) => {
      //     console.log("error-", error)
      //     setIsError(true)
      //     setErrorMessage(error.message)
      //     Swal.fire({
      //       icon: "error",
      //       title: "Error!",
      //       text: error.message,
      //       showConfirmButton: false,
      //       timer: 1500,
      //     })
      //   })
    }
  }

  return (
    <>
      <Head>
        <title>Application for Registration of Firms</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className={styles.RegistrationMain}>
        <div className="societyRegSec">
          <Container>
            <Row>
              <Col lg={12} md={12} xs={12}>
                <div className="d-flex justify-content-between page-title mb-2">
                  <div className="pageTitleLeft">
                    <h1>Application for Registration of Firms</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Form
            className={`formsec ${styles.RegistrationInput}`}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <Container>
              {/* <ApplicationDetails
                districtList={districtList}
                mandalList={mandalList}
                villageList={villageList}
                handleApplicantsData={handleApplicantsData}
              /> */}

              <div className="regofAppBg mb-3">
                <div className="formSectionTitle">
                  <h3>Firm Details</h3>
                </div>

                <Row>
                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <div className="d-flex justify-content-between">
                        <Form.Label>Firm Name</Form.Label>
                        <button className="availability">Check Availability</button>
                      </div>

                      <Form.Control
                        type="text"
                        placeholder="Enter Firm Name"
                        name="firmName"
                        onChange={firmDetailsChange}
                        value={firmDetails.firmName}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <div className="d-flex justify-content-between firmDuration">
                        <Form.Label>Firm Duration</Form.Label>
                        <Form.Check
                          inline
                          label="At Will"
                          value="At Will"
                          name="atwill"
                          type="checkbox"
                          className="fom-checkbox"
                        />
                      </div>

                      <div className="d-flex justify-content-between firmDurationInfo">
                        <Form.Control
                          type="date"
                          placeholder="DD/MM/YYYY"
                          name="firmDurationFrom"
                          onChange={firmDetailsChange}
                          value={firmDetails.firmDurationFrom}
                          className="durationFrom"
                        />
                        <div className="middleLabel">TO</div>
                        <Form.Control
                          type="date"
                          placeholder="DD/MM/YYYY"
                          name="firmDurationTo"
                          onChange={firmDetailsChange}
                          value={firmDetails.firmDurationTo}
                          className="durationTo"
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Industry Type</Form.Label>
                      <Form.Select
                        name="industryType"
                        onChange={firmDetailsChange}
                        value={firmDetails.industryType}
                      >
                        <option hidden>Select Industry Type</option>
                        <option value="own">Own</option>
                        <option value="manual">Manual</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Business Type</Form.Label>
                      <Form.Select
                        name="businessType"
                        onChange={firmDetailsChange}
                        value={firmDetails.businessType}
                      >
                        <option hidden>Select Business Type</option>
                        <option value="own">Own</option>
                        <option value="manual">Manual</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="regFormBorder"></div>

                <div className="formSectionTitle">
                  <h3>Principal Place of Business</h3>
                </div>

                <Row>
                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Door No <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Door No"
                        name="doorNo"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.doorNo}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Street <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Street"
                        name="street"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.street}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        District <span>*</span>
                      </Form.Label>
                      <select
                        className="form-control"
                        name="district"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.district}
                      >
                        <option hidden>Select</option>
                        {districtList &&
                          districtList.map((item: any, i: number) => {
                            return (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            )
                          })}
                      </select>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Mandal <span>*</span>
                      </Form.Label>
                      <select
                        className="form-control"
                        name="mandal"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.mandal}
                      >
                        <option hidden>Select</option>
                        {mandalList &&
                          mandalList.map((item: any, i: number) => {
                            return (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            )
                          })}
                      </select>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        Village/City <span>*</span>
                      </Form.Label>
                      <select
                        className="form-control"
                        name="villageOrCity"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.villageOrCity}
                      >
                        <option hidden>Select</option>
                        {villageList &&
                          villageList.map((item: any, i: number) => {
                            return (
                              <option key={i} value={item}>
                                {item}
                              </option>
                            )
                          })}
                      </select>
                    </Form.Group>
                  </Col>

                  <Col lg={3} md={3} xs={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        PIN Code <span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter PIN Code"
                        name="pinCode"
                        required={true}
                        onChange={principalBusinessChange}
                        value={principalBusiDetails.pinCode}
                      />
                    </Form.Group>
                  </Col>
                </Row>

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

                {IsOtherChecked && (
                  <div className="otherPlaceSec">
                    <div className="regFormBorder"></div>

                    <div className="formSectionTitle">
                      <h3>Other Place of Business</h3>
                    </div>

                    <div className="otherPlaceList">
                      {otherbusinessDetails.map((form, index) => {
                        return (
                          <Row className="otherDetailsList" key={index}>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Door No</Form.Label>
                                <input
                                  className="form-control"
                                  name="doorNo"
                                  placeholder="Enter Door No"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.doorNo}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Street</Form.Label>
                                <input
                                  className="form-control"
                                  name="street"
                                  placeholder="Enter Street"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.street}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>State</Form.Label>
                                <input
                                  className="form-control"
                                  name="state"
                                  placeholder="Enter State"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.state}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>District</Form.Label>
                                <input
                                  className="form-control"
                                  name="district"
                                  placeholder="Enter District"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.district}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Mandal</Form.Label>
                                <input
                                  className="form-control"
                                  name="mandal"
                                  placeholder="Enter Mandal"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.mandal}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Village/City</Form.Label>
                                <input
                                  className="form-control"
                                  name="villageOrCity"
                                  placeholder="Enter Village/City"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.villageOrCity}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Pin Code</Form.Label>
                                <input
                                  className="form-control"
                                  name="pinCode"
                                  placeholder="Enter Pin Code"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.pinCode}
                                />
                              </Form.Group>
                            </Col>
                            <Col lg={3} md={3} xs={12} className="mb-3">
                              <Form.Group>
                                <Form.Label>Registration District</Form.Label>
                                <input
                                  className="form-control"
                                  name="registrationDistrict"
                                  placeholder="Enter Registration District"
                                  onChange={(event: any) => otherDetailsChange(event, index)}
                                  value={form.registrationDistrict}
                                />
                              </Form.Group>
                            </Col>
                            {index != 0 && (
                              <div className="removeOther" onClick={() => removeFields(index)}>
                                Remove Row
                              </div>
                            )}
                          </Row>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {IsOtherChecked && (
                <div className="otherPlaceBtnSec">
                  <Row>
                    <Col lg={12} md={12} xs={12} className="mb-4">
                      <div className="addotherBtnInfo text-center">
                        <div onClick={addFields} className="btn btn-primary addPlace">
                          Add Other Place of Business
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* <PartnerDetails
                districtList={districtList}
                mandalList={mandalList}
                villageList={villageList}
                handlePartnerDetails={handlePartnerDetails}
                partnerNum={1}
              /> */}

              {/* <PartnerDetails
                districtList={districtList}
                mandalList={mandalList}
                villageList={villageList}
                handlePartnerDetails={handlePartnerDetails}
                partnerNum={2}
              /> */}

              {
                <div className="addedPartnerSec">
                  <div className="formSectionTitle mb-3">
                    <h3>Added Partner Details</h3>
                  </div>

                  <Row className="mb-4">
                    <Col lg={12} md={12} xs={12}>
                      <Table striped bordered className="tableData listData">
                        <thead>
                          <tr>
                            <th>Aadhaar Number</th>
                            <th>Partner Name</th>
                            <th>Partner SurName</th>
                            <th>Age</th>
                            <th>Joining Date</th>
                            <th>Role</th>
                            <th>Contact Number</th>
                            <th>Email ID</th>
                          </tr>
                        </thead>

                        {partnerDetails && partnerDetails.length ? (
                          <tbody>
                            {partnerDetails.map((item: any, i: number) => {
                              return (
                                <tr key={i + 1}>
                                  <td>
                                    <div className="aadhar">{item.aadharNumber}</div>
                                  </td>
                                  <td>{item.partnerName}</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td>{item.role}</td>
                                  <td>{item.mobileNumber}</td>
                                  <td>{item.email}</td>
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
                    </Col>
                  </Row>
                </div>
              }

              <div className="uploadFirmList mb-4">
                <Row>
                  <Col lg={12} md={12} xs={12}>
                    <h3>
                      Upload Firm Related Documents-(All Uploaded Documents should be in PDF format
                      only upto 5MB )
                    </h3>
                  </Col>
                </Row>

                <div className="firmFileStep1">
                  <Row>
                    <Col lg={4} md={4} xs={12}>
                      <div className="d-flex">
                        <div className="firmFileInfo">
                          <Form.Check
                            inline
                            label="Affidavit"
                            value="Affidavit"
                            name="affidavitcheck"
                            type="checkbox"
                            className="fom-checkbox"
                          />
                        </div>
                        <div className="firmFile">
                          <Form.Control
                            type="file"
                            name="affidavit"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={4} xs={12}>
                      <div className="d-flex ">
                        <div className="firmFileInfo">
                          <Form.Check
                            inline
                            label="Partnership Deed"
                            value="Partnership Deed"
                            name="partnership"
                            type="checkbox"
                            className="fom-checkbox"
                          />
                        </div>
                        <div className="firmFile">
                          <Form.Control
                            type="file"
                            name="partnershipDeed"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={4} xs={12}>
                      <div className="d-flex ">
                        <div className="firmFileInfo">
                          <Form.Check
                            inline
                            label="Lease Deed"
                            value="Lease Deed"
                            name="lease"
                            type="checkbox"
                            className="fom-checkbox"
                          />
                        </div>
                        <div className="firmFile">
                          <Form.Control
                            type="file"
                            name="form1EnglishTelugu"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="firmFileStep2">
                  <Row>
                    <Col lg={5} md={6} xs={12}>
                      <div className="d-flex">
                        <div className="firmFileInfo">
                          <Form.Check
                            inline
                            label="Self Signed Declaration "
                            value="Self Signed Declaration "
                            name="selfSigned "
                            type="checkbox"
                            className="fom-checkbox"
                          />
                        </div>
                        <div className="firmFile">
                          <Form.Control
                            type="file"
                            name="selfSignedDeclaration"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} md={4} xs={12}>
                      <div className="d-flex ">
                        <div className="firmFileInfo">
                          <Form.Check
                            inline
                            label="Other"
                            value="Other"
                            name="other"
                            type="checkbox"
                            className="fom-checkbox"
                          />
                        </div>
                        <div className="firmFile">
                          <Form.Control
                            type="file"
                            name="applicationForm"
                            ref={inputRef}
                            onChange={handleFileChange}
                            accept="application/pdf"
                          />
                        </div>
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
                        className="btn btn-primary showPayment"
                        name="btn1"
                        value="Show Payment"
                        type="submit"
                        onClick={() => setIsPayNowClicked(true)}
                      >
                        Pay now
                      </button>
                      <button
                        className="btn btn-primary saveDraft"
                        name="btn2"
                        value="Save as Draft"
                      >
                        Save as Draft
                      </button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Container>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Form1
