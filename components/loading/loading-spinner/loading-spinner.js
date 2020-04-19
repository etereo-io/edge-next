import styles from './loading-spinner.module.scss'

export default function () {
  return (
    <div className={styles.loadingSpinner}>
      <div className="lds-dual-ring"></div>
    </div>
  )
}
