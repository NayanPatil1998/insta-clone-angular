import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  email = null
  name = null;
  user = null

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    auth.getUser().subscribe((user) => {
      console.log("User  ===> ",user)
      this.email = user?.email
      // this.name = user?.displayName
    })
  }

  ngOnInit(): void {}


  async handleSignOut(){
    try {
      await this.auth.signOut();
      this.router.navigateByUrl("/signin")
      this.toastr.success("Sign Out Success")
      this.email = null;

    } catch (error) {
      this.toastr.error("Problem in Sign Out")
    }
  }
}
