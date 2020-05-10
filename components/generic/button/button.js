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
    socialButton,
    google,
    facebook,
    github
  } = props

  const classNames = `button ${loading ? 'loading' : ''} ${socialButton ? 'social-button' : ''} ${google ? 'google' : ''} ${facebook ? 'facebook' : ''} ${github ? 'github' : ''} ${alt ? 'alt' : ''} ${fullWidth ? 'full-width' : ''} ${
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

          .button.full-width {
            width: 100%;
          }

          .button.loading {
            padding: 5px 12px;
          }

          .button.social-button{
            background-size: 22px;
            background-repeat: no-repeat;
            background-position: var(--empz-gap) 50%;
            text-align: left;
            padding-left: 56px;
          }

          .button.social-button:hover{
            background-color: inherit;
            box-shadow: var(--shadow-medium);
            color: inherit;
            transform: scale(1.025);
          }

          .button.social-button::before{
            content: 'Continue with ';
          }

          .button.social-button.google{
            background-image: url(/icons/google.svg);
          }

          .button.social-button.google::after{
            content: 'Google';
          }

          .button.social-button.facebook{
            background-image: url(/icons/facebook.svg);
          }

          .button.social-button.facebook::after{
            content: 'Facebook';
          }

          .button.social-button.github{
            background-image: url(/icons/github.svg);
          }

          .button.social-button.github::after{
            content: 'Github';
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
