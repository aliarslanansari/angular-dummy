import { AngularMaterialModule } from './../angular-material.module';
import { SignUpComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations:[
        LoginComponent,
        SignUpComponent,    
    ],
    imports:[
        CommonModule,
        AngularMaterialModule
    ]
})
export class AuthModule{}