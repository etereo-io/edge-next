import Button from '../../generic/button/button'

export default function (props) {
  const onSubmit = () => {
    // TODO
  }
  return (
    <>
      <div className=''>
        <form onSubmit={onSubmit} className='form'>
          <textarea  placeholder="Your comment" />
          <Button type="submit">Send</Button>
        </form>
      </div>
      <style jsx>{
        `
        
          form {
            display: flex;
            max-width: 500px;
            margin: 0 auto;
          }
        
        `
      }</style>
    </>
  )
}
