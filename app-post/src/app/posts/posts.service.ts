import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class PostsService {
    constructor(private http:HttpClient){}

    private postsUpdated = new Subject<Post[]>();
    private posts: Post[] = [];
    getPosts(){
        this.http.get<{message:string, posts:Post[]}>('http://localhost:3000/api/posts')
        .subscribe((body)=>{
            this.posts = body.posts;
            this.postsUpdated.next([...this.posts]);
        });
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string, content:string){
        const post:Post = {id:null, title:title, content:content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts])
    }
}