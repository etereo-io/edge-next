import styles from './loading-spinner.module.scss'

export default function () {
  return (
    <div className={styles.loadingSpinner}>
      <div className={styles.ring}></div>
    </div>
  )
}
