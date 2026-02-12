export interface IAadharNumberDetails {
  type?: string
  aadharNumber: string
  otp: string
  OTPResponse: { transactionNumber: string }
  KYCResponse: any
}
