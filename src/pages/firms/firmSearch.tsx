import { useEffect, useState } from "react"
import { Container, Col, Row } from "react-bootstrap"
import api from "@/pages/api/api"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import CryptoJS from "crypto-js"
import "react-datepicker/dist/react-datepicker.css"
import { Loading, KeepLoggedIn, ShowMessagePopup } from "@/GenericFunctions"

interface SearchProps {
  requests?: any
  reqsearchdata?: any
  setReqSearchData?: any
  apiResponsetoFirmDataMapper?: any
  setIsTableView?: any
  setIsError?: any
  setErrorMessage?: any
}

const Search = ({
  requests,
  reqsearchdata,
  setReqSearchData,
  apiResponsetoFirmDataMapper,
  setIsTableView,
  setIsError,
  setErrorMessage,
}: SearchProps) => {
  const [status, setStatus] = useState<string>("")
  const [applicantName, setApplicantName] = useState<string>("")
  const [applicantNumber, setApplicantNumber] = useState<string>("")
  const [fromDate, setFromDate] = useState<any>(new Date())
  const [toDate, setToDate] = useState<any>(new Date())
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    let data: any = localStorage.getItem("FASPLoginDetails")
    if (data && data != "" && process.env.SECRET_KEY) {
      let bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY)
      data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    }
    if (data?.token) {
      setToken(data.token)
      handleSearch(data.token)
    }
  }, [])

  useEffect(() => {
    if (KeepLoggedIn()) {
    } else {
      ShowMessagePopup(false, "Invalid Access", "/")
    }
  }, [])

  const fromDateStr = fromDate.date ? fromDate.date.toString() : null
  const toDateStr = toDate.date ? toDate.date.toString() : null

  let fromDateSplit = ""

  let toDateSplit = ""

  if (fromDateStr != null) {
    fromDateSplit = fromDateStr.split(" ")
  }

  if (toDateStr != null) {
    toDateSplit = toDateStr.split(" ")
  }

  let fromDateMonth = fromDateSplit[1]
  let fromDateMonthVal = ""

  let toDateMonth = toDateSplit[1]
  let toDateMonthVal = ""

  if (fromDateMonth == "Jan") {
    fromDateMonthVal = "01"
  }
  if (fromDateMonth == "Feb") {
    fromDateMonthVal = "02"
  }
  if (fromDateMonth == "Mar") {
    fromDateMonthVal = "03"
  }
  if (fromDateMonth == "Apr") {
    fromDateMonthVal = "04"
  }
  if (fromDateMonth == "May") {
    fromDateMonthVal = "05"
  }
  if (fromDateMonth == "Jun") {
    fromDateMonthVal = "06"
  }
  if (fromDateMonth == "Jul") {
    fromDateMonthVal = "07"
  }
  if (fromDateMonth == "Aug") {
    fromDateMonthVal = "08"
  }
  if (fromDateMonth == "Sep") {
    fromDateMonthVal = "09"
  }
  if (fromDateMonth == "Oct") {
    fromDateMonthVal = "10"
  }
  if (fromDateMonth == "Nov") {
    fromDateMonthVal = "11"
  }
  if (fromDateMonth == "Dec") {
    fromDateMonthVal = "12"
  }

  if (toDateMonth == "Jan") {
    toDateMonthVal = "01"
  }
  if (toDateMonth == "Feb") {
    toDateMonthVal = "02"
  }
  if (toDateMonth == "Mar") {
    toDateMonthVal = "03"
  }
  if (toDateMonth == "Apr") {
    toDateMonthVal = "04"
  }
  if (toDateMonth == "May") {
    toDateMonthVal = "05"
  }
  if (toDateMonth == "Jun") {
    toDateMonthVal = "06"
  }
  if (toDateMonth == "Jul") {
    toDateMonthVal = "07"
  }
  if (toDateMonth == "Aug") {
    toDateMonthVal = "08"
  }
  if (toDateMonth == "Sep") {
    toDateMonthVal = "09"
  }
  if (toDateMonth == "Oct") {
    toDateMonthVal = "10"
  }
  if (toDateMonth == "Nov") {
    toDateMonthVal = "11"
  }
  if (toDateMonth == "Dec") {
    toDateMonthVal = "12"
  }

  const fromDateVal = fromDateSplit[2]
  const toDateVal = toDateSplit[2]

  const fromYearVal = fromDateSplit[3]
  const toYearVal = toDateSplit[3]

  const fromDateFull = fromDateVal + "-" + fromDateMonthVal + "-" + fromYearVal

  const toDateFull = toDateVal + "-" + toDateMonthVal + "-" + toYearVal

  const handleSearch = (tok: any) => {
    Loading(true)
    let apiPath = "/firms?page=1&perpage=10"
    if (
      fromDate != null &&
      fromDate != "" &&
      fromDateFull != "undefined--undefined" &&
      fromDateFull != ""
    ) {
      apiPath = apiPath + "&from=" + fromDateFull
    }
    // @Vejan from has to be present in case of to
    if (
      toDate != null &&
      toDate != "" &&
      toDateFull != "undefined--undefined" &&
      toDateFull != ""
    ) {
      apiPath = apiPath + "&to=" + toDateFull
    }
    if (status != null && status.length > 0) {
      apiPath = apiPath + "&status=" + status
    }
    api
      .get(apiPath, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tok}`,
        },
      })
      .then((response: any) => {
        Loading(false)
        if (process.env.SECRET_KEY && apiResponsetoFirmDataMapper) {
          const bytes = CryptoJS.AES.decrypt(response.data, process.env.SECRET_KEY)
          const resData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          if (!resData.success) {
            console.log("error-", resData.message)
            console.log(resData.message)
            setIsError(true)
            setErrorMessage(resData.message)
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: resData.message,
              showConfirmButton: false,
              timer: 1500,
            })
          }

          if (resData.data.firm) {
            resData.data.firms = [resData.data.firm]
          }

          if (resData.data.firms && resData.data.firms.length > 0) {
            const firmRegData: any = []
            for (let i = 0; i < resData.data.firms.length; i++) {
              firmRegData.push(apiResponsetoFirmDataMapper(resData.data.firms[i], i + 1))
            }
            // setRequests(firmRegData)
            setReqSearchData(firmRegData)
            setIsTableView(true)
          }
        }
      })
      .catch((error) => {
        Loading(false)
        console.log("error-", error)
        console.log(error.message)
        setIsError(true)
        setErrorMessage(error.message)
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.message,
          showConfirmButton: false,
          timer: 1500,
        })
      })
  }

  return (
    <div className="societyRegSec">
      <Container>
        <div className="formsec societyRegsecInfo">
          <div className="pagetitle-sec">
            <Row>
              <Col lg={12} md={12} xs={12}>
                <div className="d-flex justify-content-between page-title mb-2">
                  <div className="pageTitleLeft">
                    <h1>Search Criteria</h1>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row>
            <Col lg={3} md={3} xs={12} className="mb-3">
              <label className="form-label">From Date :</label>
              <DatePicker
                value={fromDate}
                className="form-control datePicker"
                dateFormat="dd-MM-yyyy"
                selected={fromDate.date}
                placeholderText="DD-MM-YYYY"
                maxDate={new Date()}
                onChange={(date) => setFromDate({ date })}
              />
            </Col>

            <Col lg={3} md={3} xs={12} className="mb-3">
              <label className="form-label">To Date :</label>
              <DatePicker
                value={toDate}
                className="form-control datePicker"
                dateFormat="dd-MM-yyyy"
                selected={toDate.date}
                placeholderText="DD-MM-YYYY"
                maxDate={new Date()}
                onChange={(date) => setToDate({ date })}
              />
            </Col>

            <Col lg={3} md={3} xs={12} className="mb-3">
              <label className="form-label">Status :</label>
              <select
                className="form-control"
                onChange={(e) => {
                  e.preventDefault()
                  setStatus(e.target.value)
                  setIsTableView(false)
                }}
              >
                <option value="">Select</option>
                <option value="Forwarded">Forwarded to DR</option>
                <option value="Not Viewed">Not Viewed</option>
                <option value="Open">Open</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Refused</option>
              </select>
            </Col>

            <Col lg={3} md={3} xs={12} className="mb-3">
              <div className="searchBtn btnTopSpace">
                <button className="btn btn-primary new-user" onClick={() => handleSearch(token)}>
                  Get Details
                </button>{" "}
                {/*
                &nbsp; &nbsp;
                <span>
                  <a href="/firmsHome/assets/pdf-view.pdf" target="_blank">
                    <img
                      src="/firmsHome/assets/pdf_symbol.jpg"
                      title="Sri. Y S Jagan Mohan Reddy"
                      alt="Sri. Y S Jagan Mohan Reddy"
                      width="30px"
                    />
                  </a>
                </span>{" "}
                &nbsp;
                <span>
                  <a href="/firmsHome/assets/Registration_Firms_Request_Details.xls" target="_blank">
                    <img
                      src="/firmsHome/assets/EXCEL.png"
                      title="Sri. Y S Jagan Mohan Reddy"
                      alt="Sri. Y S Jagan Mohan Reddy"
                      width="30px"
                    />
                  </a>
                </span>
                */}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default Search
