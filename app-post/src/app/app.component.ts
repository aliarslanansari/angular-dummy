import { AuthService } from './auth/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { Post } from "./posts/post.model";
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(private authService:AuthService,private titleService: Title){}
    ngOnInit(){
      this.authService.autoAuthData();
      this.setTitle('YourPost')
    }


    public setTitle( newTitle: string) {
      this.titleService.setTitle( newTitle );
    }
}
