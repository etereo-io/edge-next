import Layout from '@components/layout/admin/layout-admin'
import { usePermission } from '@lib/client/hooks'

const AdminPage = () => {
  const { available } = usePermission([`admin.stats`], '/')

  return (
    <>
      {available && (
        <Layout title="Stats">
          <header className="admin-title">
            <h1>Administration</h1>
            <small className="login-date">Last login: Sep 27, 2020</small>
          </header>
          <section className="stats-panel">
            <div className="stats-unit">
              <div className="stats-unit-view">
                <small className="stats-unit-percentage">
                  <svg className="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <defs/>
                    <path fill="var(--edge-success)" fillRule="evenodd" d="M7.9962 2a.6639.6639 0 00-.5049.228l-4.66 5.3334a.6667.6667 0 001.004.8773l3.498-4.0034v8.898a.6667.6667 0 101.3334 0V4.4467l3.4986 3.9927a.6667.6667 0 001.0028-.8787L8.5518 2.2923A.666.666 0 008 2h-.0038z" clipRule="evenodd"/>
                  </svg>
                </small>
                <div className="stats-title">
                  <b className="stats-unit-data">124</b>
                  <h4 className="stats-unit-title">Total Users</h4>
                </div>
              </div>
              <b className="stats-unit-increase">+21</b>
            </div>

            <div className="stats-unit">
              <div className="stats-unit-view">
                <small className="stats-unit-percentage">
                  <svg className="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <defs/>
                    <path fill="var(--edge-success)" fillRule="evenodd" d="M7.9962 2a.6639.6639 0 00-.5049.228l-4.66 5.3334a.6667.6667 0 001.004.8773l3.498-4.0034v8.898a.6667.6667 0 101.3334 0V4.4467l3.4986 3.9927a.6667.6667 0 001.0028-.8787L8.5518 2.2923A.666.666 0 008 2h-.0038z" clipRule="evenodd"/>
                  </svg>
                </small>
                <div className="stats-title">
                  <b className="stats-unit-data">124</b>
                  <h4 className="stats-unit-title">Total Users</h4>
                </div>
              </div>
              <b className="stats-unit-increase">+21</b>
            </div>

            <div className="stats-unit minus">
              <div className="stats-unit-view">
                <small className="stats-unit-percentage">
                  <svg className="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <defs/>
                    <path fill="var(--edge-error)" fillRule="evenodd" d="M7.996 14a.6641.6641 0 01-.5047-.228l-4.66-5.3334a.6667.6667 0 011.004-.8772l3.498 4.0033v-8.898a.6667.6667 0 111.3334 0v8.8866l3.4986-3.9927a.6667.6667 0 011.0028.8787l-4.6163 5.2683A.6659.6659 0 018 14h-.004z" clipRule="evenodd"/>
                  </svg>
                </small>
                <div className="stats-title">
                  <b className="stats-unit-data">124</b>
                  <h4 className="stats-unit-title">Total Users</h4>
                </div>
              </div>
              <b className="stats-unit-increase">-16</b>
            </div>

            <div className="stats-unit">
              <div className="stats-unit-view">
                <small className="stats-unit-percentage">
                  <svg className="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <defs/>
                    <path fill="var(--edge-success)" fillRule="evenodd" d="M7.9962 2a.6639.6639 0 00-.5049.228l-4.66 5.3334a.6667.6667 0 001.004.8773l3.498-4.0034v8.898a.6667.6667 0 101.3334 0V4.4467l3.4986 3.9927a.6667.6667 0 001.0028-.8787L8.5518 2.2923A.666.666 0 008 2h-.0038z" clipRule="evenodd"/>
                  </svg>
                </small>
                <div className="stats-title">
                  <b className="stats-unit-data">124</b>
                  <h4 className="stats-unit-title">Total Users</h4>
                </div>
              </div>
              <b className="stats-unit-increase">+21</b>
            </div>
          </section>

          <section className="stats-quick-view">
            <div className="stats-unit">
              <b className="title">
                Users
              </b>
            </div>
            <div className="stats-unit">
              <b className="title">
                Groups
              </b>
            </div>
          </section>
        </Layout>
      )}

      <style jsx>{`
        .admin-title {
          align-items: center;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .admin-title .login-date{
          color: var(--accents-5);
          font-size: 12px;
        }

        h1 {
          font-size: 23px;
          font-weight: 500;
        }

        @media all and (max-width: 720px) {
          h1 {
            font-size: 18px;
          }
        }

        .stats-panel{
          align-items: start;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 40px 0 24px;
        }

        .stats-unit {
          align-items: center;
          background: var(--edge-background);
          border-radius: 8px;
          box-shadow: var(--shadow-smallest);
          display: flex;
          justify-content: space-between;
          padding: 24px;
          position: relative;
          transition: box-shadow 0.35s ease-in, transform 0.35s ease-in;
          width: 23%;
        }

        .stats-unit-view {
          align-items: center;
          display: flex;
        }

        @media all and (max-width: 600px) {
          .stats-unit {
            margin-bottom: 16px;
            width: calc(50% - 16px);
          }
        }

        .stats-panel .stats-unit:hover {
          box-shadow: var(--shadow-hover);
          transform: scale(1.025);
        }

        .stats-unit-data {
          display: block;
          font-size: 23px;
        }

        .stats-unit-title {
          color: var(--accents-4);
          display: block;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
        }

        .stats-unit-percentage {
          align-items: center;
          background: var(--edge-success-soft);
          border-radius: 8px;
          display: flex;
          font-size: 14px;
          font-weight: 600;
          padding: 0;
          margin-right: 8px;
          justify-content: center;
          height: 48px;
          width: 48px;
        }

        @media all and (max-width: 990px){
          .stats-unit-percentage {
            height: 36px;
            width: 36px;
          }
        }

        @media all and (max-width: 960px) {
          .stats-unit{
            padding: 16px;
          }
          .stats-unit-increase{
            font-size: 12px;
            position: absolute;
            top: 4px;
            right: 8px;
          }
        }

        @media all and (min-width: 600px) and (max-width: 760px) {
          .stats-unit-percentage {
            height: 24px;
            width: 24px;
          }

          .stats-unit-data {
            font-size: 21px;
          }

          .stats-unit-title {
            font-size: 12px;
          }
        }

        .stats-unit-increase {
          color: var(--edge-success);
        }

        .arrow{
          width: 16px;
        }
        
        .stats-unit.minus .stats-unit-percentage{
          background: var(--edge-error-soft);
        }

        .stats-unit.minus .stats-unit-increase{
          color: var(--edge-error);
        }

        .stats-quick-view {
          display: flex;
          justify-content: space-between;
        }

        .stats-quick-view .stats-unit{
          align-items: start;
        }

        .stats-quick-view .stats-unit .title{
          font-size: 12px;
          text-transform: uppercase;
        }

        .stats-quick-view .stats-unit:first-of-type {
          width: 74.5%;
        }
      `}</style>
    </>
  )
}

export default AdminPage
