interface PlanetsAPIResponse {
  count: number
  next: null | string
  previous: null | string
  results: Planet[]
}

interface Planet {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: string[]
  films: string[]
  created: Date
  edited: Date
  url: string
}

interface Person {
  birth_year: string
  eye_color: string
  films: string[]
  gender: string
  hair_color: string
  height: string
  homeworld: string
  mass: string
  name: string
  skin_color: string
  created: Date
  edited: Date
  species: string[]
  starships: string[]
  url: string
  vehicles: string[]
}

interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: Date
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: Date
  edited: Date
  url: string
}

interface PlanetContext {
  sortState: [SortType, React.Dispatch<React.SetStateAction<SortType>>]
  peopleState: [PeopleType, React.Dispatch<React.SetStateAction<PeopleType>>]
  filmsState: [FilmsType, React.Dispatch<React.SetStateAction<FilmsType>>]
}

type PeopleType = {
  [key: string]: Person
}

type FilmsType = {
  [key: string]: Film
}

type SortType = null | { field: 'name' | 'diameter'; order: 'asc' | 'desc' }
