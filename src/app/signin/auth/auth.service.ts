import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { makeVar } from '@apollo/client/cache/inmemory/reactiveVars';
// import { makeVar } from '@apollo/client';
import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from 'ngx-cookie-service';
// import { Apollo, gql, Query } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Token } from '../../models/token.model';
// import {LOGIN_INFO} from 'src/app/common/graphql/gql';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy{
    appUrl = environment.apiUrl;
    TOKEN_NAME = 'jwt_token';

    accessToken: string;
    refreshToken: string;

    private querySubscription: Subscription;
    
    constructor(
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService,
        private router: Router,
        private cookieService: CookieService
    ) { }
    
    ngOnInit() {
        console.log('auth service ngonInit')
    }

    //accesstoken은 localstorage에 저장
    //refreshtoken은 cookie에 저장.... 일단은..
    signIn(userId: string, userPwd: string): Observable<Token>{ 
        return this.httpClient.post<Token>(`${this.appUrl}/auth/signin`, {id: userId, password: userPwd})
        .pipe(
            tap(res => this.setToken(res.accessToken)),
            tap(res => this.cookieService.set('refreshToken', res.refreshToken)),
            shareReplay()
        )
    }

    logout():void {
        console.log('logout')
        this.removeToken()
        this.router.navigate(['/signin'])
    }

    setToken(token: string): void {
        localStorage.setItem('token', token)
    }

    getToken():string {
        return localStorage.getItem('token')
    }
    
    removeToken() {
        localStorage.removeItem('token')
    }

    //token 유효기간 체크
    isTokenExpired(token: string){
        return this.jwtHelper.isTokenExpired(token);
    }

    //jwt를 decode해서 userId 얻어내기
    getUserid(): string {
        return this.jwtHelper.decodeToken(this.getToken()).userId
    }

    //token 유효성 확인
    isAuthenticated():boolean {
        const token = this.getToken();
        return token ? !this.isTokenExpired(token) : false;
    }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }   
} 
