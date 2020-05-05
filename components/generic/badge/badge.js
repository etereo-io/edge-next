import styles from './badge.module.scss'

export default function (props) {
  const {
    children,
    featured,
    success,
    secondary,
    warning,
    alert
  } = props


  return (
    <>
      <div className={`${styles.badge} ${featured ? styles.featured : ''} ${success ? styles.success : ''} ${secondary ? styles.secondary : ''} ${warning ? styles.warning : ''} ${alert ? styles.alert : ''}`} >
        <span>{children}</span>
      </div>
    </>
  )
}
