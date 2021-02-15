import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, tap} from 'rxjs/operators';


import {StudyRow} from '../../components/studyrow.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';


@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css']
})
export class StudyTableComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    
    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'birth_date', 'study_date', 'analysis_date', 'results', 'volumes']
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Birth Date','Study Date', 'Analysis Date', 'Results', 'Volumes']
    
    dataSource = new MatTableDataSource<StudyRow[]>();

    isGetStudies: boolean = false;
    isDbClick: boolean = false;

    preventSingleClickTimer: any;
    singleClickStudy: StudyRow;

    constructor(private http: HttpClient) {
        console.log('constructor');
        this.getPatientList();
        
    }

    ngOnInit(): void {
        // this.getPatientList();
    }

    ngAfterViewInit(): void {
        console.log('[StudyTableComponent.ngAfterViewInit]');
        /** only developer permission can see select box on worklist table */
        // if (this.permission !== '') {
        //     this.displayedColumns2.splice(0, 1);
        // }
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource.paginator)
        console.log(this.paginator)
        setTimeout(() => {
            this.isGetStudies = true;
        });
    }
    getPatientList() {
        console.log('getPatientList function')
        return this.http.get('assets/result_test.json').pipe(
            map(val => val['data']),
        ).subscribe(arrs => {
            this.dataSource.data = arrs;
            console.log(this.dataSource.data)
        })
    }
    
    onClick(ev, row: any) {
        ev.stopPropagation();
        // this.preventSingleClick = false;
        console.log(row,' clicked')
        

    }
    
}
