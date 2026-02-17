import { DateFormator } from "@/GenericFunctions"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Container, Col, Row, Table, Modal } from "react-bootstrap"
import FirmSearch from "./firmSearch"
import CryptoJS from "crypto-js"
import DepartmentTab from "@/components/DepartmentTab"
import { KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"
import { getFirmDetails } from "@/axios"

interface DataTableProps {
  requests?: any
  reqsearchdata?: any
  setReqSearchData?: any
  handleView?: any
  isTableView?: any
  setIsTableView?: any
  isSearchView?: any
  apiResponsetoFirmDataMapper?: any
  setIsError?: any
  setErrorMessage?: any
}

const dataTable = ({
  requests,
  reqsearchdata,
  setReqSearchData,
  handleView,

  isTableView,
  setIsTableView,
  isSearchView,
  apiResponsetoFirmDataMapper,
  setIsError,
  setErrorMessage,
}: DataTableProps) => {
  const [storeData, setStoreData] = useState<any>({})
  const router = useRouter()
  const [isResubmission, setIsResubmission] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  
  

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    setStoreData(data)

    if (data != null && data.userType === "user") {
      getFirmDetails(data.applicationId, data.token)
        .then((response: any) => {
          if (!response || !response.success) {
            console.log("error-", response.data.message)
            console.log(response.data.message)
            setIsError(true)
            setErrorMessage(response.data.message)
          }
          if (response.data.firm) {
            response.data.firm = [response.data.firm]            
            response.data.firm[0]?.isResubmission
            if (response.data.firm[0]?.isResubmission === true) {
              setIsResubmission(true);
            }
          }
        }
      )
      handleShow();
    }    

  }, [])
  console.log("reqsearchdata", reqsearchdata)

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  return (
    <>
      <div className="firmReqsList">
        {storeData?.userType != "user" ? <DepartmentTab active={1} /> : null}
        {isSearchView ? (
          <FirmSearch
            requests={requests}
            reqsearchdata={reqsearchdata}
            setReqSearchData={setReqSearchData}
            apiResponsetoFirmDataMapper={apiResponsetoFirmDataMapper}
            setIsTableView={setIsTableView}
            setIsError={setIsError}
            setErrorMessage={setErrorMessage}
          />
        ) : (
          <Container />
        )}

        {isTableView ? (
          <Container>
            <Row>
              <Col lg={12} md={12} xs={12}>
                <Table striped bordered className="tableData listData datatableInfo">
                  <thead>
                    <tr>
                      <th className="text-center">SNo</th>
                      <th className="text-center">Application No</th>
                      <th className="text-center">Applicant Name</th>
                      <th className="text-center">Firm Name</th>
                      <th className="text-center">District Name</th>
                      <th className="text-center">Application Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Remarks</th>
                    </tr>
                  </thead>

                  {reqsearchdata && reqsearchdata.length > 0 ? (
                    <tbody>
                      {reqsearchdata.map((item: any, i: number) => {
                        return (
                          <tr key={i + 1}>
                            <td className="text-center">{i + 1}</td>
                            <td>
                              {item["applicantFields"].status == "Incomplete" ? (
                                item["applicantFields"].applicantNumber
                              ) : item["applicantFields"].status != "Forwarded" &&
                                item["applicantFields"].status != "Approved" &&
                                item["applicantFields"].status != "Rejected" &&
                                storeData?.role == "DR" ? (
                                item["applicantFields"].applicantNumber
                              ) : item["applicantFields"].status != "Incomplete" ? (
                                <a
                                  onClick={() => handleView(item["userFields"].userId)}
                                  className="viewData"
                                >
                                  {item["applicantFields"].applicantNumber}
                                </a>
                              ) : null}
                            </td>
                            <td>{item["applicantFields"].applicantName}</td>
                            <td>{item["firmFields"].firmName}</td>
                            <td>{item["firmFields"].district}</td>
                            <td>{DateFormator(item["firmFields"].firmCreatedAt, "dd/mm/yyyy")}</td>
                            <td>{item["applicantFields"].status}</td>
                            {item["processingHistory"].length > 0 ? (
                              <td>
                                {
                                  item["processingHistory"][item.processingHistory.length - 1]
                                    .remarks
                                }
                              </td>
                            ) : (
                              <td />
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan={7}>No Data Found</td>
                      </tr>
                    </tbody>
                  )}
                </Table>
                {storeData?.userType == "user" &&
                  reqsearchdata &&
                  reqsearchdata.length > 0 &&
                  reqsearchdata[0]["applicantFields"].status == "Rejected" &&
                  !reqsearchdata[0]?.processingHistory?.some((x) => x.status == "Approved") &&
                  !reqsearchdata[0]?.historyDetails?.some((x) => x.status == "Approved") && (
                    <Row>
                      <Col lg={1} md={12} xs={12}></Col>
                      <Col lg={11} md={12} xs={12}>
                        <div className="d-flex justify-content-between pagesubmitSecTitle mb-3">
                          <div className="ms-2">
                            <h2>
                              <a
                                href={isResubmission ? "/firmsHome/firms/form1" : "/firmsHome/firms/form1Edit"}
                                onClick={() => localStorage.setItem("isResubmission", "true")}
                                style={{ color: "blue" }}
                              >
                                click here
                              </a>{" "}
                              {isResubmission ? "Proceed to Resubmit with Payment" : "Proceed to Resubmit without Payment"}
                            </h2>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  )}                                    
              </Col>
            </Row>
          </Container>
        ) : (
          <Container />
        )}
        <div>
            <Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className='mutablemodalCon' >
                <Modal.Header className='mutablemodalHeader'>
                    <Row className='w-100'>
                        <Col lg={10} md={10} xs={12}><Modal.Title>User Attention</Modal.Title></Col>
                        <Col lg={2} md={2} xs={2} className='text-end'><div onClick={handleClose} className='closeIcon'>X</div></Col>
                    </Row>
                </Modal.Header>
                <Modal.Body className='mutablemodalInfo'>
                    <h5 className="noteText"><span>Note:</span> If an application is rejected, the user is allowed to resubmit it once without any payment. However, for a second resubmission, the user will be charged.</h5>
                </Modal.Body>
            </Modal>
        </div>
      </div>
    </>
  )
}

export default dataTable
