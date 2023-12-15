import { FormEvent, useMemo, useState } from 'react'
import axios from 'axios'
import { MdClose, MdSearch, MdSort } from 'react-icons/md'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import PlanetItem from './PlanetItem'
import { PulseLoader } from 'react-spinners'
import { PlanetContext } from '../contexts/PlanetContext'
import SortButton from './SortButton'

function SearchPlanets() {
  const [searchParams, setSearchParams] = useSearchParams() // Params are used to send to the API

  const [data, setData] = useState<null | PlanetsAPIResponse>(null) // Planets API data
  const [searchInput, setSearchInput] = useState('') // Search input value
  const [sort, setSort] = useState<SortType>({
    field: 'name',
    order: 'asc',
  }) // Sort field and order state

  // These states are used to store the data in PlanetContext for all Planets to use
  const [people, setPeople] = useState<PeopleType>({})
  const [films, setFilms] = useState<FilmsType>({})

  // Fetch planets from SWAPI API
  const fetchPlanets = async () => {
    setData(null) // Reset data

    // Fetch from API and store data on 'data' state
    const result = await axios.get('https://swapi.dev/api/planets', {
      params: {
        search: searchParams.get('search') ?? '',
        page: searchParams.get('page') ?? '',
      },
    })
    setData(result.data)
  }

  // Fetch planets using the "search" param, reset value of input if it changed
  // but the user did not submit
  useMemo(() => {
    fetchPlanets()
    setSearchInput(searchParams.get('search') ?? '')
  }, [searchParams])

  // When the user submits, the input value is set as "search" param
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchParams(createSearchParams([['search', searchInput]]))
  }

  // Use this to search all planets again
  const cleanSearch = () => {
    setSearchInput('') // Reset input
    setSort({ field: 'name', order: 'asc' }) // Reset sort
    setSearchParams(createSearchParams()) // Reset params, this will trigger a new fetch
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          value={searchInput}
          placeholder="Search planet..."
          className="w-full h-11 pl-10 pr-4 bg-transparent placeholder:text-gray-500 border-2 border-white/50
          enabled:focus-within:border-white rounded-full transition-colors outline-none peer"
          onChange={ev => {
            setSearchInput(ev.target.value)
          }}
          disabled={!data}
        />
        <MdSearch className="absolute top-1/2 -translate-y-1/2 left-3 w-6 h-6 text-white/50 peer-focus-within:text-white transition-colors" />
        {searchInput && (
          <button
            title="Clean"
            type="button"
            onClick={cleanSearch}
            className="absolute top-1/2 -translate-y-1/2 right-3 w-6 h-6">
            <MdClose className="w-full h-full" />
          </button>
        )}
      </form>
      {!data && (
        <div className="mt-8 flex flex-col items-center">
          <PulseLoader className="mb-4" color="#ffffff" />
          <p className="text-center">Fetching planets...</p>
        </div>
      )}
      {data && data.count === 0 && (
        <>
          <p className="text-center">No planets found.</p>
          <button type="button" className="w-full text-center text-slate-300 font-bold" onClick={cleanSearch}>
            Clean search
          </button>
        </>
      )}
      {data && data.count > 0 && (
        <PlanetContext.Provider
          value={{
            sortState: [sort, setSort],
            peopleState: [people, setPeople],
            filmsState: [films, setFilms],
          }}>
          <div className="mb-4 flex items-center">
            <p className="flex-1 invisible 2xs:visible">
              {data.count} <span className="hidden xs:inline">planets found</span>
              <span className="inline xs:hidden">results</span>
            </p>
            <div className="flex items-center">
              <MdSort size={24} className="mr-2" />
              <SortButton field="Name" />
              <SortButton field="Diameter" />
            </div>
          </div>
          <ul className="flex flex-col gap-1">
            {data.results
              .toSorted((a, b) => {
                // If there's no sort selected, items are shown as the come API
                if (!sort) return 0

                // This variable is used to convert the value to compare to MAX_VALUE when it's needed
                // 'diameter' field needs to be converted when its value is 'unknown' but 'name' doesn't
                const convertToMaxValue = sort.field === 'diameter'

                // Get each value as number if it's possible or just leave it as it is
                let v1: number | string = a[sort.field],
                  v2: number | string = b[sort.field]
                v1 = +v1 || (v1 === 'unknown' && convertToMaxValue ? Number.MAX_VALUE : v1)
                v2 = +v2 || (v2 === 'unknown' && convertToMaxValue ? Number.MAX_VALUE : v2)

                // Compare each value and reverse it for "desc" order
                return (v1 > v2 ? 1 : v1 < v2 ? -1 : 0) * (sort.order === 'asc' ? 1 : -1)
              })
              .map(planet => (
                <PlanetItem key={planet.url} planet={planet} />
              ))}
          </ul>
          <div className="mt-4 flex justify-center items-center">
            <button
              type="button"
              onClick={() => {
                // If there's a previous page in the result, get the params from the URL
                if (!data.previous) return
                setSearchParams(new URLSearchParams(data.previous.split('/?').at(-1)))
              }}
              className="button"
              disabled={!data.previous}>
              Prev
            </button>
            <span className="px-2">{`${searchParams.get('page') ?? 1} / ${Math.ceil(data.count / 10)}`}</span>
            <button
              type="button"
              onClick={() => {
                // If there's a next page in the result, get the params from the URL
                if (!data.next) return
                setSearchParams(new URLSearchParams(data.next.split('/?').at(-1)))
              }}
              className="button"
              disabled={!data.next}>
              Next
            </button>
          </div>
        </PlanetContext.Provider>
      )}
    </>
  )
}

export default SearchPlanets
