const localStorageHistoryKey: string = 'url-history'

/***
 * Save current url to local storage history
 *
 * @param value
 */
export function saveHistoryToLocalStorage( value: string ): void
{
    const history: string[] = getHistoryFromLocalStorage()

    if ( history.length ) {
        if ( history.length > 10 ) {
            history.pop()
        }

        history.unshift( value )

        value = history.join( ',' )
    }

    localStorage.setItem( localStorageHistoryKey, value )
}

/***
 * Get history from local storage
 *
 * @returns {string[]}
 */
export function getHistoryFromLocalStorage(): string[]
{
    const history: string | null = localStorage.getItem( localStorageHistoryKey )

    if ( history ) {
        return history.split( ',' )
    }

    return []
}

/***
 * Fetch current url params
 *
 * @param urlString?
 *
 * @returns {URLSearchParams}
 */
export function getUrlParams( urlString: string = window.location.href ): URLSearchParams
{
    const url: URL = new URL( urlString )

    return new URLSearchParams( url.search )
}

/***
 * Set url param without reloading
 *
 * @param param
 * @param value
 */
export function setUrlParam( param: string, value: string ): void
{
    const urlParams: URLSearchParams = getUrlParams()

    urlParams.set( param, value )

    window.history.pushState( null, null, `?${ urlParams.toString() }` )
}

/***
 * Copy current URL to clipboard
 *
 * @param  url?
 */
export async function copyUrlToClipboard( url: string = window.location.href ): Promise<void>
{
    await navigator.clipboard.writeText( url )
}
