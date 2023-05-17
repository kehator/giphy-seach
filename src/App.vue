<script lang="ts" setup>
    import { fetchGifs } from './composables/api.ts'

    async function gifs () {
        const gifs = await fetchGifs( 'happy' )
        console.log(gifs)
    }
    // gifs()
</script>

<template>
    <div>
        test
    </div>
</template>
