import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from './../post.model';
import { Subscription } from 'rxjs';

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
  posts:Post[] = [];
  private postsSub: Subscription;

  constructor(public PostsService:PostsService) { }
  ngOnInit(): void {
    this.PostsService.getPosts();
    this.postsSub = this.PostsService.getPostUpdateListener()
    .subscribe((posts:Post[])=>{
      this.posts = posts;
    });
  }
  ngOnDestroy():void{
    this.postsSub.unsubscribe();
  }
  onDelete(postId:string){
    this.PostsService.deletePost(postId);
  }
}
