import * as fs from 'fs';

const commands = {};

fs.readdirSync(__dirname + '/').forEach((fileName) => {
    if (fileName.match(/Command\.ts$/) && fileName !== 'Command.ts') {
        const commandName = fileName.replace('.ts', '');
        commands[commandName] = require(`./${fileName}`).default;
    }
});

module.exports = commands;
