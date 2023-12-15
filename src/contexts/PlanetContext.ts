import { createContext, useContext } from 'react'

export const PlanetContext = createContext<PlanetContext>({
  sortState: [null, () => {}],
  peopleState: [{}, () => {}],
  filmsState: [{}, () => {}],
})

export const usePlanetContext = () => useContext(PlanetContext)
