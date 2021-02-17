import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'toolbar-logout',
    template: `
    <div id="icon_logout" class="flex-item-row top-menu-tools-container">
        <div title="Pacs" class="flex-top-menu-tools-icon-item-row">
            <img class="top-menu-tools-icon-button" src="assets/icons/logout.svg">
        </div>
        <div class="flex-top-menu-tools-icon-item-text">Logout</div>
    </div>
    `,
    styles: [`
        .top-menu-tools-icon-button{
            width: 15px;
            height: auto;
            padding: 13px 0px 2px 0px;
        }
        .flex-item-row{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .flex-top-menu-tools-icon-item-text {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            -webkit-font-smoothing: antialiased;
            color: #cecece;
            font-size: 10px;
            
            padding: 0px 0px 12px 0px;
            font-weight: 400;
            text-align: center;
            vertical-align: text-top;
            line-height: 0.6rem;
        }
    `]
})
export class ToolbarLogoutComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
