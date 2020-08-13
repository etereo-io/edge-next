import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

export default function Named(props) {
  const shareUrl = props.shareUrl
    ? props.shareUrl
    : typeof window !== 'undefined'
    ? String(window.location)
    : ''
  return (
    <>
      <div className="social-share">
        <div className="edge-button-share">
          <span className="edge-button-share-title">Share</span>
          <ul className="edge-button-share-list">
            <li className="edge-button-share-unit">
              <FacebookShareButton url={shareUrl} quote={'Share'}>
                <FacebookIcon size={24} round />
              </FacebookShareButton>
            </li>
            <li className="edge-button-share-unit">
              <PinterestShareButton url={shareUrl} media={shareUrl}>
                <PinterestIcon size={24} round />
              </PinterestShareButton>
            </li>
            <li className="edge-button-share-unit">
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={24} round />
              </WhatsappShareButton>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>
        {`
          .social-share {
            display: flex;
            flex-wrap: wrap;
          }

          .social-icon {
            margin-right: 5px;
          }

          /*Edge Button Share*/
          .edge-button-share {
            border: 1px solid var(--accents-2);
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            min-width: 96px;
            padding: var(--edge-gap-half) var(--edge-gap);
            position: relative;
            text-align: center;
            transition: border-color 0.35s ease;
            will-change: border-color;
          }

          .edge-button-share-title {
            display: inline-block;
            position: relative;
            transition: opacity 0.35s ease, transform 0.35s ease,
              visibility 0.35s ease;
            will-change: opacity, transform, visibility;
          }

          .edge-button-share-list {
            display: flex;
            justify-content: space-between;
            left: 0;
            padding: 0 $edge-gap;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
          }

          .edge-button-share-unit {
            list-style: none;
            opacity: 0;
            transition: opacity 0.35s ease,
              transform 0.35s ease visibility 0.35s ease;
            transform: translateY(4px);
            visibility: hidden;
            will-change: opacity, transform, visibility;
          }

          .edge-button-share:hover {
            border-color: transparent;
          }

          .edge-button-share:hover .edge-button-share-title {
            opacity: 0;
            transform: translateY(4px);
            visibility: hidden;
          }
          .edge-button-share:hover .edge-button-share-unit {
            opacity: 1;
            transition: opacity 0.5s ease, transform 0.5s ease,
              visibility 0.5s ease;
            transform: translateY(0);
            visibility: visible;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(1) {
            transition-delay: 0.1s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(2) {
            transition-delay: 0.2s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(3) {
            transition-delay: 0.3s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(4) {
            transition-delay: 0.4s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(5) {
            transition-delay: 0.5s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(6) {
            transition-delay: 0.6s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(7) {
            transition-delay: 0.7s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(8) {
            transition-delay: 0.8s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(9) {
            transition-delay: 0.9s;
          }

          .edge-button-share:hover .edge-button-share-unit:nth-of-type(10) {
            transition-delay: 1s;
          }
        `}
      </style>
    </>
  )
}
