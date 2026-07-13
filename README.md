## Initial Set Up
Make a copy of `.env.example` file in root as `.env`

Modify the `VITE_NASA_API_KEY` to be your key obtained from `api.nasa.gov` to avoid demo key rate limiting.

## Running locally

```
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Running with Docker

```
docker compose up --build
```

The app is served at `http://localhost:3000`.

## Architecture

**Stack**: 
* Vite 
  * Industry standard, lightweight and allows hot reloading. Most other options seemed overkill for this app.


* React 19
  * No choice, but opted latest to use most recent version. 


* TypeScript 
  * Preferred to use Typing rather than unreliability of vanilla JS.


* NGINX (docker only)  
  * Lightweight way to serve already built static "production" version of app.


* TanStack Query
  * Utilized RTK-Query in past and wanted to try TanStack since it is similar without requiring Redux. See [Data Fetching](#data-fetching) section below for details on how it's used.
  

* Tailwind CSS
  * Chosen for familiarity, speed of iteration and because responsive utilities (`sm:`) made the mobile/desktop layout trivial.


**Data sources**: 
* Wikipedia On This Day (historical events, births, deaths), 
  * Most data rich API to satisfy the main requirements of the brief. Lots of info with little work as all three event types have consistent JSON.


* NASA APOD (astronomy picture)
  * Provides more "wow" factor with large image space image but minor drawback of requiring API key.


* Open-Meteo (weather — Archive API for past dates, Forecast API for today)
  * Provided both past and current weather information and utilizing lat/long feeds easily into browser locate me feature.


* BigDataCloud (reverse-geocoding for weather location)
  * Utilized to provide a more human name to the lat/long position and to help user confirm manual lat/long input resolved as expected.

## Data Fetching

Every API call goes through TanStack Query rather than hand-rolled fetch logic. Each data source has its own thin hook (`useApod`, `useOnThisDay`, `useWeather`) wrapping a `useQuery` call, keyed by the values that should trigger a refetch.

For example the weather section is keyed by both the selected date and the resolved lat/long, so changing either fetches fresh data, but navigating back to a previously-viewed date/location combination is served instantly from cache instead of re-fetching. 

This also means each card's loading and error states are fully independent, a failed APOD lookup (a pre-1995 date) doesn't block the Weather or On This Day cards from rendering their own data as soon as it's ready.

## Bookmark Functionality 

Persisted bookmark data as JSON collection to `localStorage` via a `useBookmarks` hook, shared through React Context (`BookmarksProvider`). I did it this way to make use of the existing stack without additional libraries. 

## Tradeoffs / what I'd do differently with more time
* Add automated tests
* Utilize some sort of library like Material UI to provide basic components like dialogs or accordions
* Implement the video APOD on the NASA API
* Use a database rather than local storage
* Make it so that the location search does not rely on lat/long but instead is a typeahead city search. This would require extra components and I wanted to utilize vanilla HTML only.
* Add a light/dark toggle and a less utilitarian color scheme/UI
* Make the bookmarks view more rich with sorting/filters
