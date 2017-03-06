import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';

import { NHttpConfig, nHttpConfigFactory } from './lib/n-http.config';
import { NEndpoints, nEndpointsFactory } from './lib/n-endpoints';
import { NHttp } from './lib/n-http.service';
import { NHttpUpload } from './lib/n-http-fileupload.service';
import { NHttpUtils } from './lib/n-http-utils';
import { NHttpJWT } from './lib/n-http-jwt.service';

// for manual imports
export * from './lib/index';

@NgModule({
  imports: [HttpModule],
  providers: [
    NHttp,
    NHttpJWT,
    NHttpUpload,
    NHttpUtils
  ],
})
export class NHttpModule {
  public static forRoot(
      providedConfig: any = {
        provide: NHttpConfig,
        useFactory: nHttpConfigFactory
      },
      providedEndpoints: any = {
        provide: NEndpoints,
        useFactory: nEndpointsFactory
      }
  ): ModuleWithProviders {
    return {
      ngModule: NHttpModule,
      providers: [
          providedConfig,
          providedEndpoints
        // {provide: NHttpConfig, useClass: BaseNHttpConfig}
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
