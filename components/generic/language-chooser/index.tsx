import { useRouter } from 'next/router'

function LanguageChooser(props) {
  const router = useRouter()

  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const val = ev.target.value
    router.push({
      pathname: router.pathname,
      query: {...router.query},
    }, router.pathname, { locale: val })
  }
  
  return <div className="language-chooser">
    <select onChange={onChange} value={router.locale}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  </div>
}

export default LanguageChooser
