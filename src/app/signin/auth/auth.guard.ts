import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private auth: AuthService
    ){}
        // 새로고침 눌러서 다시 webviewer에 들어갈때 동작
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (!this.auth.isAuthenticated()) {
            console.log('invalid token');
            // 토큰이 만료되었을 때, refresh token 활용해서 새로운 토큰을 다시 받아온다\
            // refreshtoken도 만료되었을 때
            this.auth.silentRefresh().subscribe(
                (res) => {
                    console.log(res);
                    this.router.navigate(['/webviewer']);
                    return true;
                },
                (error) => {
                    console.log(error);
                    return false;
                }
            );
        }else {
            return true;
        }

    }

}
