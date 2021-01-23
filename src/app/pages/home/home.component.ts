import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users = [];
  posts = [];
  isLoading = false;
  user= null

  constructor(
    private toastr: ToastrService,
    db : AngularFireDatabase,
    auth: AuthService
  ) { 
    this.isLoading = true;
    db.object('/users')
    .valueChanges()
    .subscribe((obj) => {
      if(obj){
        this.users = Object.values(obj)
        this.isLoading = false
      }
      else{
        this.toastr.error('No Users Found')
        this.users = []
        this.isLoading = false;
      }
    })

    db.object('/posts')
    .valueChanges()
    .subscribe((obj) => {
      if(obj){
        this.posts = Object.values(obj).sort((a, b) => b.date-a.date)
        console.log(this.posts)
        this.isLoading = false
      }
      else{
        this.toastr.error('No Posts Found')
        this.posts = []
        this.isLoading = false;
      }
    })

    auth.getUser().subscribe((user) => {
      db.object(`/users/${user.uid}`)
      .valueChanges()
      .subscribe((user) => {
      this.user = user
      })
    })

    
  }

  ngOnInit(): void {
  }

}
