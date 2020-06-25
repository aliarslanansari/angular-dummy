import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class AuthService {
    private token: string;
    isAuthenticated = false;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private http:HttpClient, private router:Router){}

    createUser(email:string, password:string){
        const authData :AuthData = { email:email, password:password};
        this.http.post('http://localhost:3000/api/user/signup',authData)
        .subscribe(response=>{
            console.log(response);
            this.router.navigate(['/']);
        })
    }
    login(email:string, password:string){
        const authData :AuthData = { email:email, password:password};
        this.http.post<{token:string,expiresIn:number}>('http://localhost:3000/api/user/login',authData)
        .subscribe(response=>{
            const token = response.token;
            this.token = token;
            if(token){
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/']);
                
            }
            
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
    private saveAuthData(token:string, expirationDate:Date){
        localStorage.setItem('token',token);
        localStorage.setItem('expiration',expirationDate.toISOString());
    }
    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }
    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if(!token || !expirationDate){
            return
        }
        return{
            token:token,
            expirationDate: new Date(expirationDate)
        };
    }
}