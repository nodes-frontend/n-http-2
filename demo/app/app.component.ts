import { Component } from '@angular/core';

import '../style/app.scss';
import {NHttp} from '../../lib/n-http.service';
import {Headers} from '@angular/http';
import {NHttpUpload} from "../../lib/n-http-fileupload.service";

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  pipeTest: string = 'Create an amazing community by contributing a library';
  url: string = 'https://github.com/preboot/angular-library-seed';

  private file: any;

  constructor(private http: NHttp, private upload: NHttpUpload) {}

  getSomething() {
    let authHeaders = new Headers();
    authHeaders.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZSI6ImJhY2tlbmRfdXNlcnMiLCJ1c2VyIjp7ImlkIjo1NTYsInRva2VuIjoiNTY5ZTRiZjBkZDliMTUwOTVlZmJlNDQ2OWQ2MDQyNThlOTI3ODk4MmU4YWQzZDE5Y2U2ZTQ4Y2FjZTY0M2IxZCJ9fQ==.N6b406rNkGKB/6QWA9P4RwENnUrqRZm/1WYsBzm6ngY=');

    this.http.get('http://lokalboligv2.development-like.st/api/v1/users/me', {headers: authHeaders})
        .subscribe(
            res => console.log(res),
            err => console.log(err)
        );
  }

  uploadSomething() {
    let authHeaders = new Headers();
    authHeaders.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZSI6ImJhY2tlbmRfdXNlcnMiLCJ1c2VyIjp7ImlkIjo1NTYsInRva2VuIjoiNTY5ZTRiZjBkZDliMTUwOTVlZmJlNDQ2OWQ2MDQyNThlOTI3ODk4MmU4YWQzZDE5Y2U2ZTQ4Y2FjZTY0M2IxZCJ9fQ==.N6b406rNkGKB/6QWA9P4RwENnUrqRZm/1WYsBzm6ngY=');

    let payload = {
      asset: this.file,
      type: 'image',
      uuid: Math.round(Math.random() * 100000)
    };

    this.upload.upload('http://lokalboligv2.development-like.st/api/v1/listings/50680/messages', payload, {headers: authHeaders})
        .subscribe(
            progress => console.log(progress),
            err => console.log(err)
        );
  }

  onFileInputChange(event: any) {
    this.file = event.target.files[0];
  }

}
