import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, switchMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/signin/models/user.model';
import { UserInfoService } from 'src/app/signin/services/user-info.service';
import { UserService } from '../users.service';

interface DialogData {
    userInfo: Partial<User>;
    mode: string;
}
@Component({
    selector: 'app-createuser-dialog',
    templateUrl: './new-user-dialog.component.html',
    styles: [`
        .flex-container .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2vh;
            color: rgb(245, 245, 245);
        }
        .flex-container .input-user-info{
            padding: 0 30px;
        }
        .flex-container h5{
            margin: 0;
            margin-top: 1.5rem;
            color: rgb(189, 188, 188);
        }

        .flex-container .userinfo {
            background: transparent;

            border: none;
            border-radius: 0;
            box-shadow: none;

            min-width: 13rem;
            height: 1.5rem;
            display: inline-block;

            border-bottom: 1.5px solid #acacac;
            padding: 0 0.25rem;
            font-family: 'Montserrat', sans-serif ;
            font-weight: 500;
            font-size: 0.83rem;
            color: #9a9a9a;
            transition: border-bottom 0.2s ease;
            margin: 0.5rem 0 ;
        }

        .flex-container .userinfo:focus {
            border-bottom: 1.5px solid #0094d2;
        }

        .flex-container .selectbox {
            background-color: #3d3d3d;
            border-radius: 0.2rem;
        }

        .flex-container .input-user-info .form-error-msg, .flex-container .input-user-info .form-error-msg .material-icons{
            font-size: 0.7rem;
            color: #FF6347;
        }

        .flex-container .mat-form-field-label{
            font-size: 0.85rem;
        }
        .flex-container .input-user-info .mat-icon{
            font-size: 20px;
        }

        .create-user-btn {
            margin-top: 1.5rem;
            padding-left: 0.5rem;
        }
        .create-user-btn .mat-button {
            background-color: #9A9A9A;
        }

        .flex-container .userinfo.error{
            border-bottom: 1.5px solid #FF6347;
        }

        .personal-userId{
            color: #E4A552;
            font-weight: 600;
            margin-top: 0.7rem;
            margin-left: 0.3rem
        }
        ::ng-deep .mat-dialog-container{
            background: #2B2B2B;
        }

        ::ng-deep .mat-simple-snackbar{
            font-size: 0.8vw;
            padding-left: 3.6vw
        }
    `]
})
// [TODO] form validation error 처리 부분 바꾸기
// [TODO] password validation에서 각 case에 맞는 error msg 띄우기
// 예를 들면, pattern은 만족했지만, 길이를 못맞춘 경우,, length error만 띄워야한다.
export class CreateNewUserDialogComponent implements OnInit, OnDestroy{

    createUserForm: FormGroup;
    updatePersonalForm: FormGroup;
    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';

    fieldTextType = false;
    selectedPemissionTypeList: object[] = [
        {name: 'Administrator', value: 'ADMINISTRATOR'},
        {name: 'Physician', value: 'PHYSICIAN'},
        {name: 'Developer', value: 'DEVELOPER'}
    ];

    duplicatedId = false;
    dialogName: string;
    originId: string;

    userPermission: string;

    unsubscribe$ = new Subject();

    constructor(
        public dialogRef: MatDialogRef<CreateNewUserDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private userService: UserService,
        private snackBar: MatSnackBar,
        private userInfoService: UserInfoService
    ){
        this.userPermission =  JSON.parse(localStorage.getItem('userInfo')).permission;
        console.log(this.userPermission);

        this.createUserForm = this.fb.group({
            id: [this.data.mode === 'createMode' ? '' : this.data.userInfo.id, Validators.required],
            name: [this.data.mode === 'createMode' ? '' : this.data.userInfo.name, Validators.required],
            passwordGroup: this.fb.group({
                password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
                confirmPassword: ['', Validators.required],
            }, {validators: this.matchPassword('password', 'confirmPassword')}),
            // password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
            // confirmPassword: ['', Validators.required],
            permission: [this.data.mode === 'createMode' ? '' : this.data.userInfo.permission, Validators.required],
            institution: [this.data.mode === 'createMode' ? '' : this.data.userInfo.institution]
        });

        console.log(this.createUserForm);
        if (this.userPermission === 'PHYSICIAN'){
            this.updatePersonalForm = this.fb.group({
                name: [this.data.userInfo.name, Validators.required],
                password: ['', [Validators.required, , Validators.minLength(8), Validators.pattern(this.regexPassword)]],
            });
        }

    }

