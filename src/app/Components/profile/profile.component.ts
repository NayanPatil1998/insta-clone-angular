import { Component, OnInit, Input } from '@angular/core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input()
  user;

  faInstagram = faInstagram;

  constructor() {}

  ngOnInit(): void {}

  getInstaUrl() {
    window.open(`https://instagram.com/${this.user.instaUserName}`, "_blank");
  }
}
