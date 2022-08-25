declare const _default: {
    clearMocks: boolean;
    coverageProvider: string;
    transform: {
        "^.+\\.(t|j)sx?$": (string | {
            jsc: {
                parser: {
                    syntax: string;
                    tsx: boolean;
                    decorators: boolean;
                };
                target: string;
                keepClassNames: boolean;
                transform: {
                    legacyDecorator: boolean;
                    decoratorMetadata: boolean;
                };
            };
            module: {
                type: string;
                noInterop: boolean;
            };
        })[];
    };
};
export default _default;
