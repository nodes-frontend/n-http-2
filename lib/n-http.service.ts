import { Injectable, ErrorHandler } from '@angular/core';
import {
    Http,
    Headers,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    RequestMethod,
    Response
} from '@angular/http';

import { INHttpConfig, NHttpConfig } from './n-http.config';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class NHttp {

    private config: INHttpConfig;

    constructor(options: NHttpConfig, private http: Http, private errorHandler: ErrorHandler, private defOpts?: RequestOptions) {
        this.config = options.getConfig();
    }

    public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
        if (!request.headers) {
            request.headers = new Headers();
        }
        headers.forEach((header: Object) => {
            let key: string = Object.keys(header)[0];
            let headerValue: string = (header as any)[key];
            (request.headers as Headers).set(key, headerValue);
        });
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === 'string') {
            return this.get(url, options); // Recursion: transform url from String to Request
        }
        // else if ( ! url instanceof Request ) {
        //   throw new Error('First argument must be a url string or Request instance.');
        // }

        // from this point url is always an instance of Request;
        let req: Request = url as Request;

        return this.http.request(req).catch((error: Response) => {
            // Forward 500+ errors to error handler
            if (error.status >= 500) {
                this.errorHandler.handleError(error.toString());
            }
            return Observable.throw(error);
        });
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Get, url: url }, options);
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Post, url: url }, options);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Put, url: url }, options);
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Delete, url: url }, options);
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Patch, url: url }, options);
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Head, url: url }, options);
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Options, url: url }, options);
    }

    private mergeOptions(providedOpts: RequestOptionsArgs, defaultOpts?: RequestOptions) {
        let newOptions = defaultOpts || new RequestOptions();
        if (this.config.globalHeaders) {
            this.setGlobalHeaders(this.config.globalHeaders, providedOpts);
        }
        if (this.config.nMeta.disable === false) {
            const nMetaHeader = this.buildNMetaHeader(this.config);
            this.setGlobalHeaders([nMetaHeader], providedOpts);
        }

        newOptions = newOptions.merge(new RequestOptions(providedOpts));

        return newOptions;
    }

    private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
        let options = new RequestOptions(requestArgs);
        if (additionalOptions) {
            options = options.merge(additionalOptions);
        }
        return this.request(new Request(this.mergeOptions(options, this.defOpts)));
    }

    private buildNMetaHeader(options: INHttpConfig) {
        return {'N-Meta': [options.nMeta.platform, options.nMeta.environment].join(';')};
    }

}
