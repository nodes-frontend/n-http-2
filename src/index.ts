import {NgModule, ModuleWithProviders, Optional, SkipSelf} from '@angular/core';
import { HttpModule } from '@angular/http';

import {NHttp} from "./n-http.service";
import {NHttpJWT} from "./n-http-jwt.service";
import {NHttpUpload} from "./n-http-fileupload.service";
import {NHttpUtils} from "./n-http-utils";
import {NHttpConfig, nHttpConfigFactory} from "./n-http.config";
import {NEndpoints, nEndpointsFactory} from "./n-endpoints";

export * from './n-endpoints';
export * from './n-http.config';
export * from './n-http.service';
export * from './n-http-fileupload.service';
export * from './n-http-jwt.service';
export * from './n-http-utils';
export * from './n-jwt-helper';

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