    ngOnInit(): void {
        console.log('user info dialog2');
        if (this.data.mode === 'createMode'){
            this.dialogName = 'Create User';
            this.originId = '';
        }else if (this.data.mode === 'editMode'){
            this.dialogName = 'Edit User';
            this.originId = this.data.userInfo.id;
        }

        const checkUserId$ = this.createUserForm.get('id').valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            filter(res => res !== ''),
            filter(res => res !== this.originId),
            switchMap((userId: string) => this.userService.findDuplicateUser(userId))
        );
        const emptyId$ = this.createUserForm.get('id').valueChanges.pipe(
            filter(res => res === ''),
            mapTo(false)
        );

        merge(checkUserId$, emptyId$).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            (res) => {
                if (res){
                    this.duplicatedId = true;
                } else{
                    this.duplicatedId = false;
                }
            },
            (error) => console.log(error),
        );
    }

    togglePwdHide(): void {
        this.fieldTextType = !this.fieldTextType;
    }

    close(): void {
        this.dialogRef.close();
    }

    onSubmit(form): any {
        // request create user to server

        if (this.data.mode === 'createMode'){
            this.userService.createNewUser({
                id: form.value.id,
                password: form.value.password,
                name: form.value.name,
                institution: form.value.institution,
                permission: form.value.permission,
            }).pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe(
                () => {
                    this.close();
                    console.log('create user');
                    this.showSnackbar('Create user successfully', '');
                },

                (error) => console.log(error)
            );
        } else if (this.data.mode === 'editMode' && this.userPermission === 'ADMINISTRATOR'){
            const userSeq = String(this.data.userInfo.seq);
            this.userService.updateUser({
                id: form.value.id,
                password: form.value.password,
                name: form.value.name,
                institution: form.value.institution,
                permission: form.value.permission,
            }, userSeq).pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe(
                (result) => {
                    console.log(result);
                    this.close();
                    console.log('update success'),
                    this.showSnackbar('Update user successfully', '');
                },
                (error) => console.log(error)
            );
        } else if (this.data.mode === 'editMode' && this.userPermission === 'PHYSICIAN'){
            const userSeq = String(this.data.userInfo.seq);
            this.userService.updateUser({
                name: form.value.name,
                password: form.value.password
            }, userSeq).pipe(
                takeUntil(this.unsubscribe$)
            ).subscribe(
                (result) => {
                    console.log('resuilt', result);
                    this.userInfoService.setUserInfo(result);
                    this.close();
                    console.log('update success'),
                    this.showSnackbar('Update user successfully', '');

                },
                (error) => console.log(error)
            );
        }

    }

    showSnackbar(content: string, action: string): void {
        this.snackBar.open(content, action, {
            duration: 2000,
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-style']
        });
    }

    enterToSubmit($event): void{
        if (this.userPermission === 'PHYSICIAN' && !this.updatePersonalForm.valid){
            $event.preventDefault();
            console.log('cant submit;');
        }
        if ((this.userPermission === 'PHYSICIAN' && !this.updatePersonalForm.valid) ||
        ((this.userPermission === 'ADMINISTRATOR' || this.userPermission === 'DEVELOPER') &&
        (!this.createUserForm.valid || this.duplicatedId))) {
            $event.preventDefault();
            console.log('cant submit;');
        }
    }
    // group: AbstractControl) => ValidationErrors|null
    matchPassword(password: string, confirmPassword: string): ValidatorFn {
        return (formGroup: AbstractControl) => {
            console.log(formGroup.value);
            const passwordControl = formGroup.value[password];
            const confirmPasswordControl = formGroup.value[confirmPassword];
            console.log(passwordControl);
            if (!passwordControl || !confirmPasswordControl) {
                return null;
            } else if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                return null;
            } else if (passwordControl !== confirmPasswordControl) {
                console.log('password mismatch');
                return { passwordMismatch: true };
            }
            // if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
            //     return null;
            // }

            // if (passwordControl !== confirmPasswordControl) {
            //     console.log('password mismatch');
            //     return { passwordMismatch: true };
            // }
        };
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    // tslint:disable-next-line: typedef
    get name() {
        if (this.userPermission === 'ADMINISTRATOR' || this.userPermission === 'DEVELOPER'){
            return this.createUserForm.get('name');
        }else{
            return this.updatePersonalForm.get('name');
        }
    }

    // tslint:disable-next-line: typedef
    get id() {
        return this.createUserForm.get('id');
    }

    // tslint:disable-next-line: typedef
    get password() {
        if (this.userPermission === 'ADMINISTRATOR' || this.userPermission === 'DEVELOPER'){
            return this.createUserForm.get('password');
        }else{
            return this.updatePersonalForm.get('password');
        }
    }
}
