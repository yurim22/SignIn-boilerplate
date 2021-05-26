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

    constructor(private httpClient: HttpClient) {
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    }

    fetchDicomImage(element, url: string): any {
        console.log(`fetching: ${url}`);
        cornerstone.loadImage(url).then((image) => {
            console.log(image);
            cornerstone.displayImage(element, image);
        });
    }

    getSeriesImg(url: string): Observable<any> {
        return this.httpClient.get<any>(url);
    }
}
