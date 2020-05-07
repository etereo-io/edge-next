import { useState } from 'react'

import VideoRecorder from './video-recorder'

const RecordedVideo = (props) => {
  const videoUrl = URL.createObjectURL(props.video.blob)
  return (
    <div className="recorded-video">
      <div className="delete-video-item" onClick={props.onDelete}>
        Delete
      </div>
      <video src={videoUrl} />
    </div>
  )
}

export default function (props) {
  const [videos, setVideos] = useState([])

  const handleVideoRecordingComplete = (blob) => {
    setVideos([
      ...videos,
      { name: 'video-' + Date.now() + '-webcam.mp4', blob: blob },
    ])
  }

  const removeWebcamVideo = (index) => {
    setVideos(videos.filter((item, i) => i !== index))
  }

  return (
    <div className="sentence-form-wrapper">
      <div className="record-area-wrapper">
        <div className="recorded-videos">
          {videos.map((v, index) => (
            <RecordedVideo
              video={v}
              onDelete={() => removeWebcamVideo(index)}
            />
          ))}
        </div>
        <VideoRecorder
          onRecordingComplete={(videoBlob) => {
            handleVideoRecordingComplete(videoBlob)
          }}
        />
      </div>
    </div>
  )
}
