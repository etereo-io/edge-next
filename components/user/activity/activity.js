import Avatar from '../avatar/avatar'

export default function(props) {
  const activities = [{
    text: 'Done something sometime ago'
  }, {
    text: 'Done something sometime ago'
  }, {
    text: 'Done something sometime ago'
  }, {
    text: 'Done something sometime ago'
  }]

  return (
    <>
    <div className="activity-stream">
      {activities.map(ac => {
        return (
          <div className="activity-item">
            <div className="avatar"><Avatar width={60} src={props.user ? props.user.profile.img : null}/></div>
            <div className="message">{ac.text}</div>
          </div>
        )
      })}
    </div>
    <style jsx>{
      `
      .avatar {
        margin-right: 15px;
      }

      .activity-item {
        display: flex;
        border-bottom: 1px solid rgba(0,0,0,0.2);
        align-items: center;
      }
      `
    }</style>
  </>)
}