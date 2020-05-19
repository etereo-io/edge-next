import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import { useUser } from '@lib/client/hooks'

export default function() {
  const { user } = useUser()
  return (
    <>
      <div className="toolbar">
        <div className="mobile-over">
          <img
            className="avatar"
            src="https://storage.googleapis.com/edge-next/profilePicture/1589732055819-hayder-avatar.jpg"
          />
          <div className="open-mobile-over"></div>
        </div>
        <UserProfileBox user={user} />

        <div className="general-tags">
          <ul>
            <li>
              <a href="#">#Web Development</a>
            </li>
            <li>
              <a href="#">#Organic</a>
            </li>
            <li>
              <a href="#">#Pachamama</a>
            </li>
            <li>
              <a href="#">#Aceitunas gazpacha</a>
            </li>
            <li>
              <a href="#">#Infusión de Jengibre</a>
            </li>
            <li>
              <a href="#">#Bacalao</a>
            </li>
            <li>
              <a href="#">#Naturaleza</a>
            </li>
            <li>
              <a href="#">#Cerezas y alcaparras</a>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{
        `
        .toolbar {
          align-items: center;
          background: var(--empz-background);
          border-radius: var(--empz-radius);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          color: var(--empz-foreground);
          display: flex;
          flex-flow: column;
          padding: var(--empz-gap);
          position: sticky;
          top: 80px;
        }

        .mobile-over {
          align-items: center;
          display: none;
          width: 100%;
          flex-flow: column;
          justify-content: space-between;
          background: var(--empz-background);
          content: '';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          transition: opacity 0.35s ease, visibility 0.35s ease;
          width: 100%;
        }

        .mobile-over .avatar {
          transition: 0.35s ease;
          max-width: 80px;
          width: 100%;
        }

        .mobile-over .open-mobile-over {
          border-bottom: 3px solid var(--accents-3);
          border-right: 3px solid var(--accents-3);
          transform: rotate(-45deg) translateX(-8px);
          margin-bottom: var(--empz-gap-double);
          display: block;
          height: var(--empz-gap);
          width: var(--empz-gap);
        }

        @media all and (max-width: 720px) {
          .mobile-over {
            display: flex;
          }
        }

        @media all and (max-width: 520px) {
          .mobile-over {
            flex-flow: row;
          }
          .mobile-over .avatar {
            height: 40px;
            width: auto;
          }
          .mobile-over .open-mobile-over {
            margin-bottom: 0;
            margin-right: var(--empz-gap-double);
            transform: rotate(-135deg) translateY(-6px);
          }
        }

        
        @media all and (max-width: 720px) {
          .toolbar {
            bottom: 0;
            box-shadow: var(--shadow-large);
            height: calc(100% - 56px);
            left: 0;
            overflow-x: hidden;
            overflow-y: scroll;
            position: fixed;
            top: auto;
            transition: 0.35s ease;
            max-width: 80px;
            width: 50%;
            z-index: 2;
          }
          .toolbar::-webkit-scrollbar {
            width: 0 !important;
          }
          .toolbar {
            overflow: -moz-scrollbars-none;
          }
          .toolbar {
            -ms-overflow-style: none;
          }
          .toolbar:hover {
            max-width: 260px;
          }

          .toolbar:hover .mobile-over {
            opacity: 0;
            visibility: hidden;
          }

          .toolbar:hover .avatar {
            border-radius: 50%;
            transform: translateY(50%);
          }
        }

        @media all and (max-width: 520px) {
          .toolbar {
            box-shadow: 0 10px 60px rgba(0, 0, 0, 0.5);
            max-height: 40px;
            max-width: none;
            padding: 0;
            width: 100vw;
          }
          .toolbar:hover {
            max-height: 100%;
            max-width: none;
            width: 100vw;
          }
        }

        .general-tags {
          border-top: 1px solid var(--accents-2);
          margin-top: var(--empz-gap);
          padding-top: var(--empz-gap);
          width: 100%;
        }

        .general-tags:before {
          content: 'Trending Tags';
          background: var(--empz-foreground);
          border-radius: 4px;
          color: var(--empz-background);
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: var(--empz-gap);
          padding: 4px 8px;
          text-align: center;
          text-transform: uppercase;
          width: fit-content;
        }

        .general-tags ul li {
          display: block;
          list-style: none;
        }

        .general-tags ul li a {
          border-radius: 4px;
          color: var(--empz-foreground);
          display: block;
          font-size: 14px;
          padding: var(--empz-gap-half);
          color: inherit;
          transition: background 0.35s ease;
          overflow: hidden;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }

        .general-tags ul li a:hover {
          background: var(--accents-2);
        }
        `
      }</style>
    </>
  )
}