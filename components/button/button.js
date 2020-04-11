import './button.scss'
import Link from 'next/link'

export default function(props) {
  const { children, alt, className, href, restProps} = props
  const buttonItem = <button className={`button ${alt ? 'alt': ''} ${className}`} {...restProps}>
    {children}
  </button>

  return href ? <Link href={href}>{buttonItem}</Link> : buttonItem
}