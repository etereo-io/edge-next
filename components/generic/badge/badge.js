export default function (props) {
  const { children, featured, success, secondary, warning, alert } = props

  return (
    <>
      <div
        className={`badge ${featured ? 'featured' : ''} ${
          success ? 'success' : ''
        } ${secondary ? 'secondary' : ''} ${warning ? 'warning' : ''} ${
          alert ? 'alert' : ''
        }`}
      >
        <span>{children}</span>
      </div>
      <style jsx>
        {`
          .badge {
            padding: 0;
            position: relative;
            line-height: 0;
            display: inline-block;
          }

          .badge span {
            background: var(--edge-foreground);
            border-radius: 24px;
            color: var(--edge-background);
            display: inline-block;
            font-size: var(--edge-form-small-font);
            padding: var(--edge-gap-quarter);
            position: relative;
            line-height: 1;
            vertical-align: middle;
          }

          .badge:before {
            background: var(--edge-foreground);
          }

          .badge.success span {
            background: var(--edge-success);
            color: var(--edge-background);
          }

          .badge.success:before {
            background: var(--edge-success);
          }

          .badge.alt span {
            background: var(--edge-foreground);
            color: var(--edge-background);
          }

          .badge.alt:before {
            background: var(--edge-foreground);
          }

          .badge.secondary span {
            background: var(--edge-secondary);
            color: var(--edge-background);
          }

          .badge.secondary:before {
            background: var(--edge-secondary);
          }

          .badge.warning span {
            background: var(--edge-warning);
            color: var(--edge-background);
          }

          .badge.warning:before {
            background: var(--edge-warning);
          }

          .badge.alert span {
            background: var(--edge-alert);
            color: var(--edge-background);
          }

          .badge.alert:before {
            background: var(--edge-alert);
          }

          .badge.featured:before {
            animation: badgeFeatured 1.4s ease forwards infinite;
            border-radius: 24px;
            content: '';
            height: 100%;
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
          }

          @keyframes badgeFeatured {
            0% {
              transform: translate(-50%, -50%) scale(0.9);
              opacity: 0.8;
            }

            100% {
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  )
}
