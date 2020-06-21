import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts = [
    {title:'First Post', content:'This is the first post\' Content'},
    {title:'Second Post', content:'This is the second post\' Content'},
    {title:'Third Post', content:'This is the third post\' Content'},
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
