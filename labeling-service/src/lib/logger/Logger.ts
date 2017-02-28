/* tslint:disable:no-console */

export class Logger {

    protected logger;
    private moduleName;

    constructor (logger: { log (); error (); }) {
        this.logger = logger;
    }

    public module (moduleName: string) {
        this.moduleName = moduleName;
    }

    public info (message: string, moduleName?: string) {
        message = `[Info] ${message}`;
        const data = this.prepareMetadata(message, moduleName);
        this.logger.log(data);
    }

    public error (message: string, moduleName?: string) {
        message = `[Error] ${message}`;
        const data = this.prepareMetadata(message, moduleName);
        this.logger.error(data);
    }

    public warn (message: string, moduleName?: string) {
        message = `[Warning] ${message}`;
        const data = this.prepareMetadata(message, moduleName);
        this.logger.warn(data);
    }

    private prepareMetadata (message: string, moduleName?: string): string {
        moduleName = moduleName || this.moduleName;
        return `${moduleName}: ${message}`;
    }

}
