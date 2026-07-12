import {useOnThisDay} from '../hooks/useOnThisDay'
import type {OnThisDayEvent} from '../api/onThisDay'

interface OnThisDayListProps {
    month: string
    day: string
}

function WikipediaPersonCard({event}: { event: OnThisDayEvent }) {
    const page = event.pages[0] // Assuming there must be a page or else their life/death wouldn't be in Wiki API

    return (
        <li className="flex flex-col items-start gap-3 rounded-md border border-gray-300 p-3 sm:flex-row dark:border-gray-600">
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
            <div>
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

//TODO: Consider grouping by year for each category
//TODO: Make the limit (currently 5) configurable by count or maybe by how many years back to go
export function OnThisDayList({month, day}: OnThisDayListProps) {
    const {data, isLoading, isError} = useOnThisDay(month, day)

    if (isLoading) {
        return <p className="text-center">Loading history...</p>
    }

    if (isError || !data) {
        return <p className="text-center text-red-500">Failed to load history for this date.</p>
    }

    return (
        <section className="mx-auto max-w-2xl">
            <h2 className="mb-2 text-xl font-bold">Historical Events on {month}/{day}</h2>
            <ul className="mb-6 space-y-2">
                {data.events.slice(0, 5).map((event, i) => (
                    <li key={i}>
                        <span className="font-bold">{event.year}</span> — {event.text}
                    </li>
                ))}
            </ul>

            <h2 className="mb-2 text-xl font-bold">Births on {month}/{day}</h2>
            <ul className="mb-6 space-y-4">
                {data.births.slice(0, 5).map((event, i) => (
                    <WikipediaPersonCard key={i} event={event}/>
                ))}
            </ul>

            <h2 className="mb-2 text-xl font-bold">Deaths on {month}/{day}</h2>
            <ul className="mb-6 space-y-4">
                {data.deaths.slice(0, 5).map((event, i) => (
                    <WikipediaPersonCard key={i} event={event}/>
                ))}
            </ul>
        </section>
    )
}
