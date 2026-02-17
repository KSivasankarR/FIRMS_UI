import styles from "@/styles/components/Table.module.scss"

interface PropsTypes {
  type: string
  placeholder: string
  required: boolean
  value: string
  onChange?: any
  name: string
  disabled?: boolean
  onMouseOut?: any
  onBlurCapture?: any
  min?: any
  max?: any
  dot?: boolean
  capital?: boolean
  splChar?: boolean
  tabIndex?: number
  maxLength?: number
  onKeyPress?: boolean
  onPaste?: any
}

const TableInputText = ({
  type,
  placeholder,
  required = false,
  value,
  name,
  onChange,
  onBlurCapture,
  disabled = false,
  onMouseOut,
  min,
  max,
  dot = true,
  capital = false,
  maxLength,
  splChar = true,
  tabIndex,
  onKeyPress = false,
  onPaste,
}: PropsTypes) => {
  const blockInvalidChar = (e: any) => {
    if (onKeyPress) {
      const keyCode = e.keyCode || e.which
      const keyValue = String.fromCharCode(keyCode)
      const isValid = new RegExp("[0-9]").test(keyValue)
      if (!isValid && e.key != "Backspace") {
        e.preventDefault()
      }
    }
    if (!splChar) {
      ;["/", "_", "+", "-"].includes(e.key) && e.preventDefault()
    }
    if (type == "number") {
      ;["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
      if (maxLength && String(e.target.value).length >= maxLength && e.key != "Backspace") {
        e.preventDefault()
      }
      if (dot == false) {
        ;["."].includes(e.key) && e.preventDefault()
      }
    } else if (
      name === "transactionNo" ||
      name === "utrNumber" ||
      name === "plotNo" ||
      name === "survayNo" ||
      name === "layoutNo" ||
      name === "flatNo" ||
      name === "flatNorthBoundry" ||
      name === "flatSouthBoundry" ||
      name === "flatEastBoundry" ||
      name === "flatWestBoundry"
    ) {
      const regex = /[A-Za-z0-9/-]|,/
      if (!regex.test(e.key)) {
        e.preventDefault()
      }
    } else if (
      name == "share" ||
      name == "mobileNumber" ||
      name == "newShare" ||
      name == "pincode" ||
      name == "pinCode" ||
      name == "maskedAadhar"
    ) {
      const regex = /[0-9]/
      if (!regex.test(e.key) && e.key != "Backspace") {
        e.preventDefault()
      }
    } else if (name === "role" || name == "fullName") {
      const regex = /^[A-Za-z\s]*$/
      if (!regex.test(e.key)) {
        e.preventDefault()
      }
    }
  }

  return (
    <div>
      <input
        className={styles.columnInputBox}
        tabIndex={tabIndex}
        style={{ textTransform: (type != 'email' && type != 'password') ? 'uppercase' : 'none' }}
        name={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onKeyDown={blockInvalidChar}
        onBlurCapture={onBlurCapture}
        onWheel={(event) => event.currentTarget.blur()}
        onBlur={onMouseOut ? onMouseOut : () => {}}
        min={min}
        max={max}
        maxLength={maxLength}
        onPaste={onPaste}
        autoComplete="new-off"
      />
    </div>
  )
}

export default TableInputText
