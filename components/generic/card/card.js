export default function ({
  children,
  alt,
  featured,
  success,
  secondary,
  warning,
  alert,
  ...props
}) {
  return (
    <>
      <div
        className={`card ${alt ? 'alt' : ''} ${featured ? 'featured' : ''} ${
          success ? 'success' : ''
        } ${secondary ? 'secondary' : ''} ${warning ? 'warning' : ''} ${
          alert ? 'alert' : ''
        }`}
        {...props}
      >
        {children}
      </div>
      <style jsx>
        {`
          .card {
            background: var(--edge-background);
            box-shadow: var(--shadow-smallest);
            border-radius: var(--edge-radius);
            transition: box-shadow 0.25s ease, transform 0.25s ease;
            padding: var(--edge-gap);
            height: 100%;
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
            background: var(--edge-foreground);
            color: var(--edge-background);
          }

          .card.success {
            background-color: var(--edge-success);
            color: var(--edge-background);
          }

          .card.secondary {
            background-color: var(--edge-secondary);
            color: var(--edge-background);
          }

          .card.warning {
            background-color: var(--edge-warning);
            color: var(--edge-background);
          }

          .card.alert {
            background-color: var(--edge-alert);
            color: var(--edge-background);
          }
        `}
      </style>
    </>
  )
}
