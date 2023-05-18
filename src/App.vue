<script lang="ts" setup>
    import Gifs from './components/Gifs.vue'
    import NavDrawer from './components/NavDrawer.vue'
    import LoadingSpinner from './components/LoadingSpinner.vue'
    import CopyButton from './components/CopyButton.vue'
    import { fetchGifs } from './composables/api'
    import { watchDebounced } from '@vueuse/core'
    import { type Ref, ref } from 'vue'
    import { copyUrlToClipboard, getUrlParams, saveHistoryToLocalStorage, setUrlParam } from './composables/url.ts'

    const pageLoaded: Ref<boolean> = ref( false )
    const showDrawer: Ref<boolean> = ref( false )
    const query: Ref<string> = ref( '' )
    const gifs: Ref<[]> = ref( [] )
    const offset: Ref<number> = ref( 0 )
    const limit: Ref<number> = ref( 25 )
    const totalCount: Ref<number> = ref( 0 )
    const totalPages: Ref<number> = ref( 1 )
    const currentPage: Ref<number> = ref( 1 )
    const gifsLoading: Ref<boolean> = ref( false )

    async function search(): Promise<void>
    {
        gifsLoading.value = true

        await setUrlParam( 'q', query.value )
        await saveHistoryToLocalStorage( window.location.href )

        const { data, pagination, meta } = await fetchGifs( query.value, limit.value, offset.value )

        if ( meta?.status === 200 ) {
            gifs.value = data
            offset.value = pagination.offset
            totalCount.value = pagination.total_count
            totalPages.value = Math.ceil( pagination.total_count / limit.value )

            if ( ( totalPages.value * limit.value ) >= totalCount.value ) totalPages.value -= 1

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

    function toggleShowDrawer(): void
    {
        showDrawer.value = !showDrawer.value
    }

    function init(): void
    {
        const urlParams = getUrlParams()
        const q = urlParams.get( 'q' )
        const o = urlParams.get( 'offset' )
        const l = urlParams.get( 'limit' )

        if ( !urlParams.has( 'q' ) || !o || !l ) {
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
        <LoadingSpinner :size="200" color="red" />
    </div>

    <div class="md:flex">
        <NavDrawer v-if="showDrawer" />

        <div :class="[ 'w-full', { 'md:border-l-2 md:border-l-black': showDrawer }]">
            <div class="flex justify-between w-full p-4 my-4">
                <div class="w-14 h-12 border border-black flex flex-col items-center justify-center cursor-pointer"
                     @click="toggleShowDrawer"
                >
                    <div class="w-7 h-0.5 bg-black" />
                    <div class="w-7 h-0.5 bg-black my-2" />
                    <div class="w-7 h-0.5 bg-black" />
                </div>

                <div class="flex items-center space-x-2">
                    <input v-model="query" class="border border-black p-2 rounded-md" placeholder="search for gifs..." />
                    <CopyButton @click="copyUrlToClipboard" />
                </div>

                <label class="flex items-center align-items-center" for="selectLimit">
                    <span class="hidden sm:block">Per Page:</span>
                    <select id="selectLimit" v-model="limit" name="selectLimit" @change="limitChange">
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                    </select>
                </label>
            </div>

            <div v-if="gifs.length" class="w-full p-4">
                <Gifs :currentPage="currentPage" :data="gifs" :totalPages="totalPages" @pageChange="pageChange" />
            </div>
        </div>
    </div>
</template>
