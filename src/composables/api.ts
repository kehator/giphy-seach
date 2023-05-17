import axios, { type AxiosResponse } from 'axios'
import { config } from './config'

const { baseUrl, apiKey } = config

/***
 * Fetching the gits from the giphy API by the given keyword
 *
 * @param keyword
 * @param perPage
 * @param offset
 *
 * @return Promise<any>
 */
export async function fetchGifs( keyword: string, perPage: number, offset: number ): Promise<any>
{
    if ( !keyword || keyword.length < 3 ) return false

    try {
        const response: AxiosResponse = await axios.get( `${ baseUrl }?api_key=${ apiKey }&q=${ keyword }&limit=${ perPage }&offset=${ offset }&rating=g&lang=en` )

        return response?.data ? response.data : false
    } catch ( error ) {
        console.log( error )

        return false
    }
}
