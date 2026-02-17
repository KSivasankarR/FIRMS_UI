import styles from "@/styles/components/Table.module.scss"

interface PropsTypes {
  placeholder?: string
  required: boolean
  value?: string
  onChange: any
  name: string
  max?: any
  min?: any
}

const TableSelectDate = ({
  placeholder,
  required = false,
  name,
  value,
  onChange,
  max,
  min,
}: PropsTypes) => {
  return (
    <div className={styles.InputDate}>
      <input
        required={required}
        id="datePicker"
        type="date"
        className={styles.columnDateInputBox}
        pattern="\d{4}-\d{2}-\d{2}"
        data-language="en"
        placeholder={placeholder}
        name={name}
        value={value}
        onKeyDown={(e) => e.preventDefault()}
        onChange={onChange}
        max={max}
        min={min}
        tabIndex={-1}
      />
      {/* <Image height={14} width={14} src='/images/calender.svg' /> */}
    </div>
  )
}

export default TableSelectDate
