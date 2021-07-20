import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacsService {
    appUrl = environment.apiUrl;
    cloudServerHostIp = environment.cloudServerHostIp;

    constructor(
        private httpClient: HttpClient
    ) { }

    getReceivePacsInfo(userid: string): Observable<any>{
        return this.httpClient.get(`${this.appUrl}/pacs/rePacs/${userid}`);
    }

    getSendPacsInfo(userid: string): Observable<any>{
        return this.httpClient.get(`${this.appUrl}/pacs/sePacs/${userid}`);
    }

    setReceivePacsInfo(createPacsData, userId: string): Observable<any> {
        console.log(userId);
        return this.httpClient.post(`${this.appUrl}/pacs/rePacs/${userId}`, createPacsData);
    }

    setSendPacsInfo(createPacsData, userId: string): Observable<any> {
        return this.httpClient.post(`${this.appUrl}/pacs/sePacs/${userId}`, createPacsData);
    }

    doHospitalDicomNodeConnectionTest(ae: string, host: string, port: string): Observable<any> {

        const url = 'http://' + this.cloudServerHostIp + ':9435/dicom/' + ae + '/' + host + '/' + port + '/query';
        return this.httpClient.get(url);
    }

}
