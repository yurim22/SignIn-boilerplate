import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { makeVar } from '@apollo/client/cache/inmemory/reactiveVars';
// import { makeVar } from '@apollo/client';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Apollo, gql, Query } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import {LOGIN_INFO} from 'src/app/common/graphql/gql';


export const LoginUserInfo = makeVar<any>({})

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy{

    accessToken: string;
    refreshToken: string;

    private querySubscription: Subscription;
    
    constructor(
        private httpClient: HttpClient,
        private jwtHelper: JwtHelperService,
        private apollo: Apollo,
        private router: Router,
    ) { }
    
    ngOnInit() {
        console.log('auth service ngonInit')
    }
    signIn(userid:string, userpwd:string) {
        this.querySubscription =  this.apollo.watchQuery<any>({
            query: LOGIN_INFO,
            variables: {
                data: {
                    id: userid,
                    password: userpwd
                }
            }
        }).valueChanges.subscribe(
            ({data}) => {
                this.accessToken = data.signIn.accessToken,
                this.refreshToken = data.signIn.refreshToken
                //accessToken을 localstorage에 저장
                this.setToken(this.accessToken)
                
                this.router.navigate(['/webviewer'])
            },
            (error) => {
                console.log('login result is fail',error);
            }
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
