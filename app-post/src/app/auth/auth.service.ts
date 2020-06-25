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
                setTimeout(()=>{
                    this.logout();
                },3600)
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                this.router.navigate(['/']);
            }
            
        });

    }
    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
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
}