import { Injectable, ErrorHandler } from '@angular/core';
import {
    Http,
    Request,
    RequestOptions,
    RequestOptionsArgs,
    RequestMethod,
    Response
} from '@angular/http';

import { INHttpConfig, NHttpConfig } from './n-http.config';
import { NEndpoints } from './n-endpoints';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {NHttpUtils} from './n-http-utils';
import {NJwtHelper} from './n-jwt-helper';

export function tokenNotExpired(tokenName: string, jwt?: string): boolean {

    const token: string = jwt || localStorage.getItem(tokenName);

    const jwtHelper = new NJwtHelper();

    return token != null && !jwtHelper.isTokenExpired(token);
}

@Injectable()
export class NHttpJWT {

    private config: INHttpConfig;

    constructor(
        options: NHttpConfig, private endpoints: NEndpoints, private http: Http, private httpUtils: NHttpUtils,
        private errorHandler: ErrorHandler, private defOpts?: RequestOptions
    ) {
        this.config = options.getConfig();
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === 'string') {
            return this.get(url, options); // Recursion: transform url from String to Request
        }
        // else if ( ! url instanceof Request ) {
        //   throw new Error('First argument must be a url string or Request instance.');
        // }

        let req: Request = url as Request;

        return this.requestWithToken(req);
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Get, url }, options);
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body, method: RequestMethod.Post, url }, options);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body, method: RequestMethod.Put, url }, options);
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Delete, url }, options);
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body, method: RequestMethod.Patch, url }, options);
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Head, url }, options);
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Options, url }, options);
    }

    public storeToken(accessToken: string, refreshToken?: string): void {
        localStorage.setItem(this.config.jwtTokenName, accessToken);
        if(refreshToken) {
            localStorage.setItem(this.config.jwtRefreshTokenName, refreshToken);
        }
    }

    public refreshToken(token: string): Observable<Response> {

        const url = this.endpoints.makeUrl([this.config.jwtRefreshTokenUrl]);
        const req = new Request({url, method: RequestMethod.Get});

        req.headers.set(this.config.jwtHeaderName, [this.config.jwtHeaderPrefix, token].join(' '));
        return this.http.request(req);
    }

    private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
        let options = new RequestOptions(requestArgs);
        if (additionalOptions) {
            options = options.merge(additionalOptions);
        }

        return this.request(new Request(this.httpUtils.mergeOptions(options, this.config, this.defOpts)));
    }

    private requestWithToken(req: Request): Observable<Response> {

        let authToken: string = localStorage.getItem(this.config.jwtTokenName);
        let refreshToken: string;

        if(!tokenNotExpired(this.config.jwtTokenName, authToken)) {
            refreshToken = localStorage.getItem(this.config.jwtRefreshTokenName);

            if(refreshToken) {

                return this.refreshToken(refreshToken).map(
                    (res) => {
                        const resData = res.json();
                        this.storeToken(resData.accessToken, resData.refreshToken);
                        req.headers.set(this.config.jwtHeaderName, [this.config.jwtHeaderPrefix, resData.accessToken].join(' '));
                    },
                    (err) => {
                        return new Observable<Response>((obs: any) => {
                            obs.error(new Error(err));
                        });
                    }
                ).flatMap(() => this.http.request(req)).catch(tokenRequestError);

            } else {
                return new Observable<Response>((obs: any) => {
                    obs.error(new Error('No JWT present'));
                });
            }
        }

        req.headers.set(this.config.jwtHeaderName, [this.config.jwtHeaderPrefix, authToken].join(' '));
        return this.http.request(req).catch(tokenRequestError);;

        function tokenRequestError(error: Response) {
            // Forward 500+ errors to error handler
            if (error.status >= 500) {
                this.errorHandler.handleError(error.toString());
            }
            return Observable.throw(error);
        }
    }

}
