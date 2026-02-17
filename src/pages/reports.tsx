import { useState, useEffect } from "react"
import Head from "next/head"
import { Container, Row, Col, Table } from "react-bootstrap"
import { useRouter } from "next/router"
import { GetReports } from "@/axios"
import CryptoJS from "crypto-js"
import DepartmentTab from "@/components/DepartmentTab"
import { Loading, ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"

const ReportsPage = () => {
  const router = useRouter()

  const [reportData, setReportData] = useState<any>({})
  const [locData, setLocData] = useState<any>({})

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
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data?.token) {
      setLocData(data)
      Loading(true)
      GetReports(data.token)
        .then((res) => {
          Loading(false)
          setReportData(res.data.reports)
        })
        .catch(() => {
          Loading(false)
          console.log("error")
        })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Reports - Firms & Societies</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      {locData && locData?.userType && locData?.userType != "user" && (
        <div>
          <DepartmentTab active={0} />
          <Container>
            <Row>
              <Col lg={3} md={6} xs={12}></Col>
              <Col lg={3} md={6} xs={12}></Col>
              <Col lg={4} md={6} xs={12}>
                <div className="justify-content-end align-items-end page-title mt-2 me-4 mb-2">
                  <div className="pageTitleRight datatableInfo text-end mt-0 mb-0">
                    <div className="page-header-btns">
                      <a
                        className="btn btn-primary new-user"
                        onClick={() => router.push("userLegacyData")}
                      >
                        Legacy Data Entry Of Firms
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={2} md={6} xs={12}>
                <div className="justify-content-end align-items-end page-title mt-2 me-4 mb-2">
                  <div className="pageTitleRight datatableInfo text-end mt-0 mb-0">
                    <div className="page-header-btns">
                      <a
                        className="btn btn-primary new-user"
                        onClick={() => router.push("dataEntry")}
                      >
                        Data Entry for Firms
                      </a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>

          <div className="dashboardRegSec">
            <Container>
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <Table striped bordered className="tableData listData datatableInfo">
                    <thead>
                      <tr>
                        <th className="siNo text-center">SNo</th>
                        <th className="text-center">District</th>
                        <th className="text-center">Approved</th>
                        <th className="text-center">Refused</th>
                        <th className="text-center">Forwarded</th>
                        <th className="text-center">Open</th>
                        <th className="text-center">Not Viewed</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td className="siNo text-center">1.</td>
                        <td className="siNo text-center">{reportData?.district}</td>
                        <td className="siNo text-center">{reportData?.approved}</td>
                        <td className="siNo text-center">{reportData?.rejected}</td>
                        <td className="siNo text-center">{reportData?.forwarded}</td>
                        <td className="siNo text-center">{reportData?.open}</td>
                        <td className="siNo text-center">{reportData?.notViewed}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}
      {(!locData?.userType || locData?.userType == "user") && (
        <div className="societyRegSec">
          <Container>
            <Row>
              <Col lg={12} md={12} xs={12}>
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
    </>
  )
}

export default ReportsPage
