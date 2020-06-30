import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent, canActivate:[AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate:[AuthGuard] },
    // { path:"auth", loadChildren:'./auth/auth.module#AuthModule'}, 
    /*
    For Angular 8 and 9, the lazy load declaration changed. 
    Since Angular 8 introduced the new recommended module 
    loading method, previously the default method of lazy 
    loading modules was to specify a string path to a module:
         { path:"auth", loadChildren:'./auth/auth.module#AuthModule'}, 
    The method of importing modules has changed to dynamic import.
    The dynamic import is promise-based and gives you access to the
    module, where the module’s class can be called.
    Thus your import should now be changed to:
          { path: 'auth', loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule) }
     */
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers:[AuthGuard]
})
export class AppRoutingModule {}