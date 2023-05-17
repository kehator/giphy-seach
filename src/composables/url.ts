/***
 * Fetch current url params
 *
 * @returns {URLSearchParams}
 */
export function getUrlParams(): URLSearchParams
{
    const url: URL = new URL( window.location.href );

    return new URLSearchParams( url.search );
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

    window.history.pushState(null, null, `?${ urlParams.toString() }` );
}
