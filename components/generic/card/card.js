export default function (props) {
  const { children, alt, featured, success, secondary, warning, alert, simple } = props

  return (
    <>
      <div
        className={`card ${alt ? 'alt' : ''} ${featured ? 'featured' : ''} ${
          success ? 'success' : ''
        } ${secondary ? 'secondary' : ''} ${warning ? 'warning' : ''} ${
          alert ? 'alert' : ''
        }${simple ? 'simple' : ''}`}
      >
        {children}
      </div>
      <style jsx>
        {`
          .card {
            background: var(--empz-background);
            box-shadow: var(--shadow-smallest);
            border-radius: var(--empz-radius);
            margin-bottom: var(--empz-gap);
            transition: box-shadow 0.25s ease, transform 0.25s ease;
            padding: var(--empz-gap);
            will-change: box-shadow, transform;
          }

          @media all and (max-width: 860px) {
            .card:hover {
              transform: scale(1.05) !important;
            }
          }

          .card:hover {
            box-shadow: var(--shadow-medium);
            transform: scale(1.1);
          }

          .card.alt {
            background: var(--empz-foreground);
            color: var(--empz-background);
          }

          .card.success {
            background-color: var(--empz-success);
            color: var(--empz-background);
          }

          .card.secondary {
            background-color: var(--empz-secondary);
            color: var(--empz-background);
          }

          .card.warning {
            background-color: var(--empz-warning);
            color: var(--empz-background);
          }

          .card.alert {
            background-color: var(--empz-alert);
            color: var(--empz-background);
          }

          .card.simple {
            height: 100%;
            margin-bottom: 0;
          }
        `}
      </style>
    </>
  )
}
