import Placeholder from '@components/generic/loading/loading-placeholder/loading-placeholder'
import loadingPlaceholder from '../../generic/loading/loading-placeholder/loading-placeholder'

export default function({ user, loading = false }) {
  return (
    <>
    <div className="cover-image-wrapper">
      {loading && <loadingPlaceholder width={'100%'} height={'100%'} />}
      {!loading && <div className="cover-image" ></div>}
    </div>
    <style jsx>{`
      .cover-image-wrapper {
        height: 200px;
      }  
      .cover-image {
        background-size: cover;
        height: 100%;
        backgroun-pozition: center;
        background: url("${user && user.profile.cover ? user.profile.cover.path : '/static/demo-images/cover/clouds.jfif'}");
      }
    `}</style>
    </>
  )
}