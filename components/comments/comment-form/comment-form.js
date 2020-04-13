import Button from '../../button/button'

import './comment-form.scss'

export default function (props) {
  const onSubmit = () => {
    // TODO
  }
  return (
    <div className="comment-form">
      <form onSubmit={onSubmit}>
        <textarea placeholder="Your comment" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
