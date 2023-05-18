<script lang="ts" setup>
    import { copyUrlToClipboard, getUrlParams, getHistoryFromLocalStorage } from '../composables/url.ts'
    import CopyButton from './CopyButton.vue'

    const history = getHistoryFromLocalStorage()

    function getSearchQuery( url: string ): string
    {
        const params = getUrlParams( url )
        console.log( params.get( 'q' ) )
        return params.get( 'q' )
    }
</script>

<template>
    <div class="w-full md:w-48 lg:w-72 p-4">
        <p class="text-xl mb-8">Last 10 searches:</p>
        <ul class="w-full">
            <li v-for="( item, index ) in history" :key="index" :class="[ 'flex items-center space-x-4 justify-between pb-2 mb-2', { 'border-b': index !== history.length - 1 } ]">
                <span>{{ getSearchQuery( item ) }}</span>
                <CopyButton @click="copyUrlToClipboard( item )" />
            </li>
        </ul>
    </div>
</template>
