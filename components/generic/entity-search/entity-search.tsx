import { memo, useState } from 'react'

import API from '@lib/api/api-endpoints'
import { ENTITY_TYPES } from '@lib/constants'
import { FieldOptionType } from '@lib/types/fields'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'
import fetch from '@lib/fetcher'

function ResultItem({ item, onClick = (item) => {}, entityNameGetter = (item) => item.id }) {
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
        {entityNameGetter(item)}
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
  entityNameGetter?: (val) => string,
  entities?: FieldOptionType[]
}

function EntitySearch({
  onChange = (val) => {},
  entity,
  entityType = '',
  placeholder = 'Search',
  entityNameGetter = (item) => item.id,
  entities
}: PropTypes) {

  const [resultsOpened, setResultsOpened] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')

  const fetchData = (val) => {
  

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

    if (!apiRoute && !entities) {
      setError(true)
      return
    }
    
    if (entities) {
      
      if (!val.trim()) {
        setResults([])
        setResultsOpened(false)
        return 
      }

      setResults(entities.filter(i => {
        return new RegExp(val.toLowerCase()).test(i.label.toLowerCase());
      }))
      setResultsOpened(true)
      return
    }

    setLoading(true)
    setError(false)

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

              <ResultItem key={`${entity}-result-item-${result.id || result.value}`} item={result} onClick={onSelectItem} entityNameGetter={entityNameGetter}/>
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

export default memo(EntitySearch)