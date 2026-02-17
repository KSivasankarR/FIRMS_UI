export interface IAChangePasswordDetailsModel {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface IAApplicantDetailsModel {
  aadharNumber: string
  firstName: string
  surName: string
  relationType: string
  relation: string
  gender: string
  age: string
  role: string
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  otpCode: string
  otpStatus: string
  otp: string
  OTPResponse: { transactionNumber: string }
  KYCResponse: any
  name: string
  select: string
  ApplicantID:string
  nameOfFirm:string
  legacyAadharNumber:string
  registrationNumber:string
  registrationYear:string
  address: string
}

export interface IAContactDetailsModel {
  landPhoneNumber: string
  mobileNumber: string
  email: string
  fieldName?: string
}

export interface IAFirmDetailsModel {
  firmName: string
  firmDurationFrom: string
  firmDurationTo: string
  industryType: string
  businessType: string
  atWill?: boolean
}

export interface IABusinessDetailsModel {
  doorNo: string
  street: string
  country: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  registrationDistrict: string
  branch: string
  type?: string
}

export interface IAPartnerDetailsModel {
  aadharNumber: string
  applicantName: string
  surName: string
  relationType: string
  relation: string
  gender: string
  age: string
  role: string
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  otpCode: string
  otpStatus: string
  otp: string
  OTPResponse: { transactionNumber: string }
  KYCResponse: any
  partnerName: string
  landPhoneNumber: string
  mobileNumber: string
  email: string
  share: string
  joiningDate: string
}

export interface IAOtherBusinessDetailsModel {
  doorNo: string
  street: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
}

export interface IAFirmAdditionalDetailsModel extends IAFirmDetailsModel {
  firmType: string
  principalBusinessFields: any
  otherAddressList: any
  district: string
}

export interface IAAdditionalDetailsModel {
  submissionResponse: string
  registrationNumber: string
  applicationProcessedDate: string
  registrationYear: string
}

export interface IADepartmentLoginCredentialsModel {
  userNameOrEmail: string
  password: string
}

export interface IADRFirmDetailsModel {
  firmName: string
  district: string
  firstName: string
  lastName: string
  emailID: string
  alternameEmailID: string
  aadharNumber: string
  mobileNumber: string
  relationwithFirm: string
}

export interface IADRSocietyDetailsModel {
  societyName: string
  district: string
  firstName: string
  lastName: string
  emailID: string
  alternameEmailID: string
  aadharNumber: string
  mobileNumber: string
  relationwithFirm: string
}

export interface IALoginDetailsModel {
  registrationType: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  aadharNumber: string
  firmName: string
  alternateEmail: string
  district: string
  maskedAadhar: string
}

export interface IALoginDetailsSMModel {
  aadharNumber: string
  registrationType: string
  maskedAadhar: string
}

export interface IALoginCredentialsModel {
  fullName: string
  mobileNumber: string
  signature: string
}

export interface IAFirmDetailsLGModel {
  firmName: string
  district: string
  firstName: string
  lastName: string
  emailID: string
  alternameEmailID: string
  aadharNumber: string
  mobileNumber: string
  relationwithFirm: string
}

export interface IAPartnerDetailsMDModel {
  aadharNumber: string
  applicantName: string
  spoof: string
  relationName: string
  role: string
  deliveryType: string
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  landPhoneNumber: string
  mobileNo: string
  fax: string
  emailID: string
}
