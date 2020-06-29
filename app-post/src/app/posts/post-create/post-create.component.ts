import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from './../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls:['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy{
  private mode = 'create';
  private postId: string;
  form:FormGroup;
  post: Post;
  imagePreview: string;
  private authService:AuthService;
  isLoading: boolean  = false;
  private authStatusSub:Subscription;
  constructor(public PostsService: PostsService, public route:ActivatedRoute){}
  
  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus)=>{
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      'content':new FormControl(null, {validators:[Validators.required]}),
      'image': new FormControl(null, {validators:[Validators.required],asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit'
        this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.PostsService.getOnePost(this.postId)
                .subscribe((postData)=>{
                  this.isLoading= false;
                  this.post = {id:postData._id, title:postData.title, content:postData.content,imagePath:postData.imagePath, creator:postData.creator};
                  this.form.setValue({
                    title:this.post.title,
                        content:this.post.content,
                        image:this.post.imagePath
                      });
                    });
                  }else{
                    this.mode = 'create';
                    this.postId = null;
                  }
                });
              }
              
              onAddPost(){
                if (this.form.invalid) {
                  return;
          }
          this.isLoading = true;
          if (this.mode === "create") {
            this.PostsService.addPost(
              this.form.value.title,
              this.form.value.content,
              this.form.value.image
              );
          } else {
            this.PostsService.updatePost(
              this.postId,
              this.form.value.title,
              this.form.value.content,
              this.form.value.image
              );
          }
          this.form.reset();
    }
    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      console.log('sssssss',file);
                this.form.patchValue({ image: file });
                this.form.get("image").updateValueAndValidity();
        console.log('qqqqqqqqqqqqq',this.form.value.image)
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      ngOnDestroy(): void {
        this.authStatusSub.unsubscribe()
      }
    }