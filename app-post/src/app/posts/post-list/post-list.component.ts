import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from './../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title:'First Post', content:'This is the first post\' Content'},
  //   {title:'Second Post', content:'This is the second post\' Content'},
  //   {title:'Third Post', content:'This is the third post\' Content'},
  // ]
  totalPosts = 0;
  postPerPage =2;
  currentPage = 1;
  userIsAuthenticated = false;
  userId:string;
  pageSizeOptions = [1,2,5,10];
  posts:Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  private authStatusSub:Subscription;

  constructor(public PostsService:PostsService, private authService:AuthService) { }

  ngOnInit(): void {
    this.PostsService.getPosts(this.postPerPage,this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postsSub = this.PostsService.getPostUpdateListener()
    .subscribe((postData: {posts:Post[], postCount:number})=>{
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      this.isLoading = false;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub =  this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated= isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }
  ngOnDestroy():void{
    this.postsSub.unsubscribe();
  }
  onDelete(postId:string){
    this.PostsService.deletePost(postId).subscribe(()=>{
      this.PostsService.getPosts(this.postPerPage,this.currentPage);
    },()=>{
      this.isLoading = false;
    });
  }
  onChangedPage(pageData : PageEvent){
    this.currentPage = pageData.pageIndex+1;
    this.postPerPage = pageData.pageSize;
    this.PostsService.getPosts(this.postPerPage,this.currentPage);
  }
}
