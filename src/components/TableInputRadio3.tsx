import React from "react"
import styles from "@/styles/components/Table.module.scss"

interface PropsTypes {
  required: boolean
  options: any
  name: string
  onChange: any
  defaultValue?: any
}

const TableInputRadio3 = ({ options = [], defaultValue, name, onChange }: PropsTypes) => {
  return (
    <div>
      <div>
        {options.map((singleOption: any, index: any) => {
          return (
            <label key={index}>
              <input
                className={styles.TableRadioButton}
                type="radio"
                value={singleOption.label}
                checked={singleOption.label == defaultValue ? true : false}
                name={name}
                onChange={onChange}
                required={true}
              />
              {/* <text>{singleOption.label}</text> */}
              <text className={styles.TableRadioLabel}>{singleOption.label}</text>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default TableInputRadio3
