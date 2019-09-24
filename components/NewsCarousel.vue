<template>
    <section class="news container" v-cloak data-item-count="13" data-rtl="false">
        <!--Replace the "v-for" and the "i" from a hardcoded value (or set in the backend) -->
        <div class="news-items-wrapper" ref="newsItemWrapper">
            <div class="news-item"
                v-for="(item, i) in items" 
                :key="i" 
                :class='{animate:!swipping, "out-of-view": checkOutOfView(i)}' 
                :style="{left: getPosition(i) + 'px', width: size + 'px'}">
                <div class="news-category">NEWS</div>
                <img src="./img1.png" alt="Shake" @dragstart.prevent="">
                <div class="news-info row">
                    <div class="news-date col-3">
                        <span class="month">
                            MAY
                        </span>
                        <span class="day">
                            01
                        </span>
                        <span class="year">
                            2019
                        </span>
                    </div>
                    <div class="news-text col">
                        Lorem ipsum, dolor sit amet consectetur 
                        adipisicing elit. Unde earum corporis aspernatur.
                    </div>
                </div>
            </div>
        </div>
        <div class="row slider">
            <div class="col2">PREV</div>
            <div class="col slider-body" ref="slider">
                <div class="knob" :style='{left: knobPosition+"%"}'>&lt; &gt;</div>
            </div>
            <div class="col2">NEXT</div>
        </div>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import onSwipe from '../swipe'

export interface Item {
    image:String;
    date:Date;
    text:String;
    url:String;
}

export default Vue.extend({
    name: 'news-carousel',
    props: {
        items: {
            type: Array as () => Item[]
        },
        rtl: Boolean
    },
    data() {
        return {
            width: 0,
            swipping: false,
            scroll: 0,
        }
    },
    mounted() {
        onSwipe(this.$refs.newsItemWrapper, this.onSwipe, this.onSwipeBegin, this.onSwipeEnd);
        onSwipe(this.$refs.slider, (delta) => this.onSwipe(-delta * 3), () => this.onSwipeBegin(), () => this.onSwipeEnd())

        let defaultScroll = 0;
        if (this.rtl) {
            defaultScroll = this.maxScroll;
        }

        let setupWidth = () => {
            this.scroll = defaultScroll;
            this.width = this.rootElement().clientWidth;
        }

        setupWidth();
        //to make QC easier
        window.addEventListener('resize', setupWidth);
    },
    computed: {
        itemCount() {
            return this.items.length;
        },
        size(){
            return 300;
        },
        contentLength(){
            return this.itemCount * this.size;
        },
        minScroll(){
            return -1 * (this.contentLength - this.width);
        },
        maxScroll() {
            return 0;
        },
        knobPosition() {
            if(this.scroll == 0) return 0;

            let val = (this.scroll / this.minScroll) * 100;

            if(val < 0){
                return 0;
            }

            if(val > 99){
                return 99;
            }

            return val;
        }
    },
    methods:{
        rootElement() {
            return this.$root.$el;
        },
        onSwipe(delta){
            this.scroll -= delta;
        },
        getPosition(index){
            return (this.size * index) + this.scroll
        },
        onSwipeBegin(){
            this.swipping = true;
        },
        onSwipeEnd(){
            this.swipping = false;

            if(this.scroll < this.minScroll){
                this.scroll = this.minScroll
            }

            if(this.scroll > this.maxScroll){
                this.scroll = this.maxScroll
            }
        },
        checkOutOfView(index) {
            let position = this.getPosition(index);

            if (position < 0) {
                return true;
            }
            
            let rightSide = position + this.size;
            if (rightSide > this.width){
                return true;
            }

            return false;
        },
    }
})
</script>