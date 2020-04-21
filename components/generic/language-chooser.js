import useTranslation from 'next-translate/useTranslation'

function LanguageChooser(props) {
  console.log(props)
  const { t, lang } = useTranslation()
  return <div className="language-chooser">Active language: {lang}</div>
}

export default LanguageChooser
