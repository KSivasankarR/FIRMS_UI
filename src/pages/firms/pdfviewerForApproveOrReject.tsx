import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { getESignStatus } from "../../axios"
import { ShowMessagePopup, KeepLoggedIn } from "@/GenericFunctions"
import styles from "@/styles/components/Pdf.module.scss"

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface PdfViewerCertificateProps {
  type: any
  esignStatusData: any
}

const PdfViewerCertificate = ({ type, esignStatusData }: PdfViewerCertificateProps) => {
  const [pdfFilePath, setPdfFilePath] = useState("")
  const [isGoBack, setIsGoBack] = useState<boolean>(false)
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault()
    }
    document.addEventListener("contextmenu", handleContextmenu)
  }, [])
  // useEffect(() => {
  //   const firmsDocumentPath = `${process.env.BACKEND_STATIC_FILES}/api/files/firms/${esignStatusData?.id}/signed${type}FirmsDocument.pdf`;
  //   const defaultPdfPath = `${process.env.BACKEND_STATIC_FILES}/api/files/`+`${esignStatusData?.district}/`+`${esignStatusData?.registrationYear}/`+`${esignStatusData?.registrationNumber}_copy.pdf`;

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/firmsHome/igrsfavicon.ico" />
      </Head>
      <div
        className={styles.iframeWrapper}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Container>
          <Row>
            <Col>
              <div className="acknowledgementformInfo">
                <h3>Acknowledgement of Registration of Firm</h3>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={2} xs={0}></Col>
            <Col lg={6} md={8} xs={12}>
              <iframe
                src={
                  process.env.BACKEND_STATIC_FILES +
                  "/files/firms/" +
                  esignStatusData?.id +
                  "/signed" +
                  type +
                  "FirmsDocument.pdf" +
                  "#toolbar=0"
                }
                style={{
                  width: "100%",
                  background: "transparent",
                  height: "600px",
                  border: "none",
                  scrollbarColor: "white",
                }}
              />
            </Col>
            <Col lg={3} md={2} xs={0}></Col>
            {/* signedApprovedFirmsDocument.pdf */}
          </Row>
        </Container>
      </div>
      {/* <div id="Iframe-Master-CC-and-Rs" className="set-margin set-padding set-border set-box-shadow center-block-horiz">
                <div className="responsive-wrapper 
                    responsive-wrapper-wxh-572x612">
                    
                    <iframe  src={process.env.BACKEND_URL+"/files/"+esignStatusData.id+"/signedFirmsDocument.pdf"+"#toolbar=0"}>
                    </iframe>
    
                </div>
            </div> */}
    </>
  )
}

export default PdfViewerCertificate
