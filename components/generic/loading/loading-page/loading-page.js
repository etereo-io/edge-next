import {memo} from 'react'

import Spinner from '../loading-spinner/loading-spinner'

function LoadingPage() {
  return (
    <>
      <div className="page-loading">
        <div className="loader">
          <Spinner width="100px" />
        </div>
      </div>
      <style jsx>
        {`
          .page-loading {
            position: relative;
            height: 600px;
          }

          .loader {
            width: 120px;
            height: 120px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
          }
        `}
      </style>
    </>
  )
}

export default memo(LoadingPage)
