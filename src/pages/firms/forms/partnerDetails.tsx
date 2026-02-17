import React, { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Col, Row, Form } from "react-bootstrap"
import { ShowAadharPopup } from "@/GenericFunctions"
import { IPartnerDetailsModel } from "@/models/firmsTypes"

interface PartnerDetailProps {
  partnerNum: any
  mandalList: any
  villageList: any
  districtList: any
  handlePartnerDetails: any
}

const PartnerDetails = ({
  partnerNum,
  mandalList,
  villageList,
  districtList,
  handlePartnerDetails,
}: PartnerDetailProps) => {
  const dispatch = useAppDispatch()
  let AadharOption: any = useAppSelector((state) => state.common.AadharPopupMemory)

  const [partnerDetails, setPartnerDetails] = useState<IPartnerDetailsModel[]>([
    {
      aadharNumber: "",
      partnerName: "",
      partnerSurname: "",
      age: "",
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
      landPhoneNumber: "",
      mobileNumber: "",
      email: "",
      otpCode: "",
      otpStatus: "",
    },
    {
      aadharNumber: "",
      partnerName: "",
      partnerSurname: "",
      age: "",
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
      landPhoneNumber: "",
      mobileNumber: "",
      email: "",
      otpCode: "",
      otpStatus: "",
    },
  ])

  const partnerDetailsChange = (event: any, index: string) => {
    let inV = parseInt(index) - 1
    setPartnerDetails((prevDetails) => {
      let nVals: any = prevDetails.map((item: any, val: number) => {
        var returnValue = { ...item }
        if (val == inV) {
          console.log("inside...")
          returnValue = { ...returnValue, [event.target.name]: event.target.value }
        }
        return returnValue
      })
      return [...nVals]
    })
    // setPartnerDetails({ ...partnerDetails, [event.target.name]: event.target.value })
    console.log(partnerDetails, "oooooooo")
  }

  const [isPartnerError, setIsPartnerError] = useState<boolean>(false)

  const AddedPartnerDetailsChanges = (event: any, index: string) => {
    event.preventDefault()
    let inV = parseInt(index) - 1
    if (
      // partnerDetails[0].aadharNumber == "" ||
      // partnerDetails[0].applicantName == "" ||

      partnerDetails[inV]["role"] == "" ||
      partnerDetails[inV]["mobileNumber"] == "" ||
      partnerDetails[inV]["email"] == ""
    ) {
      setIsPartnerError(true)
    } else {
      setIsPartnerError(false)
      // console.log(partnerDetails,"PPPPPPPPPPPPPP")
      // setPartnerDetails((prevDetails) =>{
      //   let nVals = prevDetails.map((item: any, index: number) =>{
      //     var returnValue = {...item};
      //     // if (index == inV) {
      //     //   returnValue = {...returnValue,...latestData}
      //     // }
      //     return returnValue
      //   })
      //   console.log([...nVals],"---")
      //     return [...nVals]
      // }
      // );
      // console.log(partnerDetails,"_______partner details________")
      handlePartnerDetails(partnerDetails, inV)
    }
  }

  useEffect(() => {
    if (
      AadharOption.response &&
      AadharOption.enable == false &&
      AadharOption.compName == "PartnerDetails" &&
      AadharOption.dynaminCom
    ) {
      if (AadharOption.data && AadharOption.data.KYCResponse) {
        let latestData = {
          partnerName: AadharOption.data.KYCResponse.name ? AadharOption.data.KYCResponse.name : "",
          relationType: AadharOption.data.KYCResponse.co
            ? AadharOption.data.KYCResponse.co.substring(0, 3)
            : "",
          relation: AadharOption.data.KYCResponse.co
            ? AadharOption.data.KYCResponse.co.substring(4)
            : "",
          aadharNumber: AadharOption.data.aadharNumber,
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
        let indexVal = AadharOption.dynaminCom - 1

        localStorage.setItem("CurrentPartnerDetails", JSON.stringify(AadharOption.data.KYCResponse))
        setPartnerDetails((prevDetails) => {
          let nVals = prevDetails.map((item: any, index: number) => {
            var returnValue = { ...item }
            if (index == indexVal) {
              returnValue = { ...returnValue, ...latestData }
            }
            return returnValue
          })
          console.log([...nVals], "---")
          return [...nVals]
        })
      } else {
        let latestData = { partyType: AadharOption.data.type }
        localStorage.setItem("CurrentPartnerDetails", JSON.stringify(latestData))
        // setPartyDetails(latestData);
      }
    }
  }, [AadharOption])

  return (
    <div className="regofAppBg mb-4">
      <div className="formSectionTitle">
        <h3>Partner-{partnerNum} Details</h3>
        {/* <button onClick={()=> ShowAadharPopup("PartnerDetails",partnerNum)} className={styles.AadharBtn}>Verify With Aadhar</button> */}
      </div>

      <div className="partnerDetailsList">
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
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
              />
              <button
                className="verify btn btn-primary"
                onClick={() => ShowAadharPopup("PartnerDetails", partnerNum)}
              >
                Get OTP
              </button>
            </Form.Group>
          </Col>

          <Col lg={3} md={3} xs={12} className="mb-3">
            <Form.Group>
              <Form.Label>Name of the Applicant</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name of the Applicant"
                name="partnerName"
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
              />
            </Form.Group>
          </Col>

          <Col lg={3} md={3} xs={12} className="mb-3">
            <Form.Group className="inline">
              <Form.Label>Relation Name</Form.Label>
              <div className="inline formGroup">
                <Form.Select
                  name="relationType"
                  onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
                >
                  <option value="S/O of">S/O</option>
                  <option value="D/O of">D/O</option>
                  <option value="W/O of">W/O</option>
                  <option value="H/O of">H/O</option>
                </Form.Select>
                <input
                  className="form-control"
                  type="text"
                  name="relation"
                  onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                Door No<span>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Door No"
                name="doorNo"
                required
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                Mandal<span>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="mandal"
                required
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                Village/City<span>*</span>
              </Form.Label>
              <select
                className="form-select"
                name="villageOrCity"
                required
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                Pin Code<span>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Pin Code"
                name="pinCode"
                required
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
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
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={4} xs={12} className="mb-3">
            <Form.Group>
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter Mobile No"
                name="mobileNumber"
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={4} xs={12} className="mb-3">
            <Form.Group>
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email ID"
                name="email"
                onChange={(event: any) => partnerDetailsChange(event, partnerNum)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="regFormBorder"></div>
      </div>

      <Row>
        <Col lg={12} md={12} xs={12} className="mb-4">
          <div className="addotherBtnInfo text-center">
            <div
              onClick={(event) => {
                AddedPartnerDetailsChanges(event, partnerNum)
              }}
              className="btn btn-primary addPartner"
            >
              Add Partner-{partnerNum} Details
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default PartnerDetails
