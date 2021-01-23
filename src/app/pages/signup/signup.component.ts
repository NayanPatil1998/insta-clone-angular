import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


// * services
import { AuthService } from 'src/app/services/auth.service';

// * angular forms
import { NgForm } from "@angular/forms";
import { finalize } from "rxjs/operators";


// * firebase
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase } from "@angular/fire/database";

// * browser image resizer
import { readAndCompressImage } from "browser-image-resizer";

// * utils
import { imageConfig } from "../../utils/config";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  picture: string = "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg";
  uploadPercentage: number = null;
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private storage: AngularFireStorage,
    private db : AngularFireDatabase

  ) {}

  ngOnInit(): void {}


  onSubmit(f: NgForm){
    const {email, password, username, country, bio, name} = f.form.value;

    this.auth.signUp(email, password)
    .then((res) => {
      console.log(res);
      const {uid} = res.user
      this.db.object(`/users/${uid}`).set({
        id: uid,
        name: name,
        email: email,
        country: country,
        instaUserName: username,
        bio: bio,
        picture: this.picture
      })
    })
    .then(() => {
      this.router.navigateByUrl('/')
      this.toastr.success("Sign Up Success")
    })
    .catch((err) => {
      this.toastr.error("Sign Up failed")
      console.log(err)
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageConfig)

    const filePath = file.name
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercentage = percentage
    });

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("Image Upload Success")
        })
      })
    ).subscribe();
  }
}
