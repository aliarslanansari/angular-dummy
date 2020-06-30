import { SignUpComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes:Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent },
]

@NgModule({
    imports:[ RouterModule.forChild(routes) ],
    exports:[RouterModule]
})
export class AuthRoutingModule {}