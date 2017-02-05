import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import {NHttpConfig} from '../../lib/n-http.config';
import {NHttpModule} from '../../n-http';

export function ConfigureNHttp() {
  return new NHttpConfig({
    // globalHeaders: [{'jamBam': 'slamPan'},{'flap': 'jack'}],
  });
}

@NgModule({
  imports: [
    BrowserModule,
    // HttpModule,
    FormsModule,
    NHttpModule.forRoot(ConfigureNHttp())
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
