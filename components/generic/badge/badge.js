export default function (props) {
  const { children, featured, success, secondary, warning, alert } = props

  return (
    <>
      <div
        className={`badge ${featured ? 'featured' : ''} ${
          success ? 'success' : ''
        } ${secondary ? 'secondary' : ''} ${
          warning ? 'warning' : ''
        } ${alert ? 'alert' : ''}`}
      >
        <span>{children}</span>
      </div>
      <style jsx>
        {
          `
          .badge {
            padding: 0;
            position: relative;
            line-height: 0;
            display: inline-block;
          }
          
          .badge span {
            background: var(--empz-foreground);
            border-radius: 24px;
            color: var(--empz-background);
            display: inline-block;
            font-size: var(--empz-form-small-font);
            padding: var(--empz-gap-quarter);
            position: relative;
            line-height: 1;
            vertical-align: middle;
          }
          
          .badge:before {
            background: var(--empz-foreground);
          }
          
          .badge.success span {
            background: var(--empz-success);
            color: var(--empz-background);
          }
          
          .badge.success:before {
            background: var(--empz-success);
          }

          .badge.alt span {
            background: var(--empz-foreground);
            color: var(--empz-background);
          }
          
          .badge.alt:before {
            background: var(--empz-foreground);
          } 
        
          .badge.secondary span {
            background: var(--empz-secondary);
            color: var(--empz-background);
          }
          
          .badge.secondary:before {
            background: var(--empz-secondary);
          }  

          .badge.warning span {
            background: var(--empz-warning);
            color: var(--empz-background);
          }
        
          .badge.warning:before {
            background: var(--empz-warning);
          }
          
          .badge.alert span {
            background: var(--empz-alert);
            color: var(--empz-background);
          }
        
          .badge.alert:before {
            background: var(--empz-alert);
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
          `
        }
      </style>
    </>
  )
}
