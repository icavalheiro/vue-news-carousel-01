function getTouch(event) {
    if (event.touches) return event.touches[0]
    return event;
}

function addSwipeListener(element, callback, startCallback, finishCallback) {
    let x;

    let handleTouchStart = (event) => {
        x = getTouch(event).clientX;

        if (startCallback) startCallback();
    }

    let handleTouchMove = (event) => {
        if (!x) return;

        let newX = getTouch(event).clientX;
        let delta = x - newX;
        x = newX;

        if (delta != 0) callback(delta);
    }

    let handleTouchEnd = () => {
        x = undefined;
        if (finishCallback) finishCallback();
    }

    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('mousedown', handleTouchStart, false);
    element.addEventListener('touchmove', handleTouchMove, false);
    element.addEventListener('mousemove', handleTouchMove, false);
    element.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('mouseup', handleTouchEnd, false);
}

jQuery(function($){
    $('section.news').each(function(){
        let section = $(this);
        let news = $(section.find('.news-item'));
        let knob = $(section.find('.knob'))
        let size = 300;
        let itemCount = news.length;
        let contentLength = itemCount * size;
        let knobDeltaModifier = 2.1;

        let baseScroll = 0;
    
        // Methods
        let setAnimateClass = (addClass) => {
            news.removeClass('animate');
            
            if(addClass){
                news.addClass('animate');
            }
        };
        
        let minScroll = () => -1 * (contentLength - section.width());
        let maxScroll = () => 0;
        let getPosition = (index, base) => (size * index) + base;
        let knobPosition = (base) => {
            if (base == 0) return 0;
    
            let val = (base / minScroll()) * 100;
    
            if (val < 0) {
                return 0;
            }
    
            if (val > 99) {
                return 99;
            }
    
            return val;
        };
        let checkOutOfView = (index, base) => {
            let position = getPosition(index, base);
    
            if (position < 0) {
                return true;
            }
    
            let rightSide = position + size;
            if (rightSide > section.width()) {
                return true;
            }
    
            return false;
        };
        let updatePositions = () => {
            knob.css('left', knobPosition(baseScroll) + '%');
    
            news.each((i, el) => {
                el = $(el);
                el.css('left', getPosition(i, baseScroll) + 'px');
                el.css('width', size);
                el.removeClass("out-of-view");
                if (checkOutOfView(i, baseScroll)){
                    el.addClass("out-of-view");
                }
            });
        };
        let onSwipe = (delta) => {
            baseScroll -= delta;
            updatePositions();
        };
        let onSwipeBegin = () => {
            setAnimateClass(false);
        };
        let onSwipeEnd = () => {
            setAnimateClass(true);
    
            if (baseScroll < minScroll()) {
                baseScroll = minScroll()
            }
    
            if (baseScroll > maxScroll()) {
                baseScroll = maxScroll()
            }
    
            updatePositions();
        };
        
    
        // Add swipe listeners
        $(section.find('img')).on('dragstart', (e) => e.preventDefault())
        addSwipeListener(section.find('.news-items-wrapper')[0], onSwipe, onSwipeBegin, onSwipeEnd);
        addSwipeListener(section.find('.slider')[0], (delta) => onSwipe(-delta * knobDeltaModifier), (delta) => onSwipeBegin(-delta * knobDeltaModifier), (delta) => onSwipeEnd(-delta * knobDeltaModifier))

        //add window rezise listener to facilitate debugging
        window.addEventListener('resize', updatePositions);

        //finalize by executing first update
        updatePositions();
    });
});