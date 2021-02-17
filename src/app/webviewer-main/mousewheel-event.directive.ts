import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appMousewheelEvent]'
})
export class MousewheelEventDirective {

    idx = 1
    report_img: string;
    constructor() { }
    @HostListener('mousewheel', ['$event']) 
    onMousewheel(event) {
        const step = 1;
        if (event.wheelDelta > 0) {
            this.idx = (this.idx - step) < 0 ? 0 : this.idx - step;
        }
        if (event.wheelDelta < 0) {
            this.idx = this.idx + step;
        }

        console.log(this.idx)
        this.report_img = this.setImgPath(this.idx)
    }

    setImgPath(idx) {
        console.log(idx);
        return `assets/report_test_210216/${idx}.jpg`
    }

}
