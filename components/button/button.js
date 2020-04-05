import './button.scss'

export default function(props) {
  const { children, alt, className, restProps} = props
  return <button className={`button ${alt ? 'alt': ''} ${className}`} {...restProps}>
    {children}
  </button>
}