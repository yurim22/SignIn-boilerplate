import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
// import { CREATE_USER, UPDATE_USER } from 'src/app/common/graphql/gql'; 
import { User } from 'src/app/models/user.model';
import Observable from 'zen-observable';
import { UserService } from '../users.service';

interface DialogData {
    userInfo: Partial<User>;
    mode: string;
}
@Component({
    selector: 'app-createUser-dialog',
    templateUrl: './new-user-dialog.component.html',
    styles:[`
        .flex-container .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2vh;
            color: rgb(245, 245, 245);
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
            margin-top: 1.8rem
        }
        .create-user-btn .mat-button {
            background-color: #9A9A9A;
        }

        .flex-container .userinfo.error{
            border-bottom: 1.5px solid #FF6347;
        }
    `]
})
export class CreateNewUserDialogComponent {

    createUserForm: FormGroup;
    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';

    fieldTextType:boolean = false;
    selectedPemissionTypeList:object[] = [
        {name: 'Administrator', value:'ADMINISTRATOR'},
        {name:'Physician', value: 'PHYSICIAN'},
        {name: 'Developer', value:'DEVELOPER'}
    ]
    
    duplicatedId: boolean = false;
    dialogName: string;

    constructor(
        public dialogRef: MatDialogRef<CreateNewUserDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private userService: UserService
    ){ 
        // if(this.data.userInfo === null){

        // }
        this.createUserForm = this.fb.group({
            id:[this.data.mode == 'createMode' ? '' : this.data.userInfo.id, Validators.required],
            name:[this.data.mode == 'createMode' ? '' : this.data.userInfo.name,Validators.required],
            password:['',[Validators.required,, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
            permission: [this.data.mode == 'createMode' ? '' : this.data.userInfo.permission, Validators.required],
            institution: [this.data.mode == 'createMode' ? '' : this.data.userInfo.institution]
        });
    }

    ngOnInit() {
        if(this.data.mode === 'createMode'){
            this.dialogName = "Create User"
        }else if(this.data.mode === 'editMode'){
            this.dialogName = "Edit User"
        }
        const checkUserId$ = this.createUserForm.get('id').valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((userId: string) => this.userService.findDuplicateUser(userId))
        )
        
        checkUserId$.subscribe(
            (res) => {
                if(res){
                    this.duplicatedId = true
                } else{
                    this.duplicatedId = false
                }
            },
            (error) => console.log(error),
        )
    }
    togglePwdHide() {
        this.fieldTextType = !this.fieldTextType;
    }

    close() {
        this.dialogRef.close();
    }

    onSubmit(form) {
        //request create user to server
        console.log('create user')
        //console.log(this.id);
        console.log(form.value);

        if(this.data.mode === 'createMode'){
            this.userService.createNewUser({
                id: form.value.id,
                password: form.value.password,
                name: form.value.name,
                institution: form.value.institution,
                permission: form.value.permission,
            }).subscribe(
                ()=> {
                    this.close();
                    console.log('create user')},
                (error) => console.log(error)
            )
        } else if(this.data.mode === 'editMode'){
            const userSeq = String(this.data.userInfo.seq)
            this.userService.updateUser({
                id: form.value.id,
                password: form.value.password,
                name: form.value.name,
                institution: form.value.institution,
                permission: form.value.permission,
            }, userSeq).subscribe(
                (result) => {
                    console.log(result)
                    this.close();
                    console.log('update success')
                },
                (error) => console.log(error)
            )
        }

    }

    get name() {
        return this.createUserForm.get('name')
    }

    get id() {
        return this.createUserForm.get('id')
    }

    get password() {
        return this.createUserForm.get('password')
    }
}
