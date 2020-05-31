import Button from '@components/generic/button/button'

export default ({ following }) => {
  return (
    <>
      <Button
        padding={'0px'}
        success={following ? true : false}
        secondary={following ? false : true}
      >
        {following && (
          <div className="button-inner">
            <img src="/icons/icon-check.svg" /> <span>Following</span>
          </div>
        )}
        {!following && (
          <div className="button-inner">
            <img src="/icons/icon-check.svg" /> <span>Follow</span>
          </div>
        )}
      </Button>
      <style jsx>
        {`
          .button-inner {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 4px 10px 4px 8px;
          }

          .button-inner img {
            width: 15px;
            margin-right: 5px;
          }

          @media (max-width: 460px) {
            .button-inner span {
              display: none;
            }

            .button-inner img {
              margin-right: 0;
            }
          }
        `}
      </style>
    </>
  )
}
