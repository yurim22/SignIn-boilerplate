import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';
import { CREATE_USER } from 'src/app/common/graphql/gql'; 

@Component({
    selector: 'app-createUser-dialog',
    templateUrl: './new-user-dialog.component.html',
    styles:[`
        .flex-container .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5vh;
            color: rgb(245, 245, 245);
        }
        .flex-container h5{
            margin: 0;
            margin-top: 1.8rem;
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
        .create-user-btn .mat-button {
            background-color: #9A9A9A;
        }
    `]
})
export class CreateNewUserDialogComponent {

    createUserForm: FormGroup;
    
    // id: string;
    // name: string;
    // password: string;
    // permission: string;
    // institution: string;
    
    fieldTextType:boolean = false;
    selectedPemissionTypeList:object[] = [
        // {name: 'selected permission', value:''},
        {name: 'Administrator', value:'ADMINISTRATOR'},
        {name:'Physician', value: 'PHYSICIAN'},
        {name: 'Resctricted Physician', value: 'RESTRICTED_PHYSICIAN'},
        {name: 'Developer', value:'DEVELOPER'}
    ]
    
    
    constructor(
        public dialogRef: MatDialogRef<CreateNewUserDialogComponent>,
        private fb: FormBuilder,
        private apollo: Apollo
    ){
        this.createUserForm = this.fb.group({
            id:['', Validators.required],
            name:['',Validators.required],
            password:['',Validators.required],
            permission: ['', Validators.required],
            institution: ['']
        });
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
        this.apollo.mutate({
            mutation: CREATE_USER,
            variables:{
                data: {
                    id: form.value.id,
                    password: form.value.password,
                    name: form.value.name,
                    institution: form.value.institution,
                    permission: form.value.permission,
                }
            }
        }).subscribe(
            ({data}) => {
                console.log('got data', data)
                this.close();
                console.log('create user successfully')
            },
            (error) => console.log(error)
            
            )
    }

    get name() {
        return this.createUserForm.get('name')
    }

    get id() {
        return this.createUserForm.get('id')
    }
}
