Below are the changes that I have made in this application for some high impact and bug items:

-> Using URLSearchParams for getting search params and avoiding injection vulnerabilities.
-> Fixed for race condition using AbortController and getting stale data in useEffct for search results, Also suggesting to use
React query for data fetching and getting cancellation, caching, deduping, retries, and stale-while-revalidate for free.
-> Fixed key for using unique identity for each eleement in Display component. This will fix rendering wrong image for an element when filter changes and list of elements in Display also changes.
-> Fixed mutating and sorting data directly. The original prop which is data here should be immutable.
-> Fixing artFetcher call when response is not ok in fetch api. Also using zod for response validation is best to match runtine and compiletime types.
-> Fixed the error state, once it is set, need to clear it in next fetch call. So clearing the state in useEffect
-> Setting initial state for isLoading as idle instead of true to avoid showing Loading...
-> Removing div and replacing it with form for accessibility and using semantic elements
-> Using Nextjs Image component for providing better sizing, lazy-loading and responsiveness to images
-> Adding Pagination component and adding a limit of going through 1000 pages as capacity limit. Beyond 1000 pages, it is throwing 403 error.
