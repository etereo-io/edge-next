import React, { Component } from 'react'

export default class ProgressiveImage extends Component {
  constructor(props) {
    super(props)
    this.state = { highResImageLoaded: true }
  }
  render() {
    const { highResImageLoaded } = this.state

    return (
      <span>
        <img
          onLoadStart={() => {
            this.setState({ highResImageLoaded: false })
          }}
          onLoad={() => {
            this.setState({ highResImageLoaded: true })
          }}
          ref={(img) => {
            this.highResImage = img
          }}
          src={this.props.src}
        />
        <div
          className={`loading-overlay`}
          style={{ opacity: highResImageLoaded ? '0' : '1' }}
        ></div>
        <style jsx>{`
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            background: rgba(0, 0, 0, 0.3);
            width: 100%;
            height: ${this.props.height}px;
          }

          img {
            height: 100%;
            object-fit: cover;
            user-select: none;
            width: 100%;
          }
        `}</style>
      </span>
    )
  }
}
