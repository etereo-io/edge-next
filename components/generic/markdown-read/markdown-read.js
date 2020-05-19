import styles from '../../../styles/markdown.module.scss'

const MarkdowRead = ({ htmlString }) => {
  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: htmlString }}
    ></div>
  )
}

export default MarkdowRead
