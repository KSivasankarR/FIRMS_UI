import React, { useState, useEffect } from "react"
import { Col, Row, Form } from "react-bootstrap"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { NameValidation } from "@/utils"
import { ShowAadharPopup } from "@/GenericFunctions"
import { IApplicantDetailsModel, IContactDetailsModel } from "@/models/firmsTypes"

interface ApplicationDetailsProps {
  mandalList: any
  villageList: any
  districtList: any
  handleApplicantsData: any
}

const ApplicationDetails = ({
  mandalList,
  villageList,
  districtList,
  handleApplicantsData,
}: ApplicationDetailsProps) => {
  const dispatch = useAppDispatch()
  let AadharOption: any = useAppSelector((state) => state.common.AadharPopupMemory)

  const [applicantDetails, setApplicantDetails] = useState<IApplicantDetailsModel>({
    aadhaarNumber: "",
    applicantName: "",
    surName: "",
    relationType: "",
    relation: "",
    gender: "",
    role: "",
    doorNo: "",
    street: "",
    district: "",
    mandal: "",
    villageOrCity: "",
    pinCode: "",
    otpCode: "",
    otpStatus: "",
  })

  const [contactDetails, setContactDetails] = useState<IContactDetailsModel>({
    landPhoneNumber: "",
    mobileNumber: "",
    email: "",
  })

  useEffect(() => {
    console.log(AadharOption)
    if (
      AadharOption.response &&
      AadharOption.enable == false &&
      AadharOption.compName == "ApplicantDetails"
    ) {
      if (AadharOption.data && AadharOption.data.KYCResponse) {
        let latestData = {
          applicantName: AadharOption.data.KYCResponse.name
            ? AadharOption.data.KYCResponse.name
            : "",
          relationType: AadharOption.data.KYCResponse.co
            ? AadharOption.data.KYCResponse.co.substring(0, 3)
            : "",
          relation: AadharOption.data.KYCResponse.co
            ? AadharOption.data.KYCResponse.co.substring(4)
            : "",
          aadhaarNumber: AadharOption.data.aadharNumber,
          doorNo: AadharOption.data.KYCResponse.house,
          street: AadharOption.data.KYCResponse.street,
          district: AadharOption.data.KYCResponse.dist,
          villageOrCity: AadharOption.data.KYCResponse.loc,
          pinCode: AadharOption.data.KYCResponse.pc,
          address:
            (AadharOption.data.KYCResponse.lm ? AadharOption.data.KYCResponse.lm + ", \n" : "") +
            (AadharOption.data.KYCResponse.loc ? AadharOption.data.KYCResponse.loc + ", \n" : "") +
            (AadharOption.data.KYCResponse.dist
              ? AadharOption.data.KYCResponse.dist + ", \n"
              : "") +
            (AadharOption.data.KYCResponse.vtc ? AadharOption.data.KYCResponse.vtc : "") +
            (AadharOption.data.KYCResponse.pc ? "-" + AadharOption.data.KYCResponse.pc : ""),
          currentAddress:
            (AadharOption.data.KYCResponse.lm ? AadharOption.data.KYCResponse.lm + ", \n" : "") +
            (AadharOption.data.KYCResponse.loc ? AadharOption.data.KYCResponse.loc + ", \n" : "") +
            (AadharOption.data.KYCResponse.dist
              ? AadharOption.data.KYCResponse.dist + ", \n"
              : "") +
            (AadharOption.data.KYCResponse.vtc ? AadharOption.data.KYCResponse.vtc : "") +
            (AadharOption.data.KYCResponse.pc ? "-" + AadharOption.data.KYCResponse.pc : ""),
          partyType: AadharOption.data.type,
        }

        localStorage.setItem("CurrentPartyDetails", JSON.stringify(AadharOption.data.KYCResponse))
        setApplicantDetails((prevDetails) => {
          return { ...prevDetails, ...latestData }
        })
        handleApplicantsData({ ...applicantDetails })
      } else {
        let latestData = { partyType: AadharOption.data.type }
        localStorage.setItem("CurrentPartyDetails", JSON.stringify(latestData))
        // setPartyDetails(latestData);
      }
    }
  }, [AadharOption])

  const applicantDetailsChange = (e) => {
    let addName = e.target.name
    let addValue = e.target.value
    if (addName == "aadhaarNumber") {
      if (addValue.length > 12) {
        addValue = addValue.substring(0, 12)
      }
    } else if (addName == "applicantName" || addName == "relation" || addName == "role") {
      addValue = NameValidation(addValue)
    }
    setApplicantDetails({ ...applicantDetails, [addName]: addValue })
    handleApplicantsData({ ...applicantDetails }, "applicant")
  }

  const contactDetailsChange = (e) => {
    const newInput = () => ({ ...contactDetails, [e.target.name]: e.target.value })
    setContactDetails(newInput)
    console.log(contactDetails, "((((((((((")
    handleApplicantsData(contactDetails, "contact")
  }

  return (
    <div className="regofAppBg mb-3">
      <div className="formSectionTitle">
        <h3>Applicant Details</h3>
        {/* <button onClick={()=> ShowAadharPopup('ApplicantDetails')} className={styles.AadharBtn}>Verify With Aadhar</button> */}
      </div>
      <Row>
        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group className="formGroup">
            <Form.Label>
              Aadhar Number <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Aadhar Number"
              name="aadharNumber"
              required
              onChange={applicantDetailsChange}
              value={applicantDetails.aadhaarNumber}
            />
            <button
              className="verify btn btn-primary"
              onClick={() => ShowAadharPopup("ApplicantDetails")}
            >
              Get OTP
            </button>
          </Form.Group>
        </Col>
        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              Name of the Applicant <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name of the Applicant"
              name="applicantName"
              required
              onChange={applicantDetailsChange}
              value={applicantDetails.applicantName}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group className="inline">
            <Form.Label>
              Relation Name <span>*</span>
            </Form.Label>
            <div className="inline formGroup">
              <Form.Select
                size="sm"
                name="relationType"
                onChange={applicantDetailsChange}
                value={applicantDetails.relationType}
              >
                <option value="S/O of">S/O</option>
                <option value="D/O of">D/O</option>
                <option value="W/O of">W/O</option>
              </Form.Select>
              <input
                className="form-control"
                type="text"
                name="relation"
                onChange={applicantDetailsChange}
                value={applicantDetails.relation}
                required
              />
            </div>
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              Role <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Role"
              name="role"
              onChange={applicantDetailsChange}
              value={applicantDetails.role}
              required
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
              Door No <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Door No"
              name="doorNo"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.doorNo}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              Street <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Street"
              name="street"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.street}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              District <span>*</span>
            </Form.Label>
            <select
              className="form-control"
              name="district"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.district}
            >
              <option hidden>Select</option>
              {districtList &&
                districtList?.length > 0 &&
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
              Mandal <span>*</span>
            </Form.Label>
            <select
              className="form-control"
              name="mandal"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.mandal}
            >
              <option hidden>Select</option>
              {mandalList &&
                mandalList?.length > 0 &&
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
              Village/City <span>*</span>
            </Form.Label>
            <select
              className="form-control"
              name="villageOrCity"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.villageOrCity}
            >
              <option hidden>Select</option>
              {villageList &&
                villageList?.length > 0 &&
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
              PIN Code <span>*</span>
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter PIN Code"
              name="pinCode"
              required={true}
              onChange={applicantDetailsChange}
              value={applicantDetails.pinCode}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="regFormBorder"></div>

      <div className="formSectionTitle">
        <h3>Contact Details</h3>
      </div>

      <Row>
        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>Landline Phone No</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter Landline Phone No"
              name="landPhoneNumber"
              required={false}
              onChange={contactDetailsChange}
              value={contactDetails.landPhoneNumber}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              Mobile No <span>*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter Mobile No"
              name="mobileNumber"
              required={true}
              onChange={contactDetailsChange}
              value={contactDetails.mobileNumber}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={3} xs={12} className="mb-3">
          <Form.Group>
            <Form.Label>
              Email ID <span>*</span>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email ID"
              name="email"
              required={true}
              onChange={contactDetailsChange}
              value={contactDetails.email}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}

export default ApplicationDetails
