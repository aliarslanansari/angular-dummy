import { PostsService } from './../posts.service';
import { Component } from "@angular/core";
import { Post } from './../post.model';
import { NgForm } from '@angular/forms';
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})

export class PostCreateComponent {
    constructor(public PostsService: PostsService){}
    onAddPost(form:NgForm){
        if(form.invalid){
            return
        }
        const post: Post = {
            title:form.value.title,
            content:form.value.content,
        };
        this.PostsService.addPost(form.value.title,form.value.content);
    }
} 