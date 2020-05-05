import React from 'react'


const MIME_TYPES = [
  'video/webm;codecs=vp8',
  'video/webm;codecs=h264',
  'video/webm;codecs=vp9',
  'video/webm',
]

export default class VideoRecorder extends React.Component {
  constructor(props) {
    super(props)
    this.videoPreviewRef = React.createRef()
    this.state = {
      recording: false,
      isCameraOn: false,
      timerCount: 0,
      timerStart: 0,
      stream: null,
      error: false,
      isCountDown: false,
      countdown: 3,
    }
  }

  componentDidMount() {
    const isInlineRecordingSupported =
      !!window.MediaSource && !!window.MediaRecorder && !!navigator.mediaDevices

    const isVideoInputSupported =
      document.createElement('input').capture !== undefined

    this.setState({
      isInlineRecordingSupported,
      isVideoInputSupported,
    })
  }

  startTimer() {
    this.setState({
      timerStart: Date.now() - this.state.timerCount,
    })
    this.timer = setInterval(
      () =>
        this.setState({
          timerCount: Date.now() - this.state.timerStart,
        }),
      1
    )
  }

  stopTimer() {
    this.setState({ timerCount: 0 })
    clearInterval(this.timer)
  }

  stopRecording() {
    this.handleStop()
  }

  getMimeType = () => {
    if (this.props.mimeType) {
      return this.props.mimeType
    }

    const mimeType = window.MediaRecorder.isTypeSupported
      ? MIME_TYPES.find(window.MediaRecorder.isTypeSupported)
      : 'video/webm'

    return mimeType || ''
  }

  countDown = () => {
    if (this.state.countdown <= 0) {
      this.setState({
        isCountDown: false,
      })
      this.startRecording()
    } else {
      this.setState({
        countdown: this.state.countdown - 1,
      })
      setTimeout(() => this.countDown(), 1000)
    }
  }

  startCountDown = () => {
    this.setState({
      countdown: 3,
      isCountDown: true,
    })

    setTimeout(() => this.countDown(), 1000)
  }

  startRecording = () => {
    this.recordedBlobs = []
    const options = {
      mimeType: this.getMimeType(),
    }

    try {
      this.setState({
        recording: true,
      })
      this.startTimer()

      this.mediaRecorder = new window.MediaRecorder(this.stream, options)
      this.mediaRecorder.addEventListener('stop', this.handleStop)
      this.mediaRecorder.addEventListener('error', this.handleError)
      this.mediaRecorder.addEventListener(
        'dataavailable',
        this.handleDataAvailable
      )

      const chunkSize = 250
      this.mediaRecorder.start(chunkSize) // collect 10ms of data

      // mediaRecorder.ondataavailable should be called every 10ms,
      // as that's what we're passing to mediaRecorder.start() above
      const dataAvailableTimeout = 500
      setTimeout(() => {
        if (this.recordedBlobs.length === 0) {
          console.error('Tiemout when recording video')
          this.setState({
            error: true,
          })
        }
      }, dataAvailableTimeout)
    } catch (err) {
      console.error("Couldn't create MediaRecorder", err, options)
      this.setState({
        error: true,
      })
    }
  }

  handleDataAvailable = (event) => {
    if (this.isDataHealthOK(event)) {
      this.recordedBlobs.push(event.data)
    }
  }

  handleDataIssue = (event) => {
    const error = new Error('Data issue')
    console.error(error.message, event)
    this.setState({
      error: true,
    })
    if (this.state.isCameraOn) {
      this.turnCameraOff()
    }
    return false
  }

  isDataHealthOK = (event) => {
    if (!event.data) return this.handleDataIssue(event)

    const chunkSize = 250

    const dataCheckInterval = 2000 / chunkSize

    // in some browsers (FF/S), data only shows up
    // after a certain amount of time ~everyt 2 seconds
    const blobCount = this.recordedBlobs.length
    if (blobCount > dataCheckInterval && blobCount % dataCheckInterval === 0) {
      const blob = new window.Blob(this.recordedBlobs, {
        type: this.getMimeType(),
      })
      if (blob.size <= 0) return this.handleDataIssue(event)
    }

    return true
  }

