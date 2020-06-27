import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class PostsService {
    constructor(private http:HttpClient, private router:Router){}
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>();
    private posts: Post[] = [];
    
    getPosts(postsPerPage:number, currentPage:number){
        const queryParams = `?page=${currentPage}&pagesize=${postsPerPage}`;
        this.http.get<{message:string, posts:any,maxPosts:number}>('http://localhost:3000/api/posts'+queryParams)
        .pipe(map((postData)=>{
            return { post: postData.posts.map(fetchedpost=>{
                return{
                    title : fetchedpost.title,
                    content:fetchedpost.content,
                    id: fetchedpost._id,
                    imagePath: fetchedpost.imagePath,
                    creator: fetchedpost.creator,
                }
            }),
            maxPosts: postData.maxPosts
        };
        }))
        .subscribe((transformedPostsData)=>{
            console.log(transformedPostsData)
            this.posts = transformedPostsData.post;
            this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts});
        });
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string, content:string, image:File){
        const postData = new FormData();
        postData.append('title',title);
        postData.append('content',content);
        postData.append('image',image, title);
        this.http.post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
        .subscribe((resData)=>{ 
            this.router.navigate(['/',])
        });
    }
    getOnePost(id:string){
        return this.http.get<{_id:string, title:string, content:string, imagePath:string}>('http://localhost:3000/api/posts/'+id);
    }

    deletePost(postId:string){
       return this.http.delete('http://localhost:3000/api/posts/'+postId);
    }
    
    updatePost(id:string, title:string, content:string, image:File|string){
        let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
    }
}