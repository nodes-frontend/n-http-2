import { Component } from '@angular/core';

import '../style/app.scss';
import {NHttp} from '../../lib/n-http.service';
import {Headers} from '@angular/http';
import {NHttpUpload} from "../../lib/n-http-fileupload.service";
import {NEndpoints} from "../../lib/n-endpoints";

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  pipeTest: string = 'Create an amazing community by contributing a library';
  url: string = 'https://github.com/preboot/angular-library-seed';

  public email: string = 'test@user.com';
  public password: string = 'Password1';

  private file: any;

  constructor(private endpoints: NEndpoints,private http: NHttp, private upload: NHttpUpload) {
    console.log(this.endpoints.rootUrl);

    let rootUrl = this.endpoints.rootUrl;

    let testUrl = this.endpoints.makeUrl([
      this.endpoints.makeRoute(this.endpoints.routes['listings']['single'], {':listingId': 50680}),
      this.endpoints.makeRoute(this.endpoints.routes['messages']['single'], {':messageId': 4})
    ]); //

    console.log(testUrl);

  }

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

  login() {
    const url = this.endpoints.makeUrl([
      this.endpoints.makeRoute(this.endpoints.routes['auth']['login']),
    ]);

    this.http.post(url, {email: this.email, password: this.password}).subscribe(
        res => console.log(res),
        err => console.log(err)
    )
  }

}
