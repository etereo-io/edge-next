import fetch from '@lib/fetcher'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'
import { useState } from 'react'

function ResultItem({ item, onClick = () => {} }) {
  const [active, setActive] = useState(false)

  const onMouseEnter = () => {
    setActive(true)
  }

  const onMouseLeave = () => {
    setActive(false)
  }

  return (
    <>
      <div onClick={() => onClick(item)} className={`result-item ${active ? 'active' : ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {item.email} - {item.username}
      </div>
      <style jsx> 
        {
          `
          .result-item {
            padding: var(--edge-gap);
            border: var(--light-border);
            border-radius: var(--edge-radius);
          }

          .active {
            background: var(--accents-2);
          }
          `
        }
      </style>    
    </>
  )
}

export default function({ onSelect = () => {}}) {
  const [resultsOpened, setResultsOpened] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = (val) => {
    setLoading(true)
    setError(false) 


    fetch('/api/users?search=' + val)
      .then(found => {
        setLoading(false)
        setResults(found.results)
        setResultsOpened(true)
      })
      .catch(err => {
        setError(true)
        setLoading(false)
        setResultsOpened(false)
      })
  }

  const onChangeSearch = (ev) => {
    const val = ev.target.value
    setSearch(val)
    fetchData(val)
  }

  const onSelectItem = (item) => {
    setResultsOpened(false)
    onSelect(item)
    setSearch('')
  }

  return (
    <>
      <div className="user-searcher">
        <div className="input-wrapper">
          <input type="text" placeholder="Search user..." onChange={onChangeSearch} value={search}></input>
          { loading && <LoadingSpinner />}

        </div>
        {resultsOpened && <div className="results">
          {results.map(result => {
            return (
              <ResultItem item={result} onClick={onSelectItem}/>
            )
          })}
        </div>}
        { error && <div className="error-message">Error loading users </div>}
      </div>
      <style jsx>{
        `
        
        `
      }</style>
    </>
  )
}