import { useState } from 'react'
import { useSelectedDate } from './hooks/useSelectedDate'
import { DateNavigator } from './components/DateNavigator'
import { OnThisDayList } from './components/OnThisDayList'
import { ApodCard } from './components/ApodCard'
import { WeatherCard } from './components/WeatherCard'
import { BookmarksPage } from './components/BookmarksPage'
import { IconButton } from './components/IconButton'

function App() {
  const selectedDate = useSelectedDate()
  const [view, setView] = useState<'today' | 'bookmarks'>('today')

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-center text-3xl font-semibold">Almanac</h1>

      <div className="mb-6 flex justify-center gap-3">
        <IconButton
          onClick={() => setView('today')}
          className={view === 'today' ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600' : ''}
        >
          Browse
        </IconButton>
        <IconButton
          onClick={() => setView('bookmarks')}
          className={view === 'bookmarks' ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600' : ''}
        >
          Bookmarks
        </IconButton>
      </div>

      {view === 'today' ? (
        <>
          <DateNavigator {...selectedDate} />
          <div className="mt-8">
            <WeatherCard isoDate={selectedDate.isoDate} />
          </div>
          <div className="mt-8">
            <ApodCard isoDate={selectedDate.isoDate} />
          </div>
          <div className="mt-8">
            <OnThisDayList month={selectedDate.month} day={selectedDate.day} year={selectedDate.year} />
          </div>
        </>
      ) : (
        <BookmarksPage />
      )}
    </div>
  )
}

export default App
