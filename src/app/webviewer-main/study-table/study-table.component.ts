import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, takeUntil, tap} from 'rxjs/operators';

import { Study } from '../../components/study.component';
import { StudyRow} from '../../components/studyrow.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';


@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css']
})
export class StudyTableComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Output() clickRow = new EventEmitter<StudyRow>();
    unsubscribe$ = new Subject<any>();
    
    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'age', 'study_date', 'analysis_date', 'results', 'volumes']
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Age','Study Date', 'Analysis Date', 'Results', 'Volumes']
    
    dataSource = new MatTableDataSource<Study>();

    isGetStudies: boolean = false;
    isAnalyzed: boolean = false;
    isReceived: boolean = false;

    constructor(private http: HttpClient) {
        console.log('constructor');
        this.getPatientList();
        
    }

    ngOnInit(): void {
        // this.getPatientList();
        // this.currentStudy$.pipe(
        //     takeUntil(this.unsubscribe$)
        // ).subscribe( studies => {
        //     this.dataSource.data = studies
        // })
    }

    ngAfterViewInit(): void {
        console.log('[StudyTableComponent.ngAfterViewInit]');
        
        /** only developer permission can see select box on worklist table */
        // if (this.permission !== '') {
        //     this.displayedColumns2.splice(0, 1);
        // }
        this.dataSource.paginator = this.paginator;
        
        setTimeout(() => {
            this.isGetStudies = true;
        });
    }
    getPatientList() {
        console.log('getPatientList function')
        return this.http.get('assets/result_json_test_210216.json').pipe(
            map(val => val['data']),
        ).subscribe(arrs => {
            this.dataSource.data = arrs;  
        })
    }
    
    onClick(ev, row: any) {
        ev.stopPropagation();
        // this.preventSingleClick = false;
        console.log(row,' clicked')
        if(row.status === 'Analyzed'){
            console.log('success report');
            this.isAnalyzed = true;
        }

    }
    
}
