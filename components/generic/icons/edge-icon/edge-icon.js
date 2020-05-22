export default (props) => {
  return (
    <>
      <div className={`edge-icon ${props.alt ? 'alt' : ''}`}></div>
      <style jsx>{`
        .edge-icon {
          width: 24px;
          height: 24px;
          border-radius: 100%;
          border: 1px solid var(--edge-foreground);
        }

        .edge-icon.alt {
          border: 1px solid var(--edge-background);
        }
      `}</style>
    </>
  )
}
