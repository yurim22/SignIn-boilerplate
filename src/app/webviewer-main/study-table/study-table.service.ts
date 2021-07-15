import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Series } from 'src/app/models/series.model';
import { StudyRow } from 'src/app/models/studyrow.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StudyTableService {

    appUrl = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ) { }

    getStudyList(filterStatus: object, limit: number, skip: number): Observable<StudyRow[]>{
        const queryString = Object.keys(filterStatus).map(condition => encodeURIComponent(condition)
        + '=' + encodeURIComponent(filterStatus[condition])).join('&');
        // const queryString = Object.entries(filterStatus).filter(status => status[1] === true).map(status =>
        //     encodeURIComponent('status') + '=' + encodeURIComponent(status[0])).join('&');
        console.log('-------getStudyList');
        return this.httpClient.get<StudyRow[]>(`${this.appUrl}/api/v1/studies?${queryString}&limit=${limit}&skip=${skip}`);
    }

    getStudiesCount(filterStatus: object): Observable<number> {
        const queryString = Object.keys(filterStatus).map(condition => encodeURIComponent(condition)
        + '=' + encodeURIComponent(filterStatus[condition])).join('&');
        return this.httpClient.get<number>(`${this.appUrl}/api/v1/studies/studiesCount?${queryString}`);
    }

    getSeriesItem(seq: number): Observable<Series> {
        return this.httpClient.get<Series>(`${this.appUrl}/api/v1/studies/${seq}`);
    }

    updateStudyStatus(updateStudyData: Partial<StudyRow>, seq: number): Observable<StudyRow> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        console.log(updateStudyData);
        return this.httpClient.patch<StudyRow>(`${this.appUrl}/api/v1/studies/${seq}`, {updateStudyData, userInfo});
    }
}
