import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignUpComponent{

    constructor(public authService:AuthService, public router:Router){}

    isLoading=false;

    onSignup(form:NgForm){ 
        if(form.invalid){
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email,form.value.password)
        .subscribe(null,error=>{
            this.isLoading = false;
        })
    }
}