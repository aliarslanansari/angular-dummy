import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class PostsService {
    constructor(private http:HttpClient){}
    private postsUpdated = new Subject<Post[]>();
    private posts: Post[] = [];
    getPosts(){
        this.http.get<{message:string, posts:Post[]}>('http://localhost:3000/api/posts')
        .pipe(map((postData)=>{
            return postData.posts.map(fetchedpost=>{
                return{
                    title : fetchedpost.title,
                    content:fetchedpost.content,
                    id: fetchedpost._id,
                }
            })
        }))
        .subscribe((transformedPosts)=>{
            this.posts = transformedPosts;
            console.log(transformedPosts);
            this.postsUpdated.next([...this.posts]);
        });
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title:string, content:string){
        const post:Post = {id:null, title:title, content:content};
        this.http.post<{message:string, postId:string}>('http://localhost:3000/api/posts',post)
        .subscribe((resData)=>{
            const id = resData.postId;
            post.id= id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }
    getOnePost(id:string){
        return {...this.posts.find(p=> p.id == id)};
    }
    deletePost(postId:string){
        this.http.delete('http://localhost:3000/api/posts/'+postId)
        .subscribe(()=>{
            console.log('Post Deleted')
            const updatedPosts = this.posts.filter(post => post.id!==postId)
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
    updatePost(id:string, title:string, content:string){
        const post: Post = {id:id, title:title, content:content};
        this.http.put('http://localhost:3000/api/posts/'+id,post)
        .subscribe((res)=>{
            console.log(res);
        })

    }
}