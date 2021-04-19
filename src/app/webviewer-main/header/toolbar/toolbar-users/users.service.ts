import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/signin/auth/auth.service";
import { environment } from "src/environments/environment";
import { Observable, Subscription } from 'rxjs';
import { User } from "src/app/signin/models/user.model";
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
        return this.httpClient.get<User[]>(`${this.appUrl}/users`).pipe()
    }

    createNewUser(createUserData: Partial<User>) {

        return this.httpClient.post(`${this.appUrl}/users`, createUserData)
    }

    updateUser(updateUserData: Partial<User>, userSeq:string) {

        return this.httpClient.patch(`${this.appUrl}/users/${userSeq}`, updateUserData)
    }

    deleteUser(userId: string){

        return this.httpClient.delete(`${this.appUrl}/users/${userId}`)
    }

    findDuplicateUser(userId: string): Observable<Boolean>{
        return this.httpClient.get<Boolean>(`${this.appUrl}/users/checkId/${userId}`)

    }

}
