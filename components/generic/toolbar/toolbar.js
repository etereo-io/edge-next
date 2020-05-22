import UserProfileBox from '@components/user/user-profile-box/user-profile-box'
import { useUser } from '@lib/client/hooks'
import Button from '@components/generic/button/button'
import Avatar from '@components/user/avatar/avatar'
export default function () {
  const { user, finished } = useUser() 
  return (
    <>
      <div className="toolbar">
        <div className="mobile-over">
          <Avatar
              loading={!finished}
              src={user && user.profile && user.profile.picture ? user.profile.picture.path : null}
            />
          
          <div className="open-mobile-over"></div>
        </div>
        { (!finished || user) && <UserProfileBox user={user} />}
        { (finished  && !user) && <div><Button href='/auth/login'>Sign in</Button></div>}

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
      <style jsx>{`
        .toolbar {
          align-items: center;
          background: var(--empz-background);
          border-radius: var(--empz-radius);
          box-shadow: var(--shadow-smallest);
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

        .mobile-over  > :global(.avatar) {
          transition: 0.35s ease;
          max-width: 80px;
          height: 80px;
          width: 100%;
        }

        .mobile-over .open-mobile-over {
          background: var(--accents-2);
          border-radius: 4px;
          height: 32px;
          margin-bottom: var(--empz-gap-double);
          position: relative;
          width: 32px;
        }

        .mobile-over .open-mobile-over::before {
          border-bottom: 2px solid var(--accents-3);
          border-right: 2px solid var(--accents-3);
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: rotate(-45deg) translate(-20%,-80%);
          display: block;
          height: var(--empz-gap-half);
          width: var(--empz-gap-half);
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
          .mobile-over > :global(.avatar) {
            height: 40px;
            width: 40px;
          }
          .mobile-over .open-mobile-over {
            margin-bottom: 0;
            margin-right: var(--empz-gap-double);
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
            z-index: var(--z-index-toolbar);
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

          .toolbar:hover > :global(.avatar) {
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
      `}</style>
    </>
  )
}
