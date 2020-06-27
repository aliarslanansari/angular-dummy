import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy{
    private authStatusSub: Subscription;

    constructor(public authService:AuthService){}
    ngOnInit(){
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus=>{
            this.isLoading = false;
        });
    }
    ngOnDestroy(){
        this.authStatusSub.unsubscribe();
    }

    isLoading=false;

    onSignup(form:NgForm){ 
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email,form.value.password);
    }


}