import React, { useState } from "react"
import { Container, Col, Row, Form, Table } from "react-bootstrap"
import { IAPartnerDetailsMDModel } from "@/models/appTypes"

let nextId = 0

const initialPartnerDetails: IAPartnerDetailsMDModel = {
  aadharNumber: "",
  applicantName: "",
  spoof: "",
  relationName: "",
  role: "",
  deliveryType: "",
  doorNo: "",
  street: "",
  district: "",
  mandal: "",
  villageOrCity: "",
  pinCode: "",
  landPhoneNumber: "",
  mobileNo: "",
  fax: "",
  emailID: "",
}

const testMultiple = () => {
  const [name, setName] = useState<string>("")
  const [partnerDetails, setPartnerDetails] =
    useState<IAPartnerDetailsMDModel>(initialPartnerDetails)
  const [artists, setArtists] = useState<any>([])
  const [isPartnerError, setIsPartnerError] = useState<boolean>(false)
  const [isPartnerShow, setIsPartnerShow] = useState<boolean>(false)

  const partnerDetailsChange = (event: any) => {
    let data: IAPartnerDetailsMDModel = { ...partnerDetails }
    data[event.target.name] = event.target.value
    setPartnerDetails(data)
  }

  const otherFormClick = () => {
    if (partnerDetails.aadharNumber == "") {
      setIsPartnerError(true)
    } else {
      setPartnerDetails(initialPartnerDetails)
      artists.push({
        id: nextId++,
        partnerDetails: partnerDetails,
      })
      setIsPartnerShow(true)
      setIsPartnerError(false)
      console.log("artists", artists)

      const firmPreview = {
        artists: artists,
      }

      for (let j = 0; j < firmPreview.artists.length; j++) {
        console.log("Partner Info", firmPreview.artists[j].partnerDetails.aadharNumber)
      }
    }
  }

  const countryList: string[] = ["India"]
  const stateList: string[] = ["Andhra Pradesh"]
  const districtList: string[] = [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Amalapuram",
    "Bapatla",
    "Chittoor",
    "Kadapa",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "NTR - Vijayawada",
    "Nandyal",
    "Nellore",
    "Palnadu - Narsaraopeta",
    "Parvathipuram",
    "Prakasam",
    "Srikakulam",
    "Puttaparthy",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
  ]
  const genderList: string[] = ["Female", "Male", "Other"]

  const mandalList: string[] = ["AGALI", "AMADAGUR", "AMARAPURAM"]

  const villageList: string[] = ["AGALI", "AKKAGALADEVARAHALLI", "HULIKERADEVARAHALLI", "INAGALORE"]

  const deliveryList: string[] = ["Own", "Other"]

  return (
    <div className="societyRegSec">
      <Container>
        <div className="formsec">
          <div className="regofAppBg mb-4">
            <div className="formSectionTitle">
              <h3>Partner Details</h3>
            </div>
            <div className="partnerDetailsList">
              <Row>
                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Enter Aadhaar Number</Form.Label>
                    <div className="formGroup">
                      <Form.Control
                        type="text"
                        placeholder="Enter Aadhaar Number"
                        name="aadharNumber"
                        onChange={(event: any) => partnerDetailsChange(event)}
                        value={partnerDetails.aadharNumber}
                      />
                      {isPartnerError && <div className="error">Aadhar Number is required</div>}
                      <button className="verify btn btn-primary">Verify</button>
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Name of the Applicant</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name of the Applicant"
                      name="applicantName"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.applicantName}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group className="inline">
                    <Form.Label>Relation Name</Form.Label>
                    <div className="inline formGroup">
                      <Form.Select
                        name="spoof"
                        onChange={(event: any) => partnerDetailsChange(event)}
                        value={partnerDetails.spoof}
                      >
                        <option>S/O of</option>
                        <option>D/O of</option>
                        <option>W/O of</option>
                        <option>H/O of</option>
                      </Form.Select>
                      <input
                        className="form-control"
                        type="text"
                        name="relationName"
                        onChange={(event: any) => partnerDetailsChange(event)}
                        value={partnerDetails.relationName}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Role"
                      name="role"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.role}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="regFormBorder"></div>

              <div className="formSectionTitle">
                <h3>Address Details</h3>
              </div>

              <Row>
                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Delivery Type<span>*</span>
                    </Form.Label>
                    <select
                      className="form-select"
                      name="deliveryType"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.deliveryType}
                    >
                      <option hidden>Select</option>
                      {deliveryList &&
                        deliveryList.map((item: any, i: number) => {
                          return (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          )
                        })}
                    </select>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Door No<span>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Door No"
                      name="doorNo"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.doorNo}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Street"
                      name="street"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.street}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      District<span>*</span>
                    </Form.Label>
                    <select
                      className="form-select"
                      name="district"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.district}
                    >
                      <option hidden>Select</option>
                      {districtList &&
                        districtList.map((item: any, i: number) => {
                          return (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          )
                        })}
                    </select>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Mandal<span>*</span>
                    </Form.Label>
                    <select
                      className="form-select"
                      name="mandal"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.mandal}
                    >
                      <option hidden>Select</option>
                      {mandalList &&
                        mandalList.map((item: any, i: number) => {
                          return (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          )
                        })}
                    </select>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Village/City<span>*</span>
                    </Form.Label>
                    <select
                      className="form-select"
                      name="villageOrCity"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.villageOrCity}
                    >
                      <option hidden>Select</option>
                      {villageList &&
                        villageList.map((item: any, i: number) => {
                          return (
                            <option key={i} value={item}>
                              {item}
                            </option>
                          )
                        })}
                    </select>
                  </Form.Group>
                </Col>

                <Col lg={3} md={3} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Pin Code<span>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Pin Code"
                      name="pinCode"
                      required
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.pinCode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="regFormBorder"></div>

              <div className="formSectionTitle">
                <h3>Contact Details</h3>
              </div>

              <Row>
                <Col lg={3} md={4} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Landline Phone No</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter Landline Phone No"
                      name="landPhoneNumber"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.landPhoneNumber}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} md={4} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Mobile No</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Enter Mobile No"
                      name="mobileNo"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.mobileNo}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} md={4} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Fax</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Fax"
                      name="fax"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.fax}
                    />
                  </Form.Group>
                </Col>
                <Col lg={3} md={4} xs={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email ID"
                      name="emailID"
                      onChange={(event: any) => partnerDetailsChange(event)}
                      value={partnerDetails.emailID}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="regFormBorder"></div>
            </div>
          </div>

          <Row>
            <Col lg={12} md={12} xs={12} className="mb-4">
              <div className="addotherBtnInfo text-center">
                <div onClick={otherFormClick} className="btn btn-primary addPartner">
                  Add Partner Details
                </div>
              </div>
            </Col>
          </Row>

          {isPartnerShow && (
            <div className="addedPartnerSec">
              <div className="formSectionTitle mb-3">
                <h3>Added Partner Details</h3>
              </div>

              <Row className="mb-4">
                <Col lg={12} md={12} xs={12}>
                  <Table striped bordered className="tableData listData">
                    <thead>
                      <tr>
                        <th>Aadhaar Number</th>
                        <th>Partner Name</th>
                        <th>Partner SurName</th>
                        <th>Age</th>
                        <th>Joining Date</th>
                        <th>Role</th>
                        <th>Contact Number</th>
                        <th>Email ID</th>
                      </tr>
                    </thead>

                    <tbody>
                      {artists &&
                        artists.map((artist: any, id: number) => (
                          <tr key={id + 1}>
                            <td>
                              <div className="aadhar">{artist.partnerDetails.aadharNumber}</div>
                            </td>
                            <td>{artist.partnerDetails.partnerName}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{artist.partnerDetails.role}</td>
                            <td>{artist.partnerDetails.mobileNumber}</td>
                            <td>{artist.partnerDetails.email}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

export default testMultiple
