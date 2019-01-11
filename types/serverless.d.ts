declare namespace Serverless {
    namespace Provider {
        class Aws {

            public getRegion: () => string;
            public getStage: () => string;
            public getStackName: () => string;

            public request: (service: string, method: string, data: {}) => Promise<any>;

        }
    }
}

declare interface IServerless {

    cli: {
        log(message: string): null
    };

    config: {
        servicePath: string
    };

    service: {

        custom: {
            output: IOutputConfig
        }

        provider: {
            name: string
        }

        getServiceName(): string
        getAllFunctions(): string[]

    };

    init(): Promise<any>;

    run(): Promise<any>;

    setProvider(name: string, provider: Serverless.Provider.Aws): null;

    getProvider(name: string): Serverless.Provider.Aws;

    getVersion(): string;

}