  handleStop = () => {
    if (!this.recordedBlobs || this.recordedBlobs.length <= 0) {
      console.error('Error recording blob')
      this.setState({
        error: true,
      })
      return
    }

    const videoBlob =
      this.recordedBlobs.length === 1
        ? this.recordedBlobs[0]
        : new window.Blob(this.recordedBlobs, {
            type: this.getMimeType(),
          })

    const startedAt = this.state.timerStart
    const duration = this.state.timerCount
    this.stopTimer()

    // if this gets executed too soon, the last chunk of data is lost on FF
    this.mediaRecorder.ondataavailable = null

    this.setState({
      recording: false,
      videoBlob,
      videoUrl: window.URL.createObjectURL(videoBlob),
    })

    this.turnCameraOff()

    this.props.onRecordingComplete(videoBlob, startedAt, duration)
  }

  turnCameraOn(ev) {
    ev.stopPropagation()

    const fallbackContraints = {
      audio: true,
      video: true,
    }

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .catch((err) => {
        // there's a bug in chrome in some windows computers where using `ideal` in the constraints throws a NotReadableError
        if (
          err.name === 'NotReadableError' ||
          err.name === 'OverconstrainedError'
        ) {
          console.warn(
            `Got ${err.name}, trying getUserMedia again with fallback constraints`
          )
          return navigator.mediaDevices.getUserMedia(fallbackContraints)
        }
        throw err
      })
      .then((s) => {
        this.setState({
          isCameraOn: true,
        })

        this.stream = s

        if (window.URL) {
          this.videoPreviewRef.srcObject = s
        } else {
          this.videoPreviewRef.src = s
        }

        // this.videoPreviewRef.current.srcObject = s
      })
      .catch((error) => {
        console.error(error)
        // setError(true)
        this.setState({
          error: true,
        })
      })
  }

  turnCameraOff() {
    this.stream && this.stream.getTracks().forEach((stream) => stream.stop())
    this.setState({
      isCameraOn: false,
    })
  }

  render() {
    if (!this.state.isInlineRecordingSupported || this.state.error) {
      return (
        <div className="video-recorder">
          <div className="unsupported">
            This browser does not support video recording
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="video-recorder">
          <div className="video-wrapper">
            <video autoPlay ref={(ref) => (this.videoPreviewRef = ref)}></video>
            {!this.state.isCameraOn && (
              <div className="turn-camera-on">
                <div onClick={this.turnCameraOn.bind(this)}>Enable camera</div>
              </div>
            )}

            {this.state.isCameraOn &&
              !this.state.recording &&
              this.state.isCountDown && (
                <div className="timeout">{this.state.countdown}</div>
              )}
            <div className="actions">
              {this.state.isCameraOn &&
                !this.state.recording &&
                !this.state.isCountDown && (
                  <div
                    className="start-recording"
                    title="Empezar a grabar"
                    onClick={this.startCountDown.bind(this)}
                  ></div>
                )}
              {this.state.isCameraOn && this.state.recording && (
                <div
                  className="stop-recording"
                  title="Dejar de grabar"
                  onClick={this.stopRecording.bind(this)}
                ></div>
              )}
              {this.state.isCameraOn && this.state.recording && (
                <div className="counter">
                  {Math.floor(this.state.timerCount / 1000)}s
                </div>
              )}
            </div>
          </div>
        </div>
      <style jsx>{
        `
        .video-wrapper {
          position: relative;
          background: black;
        }
      
        .turn-camera-on {
          cursor: pointer;
          padding: 15px;
          background: var(--empz-foreground);
          text-align: center;
          color: white;
      
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      
        .start-recording {
          width: 25px;
          height: 25px;
          background: red;
          border-radius: 100%;
          border: 4px solid white;
          cursor: pointer;
        } 
      
        .stop-recording {
          width: 25px;
          height: 25px;
          background: red;
          border: 4px solid white;
          cursor: pointer;
        }
      
        .counter {
          color: white;
          padding-left: 10px;
        }
      
        .timeout {
          background: black;
          color: white;
          padding: 15px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      
        .actions {
          top: 10px;
          left: 60px;
          position: absolute;
          display: flex;
          align-items: center;
        }
      
        video {
          width: 300px;
          height: 200px;
          margin: 0 auto;
          display: block;
        }
        `
      }</style>
      </>
    )
  }
}
