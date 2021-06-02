import {AfterViewInit, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
// import {SetStudyFilteredColumn} from '../../../store/status/status.actions';
import {Store} from '@ngxs/store';

@Component({
    selector: 'app-filter-text-dialog',
    template: `
        <form (ngSubmit)="apply()">
            <mat-dialog-content class="filter-dialog">
                <button mat-icon-button class="close-button" [mat-dialog-close]="true">
                    <mat-icon class="close-icon">close</mat-icon>
                </button>
                <ng-container>
                    <input id="dataInput"
                        type="text"
                        name="value"
                        autocomplete="off"
                        autofocus
                        width="20"
                        [formControl]="data_input"
                    >
                </ng-container>
            </mat-dialog-content>
        </form>  `,
    styles: [`
        .filter-dialog{
            display: flex;
            flex-direction: column;
            background: white;
        }
        .filter-dialog .close-button{
            // color: whitesmoke;
            font-size: small !important;
        }
        .closeBtn {
            padding: 0;
            cursor: pointer;
            background: transparent;
            border: 0;
        }
        #dataInput {
            border: none;
            border-bottom: 1px solid 
        }
    `],
})
export class FilterTextDialogComponent implements OnInit, AfterViewInit {
    // input_value = new FormControl('');

    displayName: string;
    input_data: any;
    data_input = new FormControl('');
    el: HTMLElement;
    isModifiedFilterCondition = false;

    public constructor(
        private store: Store,
        private readonly dialogRef: MatDialogRef<FilterTextDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: any
    ) {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        console.log('[FilterTextDialogComponent.ngAfterViewInit]', this.filterData);
        this.displayName = this.filterData.title;
        this.input_data = this.filterData.query;
        this.isModifiedFilterCondition = !!this.filterData.query;
        this.data_input.patchValue(this.input_data);
        this.el = document.getElementById('dataInput');
        //this.model = this.filterData.filter || new TextFilter(this.filterData.column.name);
    }

    onClearInput()  {
        this.data_input.patchValue('');
        this.el.focus();
    }

    apply() {
        /**  If second filter remove filter condition, and remain one filter condition
         *  then should read db data by the first filter condition. */
        // const non_space = /[^a-zA-Z0-9\s]/gi;
        const non_space = /^\S*$/; // to cancel whenever space is input.
        // console.log('this.input_data-->',non_space.test(this.data_input.value), this.data_input.value, this.isModifyStatus );
        if (!non_space.test(this.data_input.value) ||
            this.data_input.value === undefined ||
            this.data_input.value === '') {
            this.dialogRef.close({value: 'remove_filter_column', column: this.displayName});
        } else {
            console.log(this.data_input.value);
            // this.store.dispatch(new SetStudyFilteredColumn({ [this.displayName]: this.data_input.value }));
            this.dialogRef.close({value: ''});
        }
    }

    onCancel() {
        this.dialogRef.close({value: 'null'});
    }
}
