import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations:[
        PostCreateComponent,
        PostListComponent,    
    ],
    imports:[
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostsModule{}