import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

// declare const cornerstone: any;
import * as cornerstone from 'cornerstone-core';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appCornerstone]'
})
export class CornerstoneDirective implements OnInit {

    element: any;
    imageList = [];
    currentIndex = 0;
    @Input('image')
    set image(imageData: any) {
        // console.log('setting image data:', imageData);
        // console.log(imageData);
        if (imageData) {
            console.log(imageData);

            if (!this.imageList.filter(img => img.imageId === imageData.imageId).length) {
                console.log('image list push');
                this.imageList.push(imageData);
            }

            if (imageData.imageId) {
                this.displayImage(imageData);
            }
            console.log(this.imageList);
        }
    }
    constructor(public elementRef: ElementRef) {
        // console.log(this.elementRef);
        this.elementRef = elementRef;
        console.log('======================constructure');
    }

    // @HostListener('window:resize', ['$event'])
    // onResize(event): void {
    //     cornerstone.resize(this.element, true);
    // }
    // [TODO] 이미지 리스트로 받아서 mousewheel event 추가
    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event): void {
        event.preventDefault();
        console.log('imageList', this.imageList);
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
        // console.log(event);

        if (delta > 0){
            // this.currentIndex ++;
            // console.log(this.currentIndex);
            // if ( this.currentIndex > this.imageList.length) {
            // this.currentIndex = this.imageList.length - 1;
            // }
            this.currentIndex --;
            if (this.currentIndex < 0){
            this.currentIndex = 0;
            }
        } else {
            // console.log(this.currentIndex);
            // this.currentIndex --;
            // if (this.currentIndex < 0){
            // this.currentIndex = 0;
            // }
            this.currentIndex ++;
            console.log(this.currentIndex);
            if ( this.currentIndex > this.imageList.length) {
            this.currentIndex = this.imageList.length - 1;
            }
        }

        this.image = this.imageList[this.currentIndex];
            // .filter( img => img.imageId === `wadouri:assets/dicom/DKUS001545/DKUS001545_${this.currentIndex}.dcm`)[0];
        console.log(this.image);
    }

    ngOnInit(): void {
        console.log('ngoninit directive');
        // Retrieve the DOM element itself
        this.element = this.elementRef.nativeElement;
        // Enable the element with Cornerstone
        cornerstone.enable(this.element);
        this.imageList = [];
    }

    displayImage(image: any): void {
        // console.log('display image', image);
        cornerstone.enable(this.element);
        // console.log('this element', this.element);
        console.log(image);
        cornerstone.displayImage(this.element, image);
    }
}
