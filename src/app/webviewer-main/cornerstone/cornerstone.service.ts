import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

// declare const cornerstone: any;
declare const cornerstoneWADOImageLoader;
// declare const dicomParser: any;

import * as cornerstone from 'cornerstone-core';
// import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CornerstoneService {

    instances: Array<Array<any>>;
    selectedElementId = '#dicomImage';

    constructor(private httpClient: HttpClient) {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    }

    getSeriesImg(url: string): Observable<any> {
        return this.httpClient.get<any>(url);
    }

    fetchDicomImage(element, url: string): any {
        console.log(`fetching: ${url}`);
        cornerstone.loadImage(url).then((image) => {
            console.log(image);
            cornerstone.displayImage(element, image);
        });
    }


    setCanvasSize(currentWidth: number, currentHeight: number): any {
        const element = document.getElementById('dicomImage');
        if (element === undefined) {
            return;
        }
        const enabledElements = cornerstone.getEnabledElements();

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < enabledElements.length; i++) {
            if (enabledElements[i].element === element) {
                const canvas = enabledElements[i].canvas;
                const image = enabledElements[i].image;

                let width = currentWidth;
                let height = currentHeight;

                //
                // 윈도우의 크기가 극도로 작아졌을때 왼쪽 사이드 바와 오른쪽 사이드 바는
                // 각각 너비 290 씩을 가지면서 더 이상 작아지지 않으므로
                // 최소 너비도 290*2로 설정한다.
                // 그리고 캔버스의 최소 크기도 0으로 지정한다. (-값이 되지 않게)
                //
                if (0 > width) { width = 0; }
                if (0 > height) { height = 0; }

                //
                // 이벤트 타이밍에 의해 너비와 resize 계산이 맞지 않는 것에 대한 보정
                //
                // if (currentWindowWidth === 580) {
                //     width = 0;
                // }

                canvas.width = width;
                canvas.height = height;
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';

                cornerstone.invalidate(element);
                cornerstone.drawImage(element);
                if (image !== undefined) {
                    const imageSize = this.getImageSize(enabledElements[i]);
                    const verticalScale = canvas.height / imageSize.height;
                    const horizontalScale = canvas.width / imageSize.width;

                    let newScale = Math.min(horizontalScale, verticalScale);

                    // Prevent scale from getting too small
                    const MIN_VIEWPORT_SCALE = 0.0001;
                    newScale = Math.max(newScale, MIN_VIEWPORT_SCALE);

                    enabledElements[i].viewport.scale = newScale;

                    cornerstone.invalidate(element);
                    cornerstone.drawImage(element);
                }
            }
        }
    }
    getImageSize(enabledElement): any {
        if (enabledElement.viewport.rotation === 0 || enabledElement.viewport.rotation === 180) {
            return {
                width: enabledElement.image.width,
                height: enabledElement.image.height
            };
        }

        return {
            width: enabledElement.image.height,
            height: enabledElement.image.width
        };
    }
    // isOneOf2x1Element(elementId): boolean {
    //     if (elementId === '#dicomImage01' || elementId === '#dicomImage02') {
    //         return true;
    //     }
    //     return false;
    // }
}
