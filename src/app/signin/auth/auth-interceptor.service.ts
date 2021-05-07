import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { CommonDialogComponent } from 'src/app/common/dialog/common-dialog.component';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    private isRefreshing: boolean;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    refreshToken: string;
    constructor(private authService: AuthService, private cookieService: CookieService, private dialog: MatDialog){ }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // 헤더에 인증 토큰을 추가한 새로운 httpRequest 객체를 생성(클론)한다.

        const clonedRequest: HttpRequest<any> = req.clone();

        // 원본 HttpRequest 객체 대신 클론한 httpRequest 객체를 다음 미들웨어 체인으로 전달한다.
        // 다음 인터셉터가 없는 경우, Observable을 반환하고 종료
        if (clonedRequest){
            return next.handle(clonedRequest).pipe(catchError(
                error => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return this.handle401Error(clonedRequest, next);
                    }else{
                        return throwError(error);
                    }
                }
            ));
        }else{
            throw new Error('Method not implemented.');
        }

    }

    // unathorization error가 났을 때 refreshtoken 활용해서 새로운 token을 받아 request를 날려야 한다.
    // clonedrequest가 아닌 새로운 request를 생성해야함
    // tslint:disable-next-line: typedef
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        this.refreshToken = this.cookieService.get('refreshToken');
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.silentRefresh().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.refreshToken);
                    return next.handle(this.addToken(request, token.accessToken));
                }),
                catchError((error) => {
                    return throwError(error);
                })
            );
        }
        else{
            return next.handle(request)
            .pipe(
                catchError((error) => {
                    this.showExpiredTokenModal();
                    return throwError(error);
                })
            );
        }
    }

    // request header에 새로운 token 붙여서 전달
    // tslint:disable-next-line: typedef
    private addToken(request: HttpRequest<any>, token: string) {
        const newReq = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(newReq);
        return newReq;
    }

    showExpiredTokenModal(): void {
        // tslint:disable-next-line: new-parens
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
        dialogRef.afterClosed().subscribe(() => this.dialog.closeAll());
    }
}
