import CryptoJS from "crypto-js"

export const encryptWithAES = (text: any) => {
  return CryptoJS.AES.encrypt(text, "!Gr$@PdEApP&").toString()
}

export const NameValidation = (text: string) => {
  text = text.replace(/[^\w\s]/gi, "")
  text = text.replace(/[0-9]/gi, "")
  text = text.replace(/[_]/gi, "")
  if (text.length > 200) {
    text = text.substring(0, 200)
  }
  return text
}

export const FirmNameValidation = (text: string) => {
  if (text.length > 200) {
    text = text.substring(0, 200)
  }
  return text
}
