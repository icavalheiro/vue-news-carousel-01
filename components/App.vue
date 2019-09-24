<template>
    <NewsCarousel :items="[0,1,2,3,4,5,6,7,8,9,10,11,12]">

    </NewsCarousel>
</template>
<script lang="ts">
import Vue from 'vue'
import NewsCarousel from './NewsCarousel.vue'

export default Vue.extend({
    components: {
        NewsCarousel
    }
})
</script>