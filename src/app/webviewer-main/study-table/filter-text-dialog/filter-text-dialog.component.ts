import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
// import {SetStudyFilteredColumn} from '../../../store/status/status.actions';
import {Store} from '@ngxs/store';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import moment from 'moment';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY-MM-DD'
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'app-filter-text-dialog',
    template: `
        <form (ngSubmit)="apply()" class="filter-dialog" [formGroup]="dateForm">
            <div class="header">
                <button mat-icon-button class="close-button" [mat-dialog-close]="true" (click)="onCancel()">
                    <mat-icon class="close-icon">close</mat-icon>
                </button>
            </div>
            <ng-container *ngIf="!dateFilter">
                <input id="dataInput"
                    type="text"
                    name="value"
                    appAutofocus
                    width="20"
                    [formControl]="dataInput"
                    autocomplete="off"
                >
            </ng-container>
            <ng-container *ngIf="dateFilter">
                <mat-form-field class="calender-form">
                    <mat-date-range-input [rangePicker]="picker">
                        <input matStartDate placeholder="Start date" autocomplete="off" formControlName="startDate" id="dataInput" appAutofocus>
                        <input matEndDate placeholder="End date" autocomplete="off" formControlName="endDate">
                    </mat-date-range-input>
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-date-range-picker #picker></mat-date-range-picker>
                </mat-form-field>
                <button type="submit">SIGN IN</button>
            </ng-container>
        </form>`,
    styles: [`
        .filter-dialog{
            display: flex;
            flex-direction: column;
        }
        .filter-dialog .header .close-button {
            width: 20px;
            height: 20px;
            line-height: 20px;
            margin-top: 10px;
            margin-bottom: 0.8rem;
        }
        .filter-dialog .header .close-icon{
            font-size: medium !important;
            font-color: #2b2b2b;
        }
        #dataInput {
            background: transparent;
            border: none;
            border-radius: 0;
            box-shadow: none;

            height: 1.5rem;
            display: inline-block;
            min-width: 2.5rem;
            border-bottom: 1.8px solid #2b2b2b;
            padding: 0 0.25rem;
            font-family: 'Montserrat', sans-serif ;
            font-weight: 500;
            color: #555;
            transition: border 0.2s ease;
        }
        #dataInput:focus {
            border-bottom: 2px solid #0094d2;
        }
        .filter-dialog .header{
            text-align: right
        }
        ::ng-deep .mat-form-field-infix {
            width: 185px !important;
            border: 0;
        }
        .mat-date-range-input {
            font-size: 14px;
        }
    `],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
    ]
})
export class FilterTextDialogComponent implements OnInit, AfterViewInit {

    displayName: string;
    inputData: any;
    dataInput = new FormControl('');
    el: HTMLElement;
    isModifiedFilterCondition = false;
    dateFilter: boolean;
    dateForm: FormGroup;
    inputValue: string;

    public constructor(
        private store: Store,
        private readonly dialogRef: MatDialogRef<FilterTextDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: any,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef
    ) {
        // const defaultDate = this.getFormatDate(new Date());
        this.dateForm = fb.group({
            startDate: new FormControl(),
            endDate: new FormControl()
        });
    }

    ngOnInit(): void {

        if (this.filterData.title === 'study_date' || this.filterData.title === 'analysis_date'){
            this.dateFilter = true;
            if (this.filterData.query) {
                this.dateForm.patchValue({
                    startDate: this.filterData.query.slice(0, 10),
                    endDate: this.filterData.query.slice(13, 23)
                });
            } else{
                this.dateForm = this.fb.group({
                    startDate: new FormControl(moment()),
                    endDate: new FormControl(moment())
                });
            }
        } else{
            this.dateFilter = false;
            console.log(this.filterData);
            this.dataInput.patchValue(this.filterData.query);
        }
    }

    ngAfterViewInit(): void {
        console.log('[FilterTextDialogComponent.ngAfterViewInit]', this.filterData);
        this.el = document.getElementById('dataInput');
        this.changeDetector.detectChanges();
    }

    onClearInput(): void  {
        this.dataInput.patchValue('');
        this.el.focus();
    }

    apply(): any {
        // [TODO] 공백 없애기
        //  If second filter remove filter condition, and remain one filter condition
        // then should read db data by the first filter condition.
        // const non_space = /[^a-zA-Z0-9\s]/gi;
        const nonSpace = /^\S*$/; // to cancel whenever space is input.
        // console.log('this.input_data-->',non_space.test(this.data_input.value), this.data_input.value, this.isModifyStatus );
        // if (!nonSpace.test(this.dataInput.value) ||
        //     this.dataInput.value === undefined ||
        //     this.dataInput.value === '') {
        //     this.dialogRef.close({value: 'remove_filter_column', column: this.displayName});
        // } else {
        //     console.log(this.dataInput.value);
        //     // this.store.dispatch(new SetStudyFilteredColumn({ [this.displayName]: this.data_input.value }));
        //     this.dialogRef.close({value: this.dataInput.value, date: this.dateForm.value});
        // }
        // if (this.dateForm.value) {
        //     const startDate = moment(this.dateForm.value.startDate);
        //     const endDate = moment(this.dateForm.value.endDate);

        // }
        if (this.dataInput.value) {
            this.inputValue = this.dataInput.value.replace(' ', '');
            this.dialogRef.close({value: this.inputValue, date: this.dateForm.value});
        } else if (this.dataInput.value === undefined) {
            this.onCancel();
        } else{
            this.dialogRef.close({value: this.dataInput.value, date: this.dateForm.value});
        }

    }

    onCancel(): void {
        this.dialogRef.close();
    }

    // getFormatDate(date): string{
    //     console.log(date);
    //     const year = date.getFullYear();
    //     let month = (1 + date.getMonth());
    //     month = month >= 10 ? month : '0' + month;
    //     let day = date.getDate();
    //     day = day >= 10 ? day : '0' + day;
    //     console.log([year, month, day].join('-'));
    //     return [year, month, day].join('-');
    // }
}
