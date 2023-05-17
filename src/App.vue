<script lang="ts" setup async>
    import Gifs from './components/Gifs.vue'
    import LoadingSpinner from './components/LoadingSpinner.vue'
    import { fetchGifs } from './composables/api'
    import { watchDebounced } from '@vueuse/core'
    import { type Ref, ref } from 'vue'

    const keyword: Ref<string> = ref( '' )
    const gifs: Ref<[]> = ref( [] )
    const offset: Ref<number> = ref( 0 )
    const perPage: Ref<number> = ref( 25 )
    const totalCount: Ref<number> = ref( 0 )
    const totalPages: Ref<number> = ref( 1 )
    const currentPage: Ref<number> = ref( 1 )
    const gifsLoading: Ref<boolean> = ref( false )

    async function search(): Promise<void>
    {
        gifsLoading.value = true

        const { data, pagination, meta } = await fetchGifs( keyword.value, perPage.value, offset.value )

        if ( meta?.status === 200 ) {
            gifs.value = data
            offset.value = pagination.offset
            totalCount.value = pagination.total_count
            totalPages.value = Math.ceil( pagination.total_count / perPage.value )

            if ( (totalPages.value * perPage.value) >= totalCount.value ) totalPages.value -= 1

            currentPage.value = offset.value > 0 ? Math.ceil( offset.value / perPage.value ) : 1
        }

        gifsLoading.value = false
    }

    async function pageChange( page: number ): Promise<void>
    {
        offset.value = ( perPage.value * page ) - perPage.value
        await search()
    }

    watchDebounced( keyword, () => search(), { debounce: 300 } )
</script>

<template>
    <div v-if="gifsLoading" class="fixed left-0 top-0 w-full h-full">
        <LoadingSpinner color="red" :size="200" />
    </div>

    <div class="w-full h-full">
        <div class="flex w-full p-4 my-4 justify-center space-x-4">
            <input v-model="keyword" class="border border-black p-2 rounded-md" placeholder="search for gifs..." />
        </div>

        <div v-if="gifs.length" class="w-full p-4">
            <Gifs :data="gifs" :totalPages="totalPages" :currentPage="currentPage" @pageChange="pageChange" />
        </div>
    </div>
</template>
