import './button.scss'
import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'

export default function(props) {
  const { children, loading, alt, className, href, onClick, restProps} = props
  const buttonItem = <button className={`button ${alt ? 'alt': ''} ${className}`} {...restProps} onClick={onClick}>
    {children}
  </button>

  if (loading) {
    return <button className={`button ${alt ? 'alt': ''} ${className} loading`}>
      <LoadingSpinner />
    </button>
  }

  return href ? <Link href={href}>{buttonItem}</Link> : buttonItem
}