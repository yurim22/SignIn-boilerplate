import {AfterViewInit, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
// import {SetStudyFilteredColumn} from '../../../store/status/status.actions';
import {Store} from '@ngxs/store';

@Component({
    selector: 'app-filter-text-dialog',
    template: `
        <form (ngSubmit)="apply()" class="filter-dialog">
            <div class="header">
                <button mat-icon-button class="close-button" [mat-dialog-close]="true">
                    <mat-icon class="close-icon">close</mat-icon>
                </button>
            </div>
            <ng-container>
                <input id="dataInput"
                    type="text"
                    name="value"
                    appAutofocus
                    width="20"
                    [formControl]="dataInput"
                    autocomplete="off"
                >
            </ng-container>
        </form>  `,
    styles: [`
        .filter-dialog{
            display: flex;
            flex-direction: column;
        }
        .filter-dialog .header .close-button {
            width: 20px;
            height: 35px;
            border-radius: 0%;
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
    `],
})
export class FilterTextDialogComponent implements OnInit, AfterViewInit {
    // input_value = new FormControl('');

    displayName: string;
    inputData: any;
    dataInput = new FormControl('');
    el: HTMLElement;
    isModifiedFilterCondition = false;

    public constructor(
        private store: Store,
        private readonly dialogRef: MatDialogRef<FilterTextDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: any
    ) {}

    ngOnInit() {
        this.dataInput.valueChanges.subscribe(
            (res) => console.log(res)
        )
    }

    ngAfterViewInit(): void {
        console.log('[FilterTextDialogComponent.ngAfterViewInit]', this.filterData);
        // this.displayName = this.filterData.title;
        // this.inputData = this.filterData.query;
        // this.isModifiedFilterCondition = !!this.filterData.query;
        // this.dataInput.patchValue(this.inputData);
        this.el = document.getElementById('dataInput');
        // this.model = this.filterData.filter || new TextFilter(this.filterData.column.name);
    }

    onClearInput()  {
        this.dataInput.patchValue('');
        this.el.focus();
    }

    apply() {
        //  If second filter remove filter condition, and remain one filter condition
        // then should read db data by the first filter condition.
        // const non_space = /[^a-zA-Z0-9\s]/gi;
        const nonSpace = /^\S*$/; // to cancel whenever space is input.
        // console.log('this.input_data-->',non_space.test(this.data_input.value), this.data_input.value, this.isModifyStatus );
        if (!nonSpace.test(this.dataInput.value) ||
            this.dataInput.value === undefined ||
            this.dataInput.value === '') {
            this.dialogRef.close({value: 'remove_filter_column', column: this.displayName});
        } else {
            console.log(this.dataInput.value);
            // this.store.dispatch(new SetStudyFilteredColumn({ [this.displayName]: this.data_input.value }));
            this.dialogRef.close({value: this.dataInput.value});
        }
    }

    onCancel() {
        this.dialogRef.close({value: 'null'});
    }
}
