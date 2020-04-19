import Link from 'next/link'
import config from '../../lib/config'
import styles from  './footer.module.scss'

export default function () {
  
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['site-logo']}>
          <img className={styles['site-logoImg']} src="/static/logos/logo.svg" alt="Site logo" />
        </div>

        <div className={styles.links}>
          <ul className={styles.ul}>
            <li className={styles.li}>
              <span className={styles.strong}>Already have an account? </span>
              <Link href="/login"><a className={styles.a} title="sign in">Sign-in</a></Link>
            </li>
            <li className={styles.li}>
              <Link href="/signup"><a className={styles.a} title="get started">Get Started</a></Link>
            </li>
          </ul>

          <ul className={styles.ul}>
            <li className={styles.li}>
              <Link href="/about"><a className={styles.a} title="about">About</a></Link>
            </li>
            <li className={styles.li}>
              <Link href="/careers"><a className={styles.a} title="careers">Careers</a></Link>
            </li>
          </ul>
        </div>

        <div className={styles.copy}>© 2020 {config.title}</div>
      </div>
    </footer>
  )
}
