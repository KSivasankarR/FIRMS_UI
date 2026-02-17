import Head from "next/head"
import { Container, Col, Row } from "react-bootstrap"

export default function OTPVerfication() {
  return (
    <>
      <Head>
        <title>OTP Verification</title>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>

      <main className="main-wrap">
        <div className="login-main registerPage">
          <Container>
            <div className="page-form">
              <div className="login-form-title">
                <h3>OTP Verification</h3>
              </div>
              <form className="login">
                <Row className="d-flex align-items-center">
                  <Col lg={6} md={6} xs={12} className="mb-4">
                    <div className="form-group">
                      <label className="form-label">Enter the OTP you received to 1234567891</label>
                      <input type="text" className="otp form-control" name="otp" required />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={3} md={4} xs={12}>
                    <div className="form-submit">
                      <button type="submit" className="btn btn-primary">
                        Next
                      </button>
                    </div>
                  </Col>
                </Row>
              </form>
            </div>
          </Container>
        </div>
      </main>
    </>
  )
}
