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
    fullWidth,
    alert,
    success,
    padding,
    hoverable,
  } = props

  const classNames = `button ${loading ? 'loading' : ''}  ${alt ? 'alt' : ''} ${
    fullWidth ? 'full-width' : ''
  } ${big ? 'big' : ''} ${success ? 'success' : ''} ${
    warning ? 'warning' : ''
  } ${secondary ? 'secondary' : ''} ${alert ? 'alert' : ''} ${
    hoverable ? 'hoverable' : ''
  } ${className}`

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
            padding: ${padding ? padding : '12px var(--empz-gap)'};
            transition: 0.3s ease;
            -webkit-appearance: none;
          }

          .button:hover {
            background-color: var(--empz-secondary);
            color: var(--empz-background);
          }

          .button.alt {
            background-color: var(--empz-foreground);
            color: var(--empz-background);
            border: var(--light-border);
          }

          .button.alt:hover {
            background-color: var(--empz-secondary);
          }

          .button.success {
            background-color: var(--empz-success);
            color: var(--empz-background);
          }

          .button.secondary {
            background-color: var(--empz-secondary);
            color: var(--empz-background);
          }

          .button.warning {
            background-color: var(--empz-warning);
            color: var(--empz-background);
          }

          .button.alert {
            background-color: var(--empz-alert);
            color: var(--empz-background);
          }

          .button.big {
            font-size: 16px;
            padding: 24px;
            width: fit-content;
          }

          .button.full-width {
            width: 100%;
          }

          .button.loading {
            display: flex;
            justify-content: center;
            text-align: center;
          }
          .button.loading div {
            display: inline-block;
          }

          .button.hoverable:hover {
            background-color: inherit;
            box-shadow: var(--shadow-medium);
            color: inherit;
            transform: scale(1.025);
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
