import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'
import styles from './button.module.scss'

export default function (props) {
  const {
    children,
    loading,
    alt,
    big,
    className,
    href,
    onClick,
    restProps,
    reference,
    title = ''
  } = props
  const buttonItem = (
    <button
      className={`${styles.button} ${alt ? styles.alt : ''} ${
        big ? styles.big : ''
      }  ${className}`}
      {...restProps}
      ref={reference}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (loading) {
    return (
      <button
        ref={reference}
        className={`${styles.button} ${alt ? styles.alt : ''} ${
          big ? styles.big : ''
        } ${className} ${styles.loading}`}
      >
        <LoadingSpinner alt={alt} />
      </button>
    )
  }

  return href ? (
    <Link href={href}>
      <a title={title}>{buttonItem}</a>
    </Link>
  ) : (
    buttonItem
  )
}
