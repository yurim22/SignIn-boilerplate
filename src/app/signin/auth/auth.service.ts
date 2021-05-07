import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { StudyState } from 'src/app/store/study/study.state';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    appUrl = environment.apiUrl;
    TOKEN_NAME = 'jwt_token';

    accessToken: string;
    refreshToken: string;

    private querySubscription: Subscription;

    constructor(
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService,
        private router: Router,
        private cookieService: CookieService,
        private store: Store
    ) { }

    // accesstoken은 localstorage에 저장
    // refreshtoken은 cookie에 저장
    signIn(userId: string, userPwd: string): Observable<Token>{
        console.log('http request signin');
        return this.httpClient.post<Token>(`${this.appUrl}/auth/signin`, {id: userId, password: userPwd})
        .pipe(
            tap(res => {
                this.setToken(res.accessToken);
                this.cookieService.set('refreshToken', res.refreshToken);

            }),
            shareReplay()
        );
    }

    silentRefresh(): Observable<any> {
        this.refreshToken = this.cookieService.get('refreshToken');
        return this.httpClient.post<Token>(`${this.appUrl}/auth/silent-refresh`, {refreshToken : this.refreshToken})
        .pipe(
            tap(res => {
                this.setToken(res.accessToken),
                console.log(res.accessToken),
                this.cookieService.set('refreshToken', res.refreshToken);
            }),
            shareReplay()
        );
    }

    logout(): void {
        const signoutTime = new Date();
        console.log(signoutTime);
        this.removeToken();
        this.cookieService.delete('refreshToken');
        this.router.navigate(['']);
        this.store.reset(StudyState);
        // this.httpClient.patch(`${this.appUrl}/auth/signout`, {sign_out_timestamp: signout_time, history_seq: })
    }

    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string {
        return localStorage.getItem('token');
    }

    removeToken(): void {
        localStorage.removeItem('token');
    }

    // token 유효기간 체크
    isTokenExpired(token: string): boolean{
        return this.jwtHelper.isTokenExpired(token);
    }

    // jwt를 decode해서 userId 얻어내기
    getUserid(): string {
        return this.jwtHelper.decodeToken(this.getToken()).userId;
    }

    // token 유효성 확인
    isAuthenticated(): boolean {
        const token = this.getToken();
        return token ? !this.isTokenExpired(token) : false;
    }

    tokenExpirationDate(token: string): Date {
        return this.jwtHelper.getTokenExpirationDate(token);
    }

    decodeToken(token: string): any {
        return this.jwtHelper.decodeToken(token);
    }
}
