const Refactor = () => {
  return (
    <section className="refactor">
      {/*Header*/}
      <header>
        <div className="edge-container">
          {/*Logo*/}
          <h1 className="edge-logo">edge</h1>

          {/*User Actions*/}
          <div className="edge-user-actions">
            {/*Searchbox*/}
            <div className="edge-searchbox">
              <img src="/refactor/icon-search.svg" />
              <input type="text" placeholder="Search" />
            </div>
            {/*User Actions Buttons*/}
            <div className="edge-user-actions-buttons">
              <img src="/refactor/icon-configuration.svg" />
              <img src="/refactor/icon-messages.svg" />
            </div>
            {/*Avatar*/}
            <div className="edge-avatar has-status available">
              <img
                className="edge-avatar-image"
                src="https://storage.googleapis.com/edge-next/profilePicture/1590225157254-image_processing20200203-15714-1coq9nh.jpg"
              />
            </div>
            {/*Button*/}
            <button className="edge-button">Write a post</button>
          </div>
        </div>
      </header>

      {/*Edge Panels*/}
      <div className="edge-panels three-panels container">
        {/*Edge Panel User*/}
        <aside className="edge-panel-user">
          {/*Edge Avatar User*/}
          <div className="edge-avatar-user">
            {/*Avatar*/}
            <div className="edge-avatar medium has-status available">
              <img
                className="edge-avatar-image"
                src="https://storage.googleapis.com/edge-next/profilePicture/1590225157254-image_processing20200203-15714-1coq9nh.jpg"
              />
            </div>
            <div className="edge-avatar-user-info">
              <strong className="edge-user-name">Hayder Al-Deen</strong>
              <small className="edge-user-alias">@hayder</small>
            </div>
          </div>

          {/*Panel User Navigation*/}
          <nav className="edge-panel-user-navigation">
            <ul>
              <li>
                <a href="#">
                  <img src="/refactor/icon-groups.svg" />
                  My Groups
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/refactor/icon-rewards.svg" />
                  Rewards
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/refactor/icon-courses.svg" />
                  Courses
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="/refactor/icon-analytics.svg" />
                  Analytics
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/*Edge Panel Content*/}
        <section className="edge-panel-content">
            <div className="edge-panel-content-inner">
                asdf
            </div>
        </section>
        {/*Edge Panel Ads*/}
        <aside className="edge-panel-ads">asdf</aside>
      </div>
    </section>
  )
}
export default Refactor
