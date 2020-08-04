import Avatar from '@components/user/avatar/avatar'

export default function GroupMembers({ members = [], visible = 3}) {
  const membersVisible = members.slice(0, visible)
  const extraMembers = members.length > visible ? members.length - visible : 0

  return (
    <>
      <div className="group-members">
          <div className="members-wrapper">
            <div className="members-title">Members</div>
            <div className="members-list">
              { membersVisible.map(member => {
                  return (
                    <div className="member-item"><Avatar radius={'100%'} width={'50px'} user={member} /></div>
                  )
                }) } 
              { extraMembers !== 0 && <div className="member-item"><div className="extra-members">+ {extraMembers}</div></div>} 
            </div>
          </div>
      </div>
      <style jsx>{
        `
        .members-list {
          display: flex;
        }

        .member-item {
          border-radius: 100%;
          overflow: hidden;
          background: white;
          padding: 2px;
        }

        .member-item:not(:first-child) {
          margin-left: -25px;
          -webkit-mask:radial-gradient(circle 30px at -5px -50%,transparent 99%,#fff 100%);
                  mask:radial-gradient(circle 30px at -5px -50%,transparent 99%,#fff 100%);
        }

        .extra-members {
          width: 50px;
          height: 50px;
          background: var(--edge-success);
          color: var(--edge-background);
          border-radius: 100%;
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        `
      }</style>
    </>
  )
}