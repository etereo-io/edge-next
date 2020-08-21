import { memo } from 'react'

interface Props {
  alt?: boolean
  width?: string | number
}

function LoadingSpinner({ alt = false, width = '1.5em' }: Props) {
  return (
    <>
      <div className={`loading-spinner ${alt ? 'alt' : ''}`}>
        <div className="ring" />
      </div>
      <style jsx>{`
        .loading-spinner .ring:after {
          content: ' ';
          display: block;
          width: ${width};
          height: ${width};
          border-radius: 50%;
          border: 0.15em solid var(--edge-foreground);
          border-color: var(--edge-foreground) var(--light-border-color)
            var(--light-border-color);
          animation: lds-dual-ring 1.2s linear infinite;
        }
        .loading-spinner.alt .ring:after {
          border: 0.15em solid var(--edge-background);
          border-color: var(--edge-background) var(--dark-border-color)
            var(--dark-border-color);
        }

        @keyframes lds-dual-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

export default memo(LoadingSpinner)
