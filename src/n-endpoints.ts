export interface INEndpoints {
    protocol: string;
    projectName: string;
    environment: string;
    envPostfix: string;
    apiPrefix: string;
    apiVersion: string;
    staticUrl: string;
}

export interface INEndpointsOptional {
    protocol?: string;
    projectName?: string;
    environment?: string;
    envPostfix?: string;
    apiPrefix?: string;
    apiVersion?: string;
    staticUrl?: string;
}

export const NEndpointsDefaults: INEndpoints = {
    protocol: 'https',
    projectName: '',
    environment: 'development',
    envPostfix: 'like.st',
    apiPrefix: 'api',
    apiVersion: 'v1',
    staticUrl: ''
};

export function nEndpointsFactory(config: INEndpointsOptional, routes?: Object): NEndpoints {
    return new NEndpoints(config, routes);
}

export class NEndpoints {
    private _config: INEndpoints;

    public routes: Object;

    constructor(_config: INEndpointsOptional, routes?: Object) {
        _config = _config || {};

        if(_config.projectName && _config.projectName.length < 1) {
            throw new Error(
                'Dont forget to configure the projectName!'
            );
        }

        this._config = Object.assign({}, NEndpointsDefaults, _config);

        if(routes) {
            this.routes = Object.assign({}, routes);
        }

    }

    get rootUrl(): string {

        if(this._config.staticUrl.length > 0) {
            return this._config.staticUrl;
        }

        return [
            this._config.protocol,
            '://',
            this._config.projectName,
            '.',
            (this._config.environment === 'production') ? '' : this._config.environment + '-',
            this._config.envPostfix,
            '/',
            this._config.apiPrefix,
            '/',
            this._config.apiVersion
        ].join('');
    }

    public makeRoute(route: string, slugs?: Object) {

        let r = route;

        if(slugs) {
            for(let key in slugs) {
                if(slugs.hasOwnProperty(key)) {
                    r = r.replace(key, slugs[key]);
                }
            }
        }

        return r;
    }

    public makeUrl(routes: Array<string>) {
        return [
            this.rootUrl
        ].concat(routes).join('/');
    }

}
