import { Component } from '@angular/core';

@Component({
    selector: 'app-webviewer-main',
    template: `
        <app-header></app-header>
        <div class="main-container">
            <div class="study-list-container">
                <ng-container #iconMenu>
                    <div class="section-title" style="margin-top: 0.4em;"><i [ngClass]="['fa fa-bars fa-sx']"></i>&nbsp;Study List</div>
                </ng-container>
                <app-study-table></app-study-table>
            </div>
            <div class="report-container">
                <ng-container>
                    <div class="section-title" style="margin-top: 0.4em;"><i [ngClass]="['fa fa-bars fa-sx']"></i>&nbsp;JUNO Report</div>
                </ng-container>
                <div class="report-image">
                    <app-report-image-list></app-report-image-list>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent {

    constructor() { }

}
