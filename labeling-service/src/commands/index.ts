import * as fs from 'fs';

const commands = {};

fs.readdirSync(__dirname + '/').forEach((fileName) => {
    if (fileName.match(/Command\.ts$/) && fileName !== 'Command.ts') {
        const queryName = fileName.replace('.ts', '');
        commands[queryName] = require(`./${fileName}`).default;
    }
});

module.exports = commands;
