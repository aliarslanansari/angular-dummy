import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
    providedIn:'root'
})
export class AuthService {
    private token: string;
    isAuthenticated = false;
    private tokenTimer: any;
    private userId:string;
    private authStatusListener = new Subject<boolean>();
    constructor(private http:HttpClient, private router:Router){}
    createUser(email:string, password:string){
        const authData :AuthData = { email:email, password:password};
        this.http.post(BACKEND_URL+'/signup',authData)
        .subscribe(response=>{
            console.log(response);
            this.router.navigate(['/']);
        },error=>{
            this.authStatusListener.next(false);
        }
        )
    }

    getUserId(){
        return this.userId;
    }

    login(email:string, password:string){
        const authData :AuthData = { email:email, password:password};
        this.http.post<{token:string,expiresIn:number, userId:string}>(BACKEND_URL+'/login',authData)
        .subscribe(response=>{
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration = response.expiresIn;
                this.userId = response.userId;
                this.setAuthTimer(expiresInDuration);
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate,this.userId);
                this.router.navigate(['/']);
            }
            
        }, error=>{
            this.authStatusListener.next(false); 
        });

    }
    autoAuthData(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresIn/1000);
        }
    }
    private setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        },duration * 1000)
    }

    logout(){
        this.token = null;
        this.userId = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
    }
    getToken(){
        return this.token;
    }
    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    private saveAuthData(token:string, expirationDate:Date, userId:string){
        localStorage.setItem('token',token);
        localStorage.setItem('expiration',expirationDate.toISOString());
        localStorage.setItem('userId',userId);
    }
    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }
    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');

        if(!token || !expirationDate){
            return
        }
        return{
            token:token,
            expirationDate: new Date(expirationDate),
            userId:userId
        };
    }
}