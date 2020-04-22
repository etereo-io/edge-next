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
} from "react-share";

export default function (props) {
  const shareUrl = props.shareUrl ? props.shareUrl : (typeof window !== 'undefined' ?  String(window.location) : '')
  return (
    <>
      <div className="social-share">
        <div className="social-icon">
          <FacebookShareButton
            url={''}
            quote={'Share'}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

        </div>

        <div className="social-icon">
          <PinterestShareButton
            url={String(window.location)}
            media={shareUrl}
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>
        </div>

        <div className="social-icon">
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={32} round/>
          </WhatsappShareButton>
        </div>
      </div>
      <style jsx>
        {
          `
          .social-share {
            display: flex;
            flex-wrap: wrap;
          }

          .social-icon {
            margin: 5px;
          }
          `
        }
      </style>
    </>
  )
}