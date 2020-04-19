import styles from './button.module.scss'
import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'

export default function (props) {
  const { children, loading, alt, className, href, onClick, restProps, reference } = props
  const buttonItem = (
    <button
      className={`${styles.button} ${alt ? 'alt' : ''} ${className}`}
      {...restProps}
      ref={reference}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (loading) {
    return (
      <button ref={reference} className={`${styles.button} ${alt ? 'alt' : ''} ${className} loading`}>
        <LoadingSpinner />
      </button>
    )
  }

  return href ? <Link href={href}><a>{buttonItem}</a></Link> : buttonItem
}
