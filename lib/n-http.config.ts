export interface INHttpConfig {
    globalHeaders: Array<Object>;
    nMeta: {
        platform: string;
        environment: string;
        disable: boolean;
    };
}

export interface INHttpConfigOptional {
    globalHeaders?: Array<Object>;
    nMeta?: {
        platform?: string;
        environment?: string;
        disable?: boolean;
    };
}

export const NHttpConfigDefaults: INHttpConfig = {
    globalHeaders: [{
        'N-Meta': 'web;development'
    }],
    nMeta: {
        platform: 'web',
        environment: 'development',
        disable: false
    }
};

export class NHttpConfig {
    private _config: INHttpConfig;

    constructor(config?: INHttpConfigOptional) {
        config = config || {};

        if(config && config.hasOwnProperty('nMeta')) {
            if(!config.nMeta.hasOwnProperty('platform') && config.nMeta.hasOwnProperty('environment')) {
                throw new Error(
                    'NHttpConfig nMeta is missing platform value, it is required if environment is defined'
                );
            }
        }
        if(config && config.hasOwnProperty('nMeta')) {
            if(!config.nMeta.hasOwnProperty('environment') && config.nMeta.hasOwnProperty('platform')) {
                throw new Error(
                    'NHttpConfig nMeta is missing environment value, it is required if platform is defined'
                );
            }
        }

        this._config = Object.assign({}, NHttpConfigDefaults, config);
    }

    public getConfig(): INHttpConfig {
        return this._config;
    }
}
