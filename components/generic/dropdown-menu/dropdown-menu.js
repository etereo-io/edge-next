import { useState, memo } from 'react'

function DropDownMenu(props) {
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
          <div
            className={`dropdown-menu-wrapper ${align}`}
            style={{ width: props.width || '155px' }}
          >
            <nav className="dropdown-menu-nav">{props.children}</nav>
          </div>
        )}
      </div>
      <style jsx>{`
        .dropdown-menu {
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--edge-radius);
          background: var(--accents-2);
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
          width: 21px;
          background-color: var(--edge-foreground);
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
          background: var(--edge-background);
          color: var(--edge-foreground);
          padding: var(--edge-gap-half);
          box-shadow: var(--shadow-medium);
          z-index: var(--z-index-minimum);
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
          color: var(--edge-foreground);
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

export default memo(DropDownMenu)
