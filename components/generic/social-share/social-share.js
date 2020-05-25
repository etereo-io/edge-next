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

export default function (props) {
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
        `}
      </style>
    </>
  )
}
