import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Study } from 'src/app/models/study.model';
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

    // getUserList(): Observable<User[]>{
    //     return this.httpClient.get<User[]>(`${this.appUrl}/users`).pipe()
    // }

    getStudyList(): Observable<StudyRow[]>{
        return this.httpClient.get<StudyRow[]>(`${this.appUrl}/studies`)
    }
}
