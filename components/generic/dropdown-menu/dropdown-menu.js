import { useState } from 'react'
export default function (props) {
  const [open, setOpened] = useState(props.open || false)
  const align = props.align || 'left'
  const toggleMenu = () => {
    setOpened(!open)
  }

  return (
    <>
      <div className="dropdown-menu">
        <div
          onClick={toggleMenu}
          className={`dropdown-menu-indicator ${open ? 'open' : 'closed'}`}
          aria-label={`${open ? 'close menu' : 'open menu'}`}
        ></div>
        {open && (
          <div className={`dropdown-menu-wrapper ${align}`}>
            <nav className="dropdown-menu-nav">{props.children}</nav>
          </div>
        )}
      </div>
      <style jsx>{`
        .dropdown-menu {
          width: 36px;
          height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--empz-radius);
          background: transparent;
          cursor: pointer;
          transition: background-color 0.2s ease;
          position: relative;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

        .dropdown-menu-indicator {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .dropdown-menu-indicator::before,
        .dropdown-menu-indicator::after {
          content: '';
          display: block;
          height: 2px;
          width: 24px;
          background-color: var(--empz-foreground);
          transition: transform 0.15s ease;
        }

        .dropdown-menu-indicator::before {
          transform: translateY(-4px) rotate(0deg);
        }

        .dropdown-menu-indicator::after {
          transform: translateY(4px) rotate(0deg);
        }

        .dropdown-menu-indicator.open::before {
          transform: translateY(1px) rotate(45deg);
        }

        .dropdown-menu-indicator.open::after {
          transform: translateY(0) rotate(-45deg);
        }

        .dropdown-menu-wrapper {
          top: 35px;
          position: absolute;
          background: var(--empz-background);
          color: var(--empz-foreground);
          padding: var(--empz-gap);
          box-shadow: var(--shadow-medium);
          z-index: 1;
        }

        .dropdown-menu-wrapper.left {
          left: 0;
        }

        .dropdown-menu-wrapper.right {
          right: 0;
        }

        nav.dropdown-menu-nav > :global(ul) {
          list-style: none;
        }

        nav.dropdown-menu-nav > :global(ul li) {
          user-select: none;
          display: flex;
          align-items: center;
          width: 100%;
          font-size: 1rem;
          padding: 4px;
        }

        nav.dropdown-menu-nav > :global(ul li a) {
          text-decoration: none;
          color: var(--empz-foreground);
        }

        nav.dropdown-menu-nav > :global(.spacer) {
          display: block;
          width: 1px;
          height: 1px;
          margin-left: 15.25pt;
          margin-top: 15.25pt;
        }
      `}</style>
    </>
  )
}
