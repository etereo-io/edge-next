import API from '@lib/api/api-endpoints'
import { ENTITY_TYPES } from '@lib/constants'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'
import fetch from '@lib/fetcher'
import { useState } from 'react'

function ResultItem({ item, onClick = (item) => {}, entityName = (item) => item.id }) {
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
        {entityName(item)}
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

type PropTypes = {
  onChange: (val) => void,
  entity: string,
  entityType?: string,
  placeholder?: string,
  entityName?: (val) => string
}

export default function Named({
  onChange = (val) => {}, 
  entity, 
  entityType = '',
  placeholder = 'Search',
  entityName = (item) => item.id
}: PropTypes) {

  const [resultsOpened, setResultsOpened] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = (val) => {
    setLoading(true)
    setError(false) 

    let apiRoute = ''

    switch(entity) {
      case ENTITY_TYPES.USER:
        apiRoute = `${API.users}?search=${val}`
        break;
      case ENTITY_TYPES.CONTENT:
        apiRoute = `${API.content[entityType]}?search=${val}`
        break;
      case ENTITY_TYPES.GROUP:
        apiRoute = `${API.groups[entityType]}?search=${val}`
        break;
      
      default: 
        break;
    }

    if (!apiRoute) {
      setError(true)
      return
    }


    fetch(apiRoute)
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
    onChange(item)
    setSearch('')
  }


  return (
    <>
      <div className="entity-searcher">
        <div className="input-wrapper">
          <input type="text" placeholder={placeholder} onChange={onChangeSearch} value={search}></input>
          { loading && <LoadingSpinner />}

        </div>
        {resultsOpened && <div className="results">
          {results.map(result => {
            return (
              
              <ResultItem key={`${entity}-result-item-${result.id}`} item={result} onClick={onSelectItem} entityName={entityName}/>
            )
          })}
        </div>}
        { error && <div className="error-message">Error loading items </div>}
      </div>
      <style jsx>{
        `
        
        `
      }</style>
    </>
  )
}