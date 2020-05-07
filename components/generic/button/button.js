import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'

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
    success,
  } = props

  const classNames = `button ${loading ? 'loading' : ''} ${alt ? 'alt' : ''} ${
    big ? 'big' : ''
  } ${success ? 'success' : ''} ${warning ? 'warning' : ''} ${
    secondary ? 'secondary' : ''
  } ${alert ? 'alert' : ''} ${className}`

  const buttonItem = (
    <>
      <button
        className={classNames}
        {...restProps}
        ref={reference}
        onClick={!loading ? onClick : null}
      >
        {!loading ? (
          children
        ) : (
          <LoadingSpinner
            alt={alt || secondary || warning || success || alert}
          />
        )}
      </button>
      <style jsx>
        {`
          .button {
            border-radius: var(--empz-radius);
            border: var(--light-border);
            background: var(--empz-background);
            color: var(--empz-foreground);
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            padding: 12px var(--empz-gap);
            transition: 0.3s ease;
            -webkit-appearance: none;
          }

          .button:hover {
            background: var(--empz-secondary);
            color: var(--empz-background);
          }

          .button.alt {
            background: var(--empz-foreground);
            color: var(--empz-background);
            border: var(--light-border);
          }

          .button.alt:hover {
            background: var(--empz-secondary);
          }

          .button.success {
            background: var(--empz-success);
            color: var(--empz-background);
          }

          .button.secondary {
            background: var(--empz-secondary);
            color: var(--empz-background);
          }

          .button.warning {
            background: var(--empz-warning);
            color: var(--empz-background);
          }

          .button.alert {
            background: var(--empz-alert);
            color: var(--empz-background);
          }

          .button.big {
            font-size: 16px;
            padding: 24px;
            width: fit-content;
          }

          .button.loading {
            padding: 5px 12px;
          }
        `}
      </style>
    </>
  )

  return href && !loading ? (
    <Link href={href}>
      <a title={title}>{buttonItem}</a>
    </Link>
  ) : (
    buttonItem
  )
}
