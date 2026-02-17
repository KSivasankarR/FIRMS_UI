import styles from "@/styles/components/Button.module.scss"

interface Proptypes {
  btnName: string
  onClick?: any
  status?: boolean
  disabled?: boolean
  type?: "submit" | "reset" | "button"
}

const Button = ({ btnName, onClick, status, type = "button", disabled }: Proptypes) => {
  return (
    <button
      className={styles.button}
      onClick={onClick ? onClick : () => {}}
      type={type}
      disabled={!!status || !!disabled}
    >
      {status && <span className={styles.loader}></span>}
      <span>{btnName}</span>
    </button>
  )
}

export default Button
