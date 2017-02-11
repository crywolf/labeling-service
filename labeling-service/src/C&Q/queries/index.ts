import * as fs from 'fs';

const queries = {};

fs.readdirSync(__dirname + '/').forEach((fileName) => {
    if (fileName !== 'index.ts') {
        const queryName = fileName.replace('.ts', '');
        const query = require(`./${fileName}`).default;
        if (Object.getPrototypeOf(query).name === 'Query') {
            queries[queryName] = query;
        }
    }
});

export = queries;
