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

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        if(!this.auth.isAuthenticated()) {
            console.log('invalid token');
            // //토큰이 만료되었을 때, refresh token 활용해서 새로운 토큰을 다시 받아온다
            this.auth.silentRefresh().subscribe(
                (res) => {
                    console.log(res)
                    return true
                },
                (error) => {
                    console.log(error)
                    this.router.navigate(['/signin'])
                    return false;
                }
            )
            // this.router.navigate(['/signin'])
            // return false;
        }
        return true;
    }
  
}
