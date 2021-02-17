import { Injectable } from '@angular/core';
import { StudyRow } from '../components/studyrow.component';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
    providedIn: 'root'
})
export class TableDataService {

    tabledataSource: Array<StudyRow>;

    constructor() { }
}
