import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from './components/user.component';
import { AuthService, LoginUserInfo } from './signin/auth.service';

const FIND_USER = gql`
    query FindOneUser($id: String!) {
        getOneUser(id: $id) {
            seq
            id
            name
            permission
            institution
        }
    }
`

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {

    //userId: string;

    private id: string;
    private name: string;
    private permission: string;
    private seq: number;
    private institution: string;

    //private users: User[] = []

    constructor(
        private authService: AuthService,
        private apollo: Apollo
    ) {
        //if localStorage안의 token값이 [undefined, "", 0]이 아닐때, 즉 token값이 있을 때
        if(!!localStorage.getItem('token')){
            const user = LoginUserInfo()
            user.id = localStorage.getItem('id');
            user.name = localStorage.getItem('name');
            user.permission = localStorage.getItem('permission');
            user.institution = localStorage.getItem('institution')
            console.log(user);
        }else {
            localStorage.clear()
            console.log('clear the localstorage')
        }
    }
    
    getCurrentLoginUserInfo() {
        const userId = this.authService.getUserid()
        console.log(userId);
        this.apollo.watchQuery<any>({
            query: FIND_USER,
            variables:{
                id: userId
            },
            errorPolicy: 'all'
        }).valueChanges.subscribe(
            ({data}) => {
                LoginUserInfo(data.getOneUser)
                this.setUserInfo()
            }
        )
    }

    setUserInfo(){
        const user = LoginUserInfo();
        this.id = user.id
        this.name = user.name;
        this.permission = user.permission;
        this.institution = user.institution;
        this.seq = user.seq

        localStorage.setItem('id', this.id)
        localStorage.setItem('name', this.name)
        localStorage.setItem('permission', this.permission)
        localStorage.setItem('institution', this.institution)
    }
    
    get userId() {
        return this.id;
    }
    get userName() {
        return this.name;
    }

    get userPermission() {
        return this.permission;
    }
    get userInstitution() {
        return this.institution
    }

    clear() {
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        localStorage.removeItem('permission');
        localStorage.removeItem('institution');

        LoginUserInfo({})
    }
    
    getCurrentUser(){
        return LoginUserInfo()
    }
}
