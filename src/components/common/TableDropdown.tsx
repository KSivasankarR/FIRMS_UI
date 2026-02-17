import styles from "@/styles/components/Table.module.scss"

interface PropsTypes {
  required: boolean
  onChange: any
  options: any
  name: string
  value?: string
  sro?: boolean
}

const TableDropdown = ({
  required = false,
  onChange,
  options = [],
  name,
  value,
  sro = false,
}: PropsTypes) => {
  return (
    <div>
      <select
        className={styles.columnDropDownBox}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{ fontFamily: "Montserrat",textTransform:  'uppercase' }}
      >
        <option style={{ width: "300px" }} key="" value="">
          SELECT
        </option>
        {options.map((singleOption: any, index: any) => {
          return (
            <option key={index} value={singleOption}>
              {singleOption}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default TableDropdown
