import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    appUrl = environment.apiUrl;

    userid: string;
    user: string;

    private currentUserIdSubject: BehaviorSubject<string>;
    public currentUserId: Observable<string>;

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient
    ) {
        this.currentUserIdSubject = new BehaviorSubject<string>(localStorage.getItem('id'));
        this.currentUserId = this.currentUserIdSubject.asObservable();

        // localStorage안의 token 값이 [undefined, "", 0]이 아닐때, 즉 token 값이 있을 떄
        if (!!localStorage.getItem('token')){
            this.user = localStorage.getItem('user');
        }else {
            localStorage.clear();
            console.log('clear the localstorage');
        }
    }

    // ngOnInit() {
    //     // if localStorage안의 token값이 [undefined, "", 0]이 아닐때, 즉 token값이 있을 때
    //     if (!!localStorage.getItem('token')){
    //         this.seq = parseInt(localStorage.getItem('seq'));
    //         this.id = localStorage.getItem('id');
    //         this.name = localStorage.getItem('name');
    //         this.permission = localStorage.getItem('permission');
    //         this.institution = localStorage.getItem('institution');
    //     }else {
    //         localStorage.clear();
    //         console.log('clear the localstorage');
    //     }
    //     console.log('ngOnInit userinfo');
    // }

    setUserInfo(user): void{
        localStorage.setItem('userInfo', JSON.stringify(user));
    }

    clear(): void {
        localStorage.removeItem('userInfo');
    }

    getCurrentUser(): Observable<User>{
        this.userid = this.authService.getUserid();
        console.log('this.userid', this.userid);
        return this.httpClient.get<User>(`${this.appUrl}/users/${this.userid}`).pipe(shareReplay());
    }

    public get currentUserValue(): string {
        return this.currentUserIdSubject.value;
    }
}
