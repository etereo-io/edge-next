export default function({password = ''}) {
  const calculateLevel = () => {
    const matchedCase = new Array();
    matchedCase.push("[$@$!%*#?&]"); // Special Charector
    matchedCase.push("[A-Z]");      // Uppercase Alpabates
    matchedCase.push("[0-9]");      // Numbers
    matchedCase.push("[a-z]");     // Lowercase Alphabates

    // Check the conditions
    let ctr = 0;
    for (let i = 0; i < matchedCase.length; i++) {
        if (new RegExp(matchedCase[i]).test(password)) {
            ctr++;
        }
    }

    if (password.length < 6) {
      ctr--
    }

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

  const level = calculateLevel()

  return (
    <>
      <div className="password-strength-wrapper">
        <span>Password strength: {level}</span>
        <div className="password-strength">
          <div className={`bar ${level || 'none'}`}></div>
        </div>
        {/*<span className="hint">Hint: Introduce capital letters, numbers and special characters to make your password strong</span>*/}
        <ul className="strenght-levels">
          <li><span className="strenght-mark"></span>Capital Letter</li>
          <li><span className="strenght-mark"></span>Number</li>
          <li><span className="strenght-mark"></span>Special Character</li>
        </ul>
      </div>
      <style jsx>{
        `
        .password-strength-wrapper {
          margin-top: var(--empz-gap-half);
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

        span {
          font-size: 13px;
          color: var(--accents-5);
        }

        .strenght-levels{
          display: flex;
          justify-content: space-between;
          margin-top: var(--empz-gap-half);
          width: 100%;
        }

        .strenght-levels li{
          color: var(--accents-5);
          font-size: 12px;
          list-style: none;
        }

        .strenght-levels li span{
          border: 1px solid var(--accents-4);
          border-radius: 50%;
          display: inline-block;
          height: 15px;
          vertical-align: middle;
          margin-right: var(--empz-gap-half);
          width: 15px;
        }

        .strenght-levels li.correct{
          color: var(--empz-success);
        }

        .strenght-levels li.correct span{
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