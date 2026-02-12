import { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Row, Col, Form } from "react-bootstrap"
import { useRouter } from "next/router"
import { IADRFirmDetailsModel, IADRSocietyDetailsModel } from "@/models/appTypes"
import { ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"

const initialDetails: any = {
  registrationType: "firm",
}

const DrDashboard = () => {
  const router = useRouter()

  const [regFirm, setRegFirm] = useState<any>(initialDetails)
  const [isFirmReg, setIsFirmReg] = useState<boolean>(false)
  const [isSocietyReg, setIsSocietyReg] = useState<boolean>(false)
  const [isLogin, setISLogin] = useState<boolean>(false)
  const [isregType, setIsRegType] = useState<string>("firm")
  const [regClass, setRegClass] = useState<string>("")

  const [firmDetails, setFirmDetails] = useState<IADRFirmDetailsModel>({
    firmName: "",
    district: "",
    firstName: "",
    lastName: "",
    emailID: "",
    alternameEmailID: "",
    aadharNumber: "",
    mobileNumber: "",
    relationwithFirm: "",
  })

  const [societyDetails, setSocietyDetails] = useState<IADRSocietyDetailsModel>({
    societyName: "",
    district: "",
    firstName: "",
    lastName: "",
    emailID: "",
    alternameEmailID: "",
    aadharNumber: "",
    mobileNumber: "",
    relationwithFirm: "",
  })

  const onChange = (e: any) => {
    let addName = e.target.name
    let addValue = e.target.value
    setRegFirm({ ...regFirm, [addName]: addValue })
  }

  const firmDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setFirmDetails(newInput)
  }

  const societyDetailsChange = (e: any) => {
    const newInput = (data: any) => ({ ...data, [e.target.name]: e.target.value })
    setSocietyDetails(newInput)
  }

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  const loginhandleChange = () => {
    if (regFirm.registrationType == "firm") {
      router.push("/firms")
    } else {
      router.push("/societies")
    }
  }
  return (
    <>
      <Head>
        <title>Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <div className={`${regClass} logiRegMainSec`}>
        <div className="societyRegSec">
          <Container>
            <div className="regContainerSec">
              {!isLogin && (
                <div className="regTypeFieldSec">
                  <div className="regTypeBtns">
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <div className="firmRegList formsec">
                          <Form.Check
                            inline
                            label="Registration of Firms"
                            value="firm"
                            name="registrationType"
                            type="radio"
                            className="fom-checkbox"
                            onChange={onChange}
                            checked={regFirm.registrationType == "firm"}
                          />
                          <Form.Check
                            inline
                            label="Registration of Societies"
                            value="society"
                            name="registrationType"
                            type="radio"
                            className="fom-checkbox"
                            onChange={onChange}
                            checked={regFirm.registrationType == "society"}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="firmSubmitSec">
                    <Row>
                      <Col lg={12} md={12} xs={12} className="text-center">
                        <button onClick={loginhandleChange} className="btn btn-primary login">
                          Submit
                        </button>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default DrDashboard
