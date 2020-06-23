import { PostsService } from './../posts.service';
import { Component, OnInit } from "@angular/core";
import { Post } from './../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

    ngOnInit(){
        this.form = new FormGroup({
            'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
            'content':new FormControl(null, {validators:[Validators.required]}),
            'image': new FormControl(null, {validators:[Validators.required]})
        });
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit'
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.PostsService.getOnePost(this.postId)
                .subscribe((postData)=>{
                    this.isLoading= false;
                    this.post = {id:postData._id, title:postData.title, content:postData.content};
                    this.form.setValue({
                        title:this.post.title,
                        content:this.post.content
                    });
                });
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onAddPost(){
        if(this.form.invalid){
            return
        }        
        this.isLoading= true;
        if(this.mode === 'create'){
            this.PostsService.addPost(this.form.value.title,this.form.value.content);
        } else {
            this.PostsService.updatePost(this.postId,this.form.value.title,this.form.value.content);
        }
        this.form.reset();
    }
    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ image:file });
        this.form.get('image').updateValueAndValidity();
        console.log(file);
        console.log(this.form);
    }
}