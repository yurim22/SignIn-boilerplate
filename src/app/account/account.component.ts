import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../signin/auth/auth.service';
import { CurrentUserState } from '../store/users/users.state';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

    changePwdForm: FormGroup;
    regexPassword = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&]).{8,}';
    userId: string;
    paramsSubscription: Subscription;
    explanation: string;
    invalidPwdMsg: string;
    isInvalidPwd: boolean;

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private store: Store,
                private authService: AuthService) {
        this.changePwdForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            passwordGroup: this.formBuilder.group({
                newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
                newPasswordRepeat: ['', Validators.required],
            }, {validators: this.matchPassword('newPassword', 'newPasswordRepeat')}),
        }, {validators: this.matchPassword('oldPassword', 'passwordGroup.newPassword')});
    }

    ngOnInit(): void {
        // url parameter로 user id 받아서 저장
        this.paramsSubscription = this.activatedRoute.params.subscribe(
            params => {
                this.userId = params.userId;
            }
        );
        // [TODO] session storage에 status 정보 담아서 새로고침해도 유지되게 만들기
        this.explanation = this.store.selectSnapshot(CurrentUserState.getUserLoginStatus);

        if (this.explanation) {
            sessionStorage.setItem('explanation', this.explanation);
        } else{
            this.explanation = sessionStorage.getItem('explanation');
        }
    }

    onSubmit(): any {
        console.log(this.changePwdForm.value.oldPassword);
        console.log('submit');
        const oldPassword = this.changePwdForm.value.oldPassword;
        const newPassword = this.changePwdForm.value.passwordGroup.newPassword;

        this.authService.chagnePassword(this.userId, oldPassword, newPassword).subscribe(
            (res) => {
                console.log(res);
                this.isInvalidPwd = false;
                this.router.navigate(['/webviewer']);
            },
            (error) => {
                console.log(error);
                this.isInvalidPwd = true;
                if (error.error.message === 'Invalid Password') {
                    this.invalidPwdMsg = 'Invalid Password';
                }
            }
        );

        setTimeout(() => this.isInvalidPwd = false, 3000);
    }
    changeNextTime(): void {
        this.router.navigate(['/webviewer']);
    }

    matchPassword(password: string, confirmPassword: string): ValidatorFn {
        console.log(confirmPassword);
        return (formGroup: AbstractControl) => {
            const passwordControl = formGroup.value[password];
            const confirmPasswordControl = formGroup.value[confirmPassword];

            if (!passwordControl || !confirmPasswordControl) {
                return null;
            } else if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
                return null;
            } else if (passwordControl !== confirmPasswordControl) {
                return { passwordMismatch: true };
            }
        };
    }
}
