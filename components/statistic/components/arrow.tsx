import React, { memo } from 'react'

type Props = {
  isError?: boolean
}

function Arrow({ isError = false }: Props) {
  return (
    <>
      {isError ? (
        <svg
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 16"
        >
          <defs />
          <path
            fill="var(--edge-error)"
            fillRule="evenodd"
            d="M7.996 14a.6641.6641 0 01-.5047-.228l-4.66-5.3334a.6667.6667 0 011.004-.8772l3.498 4.0033v-8.898a.6667.6667 0 111.3334 0v8.8866l3.4986-3.9927a.6667.6667 0 011.0028.8787l-4.6163 5.2683A.6659.6659 0 018 14h-.004z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 16"
        >
          <defs />
          <path
            fill="var(--edge-success)"
            fillRule="evenodd"
            d="M7.9962 2a.6639.6639 0 00-.5049.228l-4.66 5.3334a.6667.6667 0 001.004.8773l3.498-4.0034v8.898a.6667.6667 0 101.3334 0V4.4467l3.4986 3.9927a.6667.6667 0 001.0028-.8787L8.5518 2.2923A.666.666 0 008 2h-.0038z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <style jsx>
        {`
          .arrow {
            width: 16px;
          }
        `}
      </style>
    </>
  )
}

export default memo(Arrow)
