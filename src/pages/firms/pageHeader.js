import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Container, Col, Row } from "react-bootstrap"
import CryptoJS from "crypto-js"

const PageHeader = ({ setIsAdding }) => {
  const router = useRouter()
  const [localData, setLocalData] = useState({})
  useEffect(() => {
    let data = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setLocalData(data)
  }, [])

  return (
    <div className="pagetitle-sec">
      {(localData?.userType == "user" ||
        (localData?.userType != "user" && router?.pathname != "/firms")) && (
        <Container>
          <Row>
            <Col lg={12} md={12} xs={12}>
              <div className="d-flex justify-content-between align-items-center page-title mb-4">
                <div className="pageTitleLeft">
                  <h1>Registration of Firms-Processing</h1>
                </div>
                <div className="pageTitleRight">
                  {/* <div className="page-header-btns">
                    <a className="btn btn-primary new-user" href="/firms/dashboard">
                      Go Back
                    </a>
                  </div> */}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default PageHeader
