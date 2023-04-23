import classNames from "classnames"
import styles from './CustomDivider.module.scss'

interface CustomDividerProps {
  className?: string
}
const CustomDivider = (props:CustomDividerProps) => {
  return (
    <div className={classNames(props.className,styles.container)}></div>
  )
}

export default CustomDivider