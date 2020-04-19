import Button from '../../button/button'

import styles from './comment-form.module.scss'

export default function (props) {
  const onSubmit = () => {
    // TODO
  }
  return (
    <div className={styles.commentForm}>
      <form onSubmit={onSubmit}>
        <textarea placeholder="Your comment" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
