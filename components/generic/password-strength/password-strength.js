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
        <span className="hint">Hint: Introduce capital letters, numbers and special characters to make your password strong</span>
      </div>
      <style jsx>{
        `
        .password-strength-wrapper {
          margin-top: var(--empz-gap-half);
        }

        .password-strength {
          width: 100%;
          height: 15px;
          position: relative;
          border: var(--light-border);
        }

        span {
          font-size: 13px;
          color: var(--accents-5);
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