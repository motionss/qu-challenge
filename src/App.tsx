import { BrowserRouter } from 'react-router-dom'
import SearchPlanets from './components/SearchPlanets'

function App() {
  return (
    <BrowserRouter>
      <main className="max-w-xl mx-auto p-4 sm:p-6">
        <h1 className="mb-4 sm:mb-6 text-center text-3xl sm:text-5xl">Star Wars API</h1>
        <SearchPlanets />
      </main>
    </BrowserRouter>
  )
}

export default App
