import onSwipe from './swipe'

document.querySelectorAll('section.news').forEach(el => {
    new Vue({
        el: el,
        data() {
            return {
                width: 0,
                swipping: false,
                scroll: 0,
                itemCount: el.getAttribute('data-item-count'),
            }
        },
        mounted() {
            onSwipe(this.rootElement(), this.onSwipe, this.onSwipeBegin, this.onSwipeEnd);

            let defaultScroll = 0;
            if (el.getAttribute('data-rl')) {
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
    }); 
})