import { useState, useEffect } from 'react'

export default function toggle({
  value = false,
  onChange = () => {},
  ...props
}) {
  const [enabled, setEnabled] = useState(!!value)

  useEffect(() => {
    setEnabled(!!value)
  }, [value])

  const onToggle = () => {
    setEnabled(!enabled)
    onChange(!enabled)
  }

  return (
    <>
      <div
        onClick={onToggle}
        className={`toggle ${enabled ? 'enabled' : null}`}
        data-testid={props['data-testid']}
      >
        <div className="toggle-ball"></div>
      </div>
      <style jsx>{`
        .toggle {
          cursor: pointer;
          border: var(--light-border);
          border-radius: 12px;
          background: var(--edge-foreground);
          position: relative;
          width: 56px;
          height: 24px;
          padding: 2px;
          transition: background 0.2s ease;
        }

        .toggle-ball {
          border-radius: 100%;
          border: 2px solid var(--edge-background);
          background: var(--edge-background);
          position: absolute;
          top: 50%;
          transition: left 0.2s ease, transform 0.2s ease;
          transform: translateY(-50%) translateX(4px);
          left: 0;
          height: 16px;
          width: 16px;
          will-change: left, transform;
        }

        .toggle.enabled {
          background: var(--edge-success);
          border-color: var(--edge-success);
        }

        .toggle.enabled .toggle-ball {
          left: 100%;
          transform: translateY(-50%) translateX(calc(-100% - 4px));
        }
      `}</style>
    </>
  )
}
