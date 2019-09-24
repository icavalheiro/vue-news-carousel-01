//Given a event, gets the touch X position. Works with mouse as well
export function getTouchX(event: MouseEvent | TouchEvent) : number {
    if(event instanceof MouseEvent){
        return (event as MouseEvent).clientX;
    } else {
        return (event as TouchEvent).touches[0].clientX;
    }
}

//Handle swipe events on a given element
export default function onSwipe(
        element : HTMLElement,
        callback : (delta:number)=>{}, 
        startCallback : ()=>{}, 
        finishCallback : ()=>{}
        ) : void {

    let x : number;

    let handleTouchStart = (event: MouseEvent | TouchEvent) => {
        x = getTouchX(event);

        if (startCallback) startCallback();
    }

    let handleTouchMove = (event: MouseEvent | TouchEvent) => {
        if(!x) return;

        let newX : number = getTouchX(event);
        let delta : number = x - newX;
        x = newX;

        if(delta != 0) callback(delta);
    }

    let handleTouchEnd = () => {
        x = undefined;
        if(finishCallback) finishCallback();
    }

    //Let's register the event listeners in the DOM
    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('mousedown', handleTouchStart, false);
    element.addEventListener('touchmove', handleTouchMove, false);
    element.addEventListener('mousemove', handleTouchMove, false);
    element.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('mouseup', handleTouchEnd, false);
}