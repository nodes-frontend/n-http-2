import {Injectable} from "@angular/core";
import {RequestOptionsArgs, RequestOptions, Request, Headers, Response} from "@angular/http";
import {INHttpConfig, NHttpConfig} from "./n-http.config";
import {Observable} from "rxjs";


@Injectable()
export class NHttpUtils {

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
    
    public mergeOptions(providedOpts: RequestOptionsArgs, config: INHttpConfig, defaultOpts?: RequestOptions) {
        let newOptions = defaultOpts || new RequestOptions();
        if (config.globalHeaders) {
            this.setGlobalHeaders(config.globalHeaders, providedOpts);
        }
        if (config.nMetaDisable === false) {
            const nMetaHeader = this.buildNMetaHeader(config);
            this.setGlobalHeaders([nMetaHeader], providedOpts);
        }

        newOptions = newOptions.merge(new RequestOptions(providedOpts));

        return newOptions;
    }

    private buildNMetaHeader(options: INHttpConfig) {
        return {'N-Meta': [options.nMetaPlatform, options.nMetaEnvironment].join(';')};
    }
}