import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import Popstyles from "../styles/components/EkycPopup.module.scss";
import { ImCross } from "react-icons/im";

interface Firm {
  firmName?: string;
  district?: string;
}

interface FirmDialogProps {
  open: boolean;
  onClose: () => void;
  data: Firm[];
}

const FirmDialog = ({
  open,
  onClose,
  data,
}: FirmDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <Container>
        <div className={Popstyles.reportPopup}>
          <div className={Popstyles.container}>
            <div className={Popstyles.Messagebox}>
              <div className={Popstyles.header}>
                <div className={Popstyles.letHeader}>
                  <p className={Popstyles.text}>Firm Details</p>
                </div>
                <div>
                  <ImCross
                    onClick={handleClose}
                    className={Popstyles.closeButton}
                  />
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "1rem",
                  paddingTop: "1rem",
                  paddingRight: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
                className={Popstyles.popupBox}
              >
                <Row className="mb-0 w-100">
                  <Col lg={12} md={12} xs={12} className="mb-2">
                    {data && data.length > 0 ? (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Firm Name</th>
                            <th>District</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.firmName || "Unknown"}</td>
                              <td>{item.district || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p className="text-center">No firm details available.</p>
                    )}
                  </Col>
                </Row>
                <div className="text-center d-flex">
                  <button
                    className={Popstyles.yesBtn}
                    style={{ marginLeft: "0px" }}
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FirmDialog;