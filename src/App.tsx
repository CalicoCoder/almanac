import { useSelectedDate } from './hooks/useSelectedDate'
import { DateNavigator } from './components/DateNavigator'
import { OnThisDayList } from './components/OnThisDayList'

function App() {
  const selectedDate = useSelectedDate()

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-center text-3xl font-semibold">Almanac</h1>
      <DateNavigator {...selectedDate} />
      <div className="mt-8">
        <OnThisDayList month={selectedDate.month} day={selectedDate.day} />
      </div>
    </div>
  )
}

export default App
