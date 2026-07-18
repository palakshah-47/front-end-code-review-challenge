'use client'

import { useEffect, useState } from 'react'
import { ImageType, Pagination as PaginationType } from '../types'
import Results from '../Components/Results'
import Pagination from '../Components/Pagination'
import { artFetcher } from '../getArt'

const Search = () => {
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')
  const [data, setData] = useState([] as ImageType[])
  const [pagination, setPagination] = useState<PaginationType | null>(null)
  const [page, setPage] = useState(1)
  //initial state should be `idle`. Don't fetch on mount. Fetch only when the user submits a non-empty query.
  const [isLoading, setIsLoading] = useState(false)

  /*using TanStack Query/SWR is better option here. They give { data, error, isLoading
  isFetching } dervied from one source of truth.
  */
  useEffect(() => {
    //avoid making call if search term is empty
    if (!search.trim()) return
    //fix Race condition: stale results can overwrite fresh ones
    const ctrl = new AbortController()
    //reset the error after getting previous one
    setError(false)
    // set the state as loading
    setIsLoading(true)

    // fetch the art
    artFetcher(search, page, ctrl.signal)
      .then((response) => {
        setIsLoading(false)
        setData(response.data)
        setPagination(response.pagination)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setIsLoading(false)
          setError(true)
        }
      })
    return () => ctrl.abort()
  }, [search, page])

  return (
    <div style={{ margin: '1em' }}>
      {/*Instead of using onKeyDown, it is good practice to use form for
       submitting search. //form is also good with accessibility point.
      */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setPage(1)
          setSearch(searchInputValue)
        }}
      >
        <label htmlFor="searchValue">Search artworks: </label>
        <input
          id="searchValue"
          name="searchValue"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          style={{ paddingLeft: '0.2rem' }}
        />
        <button type="submit">Search</button>
      </form>
      <p>&nbsp;</p>
      {error && 'There was an error fetching the art.'}
      {isLoading ? 'Loading ...' : !data.length && 'No results.'}
      <Results data={data} />
      <Pagination
        pagination={pagination}
        onPageChange={setPage}
        disabled={isLoading}
      />
    </div>
  )
}

export default Search
