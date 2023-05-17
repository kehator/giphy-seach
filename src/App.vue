<script lang="ts" setup>
    import Gifs from './components/Gifs.vue'
    import { fetchGifs } from './composables/api.ts'

    async function gifs () {
        const gifs = await fetchGifs( 'happy' )
        console.log(gifs)
    }
    // gifs()
</script>

<template>
    <div class="w-full">
        <div class="flex w-full p-4 justify-center">input</div>

        <div class="flex w-full p-4">
            <Gifs />
        </div>
    </div>
</template>
