import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, tap} from 'rxjs/operators';


import {StudyRow} from '../../components/studyrow.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import * as EventEmitter from 'events';

@Component({
    selector: 'app-study-table',
    templateUrl: './study-table.component.html',
    styleUrls: ['./study-table.component.css']
})
export class StudyTableComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() onclick = new EventEmitter();
    @Output() dbClick = new EventEmitter();
    
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
            console.log(this.dataSource)
        })
    }
    clickCount = 0;
    clickRelatedCount = 0;
    onClick(ev, row: any) {
        ev.stopPropagation();
        // this.preventSingleClick = false;
        console.log(row,' clicked')
        // this.clickCount++;
        // if (this.clickCount === 1) {
        //     // console.log('---------- onClick0')
        //     this.preventSingleClickTimer = setTimeout(() => {
        //         this.clickCount = 0;
        //         this.singleClickStudy = row;
        //         this.onclick.emit({event: ev, study: row});
        //         // this.getRelatedStudies(row, this.isDblClick);
        //     }, 300);
        // } else if (this.clickCount === 2) {
        //     clearTimeout(this.preventSingleClickTimer);
        //     this.clickCount = 0;
        //     this.onDblClick(ev, row);
        // }
    }
    // onDblClick(ev, row: any) {
    //     clearTimeout(this.preventSingleClickTimer);
    //     ev.stopPropagation();
    //     // console.log('---------- onDblClick')
    //     this.dbClick.emit({event: ev, study: row}); // main view 열면서 study 전달
    //     this.isDblClick = true;
    //     //this.getRelatedStudies(row, this.isDblClick);
    // }
}
