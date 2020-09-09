import React, { memo, useCallback, useState, useRef } from 'react'
import useSWR from 'swr'

import { UserType } from '@lib/types'
import config from '@lib/config'
import API from '@lib/api/api-endpoints'
import fetcher from '@lib/fetcher'
import { hasPermission } from '@lib/permissions'
import { useDebounce } from '@lib/client/hooks'
import LoadingSpinner from '@components/generic/loading/loading-spinner/loading-spinner'
import { SuperSearchResponse } from '@lib/types'
import { useClickAwayListener } from '@lib/client/hooks'

import SearchIcon from '@icons/icon-search.svg'

import List from './list'

const { superSearch: searchConfig } = config

interface Props {
  user: UserType
}

function SuperSearch({ user }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const ref = useRef()
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const debouncedSearch = useDebounce<string>(url, 1000) // to prevent requests from being sent for every letter
  const canSee = hasPermission(user, 'superSearch.read')

  useClickAwayListener(ref, () => setIsFocus(false))

  const { data, isValidating } = useSWR<{ data: SuperSearchResponse[] }>(
    debouncedSearch || null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  const handleInputChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      const url = value ? `${API.superSearch}?query=${value}` : null

      setUrl(url)
      setIsFocus(true)
    },
    [setUrl]
  )

  const handleOnFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])

  return (
    <>
      {searchConfig.enabled && canSee && (
        <div className="edge-searchbox" ref={ref}>
          <span className="icon-box">
            {isValidating ? <LoadingSpinner /> : <SearchIcon />}
          </span>
          <input
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            type="text"
            placeholder="Search"
          />
          {isFocus && debouncedSearch && (
            <List data={data?.data || []} isLoading={isValidating} />
          )}
        </div>
      )}

      <style jsx>
        {`
          @media all and (max-width: 640px) {
            .edge-searchbox {
              display: none;
            }
          }

          .edge-searchbox .icon-box {
            left: 10px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
          }

          .edge-searchbox .icon-box img {
            left: 16px;
          }

          .edge-searchbox input {
            background-color: var(--accents-1-medium);
            border: none;
            font-size: 12px;
            padding: var(--edge-gap-half);
            padding-left: var(--edge-gap-double);
          }
        `}
      </style>
    </>
  )
}

export default memo(SuperSearch)
