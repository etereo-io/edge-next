import styles from './loading-spinner.module.scss'

export default function ({ alt }) {
  return (
    <div className={`${styles.loadingSpinner} ${alt ? styles.alt : ''}`}>
      <div className={styles.ring}></div>
    </div>
  )
}
