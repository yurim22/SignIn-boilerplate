import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoService } from '../user-info.service';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

// query to graphql 
const LOGIN_INFO = gql`
    mutation UserLogin ($data: any) {
        login(data: $data){
            accessToken,
            refreshToken
        }
    }
`
const USER_LIST = gql`
    query GetAllUsers{
        getAllUsers{
            seq
            id
            name
            password
            permission
            creation_timestamp
        }
    }
`

@Component({ 
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

    checked = false;

    passwordExpired = false;
    signInForm: FormGroup;

    rememberedId = '';

    id = '';
    password = '';
    // oldPassword = '';
    // newPassword = '';
    // newPasswordRepeat = '';

    invalidPasswordCountOver = false;

    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';

    rememberMeCheckboxChecked = false;
    isAboutModalOpened = false;

    isSystemIntegrityChecking = true;
    isSystemIntegrityCheckingSuccess = true;

    private querySubscription: Subscription;
    
    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private dialog: MatDialog,
                private snackbar: MatSnackBar,
                private userInfoService: UserInfoService,
                private apollo: Apollo) {

        this.signInForm = formBuilder.group({
            id: [this.rememberedId, Validators.required],
            password: ['', Validators.required]
        })
    }


    ngOnInit(): void {
        console.log('[yurim] signin ngOnInit');
        setTimeout(() => {
            this.isSystemIntegrityChecking = false;
            this.isSystemIntegrityCheckingSuccess = true;
        }, 2000)

        this.querySubscription = this.apollo.watchQuery({
            query: USER_LIST
        }).valueChanges.subscribe(
            ({data}) => {
                console.log(data)
            }, (error) => console.log(error)
        )
    }

    getMyClass() {
        /* if (this.selectedServiceModeOption === 'basic') { */
            return 'login-wrapper non-banner-image';
        /* } else {
            return 'login-wrapper main-banner-image';
        } */
    }

    onSubmit(){
        console.log('submit');
        //this.router.navigate(['/webviewer'])
        console.log('loginid:',this.signInForm.value);
        this.userInfoService.userId = this.signInForm.value.id
        console.log(this.userInfoService.userId)
        console.log(this.signInForm.value.password)
        
        // this.apollo.mutate({
        //     mutation: LOGIN_INFO,
        //     variables: {
        //         data:{
        //             id: this.signInForm.value.id,
        //             password: this.signInForm.value.password
        //         }
        //     }
        // }).subscribe(
        //     ({data}) => console.log('result of login ', data),
        //     (error) => console.log('there was an error sending the query', error)
        // )
    }

    isRememberedIdExist():boolean {
        return false;
    }
    onRemembermeChanged(e) {
        console.log(e);
        this.rememberMeCheckboxChecked = e.checked
    } 

    showAboutDialog(){
        console.log('show about dialog')
    }

    // set userName(id: string){
    //     this.userInfoService.userId = id;
    // }

    ngOnDestroy() {
        this.querySubscription.unsubscribe();
    }

}
