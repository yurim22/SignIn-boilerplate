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
    styles: [`
        .main-container{
            display: flex;
        }
        .study-list-container{
            width: 55%;
        }
        .report-container {
            width: 45%;
        }
        .study-list-container, .report-container {
            margin-left: 1%;
            padding-right: 1%;
        }
        .section-title{
            display: inline-block;
            margin-top: 8px;
            font-size: 1.25rem;
            color: rgb(214, 212, 212);
            padding-bottom: 4px;
            margin-bottom: 1px;
        }
        .report-image{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        @media (max-width: 1224px) {
            .study-list-container{
                width: 50%;
            }
            .report-container {
                width: 50%;
            }
        }
    `]
})
export class WebviewerMainComponent {

    constructor() { }

}
