export default function({password = ''}) {
  
  const special = new RegExp("[$@$!%*#?&]").test(password)
  const uppercase = new RegExp("[A-Z]").test(password)
  const numbers = new RegExp("[0-9]").test(password)
  const lowercase = new RegExp("[a-z]").test(password)
  
  let ctr = 0

  if (special) ctr++

  if (uppercase) ctr++

  if (numbers) ctr++

  if (lowercase) ctr++

  if (password.length < 6 ) ctr--

  if (password.length > 9) ctr++

  if (ctr > 4) ctr = 4


  const calculateLevel = ctr => {
    switch(ctr) {
      case 0:
        return 'none'
      case 1:
        return 'weak'
      case 2: 
        return 'medium'
      case 3:
        return 'medium-high'
      case 4:
        return 'strong'
      default: 
        return 'none'
    }
  }

  const level = calculateLevel(ctr)

  return (
    <>
      <div className="password-strength-wrapper">
        <small>Password strength: <span>{level}</span></small>
        <div className="password-strength">
          <div className={`bar ${level || 'none'}`}></div>
        </div>
        {/*<span className="hint">Hint: Introduce capital letters, numbers and special characters to make your password strong</span>*/}
        <ul className="strenght-levels">
          <li className={`strenght-mark ${uppercase ? 'active': ''}`}><span className={`strenght-mark `}></span>Capital Letter</li>
          <li className={`strenght-mark ${numbers ? 'active': ''}`}><span className={`strenght-mark `}></span>Number</li>
          <li className={`strenght-mark ${special ? 'active': ''}`}><span className={`strenght-mark `}></span>Special Character</li>
        </ul>
      </div>
      <style jsx>{
        `
        .password-strength-wrapper {
          margin-top: var(--empz-gap-half-negative);
        }

        .password-strength {
          border: var(--light-border);
          border-radius: 15px;
          height: 15px;
          margin-top: 4px;
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        small {
          font-size: 12px;
          color: var(--accents-4);
          text-transform: capitalize;
        }

        small span {
          color: var(--empz-foreground);
        }

        .strenght-levels{
          display: flex;
          justify-content: space-between;
          margin-top: var(--empz-gap-half);
          width: 100%;
        }

        .strenght-levels li{
          color: var(--accents-4);
          font-size: 12px;
          font-weight: 400;
          list-style: none;
          transition: 0.25s ease;
        }

        .strenght-levels li span{
          border: 1px solid var(--accents-4);
          border-radius: 50%;
          display: inline-block;
          height: 15px;
          margin-right: var(--empz-gap-half);
          transition: 0.25s ease;
          vertical-align: middle;
          width: 15px;
        }

        .strenght-levels li.active{
          color: var(--empz-foreground);
        }

        .strenght-levels li.active span{
          background: var(--empz-success);
          border-color: var(--empz-success);
        }

        .bar {
          height: 15px;
          width: 0;
          height: 13px;
          transition: width 300ms linear, background 300ms linear;
          background: var(--accents-2);
        }

        .bar.weak {
          width: 25%;
          background: var(--empz-error);
        }

        .bar.medium {
          width: 50%;
          background: var(--empz-warning);
        }

        .bar.medium-high {
          width: 75%;
          background: var(--empz-success-light);
        }


        .bar.strong {
          width: 100%;
          background: var(--empz-success);
        }
        `
      }</style>
    </>
  )
}