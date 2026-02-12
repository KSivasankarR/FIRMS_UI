export interface IApplicantDetailsModel {
  aadhaarNumber: string
  applicantName: string
  surName: string
  relationType: string
  relation: string
  gender: string
  role: string
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  otpCode: string
  otpStatus: string
}

export interface IContactDetailsModel {
  landPhoneNumber: string
  mobileNumber: string
  email: string
  fieldName?: string
}

export interface IFirmDetailsModel {
  firmName: string
  firmDurationFrom: string
  firmDurationTo: string
  industryType: string
  businessType: string
  atWill?: boolean
}

export interface IBusinessDetailsModel {
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

export interface IPartnerDetailsModel {
  aadharNumber: string
  partnerName: string
  partnerSurname: string
  age: string
  relationType: string
  relation: string
  gender: string
  role: string
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  landPhoneNumber: string
  mobileNumber: string
  email: string
  otpCode: string
  otpStatus: string
}

export interface IApplicantDetailsForm1Model {
  maskedAadhar: string
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
  address: string
}

export interface IOtherBusinessForm1DetailsModel {
  doorNo: string
  street: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
}

export interface ISelectedPartnerDetailsModel {
  maskedAadhar: string
  aadharNumber: string
  applicantName: string
  surName: string
  relationType: string
  relation: string
  gender: string
  age: string
  role: string
  address: string
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
  newShare?: string
  _id?: string
}

export interface IFirmInDetailsModel extends IFirmDetailsModel {
  firmType: string
  principalBusinessFields: any
  otherAddressList: any
  district: string
  status?: string
  paymentDetails?: any
  paymentStatus?: string
  principalPlaceBusiness?: any
  firmPartners?: any
  otherPlaceBusiness?: any
  processingHistory?:any
}

export interface IOtherBusinessForm2DetailsModel {
  doorNo: string
  street: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  disabled?: boolean
  AddNew?: boolean
  role?: any
}

export interface IFirmPartnerDetailsModel {
  doorNo: string
  street: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  role: string
  disabled: boolean
  AddNew: boolean
  address: string
}

export interface IApplicantDetailsForm2Model {
  maskedAadhar: string
  name: string
  aadharNumber: string
  applicantName: string
  spoof: string
  relation: string
  relationType: string
  role: string
  otp: string
  OTPResponse: { transactionNumber: string }
  KYCResponse: any
  doorNo: string
  street: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  deliveryType: string
  gender: string
  surName?: string
  age?: string
  address: string
}

export interface IPrincipleForm2BusinessDetails {
  doorNo: string
  street: string
  country: string
  state: string
  district: string
  mandal: string
  villageOrCity: string
  pinCode: string
  fieldName: string
  type: string
  newPlaceEffectDate?: string
}

export interface IFirmNameChangeModel {
  newFirmName: string
  newNameEffectDate: string
}

export interface IExistingPartnerDetailsModel {
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
  address: string
}

export interface ICheckListDetailsModel {  
  isPartnershipDeedDoc?: boolean
  isAffidvitOrLeaseAgreementDoc: boolean,
  isSelfSignDeclarationDoc: boolean,
  isForm1DigitalSignDoc: boolean

}
