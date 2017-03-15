import defaultConfig from './default';
import developmentConfig from './development';
import testingConfig from './testing';

const env = process.env.NODE_ENV || 'development';

let environmentConfig;
switch (env) {
    case 'development': environmentConfig = developmentConfig;
        break;
    case 'testing': environmentConfig = testingConfig;
        break;
    default:
        throw new Error(`Error loading config file`);
}

// Export the config object based on NODE_ENV
const config = Object.assign(defaultConfig, environmentConfig);

export default config;
