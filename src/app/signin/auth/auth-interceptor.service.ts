import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take, tap } from "rxjs/operators";
import { CommonDialogComponent } from "src/app/common/dialog/common-dialog.component";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    private isRefreshing:boolean = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    
    refreshToken : string;
    constructor(private authService: AuthService, private cookieService: CookieService,
        private dialog: MatDialog){ }    
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var authToken = this.authService.getToken();

        //헤더에 인증 토큰을 추가한 새로운 httpRequest 객체를 생성(클론)한다.

        console.log('there is a token: ', authToken)
        console.log('isRefreshing 왜 안돼', this.isRefreshing)
        const clonedRequest: HttpRequest<any> = req.clone()
        console.log('clonedRequest', clonedRequest)
        //원본 HttpRequest 객체 대신 클론한 httpRequest 객체를 다음 미들웨어 체인으로 전달한다. 
        //다음 인터셉터가 없는 경우, Observable을 반환하고 종료
        if(clonedRequest){
            return next.handle(clonedRequest).pipe(catchError(
                error => {
                    if(error instanceof HttpErrorResponse && error.status === 401) {
                        console.log(error)
                        return this.handle401Error(clonedRequest, next);
                    }else{
                        return throwError(error);
                    }
                }
            ))
        }else{
            throw new Error("Method not implemented.");
        }

    }

    //unathorization error가 났을 때 refreshtoken 활용해서 새로운 token을 받아 request를 날려야 한다.
    //clonedrequest가 아닌 새로운 request를 생성해야함
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        console.log(this.isRefreshing)
        this.refreshToken = this.cookieService.get('refreshToken')
        console.log(this.authService.isTokenExpired(this.refreshToken))
        if(!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.silentRefresh().pipe(
                switchMap((token: any) => {
                    console.log(token)
                    this.isRefreshing = false;
                    console.log('this.isRefreshing2 ------',this.isRefreshing)
                    this.refreshTokenSubject.next(token.refreshToken)
                    console.log(request)
                    return next.handle(this.addToken(request, token.accessToken))
                }),
                catchError((error) => {
                    // this.authService.logout()
                    console.log('silentRefresh error', error)
                    return throwError(error)
                })
            )
        }
        // else if(this.isRefreshing && !this.authService.isTokenExpired(this.refreshToken)) {
        //     console.log('refresgTijeb',this.refreshToken)
        //     return next.handle(request)
        // }
        else{
            console.log('refresgTijeb',this.refreshToken)
            return next.handle(request)
            .pipe(
                catchError((error) => {
                    this.showExpiredTokenModal()
                    console.log('error in else partS')
                    return throwError(error)
                })
            )
        }

    }

    //request header에 새로운 token 붙여서 전달
    private addToken(request: HttpRequest<any>, token: string) {
        const newReq = request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(newReq)
        return newReq
    }

    showExpiredTokenModal() {
        const dialogConfig = new MatDialogConfig;
        dialogConfig.hasBackdrop = true;
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'common-dialog';
        dialogConfig.data = {
            name: 'Logout',
            title: 'Token Expired',
            description: 'Token was expired. Please signin again',
            isConfirm: true,
            actionButtonText: 'OK',
        };

        const dialogRef = this.dialog.open(CommonDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(() => this.dialog.closeAll())
    }
}