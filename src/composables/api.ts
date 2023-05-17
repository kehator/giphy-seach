import axios, { type AxiosResponse } from 'axios'
import { config } from './config'

const { baseUrl, apiKey } = config

/***
 * Fetching the gits from the giphy API by the given query
 *
 * @param query
 * @param limit
 * @param offset
 *
 * @returns Promise<any>
 */
export async function fetchGifs( query: string, limit: number, offset: number ): Promise<any>
{
    if ( !query || query.length < 3 ) return false

    try {
        const response: AxiosResponse = await axios.get( `${ baseUrl }?api_key=${ apiKey }&q=${ query }&limit=${ limit }&offset=${ offset }&rating=g&lang=en` )

        return response?.data ? response.data : false
    } catch ( error ) {
        console.log( error )

        return false
    }
}
