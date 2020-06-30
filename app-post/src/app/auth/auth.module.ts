import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from './../angular-material.module';
import { SignUpComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations:[
        LoginComponent,
        SignUpComponent,    
    ],
    imports:[
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule{}