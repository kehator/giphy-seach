import axios, { AxiosResponse } from 'axios'
import { config } from './config'

const { baseUrl, apiKey } = config

/***
 * Fetching the gits from the giphy API by the given keyword
 *
 * @param keyword
 * @param limit
 * @param offset
 *
 * @return Promise<[]>
 */
export async function fetchGifs( keyword: string, limit: number = 25, offset: number = 0 ): Promise<[]>
{
    if ( !keyword || keyword.length < 3 ) return []

    try {
        const response: AxiosResponse = await axios.get( `${ baseUrl }?api_key=${ apiKey }&q=${ keyword }&limit=${ limit }&offset=${ offset }&rating=g&lang=en` )

        return response?.data ? response.data : []
    } catch ( error ) {
        console.log( error )

        return []
    }
}
