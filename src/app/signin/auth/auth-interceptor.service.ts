import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


// interface HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
// }

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService){}    
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();

        //헤더에 인증 토큰을 추가한 새로운 httpRequest 객체를 생성(클론)한다.
        const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', authToken)
        });
        
        //원본 HttpRequest 객체 대신 클론한 httpRequest 객체를 다음 미들웨어 체인으로 전달한다. 
        //다음 인터셉터가 없는 경우, Observable을 반환하고 종료
        if(clonedRequest){
            return next.handle(clonedRequest)
        }else{
            throw new Error("Method not implemented.");
        }
    }
    
}