import { DateFormator, HandleLogout } from "@/GenericFunctions"
import api from "@/redux/api"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { saveLoginDetails } from "@/redux/loginSlice"
import styles from "@/styles/components/header.module.scss"
import CryptoJS from "crypto-js"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button, Col, Container, Nav, NavDropdown, Navbar, Row, Modal } from "react-bootstrap"
import { FiLogOut } from "react-icons/fi"

const Header = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [SelectedformTypekey, setSelectedformTypekey] = useState<number>(1)
  let initialLoginDetails = useAppSelector((state) => state.login.loginDetails)
  const [isAuthenticated, setIsAuthenticated] = useState<any>(null)
  const [savedLoginDetails, setSavedLoginDetails] = useState<any>(null)
  const [LoginDetails, setLoginDetails] = useState<any>(initialLoginDetails)
  const [userType, setUserType] = useState<string>("")
  const [lastLoginIn, setLastLoginIn] = useState<any>("")

  const popupState = () => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (!data || data == null || data == "") {
      router.push("/")
    }
  }

  useEffect(() => {
    window.addEventListener("popstate", () => {
      popupState()
    })
    return () => {
      window.removeEventListener("popstate", () => {
        popupState()
      })
    }
  }, [])

  useEffect(() => {
    setLoginDetails(initialLoginDetails)
  }, [initialLoginDetails])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setSavedLoginDetails(data)
    if (data) {
      api
        .get("/getRefreshToken", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data?.token}`,
          },
        })
        .then((res: any) => { })
        .catch((err: any) => {
          HandleLogout()
        })
      setUserType(data.userType)
      if (data.lastLogin) {
        let myDate = DateFormator(data.lastLogin, "dd/mm/yyyy")
        let myTime = new Date(data.lastLogin).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
        setLastLoginIn(`${myDate} ${myTime}`)
      }
    } else {
      setLastLoginIn("")
    }
    RefreshToken()
  }, [initialLoginDetails])

  const RefreshToken = () => {
    setInterval(() => {
      let data: any = localStorage.getItem("FASPLoginDetails")
      if (data && data != "" && process.env.SECRET_KEY) {
        let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
        data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        if (data) {
          api
            .get("/getRefreshToken", {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${data.token}`,
              },
            })
            .then((res: any) => { })
            .catch((err: any) => {
              HandleLogout()
            })
        }
      }
    }, 3660000)
  }

  const OnLogout = () => {
    const resetLoginDetails = {
      firstName: "",
      lastName: "",
      email: "",
      alternateEmail: "",
      mobileNumber: "",
      aadharNumber: "",
      registrationType: "",
      status: "",
      applicationId: "",
      applicationNumber: "",
      userType: "",
    }
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      if (data?.token) {
        let mytoken = { headers: { Authorization: `Bearer ${data.token}` } }
        api
          .get("/logout", mytoken)
          .then((res: any) => {
            dispatch(saveLoginDetails(resetLoginDetails))
            setSavedLoginDetails(resetLoginDetails)
            localStorage.clear()
            router.push("/")
            setShowLogoutModal(false)
          })
          .catch((e: any) => {
            console.log(e.message)
            return {
              status: false,
              message: e?.response?.data,
            }
          })
      }
    }
  }

  return (
    <header className={styles.header_body}>
      <div className={`headerMainSec ${styles.header_main}`}>
        <Container fluid>
          <Row className="d-flex align-items-center">
            <Col lg={3} md={4} xs={12} className={styles.header_main_left}>
              <div className="d-flex align-items-center">
                <div className={`cm-img ${styles.left_img}`}><img src="/firmsHome/assets/cm_img.svg" title="Sri. Nara Chandrababu Naidu" alt="Sri. Nara Chandrababu Naidu" className={styles.cmImg} /></div>
                <div className={styles.header_main_left_cminfo}>
                  <h4>Sri. Nara Chandrababu Naidu</h4>
                  <h6>Hon'ble Chief Minister <br />Andhra Pradesh</h6>
                  {/* <h6>Hon'ble Minister for Revenue, <br />Registration & Stamps</h6> */}
                </div>
              </div>
            </Col>

            <Col lg={6} md={4} xs={12} className={styles.header_main_middle}>

              <div className="d-flex align-items-center justify-content-center">

                <Image alt='' width={50}
                  height={55} src="/firmsHome/assets/aplogoimg.png" />

                <div className={`${styles.leftHeadingContainer} ${styles.MiddleContainer}`}>

                  <div className={` ${styles.textContainer} ${styles.RegtextContainer}`}>

                    <text className={`${styles.titleText} ${styles.govtitleText}`}>REGISTRATION & STAMPS DEPARTMENT</text>

                    <text className={`${styles.infoText} ${styles.govText}`}>GOVERNMENT OF ANDHRA PRADESH</text>

                  </div>

                </div>

              </div>

            </Col>

            <Col lg={3} md={4} xs={12} className={styles.header_main_right}>
            <div className={`d-flex align-items-center justify-content-end ${styles.header_main_rightInfo}`}>
                        <div className={`cm-img ${styles.right_img}`}><img src="/firmsHome/assets/minister_img.svg" title="Sri.Anagani Satya Prasad" alt="Sri.Anagani Satya Prasad" /></div>
                        <div className={styles.header_main_left_cminfo}>
                          <h4>Sri. Anagani Satya Prasad</h4>
                          <h6>Hon'ble Minister for Revenue, <br />Registration & Stamps</h6>
                        </div>
                      </div>
            </Col>
          </Row>

          <div className={`headerInfoSec ${styles.InfoBarContainer}`}>
            <Row className="align-items-center">
              <Col lg={4} md={4} xs={12}>
                <div className={styles.InfoTextContainer}>
                  <div className={styles.phoneText}>
                    <Image alt="phone" width={16} height={20} src="/firmsHome/assets/icon-phone.svg" />
                    <text className={styles.InfoBarText}>+91 9121106359</text>
                  </div>
                  <div className={styles.mailText}>
                    <Image alt="emial" width={16} height={20} src="/firmsHome/assets/icon-email.svg" />
                    <text className={styles.InfoBarText}>helpdesk-it@igrs.ap.gov.in</text>
                  </div>
                </div>
              </Col>

              <Col lg={4} md={4} xs={12} className="text-center appMainTitle">
                <h2>Firms Registration System</h2>
              </Col>

              <Col lg={4} md={4} xs={12} className="text-end" />
            </Row>
          </div>
        </Container>

        <div className={styles.Mainpage_Navbar}>
          <div className="mx-2">

            {savedLoginDetails && userType != "dept" && (
              <a href="/firmsHome/firms/dashboard">
                <Image alt="phone" width={25} height={22} src="/firmsHome/assets/home-icon.svg" style={{ cursor: "pointer" }} />
              </a>
            )}


            {savedLoginDetails && userType == "dept" && (
              <>
               {savedLoginDetails.isPasswordChanged === true &&
              <a href="/firmsHome/reports">
                <Image alt="phone" width={25} height={22} src="/firmsHome/assets/home-icon.svg" style={{ cursor: "pointer" }} />
              </a>}
              </>
            )}

            {!savedLoginDetails && (
              <a href="/firmsHome/">
                <Image alt="phone" width={25} height={22} src="/firmsHome/assets/home-icon.svg" style={{ cursor: "pointer" }} />
              </a>
            )}</div>
          <div className={styles.FormBtn}>
            <div className="pageTitleRight d-flex justify-content-end">
              {!savedLoginDetails && (
                <Button
                  className="btn btn-primary logoutbtn department"
                  onClick={() => router.push("/departmentLogin")}
                >
                  Department Login
                </Button>
              )}

              {lastLoginIn && (
                <div className={`headerInfoSec ${styles.InfoBarContainer}`}>
                  <Row className="align-items-end mx-3">
                    <Col lg={12} md={12} xs={12} className="text-end appMainTitle">
                      <div className={styles.header_main_left_cminfo}>
                        <h6 style={{ fontWeight: 600, color: "#ffffff" }}>{`Last Logged On: ${lastLoginIn}`}</h6>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* {savedLoginDetails && userType == "dept" && (
                <Navbar id="myaccountNav">
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                      <Nav.Link href="/firms" id="myAccount">
                        Registrations
                      </Nav.Link>
                      <Nav.Link href="/reports" id="myAccount">
                        Reports
                      </Nav.Link>
                      <NavDropdown
                        title="My Account"
                        id="myAccount"
                        renderMenuOnMount={true}
                        align={{ lg: "end", md: "end" }}
                      >
                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/changePassword">Change Password</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
              )} */}
              {savedLoginDetails && userType == "user" && (
                <button onClick={() => setShowLogoutModal(true)} className="btn btn-primary logoutbtn">
                  <FiLogOut className="LogoutIcon" height={50} width={50} />
                  Logout
                </button>
              )}
              {savedLoginDetails && userType == "dept" && (

                <Navbar id="myaccountNav" className={styles.nav} >

                  <Navbar.Collapse id="basic-navbar-nav" >

                    {/* <Nav className="me-auto"> */}



                    <NavDropdown



                      title={savedLoginDetails.userName}

                      renderMenuOnMount={true}

                      align={{ lg: "end", md: "end" }}

                    >

                      <NavDropdown.Item href="/firmsHome/profile" className={styles.navdropdown} style={{ display: "flex" }}><div style={{ marginRight: "8px" }}><Image alt="" width={13} height={13} src="/firmsHome/assets/User.svg" /></div>Profile</NavDropdown.Item>

                      <NavDropdown.Item href="/firmsHome/changePassword" className={styles.navdropdown} style={{ display: "flex", width: "172px" }}>

                        <div style={{ marginRight: "8px" }}><Image alt="" style={{ color: "#333333" }} width={15} height={15} src="/firmsHome/assets/Change-Password.svg" /></div>Change Password</NavDropdown.Item>

                      <NavDropdown.Item className={styles.navdropdown} onClick={() => { setShowLogoutModal(true) }} style={{ display: "flex" }}>

                        <div style={{ marginRight: "8px" }}><Image alt="" width={15} height={15} src="/firmsHome/assets/Logout.svg" /></div>

                        Logout</NavDropdown.Item>



                    </NavDropdown>

                    {/* </Nav> */}

                  </Navbar.Collapse>

                </Navbar>

              )}
              <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} style={{ paddingTop: "8%" }}>

                <Modal.Header closeButton>

                  <Modal.Title style={{ paddingLeft: "35%" }}>

                    Confirmation

                  </Modal.Title>

                </Modal.Header>

                <Modal.Body className="text-center py-20">

                  Are You Sure You Want to Logout?

                </Modal.Body>

                <Modal.Footer style={{ justifyContent: "center" }}>



                  {/* <div > */}

                  <Button variant="primary" onClick={() => OnLogout()}>

                    Yes

                  </Button>

                  <Button variant="secondary" className="ms-2" onClick={() => { setShowLogoutModal(false) }}>

                    No

                  </Button>

                  {/* </div> */}



                </Modal.Footer>

              </Modal>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
