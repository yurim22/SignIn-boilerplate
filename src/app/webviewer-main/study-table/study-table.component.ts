import { Component, Input, OnChanges, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, takeUntil, tap} from 'rxjs/operators';

import { Study } from '../../components/study.component';
import { StudyRow} from '../../components/studyrow.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';


@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css'],
    
})
export class StudyTableComponent implements OnInit, OnChanges {

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Input() isConfirmed: boolean;
    @Input() confirmedStudy: number;
    @Input() isSelected: boolean;

    @Output() clickRow = new EventEmitter<StudyRow>();
    unsubscribe$ = new Subject<any>();
    
    displayedColumns = ['status', 'patient_id', 'patient_name', 'sex', 'age', 'study_date', 'analysis_date', 'results', 'volumes']
    displayedTitle = ['Status', 'Patient ID', 'Patient Name', 'Sex', 'Age','Study Date', 'Analysis Date', 'Results', 'Volumes']
    
    dataSource = new MatTableDataSource<Study>();

    isGetStudies: boolean = false;
    isAnalyzed: boolean = false;
    isReceived: boolean = false;

    sortedData: StudyRow[];

    @ViewChild('sort') sort: MatSort;
    

    constructor(private http: HttpClient, private el: ElementRef) {
        console.log('constructor');
        this.getPatientList();
        // console.log(this.row)
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        console.log('[StudyTableComponent.ngAfterViewInit]');
    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        setTimeout(() => {
            this.isGetStudies = true;
        });
       
    }

    ngOnChanges():void {
        if(this.isConfirmed) {
            console.log(this.dataSource.data[this.confirmedStudy-1])
            this.dataSource.data[this.confirmedStudy-1].status = "Reviewed"
        }
        console.log(this.isSelected);
    }
    getPatientList() {
        console.log('getPatientList function')
        return this.http.get('assets/result_json_test_210216.json').pipe(
            map(val => val['data']),
        ).subscribe(arrs => {
            console.log(arrs);
            // this.sortedData = arrs.slice()
            this.dataSource.data = arrs;  
            this.sortedData = this.dataSource.data.slice()
        })
    }
    // onSortRequest(sort: Sort) {
    //     console.log(sort);
    //     const data = this.dataSource.data.slice();
    //     console.log(data);
    //     if(!sort.active || sort.direction === ''){
    //         this.sortedData = data;
    //         return;
    //     }

    //     this.dataSource.data = data.sort((a,b) => {
    //         const isAsc = sort.direction === 'asc';
    //         console.log(a.patient_id)
    //         switch (sort.active) {
    //             case 'patient_id' : return compare(a.patient_id, b.patient_id, isAsc);
    //             default: return 0;
    //         }
    //     })

    //     console.log(this.sortedData)
    //     console.log(this.dataSource.data);
    // }
    getBackground(row){
        if(this.confirmedStudy === row.id){
            return {'selectedRow': true}
        }else{
            return {'selectedRow': false}
        }
    }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}