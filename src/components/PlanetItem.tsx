import { useState } from 'react'
import { cn, getTerrainType } from '../lib/utils'
import { MdChevronRight } from 'react-icons/md'
import { PulseLoader } from 'react-spinners'
import { usePlanetContext } from '../contexts/PlanetContext'
import axios from 'axios'

function PlanetItem({ planet }: { planet: Planet }) {
  const [people, setPeople] = usePlanetContext().peopleState
  const [films, setFilms] = usePlanetContext().filmsState

  const [showInfo, setShowInfo] = useState(false) // Used to show/hide the planet info
  const [isFetching, setIsFetching] = useState({ films: false, people: false }) // Used to show/hide the loader

  // These 2 functions are made like this because there's only going to be 2 of them.
  // If more of the same were needed, there would've been an alternative
  // where PlanetContext would had a "extraDataState" e.g, contanining [films, people, ...]
  // and these functions would merge into a single "fetchExtraData" function.
  const fetchFilms = async (urls: string[]) => {
    setIsFetching(cv => ({ ...cv, films: true }))
    for (const url of urls) {
      // If given url is not in "films" object, I fetch it and store in the object
      if (!films[url]) {
        const result = await axios.get(url)
        setFilms(cf => ({ ...cf, [url]: result.data }))
      }
    }
    setIsFetching(cv => ({ ...cv, films: false }))
  }

  const fetchPeople = async (urls: string[]) => {
    setIsFetching(cv => ({ ...cv, people: true }))
    for (const url of urls) {
      // If given url is not in "people" object, I fetch it and store in the object
      if (!people[url]) {
        const result = await axios.get(url)
        setPeople(cf => ({ ...cf, [url]: result.data }))
      }
    }
    setIsFetching(cv => ({ ...cv, people: false }))
  }

  return (
    <li
      className={cn(
        'w-full odd:bg-gray-900 rounded-lg border-2 hover:border-white transition-colors overflow-hidden',
        !showInfo && 'border-transparent'
      )}>
      <button
        type="button"
        onClick={() => setShowInfo(value => !value)}
        className="w-full hover:bg-gray-800 focus-visible:bg-gray-800 p-3 flex gap-2 items-center transition-colors cursor-pointer group">
        <p className="sm:text-lg">{planet.name}</p>
        {/* The result of planet.terrain.split().filter().map() is put in a Set so there's no duplicate values */}
        {[
          ...new Set(
            planet.terrain
              .split(', ')
              .filter(terrain => terrain !== 'unknown')
              .map(terrain => getTerrainType(terrain))
          ),
        ].map(terrainType => (
          <TerrainDot key={terrainType} terrainType={terrainType} />
        ))}
        <div className="flex-1 flex justify-end items-center">
          {!!+planet.diameter && (
            <p className="text-sm sm:text-base">{`(Ø ${Intl.NumberFormat('en').format(+planet.diameter)} km)`}</p>
          )}
          <MdChevronRight
            size={26}
            className={cn(
              'transition-transform group-hover:opacity-100',
              showInfo ? '-rotate-90' : 'opacity-0 rotate-90'
            )}
          />
        </div>
      </button>
      {showInfo && (
        <div className="w-full p-3 flex flex-col gap-3 text-sm sm:text-base">
          <div className="flex-1">
            <p className="font-bold">• Terrain</p>
            {planet.terrain === 'unknown' && <p className="text-gray-300">{planet.terrain}</p>}
            {planet.terrain !== 'unknown' && (
              <div className="mt-1 flex gap-2 flex-wrap">
                {planet.terrain.split(', ').map(terrain => (
                  <TerrainTag key={terrain} terrain={terrain} />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold">• Gravity</p>
            <p className="text-gray-300">{planet.gravity}</p>
          </div>
          <div className="flex flex-col 2xs:flex-row gap-3">
            <div className="flex-1">
              <p className="font-bold">• Diameter</p>
              <p className="text-gray-300">
                {!!+planet.diameter
                  ? `${Intl.NumberFormat('en').format(+planet.diameter)} kilometers`
                  : planet.diameter}
              </p>
            </div>
            <div className="flex-1">
              <p className="font-bold">• Population</p>
              <p className="text-gray-300">
                {!!+planet.population
                  ? Intl.NumberFormat('en', { notation: 'compact' }).format(+planet.population)
                  : planet.population}
              </p>
            </div>
          </div>
          <div className="flex flex-col 2xs:flex-row gap-3">
            <div className="flex-1">
              <p className="font-bold">• Climate</p>
              <p className="text-gray-300">{planet.climate}</p>
            </div>
            <div className="flex-1">
              <p className="font-bold">• Surface water</p>
              <p className="text-gray-300">
                {planet.surface_water !== 'unknown' ? `${planet.surface_water} %` : planet.surface_water}
              </p>
            </div>
          </div>
          <div className="flex flex-col 2xs:flex-row gap-3">
            <div className="flex-1">
              <p className="font-bold">• Rotation period</p>
              <p className="text-gray-300">
                {!!+planet.rotation_period
                  ? `${Intl.NumberFormat('en').format(+planet.rotation_period)} standard-hours`
                  : planet.rotation_period}
              </p>
            </div>
            <div className="flex-1">
              <p className="font-bold">• Orbital period</p>
              <p className="text-gray-300">
                {!!+planet.orbital_period
                  ? `${Intl.NumberFormat('en').format(+planet.orbital_period)} standard-days`
                  : planet.orbital_period}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold">• Films</p>
            <p className="text-gray-300">This planet appeared in {planet.films.length} films.</p>
            {!isFetching.films &&
              // Check if there's any film that hasn't been fetched yet
              (planet.films.some(residentUrl => !films[residentUrl]) ? (
                <button type="button" onClick={() => fetchFilms(planet.films)} className="text-yellow-300 font-bold">
                  Show films
                </button>
              ) : (
                <ol>
                  {planet.films.map(filmUrl => {
                    const film = films[filmUrl]
                    return (
                      <li key={film.url} className="ml-4 list-decimal">
                        <span className="text-yellow-300">{film.title}</span>
                      </li>
                    )
                  })}
                </ol>
              ))}
            {isFetching.films && (
              <div className="flex items-center text-sm text-yellow-300">
                <PulseLoader size={10} color="#fddf47" className="mr-1" /> Fetching films...
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold">• People</p>
            <p className="text-gray-300">{planet.residents.length} relevant people live on this planet.</p>
            {!isFetching.people &&
              // Check if there's any person that hasn't been fetched yet
              (planet.residents.some(residentUrl => !people[residentUrl]) ? (
                <button
                  type="button"
                  onClick={() => fetchPeople(planet.residents)}
                  className="text-yellow-300 font-bold">
                  Show people
                </button>
              ) : (
                <ol>
                  {planet.residents.map(residentUrl => {
                    const person = people[residentUrl]
                    return (
                      <li key={person.url} className="ml-4 list-decimal">
                        <span className="text-yellow-300">{person.name}</span>
                      </li>
                    )
                  })}
                </ol>
              ))}
            {isFetching.people && (
              <div className="flex items-center text-sm text-yellow-300">
                <PulseLoader size={10} color="#fddf47" className="mr-1" /> Fetching people...
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function TerrainDot({ terrainType }: { terrainType: string }) {
  return (
    <div
      className={cn('w-3 h-3 sm:w-4 sm:h-4 rounded-full', {
        'bg-neutral-500': terrainType === 'air',
        'bg-slate-700': terrainType === 'city',
        'bg-green-700': terrainType === 'greens',
        'bg-amber-700': terrainType === 'land',
        'bg-yellow-600': terrainType === 'arid',
        'bg-cyan-600': terrainType === 'ice',
        'bg-blue-700': terrainType === 'water',
      })}
    />
  )
}

function TerrainTag({ terrain }: { terrain: string }) {
  const terrainType = getTerrainType(terrain)
  return (
    <span
      className={cn('px-2 rounded-md', {
        'bg-neutral-500': terrainType === 'air',
        'bg-slate-700': terrainType === 'city',
        'bg-green-700': terrainType === 'greens',
        'bg-amber-700': terrainType === 'land',
        'bg-yellow-600': terrainType === 'arid',
        'bg-cyan-600': terrainType === 'ice',
        'bg-blue-700': terrainType === 'water',
      })}>
      {terrain}
    </span>
  )
}

export default PlanetItem
