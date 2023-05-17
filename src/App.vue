<script lang="ts" setup>
    import Gifs from './components/Gifs.vue'
    import LoadingSpinner from './components/LoadingSpinner.vue'
    import { fetchGifs } from './composables/api'
    import { watchDebounced } from '@vueuse/core'
    import { type Ref, ref } from 'vue'
    import { getUrlParams, setUrlParam } from './composables/url.ts'

    const pageLoaded: Ref<boolean> = ref( false )
    const query: Ref<string> = ref( '' )
    const gifs: Ref<[]> = ref( [] )
    const offset: Ref<number> = ref( 0 )
    const limit: Ref<number> = ref( 25 )
    const totalCount: Ref<number> = ref( 0 )
    const totalPages: Ref<number> = ref( 1 )
    const currentPage: Ref<number> = ref( 1 )
    const gifsLoading: Ref<boolean> = ref( false )

    function updateUrlParam( param: string, value: string ): void
    {
        window.history.replaceState(null, null, '?q='+query.value );
    }

    async function search(): Promise<void>
    {
        gifsLoading.value = true

        setUrlParam( 'q', query.value )

        const { data, pagination, meta } = await fetchGifs( query.value, limit.value, offset.value )

        if ( meta?.status === 200 ) {
            gifs.value = data
            offset.value = pagination.offset
            totalCount.value = pagination.total_count
            totalPages.value = Math.ceil( pagination.total_count / limit.value )

            if ( (totalPages.value * limit.value) >= totalCount.value ) totalPages.value -= 1

            currentPage.value = offset.value > 0 ? Math.ceil( offset.value / limit.value ) : 1
        }

        gifsLoading.value = false
    }

    async function pageChange( page: number ): Promise<void>
    {
        offset.value = ( limit.value * page ) - limit.value
        setUrlParam( 'offset', offset.value )
        await search()
    }

    async function limitChange( event: Event ): Promise<void>
    {
        limit.value = parseInt( event.target.value )
        setUrlParam( 'limit', limit.value )
        await search()
    }

    function init(): void
    {
        const urlParams = getUrlParams();
        const q = urlParams.get( 'q' )
        const o = urlParams.get( 'offset' )
        const l = urlParams.get( 'limit' )

        if ( !urlParams.has('q') || !o || !l ) {
            urlParams.set( 'q', query.value )
            urlParams.set( 'offset', offset.value )
            urlParams.set( 'limit', limit.value )

            window.location.search = urlParams.toString()
        } else {
            query.value = q
            offset.value = o
            limit.value = l

            pageLoaded.value = true
        }
    }

    watchDebounced( query, () => pageLoaded.value && search(), { debounce: 300 } )
    init()
</script>

<template>
    <div v-if="gifsLoading" class="fixed left-0 top-0 w-full h-full">
        <LoadingSpinner color="red" :size="200" />
    </div>

    <div class="w-full h-full">
        <div class="flex w-full p-4 my-4 justify-center space-x-4">
            <input v-model="query" class="border border-black p-2 rounded-md" placeholder="search for gifs..." />
            <label class="flex items-center" for="selectLimit">
                Per Page:
                <select v-model="limit" name="selectLimit" id="selectLimit" @change="limitChange">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                </select>
            </label>
        </div>

        <div v-if="gifs.length" class="w-full p-4">
            <Gifs :data="gifs" :totalPages="totalPages" :currentPage="currentPage" @pageChange="pageChange" />
        </div>
    </div>
</template>
