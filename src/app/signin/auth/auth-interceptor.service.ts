import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService){ }    
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var authToken = this.authService.getToken();

        //헤더에 인증 토큰을 추가한 새로운 httpRequest 객체를 생성(클론)한다.

        console.log('there is a token: ', authToken)

        const clonedRequest: HttpRequest<any> = req.clone()
        console.log('clonedRequest', clonedRequest)
        //원본 HttpRequest 객체 대신 클론한 httpRequest 객체를 다음 미들웨어 체인으로 전달한다. 
        //다음 인터셉터가 없는 경우, Observable을 반환하고 종료
        if(clonedRequest){
            return next.handle(clonedRequest).pipe(catchError(
                error => {
                    if(error instanceof HttpErrorResponse && error.status === 401) {
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
        if(!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.silentRefresh().pipe(
                switchMap((token: any) => {
                    console.log(token)
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token)
                    console.log(request)

                    return next.handle(this.addToken(request, token.accessToken))
                })
            )
        }else{
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {return next.handle(this.addToken(request, jwt))})
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
}