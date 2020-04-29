import styles from './badge.module.scss'

export default function (props) {
  const {
    children,
    featured
  } = props


  return (
    <>
      <div className={`${styles.badge} ${featured ? styles.featured : ''}`}>
        <span>{children}</span>
      </div>
    </>
  )
}
