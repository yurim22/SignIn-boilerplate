import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthService } from '../signin/auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    appUrl = environment.apiUrl;
    
    userid: string;
    
    id: string;
    name: string;
    permission: string;
    institution: string;
    private seq: number;

    //private users: User[] = []

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient
    ) {}

    ngOnInit(){
        //if localStorage안의 token값이 [undefined, "", 0]이 아닐때, 즉 token값이 있을 때
        if(!!localStorage.getItem('token')){
            this.id = localStorage.getItem('id');
            this.name = localStorage.getItem('name');
            this.permission = localStorage.getItem('permission');
            this.institution = localStorage.getItem('institution')
        }else {
            localStorage.clear()
            console.log('clear the localstorage')
        }
        console.log('ngOnInit userinfo')
    }
    setUserInfo(user){
        localStorage.setItem('id', user.id)
        localStorage.setItem('name', user.name)
        localStorage.setItem('permission', user.permission)
        localStorage.setItem('institution', user.institution)
    }

    clear() {
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('permission');
        localStorage.removeItem('institution');
    }
    
    getCurrentUser(): Observable<User>{
        this.userid = this.authService.getUserid();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        
        return this.httpClient.get<User>(`${this.appUrl}/users/${this.userid}`,{headers}).pipe(shareReplay())
    }
}
