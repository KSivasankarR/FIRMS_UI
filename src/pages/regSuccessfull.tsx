import { useState } from "react"
import Head from "next/head"
import { Container } from "react-bootstrap"

const RegistrationSuccessFull = () => {
  const [loginDetails, setLoginDetails] = useState<any>({
    otp: "",
  })

  const loginDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setLoginDetails(newInput)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
  }

  return (
    <>
      <Head>
        <title>Successfully Completed Registration! - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className="logiRegMainSec">
        <div className="societyRegSec">
          <Container>
            <div className="regFieldsMain text-center">
              <div className="successImg mb-4">
                <img src="/firmsHome/assets/successful-reg.svg" />
              </div>

              <div className="formSectionTitle">
                <h3>Successfully Completed Registration!</h3>
              </div>

              <div className="verifyMail">
                <p>
                  Please verify your mail, unique reference id and password is send through mail.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default RegistrationSuccessFull
