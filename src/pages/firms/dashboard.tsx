import React, { useEffect, useState } from "react"
import Head from "next/head"
import { Container, Row, Col, Accordion, Modal, Button } from "react-bootstrap"
import { useRouter } from "next/router"
import { useAppDispatch } from "@/redux/hooks"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import CryptoJS from "crypto-js"

const FirmDashboard = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loginDetails, setLoginDetails] = useState<any>({})
  const [showform1Modal, setShowform1Modal] = useState(false)
  const [showform2Modal, setShowform2Modal] = useState(false)
  const [showform3Modal, setShowform3Modal] = useState(false);
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);
  const handleOnClick = () => setHovered(!hovered);

  useEffect(() => {
    localStorage.removeItem("PaymentDone")
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data && data.token) {
      setLoginDetails(data)
    }
    if (KeepLoggedIn()) {
    }
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  const redirectToPage = (location: string) => {
    router.push({
      pathname: location,
    })
  }

  
      


  return (
    <>
      <Head>
        <title>Registration of New Firms</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {loginDetails && loginDetails?.userType && loginDetails?.userType == "user" && (
        <div className="societyRegSec mt-0">  
        <div className="dashboardRegSec">
         <div className="firmHomeSec">
              <div className="publicDataSec">
                <div className="publicdataCol">
                  <div className={hovered ? 'hover publicDataInfo publicDataInfoCon' : 'publicDataInfo publicDataInfoCon'}
                    onMouseEnter={toggleHover}
                    onMouseLeave={toggleHover}
                    onClick={handleOnClick}>
                    <div className="publicDataImg publicDatasidebarImg"><img className="normalImg regNormalImg sidebarImg" src="/firmsHome/services/serv_1_blue.png" title="Firm Registration" alt="service-ease-of.png" />
                    <img className="hoverImg reghoverNormalImg sidebarhoverImg" src="/firmsHome/services/serv_1_white.png" title="Firm Registration" alt="service-ease-of.png" /> <h6>Firm Registration <span>Fee - <strong>500/-</strong></span></h6></div>
                  </div>
                </div>
              </div>

                <div className="publicDataSec">
                <div className="publicdataCol">
                  <div className={hovered ? 'hover publicDataInfo publicDataInfoCon' : 'publicDataInfo publicDataInfoCon'}
                    onMouseEnter={toggleHover}
                    onMouseLeave={toggleHover}
                    onClick={handleOnClick}>
                    <div className="publicDataImg publicDatasidebarImg"><img className="normalImg regNormalImg sidebarImg" src="/firmsHome/services/serv_2_blue.png" title="Address Change Request" alt="service-ease-of.png" />
                    <img className="hoverImg reghoverNormalImg sidebarhoverImg" src="/firmsHome/services/serv_2_white.png" title="Address Change Request" alt="service-ease-of.png" /> <h6>Address Change Request <span>Fee - <strong>100/-</strong> (per person)</span></h6></div>
                  </div>
                </div>
              </div>

                <div className="publicDataSec">
                <div className="publicdataCol">
                  <div className={hovered ? 'hover publicDataInfo publicDataInfoCon' : 'publicDataInfo publicDataInfoCon'}
                    onMouseEnter={toggleHover}
                    onMouseLeave={toggleHover}
                    onClick={handleOnClick}>
                    <div className="publicDataImg publicDatasidebarImg"><img className="normalImg regNormalImg sidebarImg" src="/firmsHome/services/serv_3_blue.png" title="Reconstitution of Firm" alt="service-ease-of.png" />
                    <img className="hoverImg reghoverNormalImg sidebarhoverImg" src="/firmsHome/services/serv_3_white.png" title="Reconstitution of Firm" alt="service-ease-of.png" /><h6>Reconstitution of Firm <span>Fee - <strong>300/-</strong></span></h6></div>
                  </div>
                </div>
              </div>

              <div className="publicDataSec">
                <div className="publicdataCol">
                  <div className={hovered ? 'hover publicDataInfo publicDataInfoCon' : 'publicDataInfo publicDataInfoCon'}
                    onMouseEnter={toggleHover}
                    onMouseLeave={toggleHover}
                    onClick={handleOnClick}>
                    <div className="publicDataImg publicDatasidebarImg"><img className="normalImg regNormalImg sidebarImg" src="/firmsHome/services/serv_4_blue.png" title="Certified Copy of Firm" alt="service-ease-of.png" />
                      <img className="hoverImg reghoverNormalImg sidebarImg sidebarhoverImg" src="/firmsHome/services/serv_4_white.png" title="Certified Copy of Firm" alt="service-ease-of.png" /><h6>Certified Copy of Firm <span>Fee - <strong>300/-</strong></span></h6></div>
                  </div>
                </div>
              </div>
            </div>
            </div>
        </div>
      )}
      {(!loginDetails?.userType || loginDetails?.userType != "user") && (
        <div className="societyRegSec">
          <Container>
            <Row>
              <Col lg={9} md={12} xs={12}>
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
      <Modal
        show={showform1Modal}
        onHide={() => {
          setShowform1Modal(false)
        }}
        style={{ paddingTop: "100px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>CheckList</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <ul>
            <li>
              <p> Aadhaar Numbers of All Partners</p>
            </li>
            <li>
              <p> Partnership Deed</p>
            </li>
            <li>
              <p> Lease Agreement or Affidavit</p>
            </li>
            <li>
              <p> Self Signed Declaration</p>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ alignItems: "flex-end" }}>
            <Button
              variant="primary"
              onClick={() => {
                router.push("/firms/form1")
              }}
            >
              Proceed
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowform1Modal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showform2Modal}
        onHide={() => {
          setShowform2Modal(false)
        }}
        style={{ paddingTop: "100px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>CheckList</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <ul>
            <li>
              <p> Aadhaar Numbers of All Partners</p>
            </li>
            <li>
              <p> Partnership Deed</p>
            </li>
            <li>
              <p> Lease Agreement or Affidavit</p>
            </li>
            <li>
              <p> Self Signed Declaration</p>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ alignItems: "flex-end" }}>
            <Button
              variant="primary"
              onClick={() => {
                router.push("/firms/form2")
              }}
            >
              Proceed
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowform2Modal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showform3Modal}
        onHide={() => {
          setShowform3Modal(false)
        }}
        style={{ paddingTop: "100px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>CheckList</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          <ul>
            <li>
              <p> Aadhaar Numbers of All Partners</p>
            </li>
            <li>
              <p> Partnership Deed</p>
            </li>
            <li>
              <p> Lease Agreement or Affidavit</p>
            </li>
            <li>
              <p> Self Signed Declaration</p>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ alignItems: "flex-end" }}>
            <Button
              variant="primary"
              onClick={() => {
                router.push("/firms/form3")
              }}
            >
              Proceed
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setShowform3Modal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>



      <div className="latestMainSec">
        <Container fluid>
          <div className="publicDataSec">
            <Row>
              <Col lg={8} md={6} xs={12}>
              <Row>
              <Col lg={12} md={12} xs={12}>
                <div className="justify-content-between page-title mb-2">
                  <div className="pageTitleLeft">
                    <h1 className="mt-0"><u>Registration of New Firms</u></h1>
                  </div>
                </div>
              </Col>
            </Row>
                <Row>
                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverCon mb-1 pb-1">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg regNormalImg regformImg " src="/firmsHome/services/service_1_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg reghoverNormalImg" src="/firmsHome/services/service_1_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Registration of New Firm (Online Application Form)</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                          <div className="panelDesc">
                            <p>
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setShowform1Modal(true)
                                }}
                              >
                                <strong>Click here for Online Application Form</strong>
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>


                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverCon mb-1 pb-1">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg" src="/firmsHome/services/service_2_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg" src="/firmsHome/services/service_2_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Status of Application</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                         <div className="panelDesc">
                          <p>
                            <a href="/firmsHome/firms">
                              <strong>Click here for Status of Application Form</strong>
                            </a>
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Col>


                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverCon mb-1 pb-1">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg" src="/firmsHome/services/service_3_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg" src="/firmsHome/services/service_3_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Download of Registration Certificate</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                          <div className="panelDesc">
                          <p>
                            <a href="/firmsHome/firms/downloadCertificate">
                              <strong>Click here to Download Certificate</strong>
                            </a>
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverInfo">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg" src="/firmsHome/services/service_4_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg" src="/firmsHome/services/service_4_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Reconstitution of Firm</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                         <div className="panelDesc">
                          <p>
                            <a
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShowform3Modal(true)
                              }}
                            >
                              <strong>Click here for Reconstitution of Firm</strong>
                            </a>
                          </p>

                          <p>
                            <strong>Description :</strong> This service is available to any firm
                            which wants to add/delete partners. Required document is uploaded and
                            department after verification can approve or reject the request.
                          </p>

                          <h6>Documents Needed :</h6>

                          <div className="mb-3">
                            <ol>
                              <li>Online Application</li>
                              <li>
                                The firm shall submit the original acknowledgment, statutory form,
                                partnership deed effecting reconstitution of firm through
                                courier/RPAD or in person to the Registrar of Firms concerned. The
                                approval shall be given within 3 working days from the time of
                                receipt of original papers, if every thing is in order.
                              </li>
                            </ol>
                          </div>

                          <p>
                            Approval Authority :Registrar of Firms & District Registrar Concerned
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverInfo">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg" src="/firmsHome/services/service_5_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg" src="/firmsHome/services/service_5_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Certified Copy of Registration Certificate</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                          <div className="panelDesc">
                          <p>
                            <a href="/firmsHome/firms/downloadByLawCertificate">
                              <strong>Click here for the link</strong>
                            </a>
                          </p>

                          <p>
                            <strong>Description :</strong> This service is available when citizen
                            wants a copy of registration certificate of registered firm. After
                            registration of Firm, original Certificate of Registration is delivered
                            to the firm. Later, anybody can request for certified copy.
                          </p>

                          <h6>Required Documents :</h6>

                          <p>Online Applicant</p>

                          <p>
                            <strong>Service Delivery :</strong> Download Online
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col lg={4} md={3} xs={12} className="publicdataCol publicdataHoverInfo">
                    <div className={hovered ? 'hover publicDataInfo' : 'publicDataInfo'}
                      onMouseEnter={toggleHover}
                      onMouseLeave={toggleHover}
                      onClick={handleOnClick}>
                      <div className="publicDataImg"><img className="normalImg" src="/firmsHome/services/service_6_blue.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /><img className="hoverImg" src="/firmsHome/services/service_6_white.png" title="Registration of New Firm (Online Application Form)" alt="service-ease-of.png" /></div>
                      <div className="publicDataDetails">
                        <h5>Address Change Request</h5>
                        <div className="publicHoverIcon"><img src="/firmsHome/services/public-data-arrow.png" alt="" /></div>
                        <div className='publicHoverList'>
                           <div className="panelDesc">
                          <p>
                            <strong>
                              <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setShowform2Modal(true)
                                }}
                              >
                                Click here for Alteration In Firm
                              </a>
                            </strong>
                          </p>

                          <p>
                            <strong>Description : </strong> This service can be availed by any Firm
                            which wants to change/add/delete a business premises, godown, branch
                            office etc. Required document is uploaded and originals are submitted in
                            DR Office concerned. Department after verification can approve or reject
                            the request.
                          </p>

                          <h6>Documents Needed :</h6>

                          <div className="mb-3">
                            <ol>
                              <li>Online Application</li>

                              <li>
                                The firm shall submit the original acknowledgment and statutory form
                                through courier/RPAD or in person to the Registrar of Firms
                                concerned. The approval shall be given within 3 working days from
                                the time of receipt of original papers, if everything is in order.
                              </li>
                            </ol>
                          </div>

                          <p>
                            Approval Authority :Registrar of Firms & District Registrar concerned
                          </p>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Col>

                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      
    </>

   
  )
}

export default FirmDashboard
