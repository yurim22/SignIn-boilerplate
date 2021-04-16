import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/signin/auth.service";
import { environment } from "src/environments/environment";
import { Observable, Subscription } from 'rxjs';
import { User } from "src/app/models/user.model";
import { shareReplay } from "rxjs/operators";


@Injectable({
    providedIn: 'root'
})
export class UserService{
    appUrl = environment.apiUrl;

    constructor(
        private authService: AuthService,
        private httpClient: HttpClient
    ){}

    getUserList(): Observable<User[]>{
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        return this.httpClient.get<User[]>(`${this.appUrl}/users`,{headers}).pipe()
    }

    createNewUser(createUserData: Partial<User>) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        return this.httpClient.post(`${this.appUrl}/users`, createUserData, {headers})
    }

    updateUser(updateUserData: Partial<User>, userSeq:string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        return this.httpClient.patch(`${this.appUrl}/users/${userSeq}`, updateUserData, {headers})
    }

    deleteUser(userId: string){
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        return this.httpClient.delete(`${this.appUrl}/users/${userId}`, {headers})
    }

    searchDuplicateId(userInput: string) {
        
    }

}