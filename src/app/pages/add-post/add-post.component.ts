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

// * uuid
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  
  locationName: string;
  caption: string;
  picture: string = null;
  user = null;
  uploadPercent: number = null

  constructor(
    private db : AngularFireDatabase,
    private storage : AngularFireStorage,
    private toastr: ToastrService,
    auth: AuthService,
    private router: Router
  ) { 
    auth.getUser().subscribe((user) => {
      this.db.object(`/users/${user.uid}`)
      .valueChanges()
      .subscribe((user) => {
      this.user = user
      })
    })
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const pid = uuidv4()

    this.db.object(`/posts/${pid}`)
    .set({
      id: pid,
      userPic:this.user.picture,
      locationName: this.locationName,
      caption: this.caption,
      by: this.user.name,
      picture: this.picture,
      instaid: this.user.instaUserName,
      likes: [0],
      date: Date.now()
    })
    .then(() => {
      this.toastr.success("Post Added Successfully")
      this.router.navigateByUrl('/')
      
    })
    .catch((err)=> {
      this.toastr.error(err.message)
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageConfig)


    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((pg) => {
      this.uploadPercent = pg
    })

    task.snapshotChanges()
    .pipe(finalize(() => {
      fileRef.getDownloadURL().subscribe((url) => {
        this.picture = url;
        this.toastr.success("Upload Successful")
      })
    })).subscribe();
  }

}
