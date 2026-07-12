import {useOnThisDay} from '../hooks/useOnThisDay'
import type {OnThisDayEvent} from '../api/onThisDay'

interface OnThisDayListProps {
    month: string
    day: string
    year: string
}

function WikipediaPersonCard({event}: { event: OnThisDayEvent }) {
    const page = event.pages[0] // Assuming there must be a page or else their life/death wouldn't be in Wiki API

    return (
        <li className="flex flex-col items-center gap-3 rounded-md border border-gray-300 p-3 sm:flex-row sm:items-start dark:border-gray-600">
            {page?.thumbnail && (
                <img
                    src={page.thumbnail.source}
                    alt=""
                    className="rounded h-24 w-24 object-cover"
                />
            )}
            {!page?.thumbnail && (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Person_Image_Placeholder.png"
                    alt="default person image"
                    className="rounded h-24 w-24 object-cover"
                />
            )}
            <div className="text-center sm:text-left">
                <a
                    href={page.content_urls!.desktop.page}
                    target="_blank"
                    className="font-medium underline"
                >
                    {page.normalizedtitle ?? page.title}
                </a>

                {page?.description && <p className="text-sm text-gray-400">{page.description}</p>}
            </div>
        </li>
    )
}

export function OnThisDayList({month, day, year}: OnThisDayListProps) {
    const {data, isLoading, isError} = useOnThisDay(month, day)

    if (isLoading) {
        return <p className="text-center">Loading history...</p>
    }

    if (isError || !data) {
        return <p className="text-center text-red-500">Failed to load history for this date.</p>
    }

    const targetYear = Number(year)
    const events = data.events.filter((event) => event.year === targetYear)
    const births = data.births.filter((event) => event.year === targetYear)
    const deaths = data.deaths.filter((event) => event.year === targetYear)

    return (
        <section className="mx-auto max-w-2xl">
            <h2 className="mb-2 text-xl font-bold">Historical Events on {month}/{day}/{year}</h2>
            {events.length === 0 ? (
                <p className="mb-6 text-gray-400">Nothing happened at all on this date.</p>
            ) : (
                <ul className="mb-6 space-y-2">
                    {events.map((event, i) => (
                        <li key={i}
                            className="rounded-md border border-gray-300 p-3 dark:border-gray-600"
                        >{event.text}</li>
                    ))}
                </ul>
            )}

            <h2 className="mb-2 text-xl font-bold">Births on {month}/{day}/{year}</h2>
            {births.length === 0 ? (
                <p className="mb-6 text-gray-400">Absolutely no one was born on this day.</p>
            ) : (
                <ul className="mb-6 space-y-4">
                    {births.map((event, i) => (
                        <WikipediaPersonCard key={i} event={event}/>
                    ))}
                </ul>
            )}

            <h2 className="mb-2 text-xl font-bold">Deaths on {month}/{day}/{year}</h2>
            {deaths.length === 0 ? (
                <p className="mb-6 text-gray-400">
                    Not a single person died on this day, it was widely celebrated.
                </p>
            ) : (
                <ul className="mb-6 space-y-4">
                    {deaths.map((event, i) => (
                        <WikipediaPersonCard key={i} event={event}/>
                    ))}
                </ul>
            )}
        </section>
    )
}
