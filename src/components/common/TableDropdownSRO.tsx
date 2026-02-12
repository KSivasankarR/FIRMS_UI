import styles from "@/styles/components/Table.module.scss"
import TableInputText from "./TableInputText"

interface PropsTypes {
  required: boolean
  onChange: any
  options: any
  name: string
  value?: string
  keyName: any
  disabled?: boolean
}

const TableDropdownSRO = ({
  required = false,
  onChange,
  options = [],
  keyName,
  name,
  value,
  disabled = false,
}: PropsTypes) => {
  const keyIdentifier = (singleOption: any) => {
    if (typeof keyName == "string") {
      return singleOption[keyName]
    } else {
      let AllNames: any = ``
      keyName.map((x: any) => {
        AllNames = AllNames + "-" + singleOption[x]
      })
      return AllNames.substring(1)
    }
  }
  return (
    <div>
      {
        !disabled ? (
          <select
            className={styles.columnDropDownBox}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          >
            <option style={{ width: "300px" }} key="" value="">
              SELECT
            </option>
            {options.map((singleOption: any, index: any) => {
              return (
                <option key={index} value={singleOption[name]}>
                  {keyIdentifier(singleOption)}
                </option>
              )
            })}
          </select>
        ) : (
          <TableInputText
            required={false}
            type="text"
            placeholder=""
            disabled={true}
            name=""
            value={value ? value : ""}
            onChange={() => {}}
          />
        )
        // options.map((singleOption: any, index: any) => {
        //   if(value==keyIdentifier(singleOption)){
        //     return (
        //       // <option key={index} value={singleOption[name]} >{keyIdentifier(singleOption)}</option>
        //       <TableInputText required={false} type='text' placeholder='' disabled={true} name='' value={keyIdentifier(singleOption)} onChange={()=>{}}/>
        //     )
        //   }
        // })
      }
    </div>
  )
}

export default TableDropdownSRO
