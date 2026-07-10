import { useSelectedDate } from './hooks/useSelectedDate'
import { DateNavigator } from './components/DateNavigator'

function App() {
  const selectedDate = useSelectedDate()

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-center text-3xl font-semibold">Almanac</h1>
      <DateNavigator {...selectedDate} />
    </div>
  )
}

export default App
