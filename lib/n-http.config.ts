export interface INHttpConfig {
    globalHeaders: Object[];
    nMetaPlatform: string;
    nMetaEnvironment: string;
    nMetaDisable: boolean;
    jwtHeaderName: string;
    jwtHeaderPrefix: string;
    jwtTokenName: string;
    jwtRefreshTokenName: string;
    jwtRefreshTokenUrl: string;
}

// This is the interface to merge!
export interface INHttpConfigOptional {
    globalHeaders?: Object[];
    nMetaPlatform?: string;
    nMetaEnvironment?: string;
    nMetaDisable?: boolean;
    jwtHeaderName?: string;
    jwtHeaderPrefix?: string;
    jwtTokenName?: string;
    jwtRefreshTokenName?: string;
    jwtRefreshTokenUrl?: string;
}
// This is to merge!
export const NHttpConfigDefaults: INHttpConfig = {
    globalHeaders: [],
    nMetaPlatform: 'web',
    nMetaEnvironment: 'development',
    nMetaDisable: false,
    jwtHeaderName: 'Authorization',
    jwtHeaderPrefix: 'Bearer',
    jwtTokenName: 'id_token',
    jwtRefreshTokenName: 'refresh_token',
    jwtRefreshTokenUrl: ''
};

export function nHttpConfigFactory(config: INHttpConfigOptional): NHttpConfig {
    return new NHttpConfig(config);
}

export class NHttpConfig {
    private _config: INHttpConfig;

    constructor(_config: INHttpConfigOptional) {
        _config = _config || {};

        if(!_config.hasOwnProperty('nMetaPlatform') && _config.hasOwnProperty('nMetaEnvironment')) {
            throw new Error(
                'NHttpConfig nMetaPlatform is missing, it is required if environment is defined'
            );
        }

        if(!_config.hasOwnProperty('nMetaEnvironment') && _config.hasOwnProperty('nMetaPlatform')) {
            throw new Error(
                'NHttpConfig nMetaEnvironment, it is required if platform is defined'
            );
        }

        this._config = Object.assign({}, NHttpConfigDefaults, _config);
    }

    public getConfig(): INHttpConfig {
        return this._config;
    }
}
