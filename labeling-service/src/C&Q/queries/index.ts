import * as fs from 'fs';

const queries = {};

fs.readdirSync(__dirname + '/').forEach((fileName) => {
    if (fileName.match(/Query\.ts$/) && fileName !== 'Query.ts') {
        const queryName = fileName.replace('.ts', '');
        queries[queryName] = require(`./${fileName}`).default;
    }
});

module.exports = queries;
