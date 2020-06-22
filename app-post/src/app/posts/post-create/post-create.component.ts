import { PostsService } from './../posts.service';
import { Component, OnInit } from "@angular/core";
import { Post } from './../post.model';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    private mode = 'create';
    private postId: string;
    form:FormGroup;
    post: Post;
    isLoading: boolean  = false;
    constructor(public PostsService: PostsService, public route:ActivatedRoute){}

    onAddPost(){
        if(form.invalid){
            return
        }
        this.isLoading= true;
        if(this.mode === 'create'){
            this.PostsService.addPost(form.value.title,form.value.content);
        } else {
            this.PostsService.updatePost(this.postId,form.value.title,form.value.content);
        }
        form.resetForm();
    }
    ngOnInit(){
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit'
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.PostsService.getOnePost(this.postId)
                .subscribe((postData)=>{
                    this.isLoading= false;
                    this.post = {id:postData._id, title:postData.title, content:postData.content};
                });
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }
}