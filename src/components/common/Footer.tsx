import React from "react"
import styles from "@/styles/components/footer.module.scss"
import { Container, Col, Row } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className={styles.footer_body}>
      <Container className={styles.footer_content}>
        <Row className="d-flex justify-content-between">
          <Col lg={12} md={12} xs={12} className={styles.footer_copyright}>
            <p>
              Copyright © All rights reserved with Registration & Stamps Department, Government of
              Andhra Pradesh.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
