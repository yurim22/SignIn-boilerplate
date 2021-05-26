import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/signin/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/signin/models/user.model';
import { shareReplay } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class UserService{
    appUrl = environment.apiUrl;

    constructor(
        private httpClient: HttpClient
    ){}

    getUserList(): Observable<User[]>{
        return this.httpClient.get<User[]>(`${this.appUrl}/users`).pipe();
    }

    createNewUser(createUserData: Partial<User>): Observable<any> {
        return this.httpClient.post(`${this.appUrl}/users`, createUserData);
    }

    updateUser(updateUserData: Partial<User>, userSeq: string): Observable<any> {
        console.log('updateUserDate', updateUserData)
        return this.httpClient.patch(`${this.appUrl}/users/${userSeq}`, updateUserData);
    }

    deleteUser(userId: string): Observable<any>{

        return this.httpClient.delete(`${this.appUrl}/users/${userId}`);
    }

    findDuplicateUser(userId: string): Observable<boolean>{
        return this.httpClient.get<boolean>(`${this.appUrl}/users/checkId/${userId}`);
    }

    unlockUser(userId: string): Observable<any>{
        return this.httpClient.patch(`${this.appUrl}/users/unlock/${userId}`, {invalid_password_count: 0});
    }
}
