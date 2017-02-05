import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NHttpConfig } from './lib/n-http.config';
import { NHttp } from './lib/n-http.service';
import { NHttpUpload } from './lib/n-http-fileupload.service';

// for manual imports
export * from './lib/index';

@NgModule({
  imports: [HttpModule],
  providers: [
    NHttp,
    NHttpUpload
  ],
})
export class NHttpModule {
  public static forRoot(config: NHttpConfig): ModuleWithProviders {
    return {
      ngModule: NHttpModule,
      providers: [
        {provide: NHttpConfig, useValue: config}
      ]
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: NHttpModule) {
    if (parentModule) {
      throw new Error(
          'NHttpModule is already loaded. Import it in the AppModule only');
    }
  }
}
