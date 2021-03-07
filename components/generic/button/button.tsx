import Link from 'next/link'
import LoadingSpinner from '../loading/loading-spinner/loading-spinner'
import { memo } from 'react'

type Props = {
  children?: any
  loading?: boolean
  alt?: boolean
  big?: boolean
  medium?: boolean
  className?: string
  href?: string
  onClick?: (...args: any[]) => any
  restProps?: { [key: string]: any }
  reference?: any
  title?: string
  type?: string
  secondary?: boolean
  warning?: boolean
  fullWidth?: boolean
  alert?: boolean
  soft?: boolean
  success?: boolean
  padding?: string
  hoverable?: boolean
  round?: boolean
  width?: string
}

function Button({
  children,
  loading,
  alt,
  big,
  medium,
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
  soft,
  success,
  padding,
  hoverable,
  round,
  width = '32px',
}: Props) {
  const classNames = `edge-button button ${loading ? 'loading' : ''} ${
    alt ? 'alt' : ''
  } ${fullWidth ? 'full-width' : ''} ${big ? 'big' : ''} ${
    medium ? 'medium' : ''
  } ${soft ? 'soft' : ''} ${success ? 'success' : ''} ${
    warning ? 'warning' : ''
  } ${secondary ? 'secondary' : ''} ${alert ? 'alert' : ''} ${
    hoverable ? 'hoverable' : ''
  } ${className}  ${round ? 'round' : ''}`

  const buttonItem = (
    <>
      <button
        title={title}
        className={classNames}
        {...restProps}
        ref={reference}
        onClick={!loading ? onClick : null}
      >
        {!loading ? (
          <div className="children-wrapper">{children}</div>
        ) : (
          <LoadingSpinner
            alt={alt || secondary || warning || success || alert}
          />
        )}
      </button>
      <style jsx>
        {`
          .button {
            border-radius: var(--edge-radius);
            border: var(--light-border);
            background-color: var(--edge-background);
            color: var(--edge-foreground);
            cursor: pointer;
            display: inline-block;
            font-size: 12px;
            font-weight: 500;
            padding: ${padding ? padding : '8px var(--edge-gap)'};
            transition: 0.3s ease;
            -webkit-appearance: none;
            position: relative;
          }

          .button:hover {
            background-color: var(--edge-secondary);
            color: var(--edge-background);
          }

          .button.alt {
            background-color: var(--edge-foreground);
            border-color: var(--edge-foreground);
            color: var(--edge-background);
            border: var(--light-border);
          }

          .button.alt:hover {
            background-color: var(--edge-secondary);
          }

          .button.success {
            background-color: var(--edge-success);
            border-color: var(--edge-success);
            color: var(--edge-background);
          }

          .button.secondary {
            background-color: var(--edge-secondary);
            border-color: var(--edge-secondary);
            color: var(--edge-background);
          }

          .button.warning {
            background-color: var(--edge-warning);
            border-color: var(--edge-warning);
            color: var(--edge-background);
          }

          .button.alert {
            background-color: var(--edge-alert);
            border-color: var(--edge-alert);
            color: var(--edge-background);
          }

          .button.soft {
            background-color: var(--edge-success-soft);
            border-color: transparent;
            color: var(--edge-success);
          }

          .button.big {
            font-size: 14px;
            padding: 24px;
            width: fit-content;
          }

          .button.medium {
            font-size: 14px;
            padding: 16px;
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

          .button.round {
            width: ${width};
            height: ${width};
            border-radius: 100%;
            padding: 0;
          }

          .children-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          a {
            text-decoration: none;
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

export default memo(Button)
