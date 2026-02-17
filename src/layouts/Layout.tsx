import { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Container, Col, Row } from "react-bootstrap"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"

export default function Layout({ children }: any) {
  const router = useRouter()

  const [pageHeader, setPageHeader] = useState<string>("")

  useEffect(() => {
    if (
      router.pathname == "/form2" ||
      router.pathname == "/form1" ||
      router.pathname == "/form1-2" ||
      router.pathname == "/forms" ||
      router.pathname == "/downloadCertificate"
    ) {
      setPageHeader("formTypeHeader")
    } else {
      setPageHeader("globalHeader")
    }
  }, [router])

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={`${pageHeader} pageWrapper`}>
        <Header />
        <div className="mainWrapper">
          {router.pathname != "/" &&
            router.pathname != "/firms/dashboard" &&
            router.pathname != "/firms" &&
            router.pathname != "/firms/RegistrationofFirmsCertificate" &&
            router.pathname != "/firms/form1" &&
            router.pathname != "/firms/form2" &&
            router.pathname != "/firms/form3" &&
            router.pathname != "/firms/downloadCertificate" &&
            router.pathname != "/firms/viewDetails" &&
            router.pathname != "/firms/firm-requests" &&
            router.pathname != "/reports" &&
            router.pathname != "/dataEntry" && (
              <div className="pageTopbtnsSec">
                <Container>
                  <Row>
                    <Col lg={12} md={12} xs={12}>
                      <div className="d-flex justify-content-end page-title mb-3">
                        {/* <div className="page-header-btns">
                          <a className="btn btn-primary new-user" onClick={() => router.back()}>
                            Go Back
                          </a>
                        </div> */}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}

          <div className="pageInnerSec">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  )
}
