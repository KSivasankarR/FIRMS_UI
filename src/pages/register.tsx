import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Container, Row, Col, Accordion, Card } from "react-bootstrap"
import Login from "./login"
import { IADRSocietyDetailsModel, IAFirmDetailsLGModel } from "@/models/appTypes"
import styles from "@/styles/pages/Forms.module.scss"

const initialDetails: any = {
  registrationType: "firm",
}

const Register = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<number>(0)
  const tabs: string[] = ["Check List"]
  const renderTabHeaders = (): any => {
    return tabs.map((item: string, index: number) => {
      return (
        <div
          className={activeTab === index ? styles.activeTabHeaderlogin : styles.tabHeaderlogin}
          key={index}
          onClick={() => {
            setActiveTab(index)
          }}
        >
          {item}
        </div>
      )
    })
  }
  const [regFirm, setRegFirm] = useState<any>(initialDetails)
  const [isFirmReg, setIsFirmReg] = useState<boolean>(false)
  const [isSocietyReg, setIsSocietyReg] = useState<boolean>(false)
  const [isLogin, setISLogin] = useState<boolean>(false)
  const [isregType, setIsRegType] = useState<string>("firm")
  const [regClass, setRegClass] = useState<string>("")

  const [firmDetails, setFirmDetails] = useState<IAFirmDetailsLGModel>({
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

  const loginhandleChange = () => {
    setISLogin(true)
    setIsRegType(regFirm.registrationType)
  }

  return (
    <>
      <Head>
        <title>Registration of Firm</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {!isLogin && (
        <div className={`${regClass} logiRegMainSec regAccordionSec`}>
          <div className="societyRegSec">
            <Container fluid>
              <div className="regMainFitSec">
                <div className="regContainerSec">
                  <div className="regSecCon">
                    <Row>
                      <Col lg={6} md={12} xs={12} className="mainColCon">
                        <div className="homepageTitle">
                          <h3><u>Check List</u></h3>
                        </div>

                        <div className="dashboardRegSec">
                          {/* {activeTab === 0 &&
                          <div className="dashboardInfologin">
                            <h6>Firm registration</h6>
                            <ul>
                              <li>
                                The user has to submit an online application by providing the
                                required details and upload required documents (as shown in
                                checklist).
                              </li>
                              <li>
                                The user then has to make requisite payment through the online
                                portal.
                              </li>
                              <li>
                                The user then has to send the original documents to District
                                Registrar Office, either through couriers/RPAD or by dropping
                                them at the drop-box located at the District Registrar office.
                              </li>
                            </ul>

                            <div className="">
                              <h6>Procedure at the District Registrar Office</h6>
                            </div>

                            <div className="">
                              <h6>Sr. Assistant Level:</h6>
                              <ul>
                                <li>
                                  The documents (Form I, Partnership Deed, ID proof of Partners)
                                  received at the Office of District Registrar will be verified
                                  by Senior Assistant against the details provided in the online
                                  application.
                                </li>

                                <li>
                                  Upon successful verification, a recommendation for approval is
                                  made to District Registrar.
                                </li>

                                <li>
                                  In case of verification being unsuccessful, the applicant will
                                  be directed to make necessary changes to the application.
                                </li>
                              </ul>
                            </div>
                          </div>
                        } */}
                          {activeTab === 0 && (
                            <div className="dashboardInfologin">
                              <h6>District Registrar Level:</h6>
                              <ul>
                                <li>
                                  Based on the recommendation provided by Sr. Assistant, District
                                  Registrar approves the registration.
                                </li>

                                <li>
                                  With the approval, the District Registrar also digitally signs the
                                  registration certificate.
                                </li>

                                <li>
                                  In case of verification being unsuccessful, the applicant will be
                                  directed to make necessary changes to the application.
                                </li>
                              </ul>

                              <div className="panelDesc">
                                <div className="mb-3">
                                  <h6>
                                    After submitting online application of Firm, the following
                                    documents shall be submitted in
                                  </h6>
                                  <ol>
                                    <li> Form I in original</li>
                                    <li>Partnership Deed copy</li>
                                    <li>ID Proof of partners</li>
                                  </ol>
                                </div>

                                <p>
                                  Citizen must submit papers either by courier/RPAD or handover in
                                  person in the concerned District Registrar Office quoting online
                                  application reference number.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6} md={12} xs={12}>
                          <div className="homepageTitle mt-5 pt-5">
                            <h3><u>Registration of Partnership Firm</u></h3>
                          </div>
                  
                        <div className="regTypeFieldSec">
                          {/* <div className="mainPageImg mt-5 pt-3">
                          <img
                            src="/firmsHome/assets/home-firms-img.jpg"
                            alt="home-firms-img.jpg"
                          />
                        </div> */}
                          <div className="firmSubmitSec">
                            <Row style={{ alignItems: "center", justifyContent: "center" }}>
                              <Col lg={12} md={6} xs={6}>
                                <div className="homeLoginBtn">
                                  <a href="/firmsHome/login" className="btn btn-primary login">
                                    Login
                                  </a>

                                  <a
                                    href="/firmsHome/firmRegistration"
                                    className="btn btn-primary login"
                                  >
                                    Register
                                  </a>
                                </div>

                              </Col>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  {/* <div className={styles.tabContainer} id="tabDiv">
                        {renderTabHeaders()}
                      </div> */}
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}
      {isLogin && (
        <div className={`${regClass} logiRegMainSec`}>
          <div className="societyRegSec">
            <Container>
              <div className="regContainerSec">
                <Login isregType={isregType} setIsRegType={setIsRegType} setISLogin={setISLogin} />
              </div>
            </Container>
          </div>
        </div>
      )}
    </>
  )
}

export default Register
