<script lang="ts" setup>
    import { defineProps, withDefaults } from 'vue'

    const props = withDefaults( defineProps<{
        color?: string,
        width?: string,
        size?: string,
        background?: string
    }>(), {
        color: 'white',
        width: '4',
        size: '80',
        background: 'bg-black'
    } )

    const circleStyle = {
        borderColor: `${ props.color } transparent transparent transparent`,
        borderWidth: `${ props.width }px`,
        width: `${ props.size }px`,
        height: `${ props.size }px`
    }
</script>

<template>
    <div :class="[ 'lds-ring relative flex items-center justify-center w-full h-full', background ]">
        <div class="block absolute box-border rounded-full" :style="circleStyle" />
        <div class="block absolute box-border rounded-full" :style="circleStyle" />
        <div class="block absolute box-border rounded-full" :style="circleStyle" />
        <div class="block absolute box-border rounded-full" :style="circleStyle" />
    </div>
</template>

<style scoped>
.lds-ring div {
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}

@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
