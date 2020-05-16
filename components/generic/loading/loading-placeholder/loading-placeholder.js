export default function ({ width, height, borderRadius }) {
  return (
    <>
      <div className="loading-placeholder"></div>
      <style jsx>{`
        .loading-placeholder {
          width: ${width || '200px'};
          height: ${height || '20px'};
          border-radius: ${typeof borderRadius !== 'undefined'
            ? borderRadius
            : 'var(--empz-radius)'};
          background: linear-gradient(
            -45deg,
            var(--accents-1),
            var(--accents-2),
            var(--accents-1),
            var(--accents-2)
          );
          background-size: 400% 400%;
          animation: gradient 10s ease infinite;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </>
  )
}
