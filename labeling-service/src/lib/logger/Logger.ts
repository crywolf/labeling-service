/* tslint:disable:no-console */

export class Logger {

    private moduleName;

    public module (moduleName: string) {
        this.moduleName = moduleName;
    }

    public info (message: string, moduleName?: string) {
        message = `[Info] ${message}`;
        const data = this.prepareMetadata(message, moduleName);
        console.log(data);
    }

    public error (message: string, moduleName?: string) {
        message = `[Error] ${message}`;
        const data = this.prepareMetadata(message, moduleName);
        console.error(data);
    }

    private prepareMetadata (message: string, moduleName?: string): string {
        moduleName = moduleName || this.moduleName;
        return `${moduleName}: ${message}`;
    }

}
