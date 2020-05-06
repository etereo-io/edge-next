import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'
import load from '../../../lib/config/load-config'
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
    title = '',
    secondary,
    warning,
    alert,
    success
  } = props

  const classNames = `${styles.button} ${loading ? styles.loading : ''} ${alt ? styles.alt : ''} ${
    big ? styles.big : ''
  } ${success ? styles.success : ''} ${warning ? styles.warning : ''} ${secondary ? styles.secondary : ''} ${alert ? styles.alert : ''} ${className}`

  const buttonItem = (
    <button
      className={classNames}
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
        className={classNames}
      >
        <LoadingSpinner alt={alt || secondary || warning || success || alert} />
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
