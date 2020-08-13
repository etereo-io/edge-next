export default function ({
  count = 0,
  type = 'like',
  onClick = () => {},
  active = false,
}) {
  return (
    <>
      <div className={`reaction-wr ${active ? 'active' : ''}`}>
        <span className="reaction-counter">{count}</span>
        <div className="reaction-item-wr">
          {type === 'like' && (
            <svg
              className={`reaction-item reaction-item-like ${
                active ? 'active' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-10 0 532 476"
            >
              <defs />
              <path
                fill="#FFF"
                fillRule="nonzero"
                stroke="#EAEAEA"
                stroke-width="20"
                d="M464.0307 51.3565C439.425 24.6693 405.7258 10 368.9727 10c-27.328 0-52.2457 8.6013-74.3307 25.6792-11.2483 8.7012-21.4801 19.386-30.5391 31.9116l-8.1034 11.2043-8.1027-11.2048c-9.056-12.523-19.2916-23.2106-30.542-31.9105C195.273 18.6015 170.3556 10 143.0273 10c-36.7542 0-70.457 14.67-95.0612 41.3557C23.5206 77.8761 10 114.2588 10 153.8711c0 40.8115 15.2423 78.2532 48.4806 118.361 14.167 17.0935 31.8873 35.1252 54.8934 56.2032 17.8482 16.3524 33.3202 29.7605 71.011 61.8797 27.6543 23.5696 41.2316 35.2205 58.4109 50.2407 3.6525 3.1992 8.3382 4.96 13.2041 4.96 4.8626 0 9.5525-1.7612 13.2022-4.9574 17.1403-14.9893 30.4533-26.4135 58.425-50.2555 37.7107-32.1353 53.159-45.5223 71.0038-61.871 23.006-21.0773 40.7256-39.1086 54.8923-56.2037C486.7596 232.1265 502 194.6852 502 153.8671c0-39.6099-13.5215-75.9917-37.9693-102.5106zm0 0l-.0002-.0002.0003.0004-.0001-.0002z"
              />
            </svg>
          )}
        </div>
      </div>
      <style jsx>{`
        .reaction-wr {
          align-items: center;
          display: flex;
        }

        .reaction-counter {
          color: var(--accents-3);
          font-size: 13px;
          margin-right: var(--edge-gap-half);
        }

        .reaction-item-wr {
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          height: 32px;
          position: relative;
          width: 32px;
        }

        .reaction-item-wr:before,
        .reaction-item-wr:after {
          border: 2px solid var(--accents-2);
          box-sizing: content-box;
          content: '';
          position: absolute;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          pointer-events: none;
        }

        .reaction-item-wr:after {
          border-color: var(--edge-alert);
          opacity: 0;
          transition: 0.35s ease;
        }

        .reaction-item {
          transition: 0.35s ease;
          width: 16px;
        }

        .reaction-item-wr:hover .reaction-item {
          transform: scale(0.8);
        }

        .reaction-item-wr:hover:after {
          animation: reactionItemAfter 0.35s ease-in-out forwards;

          @keyframes reactionItemAfter {
            10% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              border-width: 6px;
            }
          }
        }

        .reaction-item-like path {
          fill: var(--accents-3);
          transition: 0.35s ease;
        }

        .active .reaction-item-like path {
          fill: var(--edge-alert);
          stroke: var(--edge-alert);
        }

        .reaction-item-wr:hover .reaction-item-like path {
          fill: var(--edge-alert);
          stroke: var(--edge-alert);
        }
      `}</style>
    </>
  )
}
