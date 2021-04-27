import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../signin/auth/auth.service';
@Component({
    selector: 'app-webviewer-main',
    templateUrl: './webviewer-main.component.html',
    styleUrls: ['./webviewer-main.component.css']
})
export class WebviewerMainComponent implements OnInit {

    tokenExpireDate: Date;
    refreshToken: string;
    decodeToken: any;
    timeToExpired: number;

    constructor(private authService: AuthService,
        private cookieService: CookieService) { }

    ngOnInit() {
        this.refreshToken = this.cookieService.get('refreshToken')
        this.tokenExpireDate = this.authService.tokenExpirationDate(this.cookieService.get('refreshToken'))
        console.log('------------tokenExpireDate', this.tokenExpireDate)
        this.decodeToken = this.authService.decodeToken(this.refreshToken);
        console.log(this.decodeToken)

        this.timeToExpired = this.decodeToken.exp - this.decodeToken.iat
        console.log(this.timeToExpired);
        setTimeout(() => {console.log('refresh token was expired')}, this.timeToExpired*1000)
    }  

    expiredRefreshToken() {
        
    }

}
