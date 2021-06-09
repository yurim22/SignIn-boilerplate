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

    getStudyList(filterStatus: object): Observable<StudyRow[]>{
        const queryString = Object.keys(filterStatus).map(condition => encodeURIComponent(condition)
        + '=' + encodeURIComponent(filterStatus[condition])).join('&');
        // const queryString = Object.entries(filterStatus).filter(status => status[1] === true).map(status =>
        //     encodeURIComponent('status') + '=' + encodeURIComponent(status[0])).join('&');
        return this.httpClient.get<StudyRow[]>(`${this.appUrl}/studies?${queryString}`);
    }

    getSeriesItem(seq: number): Observable<Series> {
        return this.httpClient.get<Series>(`${this.appUrl}/studies/${seq}`);
    }

    updateStudyStatus(updateStudyData: Partial<StudyRow>, seq: number): Observable<StudyRow> {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return this.httpClient.patch<StudyRow>(`${this.appUrl}/studies/${seq}`, {updateStudyData, userInfo});
    }
}
