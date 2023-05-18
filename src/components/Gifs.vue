<script lang="ts" setup>
    import Paginate from 'vuejs-paginate-next'
    import { type Ref, ref, watch } from 'vue'

    const props = defineProps<{
        data: Object[],
        totalPages: number,
        currentPage: number,
    }>()

    const emit = defineEmits<{
        ( e: 'pageChange', value: number ): void
    }>()

    const gifs: Ref<Object> = ref( props.data )
    const pageCount: Ref<number> = ref( props.totalPages )
    const pageNumber: Ref<number> = ref( props.currentPage )
    const isFirstPage: Ref<boolean> = ref( true )
    const isLastPage: Ref<boolean> = ref( false )
    const linkClasses: string = 'p-4 cursor-pointer'

    watch( props, () => {
        gifs.value = props.data
        pageCount.value = props.totalPages
        isFirstPage.value = pageNumber.value === 1
        isLastPage.value = pageNumber.value === pageCount.value
    } )
</script>

<template>
    <div class="flex flex-wrap justify-center gap-4">
        <div v-for="( gif, index ) in gifs" :key="index" class="flex place-items-center w-72 h-72 bg-black">
            <a :href="gif.url" class="flex w-full h-full justify-center" target="_blank">
                <img :alt="gif.title" :src="gif.images.original.url">
            </a>
        </div>
    </div>

    <div class="my-8">
        <Paginate
            :clickHandler="page => emit( 'pageChange', page )"
            :containerClass="'flex w-full justify-center items-center'"
            :pageClass="'mx-2'"
            :pageLinkClass="linkClasses"
            :prevLinkClass="linkClasses"
            :nextLinkClass="linkClasses"
            :activeClass="'underline text-xl'"
            :margin-pages="2"
            :pageCount="pageCount"
            :pageRange="3"
            hidePrevNext
            firstLastButton
        />
    </div>
</template>
