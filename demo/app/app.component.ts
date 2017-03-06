import { Component } from '@angular/core';

import '../style/app.scss';
import {NHttp} from '../../lib/n-http.service';
import {Headers} from '@angular/http';
import {NHttpUpload} from "../../lib/n-http-fileupload.service";
import {NEndpoints} from "../../lib/n-endpoints";
import {NHttpJWT} from "../../lib/n-http-jwt.service";

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  pipeTest: string = 'Create an amazing community by contributing a library';
  url: string = 'https://github.com/preboot/angular-library-seed';

  public email: string = 'dhni@nodes.dk';
  public password: string = 'password';

  public user = {
    email: 'dhni+1@nodes.dk',
    password: 'password',
    name: {
      first: 'Dennis 2',
      last: 'Haulund Nielsen 2'
    }
  };

  private file: any;

  constructor(private endpoints: NEndpoints, private http: NHttp, private authHttp: NHttpJWT, private upload: NHttpUpload) {
    console.log(this.endpoints.rootUrl);

    let rootUrl = this.endpoints.rootUrl;

    // let testUrl = this.endpoints.makeUrl([
      // this.endpoints.makeRoute(this.endpoints.routes['listings']['single'], {':listingId': 50680}),
      // this.endpoints.makeRoute(this.endpoints.routes['messages']['single'], {':messageId': 4})
    // ]); //

    // console.log(testUrl);

  }

  somethingSecure() {
    const url = this.endpoints.makeUrl([
      this.endpoints.makeRoute(this.endpoints.routes['admin']['me']),
    ]);

    this.authHttp.get(url).subscribe(
        res => console.warn(res.json()),
        err => console.error(err)
    );
  }

  createUser() {
    const url = this.endpoints.makeUrl([
      this.endpoints.makeRoute(this.endpoints.routes['admin']['create']),
    ]);

    console.log(this.user);

    this.http.post(url, this.user).subscribe(
        res => console.log(res.json()),
        err => console.log(err)
    )
  }

  getSomething() {
    // let authHeaders = new Headers();
    // authHeaders.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZSI6ImJhY2tlbmRfdXNlcnMiLCJ1c2VyIjp7ImlkIjo1NTYsInRva2VuIjoiNTY5ZTRiZjBkZDliMTUwOTVlZmJlNDQ2OWQ2MDQyNThlOTI3ODk4MmU4YWQzZDE5Y2U2ZTQ4Y2FjZTY0M2IxZCJ9fQ==.N6b406rNkGKB/6QWA9P4RwENnUrqRZm/1WYsBzm6ngY=');
    //
    // this.http.get('http://lokalboligv2.development-like.st/api/v1/users/me', {headers: authHeaders})
    //     .subscribe(
    //         res => console.log(res),
    //         err => console.log(err)
    //     );
  }

  uploadSomething() {
    // let authHeaders = new Headers();
    // authHeaders.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0YWJsZSI6ImJhY2tlbmRfdXNlcnMiLCJ1c2VyIjp7ImlkIjo1NTYsInRva2VuIjoiNTY5ZTRiZjBkZDliMTUwOTVlZmJlNDQ2OWQ2MDQyNThlOTI3ODk4MmU4YWQzZDE5Y2U2ZTQ4Y2FjZTY0M2IxZCJ9fQ==.N6b406rNkGKB/6QWA9P4RwENnUrqRZm/1WYsBzm6ngY=');
    //
    // let payload = {
    //   asset: this.file,
    //   type: 'image',
    //   uuid: Math.round(Math.random() * 100000)
    // };
    //
    // this.upload.upload('http://lokalboligv2.development-like.st/api/v1/listings/50680/messages', payload, {headers: authHeaders})
    //     .subscribe(
    //         progress => console.log(progress),
    //         err => console.log(err)
    //     );
  }

  onFileInputChange(event: any) {
    this.file = event.target.files[0];
  }

  login() {
    const url = this.endpoints.makeUrl([
      this.endpoints.makeRoute(this.endpoints.routes['admin']['login']),
    ]);

    this.http.post(url, {email: this.email, password: this.password}).subscribe(
        (res) => {
          const data = res.json();

          this.authHttp.storeToken(data.accessToken, data.refreshToken);
          // localStorage.setItem('id_token', res.json().accessToken);
          // localStorage.setItem('refresh_token', res.json().refreshToken);
        },
        err => console.log(err)
    )
  }

}
